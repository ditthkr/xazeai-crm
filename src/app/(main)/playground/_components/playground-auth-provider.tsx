"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { verifyPlaygroundApiKey } from "@/app/actions/playground";

interface PlaygroundAuthContextType {
    apiKey: string | null;
    logout: () => void;
}

const PlaygroundAuthContext = createContext<PlaygroundAuthContextType>({
    apiKey: null,
    logout: () => { },
});

export const usePlaygroundAuth = () => useContext(PlaygroundAuthContext);

export function PlaygroundAuthProvider({ children }: { children: ReactNode }) {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [inputKey, setInputKey] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem("playground_api_key");
        if (storedKey) {
            verifyPlaygroundApiKey(storedKey).then((valid) => {
                if (valid) {
                    setApiKey(storedKey);
                } else {
                    localStorage.removeItem("playground_api_key");
                }
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputKey.trim()) return;

        setIsVerifying(true);
        const isValid = await verifyPlaygroundApiKey(inputKey);
        setIsVerifying(false);

        if (isValid) {
            localStorage.setItem("playground_api_key", inputKey);
            setApiKey(inputKey);
            toast.success("Logged in successfully");
        } else {
            toast.error("Invalid API Key");
        }
    };

    const logout = () => {
        localStorage.removeItem("playground_api_key");
        setApiKey(null);
        toast.info("Logged out");
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!apiKey) {
        return (
            <div className="flex h-screen items-center justify-center bg-muted/20 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Playground Login</CardTitle>
                        <CardDescription>Enter your API Key to access the playground.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Enter API Key"
                                    value={inputKey}
                                    onChange={(e) => setInputKey(e.target.value)}
                                    disabled={isVerifying}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isVerifying || !inputKey.trim()}>
                                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <PlaygroundAuthContext.Provider value={{ apiKey, logout }}>
            {children}
        </PlaygroundAuthContext.Provider>
    );
}
