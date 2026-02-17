"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, Copy } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { usePlaygroundAuth } from "../../_components/playground-auth-provider";
import { createPlaygroundKBEntryBatch } from "@/app/actions/playground";

interface BatchEntryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kbId: string;
    onSuccess: () => void;
}

interface EntryForm {
    title: string;
    content: string;
    source: string;
}

export function BatchEntryDialog({ open, onOpenChange, kbId, onSuccess }: BatchEntryDialogProps) {
    const { apiKey } = usePlaygroundAuth();
    const [isPending, setIsPending] = useState(false);

    // Initial state with one empty entry
    const [entries, setEntries] = useState<EntryForm[]>([
        { title: "", content: "", source: "manual" }
    ]);

    const handleAddEntry = () => {
        setEntries([...entries, { title: "", content: "", source: "manual" }]);
    };

    const handleRemoveEntry = (index: number) => {
        if (entries.length === 1) {
            // If only one, just clear it
            setEntries([{ title: "", content: "", source: "manual" }]);
            return;
        }
        setEntries(entries.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof EntryForm, value: string) => {
        const newEntries = [...entries];
        newEntries[index] = { ...newEntries[index], [field]: value };
        setEntries(newEntries);
    };

    const handleDuplicate = (index: number) => {
        const entry = entries[index];
        const newEntries = [...entries];
        newEntries.splice(index + 1, 0, { ...entry, title: `${entry.title} (Copy)` });
        setEntries(newEntries);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Check for empty titles or content
        const invalidEntryIndex = entries.findIndex(e => !e.title.trim() || !e.content.trim());
        if (invalidEntryIndex !== -1) {
            toast.error(`Entry #${invalidEntryIndex + 1} is missing title or content`);
            return;
        }

        setIsPending(true);
        try {
            // Transform to API format
            const payload = entries.map(e => ({
                title: e.title,
                content: e.content,
                metadata: { source: e.source }
            }));

            const result = await createPlaygroundKBEntryBatch(apiKey || "", kbId, payload);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success(`Successfully created ${entries.length} entries`);
            onSuccess();
            onOpenChange(false);
            setEntries([{ title: "", content: "", source: "manual" }]); // Reset
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4">
                    <DialogTitle>Batch Add Entries</DialogTitle>
                    <DialogDescription>
                        Add multiple entries at once. All fields are required.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-2">
                    <form id="batch-form" onSubmit={handleSubmit} className="space-y-6">
                        {entries.map((entry, index) => (
                            <div key={index} className="relative grid gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                                <div className="absolute right-2 top-2 flex gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                                        onClick={() => handleDuplicate(index)}
                                        title="Duplicate"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleRemoveEntry(index)}
                                        title="Remove"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>

                                </div>

                                <div className="grid grid-cols-6 gap-4">
                                    <div className="col-span-1 flex items-center justify-center">
                                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="col-span-5 grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`title-${index}`}>Title</Label>
                                                <Input
                                                    id={`title-${index}`}
                                                    value={entry.title}
                                                    onChange={(e) => handleChange(index, "title", e.target.value)}
                                                    placeholder="Entry Title"
                                                    className="h-8"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`source-${index}`}>Source</Label>
                                                <Input
                                                    id={`source-${index}`}
                                                    value={entry.source}
                                                    onChange={(e) => handleChange(index, "source", e.target.value)}
                                                    placeholder="manual"
                                                    className="h-8"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`content-${index}`}>Content</Label>
                                            <Textarea
                                                id={`content-${index}`}
                                                value={entry.content}
                                                onChange={(e) => handleChange(index, "content", e.target.value)}
                                                placeholder="Entry content..."
                                                className="min-h-[80px] resize-y"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </form>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/20 flex !justify-between items-center">
                    <Button type="button" variant="outline" onClick={handleAddEntry} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Another
                    </Button>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" form="batch-form" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Import {entries.length} Entries
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
