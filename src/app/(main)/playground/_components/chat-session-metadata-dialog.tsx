"use client";

import { useState, useEffect, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getChatSession, updateChatSession } from "@/app/actions/playground";

interface ChatSessionMetadataDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId: string;
    apiKey: string;
}

export function ChatSessionMetadataDialog({
    open,
    onOpenChange,
    sessionId,
    apiKey,
}: ChatSessionMetadataDialogProps) {
    const [metadataJson, setMetadataJson] = useState("{}");
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (open && sessionId && apiKey) {
            fetchMetadata();
        }
    }, [open, sessionId, apiKey]);

    async function fetchMetadata() {
        setIsLoading(true);
        try {
            const session = await getChatSession(apiKey, sessionId);
            if (session && session.metadata) {
                setMetadataJson(JSON.stringify(session.metadata, null, 2));
            } else {
                setMetadataJson("{}");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch session metadata");
        } finally {
            setIsLoading(false);
        }
    }

    function handleSave() {
        if (!sessionId) return;

        let parsedMetadata: Record<string, any>;
        try {
            parsedMetadata = JSON.parse(metadataJson);
        } catch (e) {
            toast.error("Invalid JSON format");
            return;
        }

        startTransition(async () => {
            const result = await updateChatSession(apiKey, sessionId, {
                metadata: parsedMetadata,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Session metadata updated");
                onOpenChange(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Session Metadata</DialogTitle>
                    <DialogDescription>
                        Edit metadata for session {sessionId.substring(0, 8)}...
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="metadata">Metadata (JSON)</Label>
                        {isLoading ? (
                            <div className="flex h-[200px] items-center justify-center border rounded-md">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <Textarea
                                id="metadata"
                                className="font-mono text-xs h-[200px]"
                                value={metadataJson}
                                onChange={(e) => setMetadataJson(e.target.value)}
                                placeholder='{"username": "user123"}'
                            />
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isPending || isLoading}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {!isPending && <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
