"use client";

import { useEffect, useState } from "react";
import { usePlaygroundAuth } from "../../_components/playground-auth-provider";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createPlaygroundKBEntry, updatePlaygroundKBEntry } from "@/app/actions/playground";

interface KnowledgeBaseEntryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry?: any;
    kbId: string;
    onSuccess: () => void;
}

export function KnowledgeBaseEntryDialog({ open, onOpenChange, entry, kbId, onSuccess }: KnowledgeBaseEntryDialogProps) {
    const { apiKey } = usePlaygroundAuth();
    const [isPending, setIsPending] = useState(false);
    const isEdit = !!entry;

    // Form States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [source, setSource] = useState("");

    useEffect(() => {
        if (open) {
            if (entry) {
                setTitle(entry.title || "");
                setContent(entry.content || "");
                setSource(entry.metadata?.source || "manual");
            } else {
                setTitle("");
                setContent("");
                setSource("manual");
            }
        }
    }, [open, entry]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        const metadata = { source };
        const payload = { title, content, metadata };

        try {
            const result = isEdit
                ? await updatePlaygroundKBEntry(apiKey || "", kbId, entry.id, payload)
                : await createPlaygroundKBEntry(apiKey || "", kbId, payload);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success(isEdit ? "Entry updated" : "Entry created");
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Entry" : "Add Entry"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the content of this knowledge base entry." : "Add a new entry to this knowledge base."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Entry Title"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Entry Content..."
                            required
                            className="min-h-[150px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="source">Source (Metadata)</Label>
                        <Input
                            id="source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="e.g. website, manual, policy_doc"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Save Changes" : "Add Entry"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
