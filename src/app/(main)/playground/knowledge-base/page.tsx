"use client";

import { useEffect, useState } from "react";
import { usePlaygroundAuth } from "../_components/playground-auth-provider";
import { useRouter } from "next/navigation";
import { Loader2, Plus, RefreshCw, Trash2, Pencil, BookOpen } from "lucide-react";
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
import { getPlaygroundKnowledgeBases, deletePlaygroundKnowledgeBase, type PlaygroundKnowledgeBase } from "@/app/actions/playground";
import { KnowledgeBaseDialog } from "./_components/knowledge-base-dialog";
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

export default function KnowledgeBasePage() {
    const router = useRouter();
    const { apiKey } = usePlaygroundAuth();
    const [kbs, setKbs] = useState<PlaygroundKnowledgeBase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedKb, setSelectedKb] = useState<PlaygroundKnowledgeBase | undefined>(undefined);

    const fetchKbs = async () => {
        setIsLoading(true);
        try {
            const data = await getPlaygroundKnowledgeBases(apiKey || "");
            setKbs(data);
        } catch (error) {
            console.error("Failed to fetch knowledge bases", error);
            toast.error("Failed to fetch knowledge bases");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (apiKey) {
            fetchKbs();
        }
    }, [apiKey]);

    const handleDelete = async (id: string) => {
        try {
            const result = await deletePlaygroundKnowledgeBase(apiKey || "", id);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success("Knowledge base deleted");
            setKbs(prev => prev.filter(kb => kb.id !== id));
        } catch (error: any) {
            console.error("Failed to delete knowledge base", error);
            toast.error(error.message || "Failed to delete knowledge base");
        }
    };

    const handleEdit = (kb: PlaygroundKnowledgeBase) => {
        setSelectedKb(kb);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedKb(undefined);
        setIsDialogOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                    <p className="text-muted-foreground">
                        Manage your knowledge bases linking Personas and Business Profiles.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={fetchKbs} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Create Knowledge Base
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Knowledge Bases</CardTitle>
                    <CardDescription>A list of knowledge bases associated with your API Key.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && kbs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : kbs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No knowledge bases found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kbs.map((kb) => (
                                    <TableRow key={kb.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleEdit(kb)}>
                                        <TableCell className="font-medium">{kb.name}</TableCell>
                                        <TableCell>{kb.description}</TableCell>
                                        <TableCell>{new Date(kb.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); router.push(`/playground/knowledge-base/${kb.id}/entries`); }}>
                                                    <BookOpen className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(kb); }}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the knowledge base &quot;{kb.name}&quot;.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={(e) => { e.stopPropagation(); handleDelete(kb.id); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

            <KnowledgeBaseDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                kb={selectedKb}
                onSuccess={fetchKbs}
            />
        </div>
    );
}
