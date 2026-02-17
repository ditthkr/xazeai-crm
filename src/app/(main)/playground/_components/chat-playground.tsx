"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Settings, Loader2, PlayCircle, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { usePlaygroundAuth } from "./playground-auth-provider";
import {
    getPlaygroundKnowledgeBases,
    getChatSessions,
    createChatSession,
    sendChatMessage,
    getChatJobStatus,
    getChatHistory,
    type ChatSession,
} from "@/app/actions/playground";

interface Message {
    role: "user" | "assistant" | "system" | "bot";
    content: string;
    isError?: boolean;
}

const STORAGE_KEYS = {
    SESSION_ID: "playground_chat_session_id",
    KB_ID: "playground_chat_kb_id",
};

export function ChatPlayground() {
    const { apiKey } = usePlaygroundAuth();
    // Config State
    const [kbID, setKbID] = useState("");
    const [knowledgeBases, setKnowledgeBases] = useState<{ id: string; name: string }[]>([]);
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    // Chat State
    const [sessionID, setSessionID] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRestoring, setIsRestoring] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Restore session from localStorage on mount
    useEffect(() => {
        const storedSessionID = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
        const storedKbID = localStorage.getItem(STORAGE_KEYS.KB_ID);
        if (storedKbID) setKbID(storedKbID);
        if (storedSessionID) setSessionID(storedSessionID);
        setIsRestoring(false);
    }, []);

    // Persist sessionID to localStorage
    useEffect(() => {
        if (sessionID) {
            localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionID);
        } else {
            localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
        }
    }, [sessionID]);

    // Persist kbID to localStorage
    useEffect(() => {
        if (kbID) {
            localStorage.setItem(STORAGE_KEYS.KB_ID, kbID);
        }
    }, [kbID]);

    // Restore chat history when session is restored
    useEffect(() => {
        if (!isRestoring && apiKey && sessionID && messages.length === 0) {
            restoreChatHistory(sessionID);
        }
    }, [isRestoring, apiKey, sessionID]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (apiKey) {
            fetchKnowledgeBases();
            fetchSessions();
        }
    }, [apiKey]);

    const restoreChatHistory = async (sid: string) => {
        try {
            const history = await getChatHistory(apiKey || "", sid);
            if (history.length > 0) {
                setMessages(history.map((m) => ({ role: m.role as Message["role"], content: m.content })));
            }
        } catch (error) {
            console.error("Failed to restore chat history", error);
        }
    };

    useEffect(() => {
        if (!isRestoring && knowledgeBases.length > 0 && !kbID) {
            setKbID(knowledgeBases[0].id);
        }
    }, [knowledgeBases, kbID, isRestoring]);

    const fetchKnowledgeBases = async () => {
        try {
            const data = await getPlaygroundKnowledgeBases(apiKey || "");
            setKnowledgeBases(data);
        } catch (e) {
            console.error("Failed to fetch KBs", e);
        }
    };

    const fetchSessions = async () => {
        try {
            const data = await getChatSessions(apiKey || "");
            setSessions(data);
        } catch (e) {
            console.error("Failed to fetch sessions", e);
        }
    };

    const switchSession = async (newSessionId: string) => {
        setSessionID(newSessionId);
        setMessages([]);
        try {
            const history = await getChatHistory(apiKey || "", newSessionId);
            if (history.length > 0) {
                setMessages(history.map((m) => ({ role: m.role as Message["role"], content: m.content })));
            }
        } catch (error) {
            console.error("Failed to load session history", error);
            toast.error("Failed to load session history");
        }
    };

    const startNewSession = async () => {
        if (!kbID) {
            toast.error("Knowledge Base ID is required");
            return;
        }

        setIsLoading(true);
        try {
            const result = await createChatSession(apiKey || "", kbID);

            if (result.error) {
                throw new Error(result.error);
            }

            setSessionID(result.id!);
            setMessages([]);
            await fetchSessions();
            toast.success("New session started");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to start session");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistoryAndAppendLast = async (currentSessionID: string) => {
        try {
            const history = await getChatHistory(apiKey || "", currentSessionID);
            const lastMsg = history[history.length - 1];

            if (lastMsg && lastMsg.role === "assistant") {
                setMessages((prev) => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'bot' && newMessages[newMessages.length - 1].content === 'Thinking...') {
                        newMessages.pop();
                    }
                    return [...newMessages, { role: "assistant", content: lastMsg.content }];
                });
            } else {
                setMessages((prev) => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'bot' && newMessages[newMessages.length - 1].content === 'Thinking...') {
                        newMessages.pop();
                    }
                    return [...newMessages, { role: "bot", content: "(No response received)", isError: true }];
                });
            }

        } catch (error: any) {
            console.error(error);
        }
    };

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        let currentSessionID = sessionID;
        if (!currentSessionID) {
            if (!kbID) {
                toast.error("Knowledge Base ID is required");
                return;
            }
            try {
                const result = await createChatSession(apiKey || "", kbID);
                if (result.error) throw new Error(result.error);
                currentSessionID = result.id!;
                setSessionID(currentSessionID);
            } catch (e: any) {
                toast.error("Failed to auto-start session");
                return;
            }
        }

        const userMsg = inputValue;
        setInputValue("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        // Add placeholder bot message
        setMessages((prev) => [...prev, { role: "bot", content: "Thinking..." }]);

        try {
            // 1. Send Message
            const msgResult = await sendChatMessage(apiKey || "", currentSessionID, userMsg);

            if (msgResult.error) {
                throw new Error(msgResult.error);
            }

            const jobID = msgResult.jobId!;

            // 2. Poll for Job Status
            const pollInterval = setInterval(async () => {
                try {
                    const jobResult = await getChatJobStatus(apiKey || "", jobID);

                    if (jobResult.status === "completed") {
                        clearInterval(pollInterval);
                        setIsLoading(false);
                        if (currentSessionID) {
                            await fetchHistoryAndAppendLast(currentSessionID);
                        }

                    } else if (jobResult.status === "failed") {
                        clearInterval(pollInterval);
                        setIsLoading(false);
                        setMessages((prev) => {
                            const newMessages = [...prev];
                            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'bot' && newMessages[newMessages.length - 1].content === 'Thinking...') {
                                newMessages.pop();
                            }
                            return [...newMessages, { role: "bot", content: `Error: ${jobResult.error}`, isError: true }];
                        });
                        toast.error(`Job failed: ${jobResult.error}`);
                    }
                } catch (e) {
                    console.error("Polling error", e);
                    clearInterval(pollInterval);
                    setIsLoading(false);
                }
            }, 1000);

        } catch (error: any) {
            console.error(error);
            setMessages((prev) => {
                const newMessages = [...prev];
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'bot' && newMessages[newMessages.length - 1].content === 'Thinking...') {
                    newMessages.pop();
                }
                return [...newMessages, { role: "bot", content: `Error: ${error.message}`, isError: true }];
            });
            setIsLoading(false);
        }
    };


    return (
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
            {/* Left: Chat Area */}
            <div className="col-span-2 flex flex-col min-w-0 min-h-0">
                <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-border/60">
                    <CardHeader className="shrink-0 py-2 px-3 border-b bg-muted/30 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-medium">Chat Session</CardTitle>
                            {sessionID && (
                                <Badge variant="outline" className="text-[10px] h-5 font-normal font-mono px-1">
                                    {sessionID.substring(0, 8)}...
                                </Badge>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={startNewSession}
                            disabled={isLoading}
                            className="h-7 text-xs hover:bg-destructive/10 hover:text-destructive px-2"
                        >
                            <RefreshCw className={`mr-1.5 h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                            New Session
                        </Button>
                    </CardHeader>

                    {/* Scrollable messages area */}
                    <div className="flex-1 relative min-h-0">
                        <div className="absolute inset-0 overflow-y-auto px-4 py-3">
                            <div className="flex flex-col gap-3 min-h-full justify-end">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 py-10">
                                        {knowledgeBases.length === 0 && !isLoading ? (
                                            <>
                                                <Database className="h-8 w-8 mb-2" />
                                                <p className="text-xs">Please create a Knowledge Base first.</p>
                                            </>
                                        ) : (
                                            <>
                                                <PlayCircle className="h-8 w-8 mb-2" />
                                                <p className="text-xs">Start a new session or send a message to begin.</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`max-w-[50%] rounded-lg px-3 py-2 text-sm break-words overflow-hidden ${msg.role === "user"
                                            ? "ml-auto bg-primary text-primary-foreground"
                                            : msg.isError
                                                ? "bg-destructive/15 text-destructive"
                                                : "bg-muted"
                                            }`}
                                    >
                                        {msg.role === "bot" && msg.content === "Thinking..." ? (
                                            <div className="flex items-center gap-2 text-muted-foreground italic">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                <span>Thinking...</span>
                                            </div>
                                        ) : (
                                            <span className="whitespace-pre-wrap break-words">{msg.content}</span>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    </div>

                    {/* Input bar */}
                    <div className="shrink-0 p-3 border-t bg-background">
                        <form
                            className="flex w-full items-center gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                        >
                            <Input
                                id="message"
                                placeholder="Type your message..."
                                className="flex-1 h-9 text-sm"
                                autoComplete="off"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={isLoading || !inputValue.trim()}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>

            {/* Right: Configuration */}
            <div className="flex flex-col gap-3 min-w-0 min-h-0">
                <Card className="shadow-sm border-border/60">
                    <CardHeader className="py-2 px-3 border-b bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                            <CardTitle className="text-sm font-medium">Configuration</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3">
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label>Chat Session</Label>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={fetchSessions}
                                    title="Refresh Sessions"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                </Button>
                            </div>
                            <Select value={sessionID || ""} onValueChange={switchSession}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Session" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sessions.length > 0 ? (
                                        sessions.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {new Date(s.created_at).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}
                                                {" · "}
                                                {s.id.substring(0, 8)}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>
                                            No sessions found
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="kbID">Knowledge Base</Label>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={fetchKnowledgeBases}
                                    title="Refresh Knowledge Bases"
                                >
                                    <RefreshCw className="h-3 w-3" />
                                </Button>
                            </div>
                            <Select value={kbID} onValueChange={setKbID}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Knowledge Base" />
                                </SelectTrigger>
                                <SelectContent>
                                    {knowledgeBases.length > 0 ? (
                                        knowledgeBases.map((kb) => (
                                            <SelectItem key={kb.id} value={kb.id}>
                                                {kb.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value={kbID || "default"} disabled>
                                            {kbID ? "Current ID (Not in list)" : "No KBs found"}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full" variant="outline" onClick={() => toast.success("Configuration saved (in memory)")}>
                            Update Config
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
