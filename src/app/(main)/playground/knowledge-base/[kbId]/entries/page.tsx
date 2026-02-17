"use client";

import { useEffect, useState, use } from "react";
import { usePlaygroundAuth } from "../../../_components/playground-auth-provider";
import { Loader2, ArrowLeft, ExternalLink, Plus, Pencil, Trash2, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { getPlaygroundKBEntries, deletePlaygroundKBEntry, type PlaygroundKBEntry } from "@/app/actions/playground";
import { useRouter } from "next/navigation";
import { KnowledgeBaseEntryDialog } from "../../_components/knowledge-base-entry-dialog";
import { BatchEntryDialog } from "../../_components/batch-entry-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PageProps {
    params: Promise<{ kbId: string }>;
}

export default function KnowledgeBaseEntriesPage({ params }: PageProps) {
    const { kbId } = use(params);

    const { apiKey } = usePlaygroundAuth();
    const router = useRouter();
    const [entries, setEntries] = useState<PlaygroundKBEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<PlaygroundKBEntry | undefined>(undefined);

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const data = await getPlaygroundKBEntries(apiKey || "", kbId);
            setEntries(data);
        } catch (error) {
            console.error("Failed to fetch entries", error);
            toast.error("Failed to fetch entries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (apiKey && kbId) {
            fetchEntries();
        }
    }, [apiKey, kbId]);

    const handleDelete = async (entryId: string) => {
        try {
            const result = await deletePlaygroundKBEntry(apiKey || "", kbId, entryId);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success("Entry deleted");
            setEntries(prev => prev.filter(e => e.id !== entryId));
        } catch (error: any) {
            console.error("Failed to delete entry", error);
            toast.error(error.message || "Failed to delete entry");
        }
    };

    const handleCreate = () => {
        setSelectedEntry(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (entry: PlaygroundKBEntry) => {
        setSelectedEntry(entry);
        setIsDialogOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base Entries</h1>
                        <p className="text-muted-foreground">
                            View and manage entries for this knowledge base.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsBatchDialogOpen(true)}>
                        <FileJson className="mr-2 h-4 w-4" /> Batch Import
                    </Button>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Add Entry
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Entries</CardTitle>
                    <CardDescription>Document chunks and entries stored in this knowledge base.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[20%]">Title</TableHead>
                                <TableHead className="w-[40%]">Content</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No entries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                entries.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="font-medium align-top">{entry.title || "Untitled"}</TableCell>
                                        <TableCell className="align-top">
                                            <div className="max-h-[100px] overflow-y-auto text-sm text-muted-foreground whitespace-pre-wrap">
                                                {entry.content}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            {entry.source_url ? (
                                                <a href={entry.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline text-sm">
                                                    Link <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="align-top whitespace-nowrap text-sm text-muted-foreground">
                                            {new Date(entry.created_at).toLocaleDateString()} {new Date(entry.created_at).toLocaleTimeString()}
                                        </TableCell>
                                        <TableCell className="align-top text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the entry &quot;{entry.title}&quot;.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(entry.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <KnowledgeBaseEntryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                entry={selectedEntry}
                kbId={kbId}
                onSuccess={fetchEntries}
            />
            <BatchEntryDialog
                open={isBatchDialogOpen}
                onOpenChange={setIsBatchDialogOpen}
                kbId={kbId}
                onSuccess={fetchEntries}
            />
        </div>
    );
}
