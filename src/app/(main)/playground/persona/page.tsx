"use client";

import { useEffect, useState } from "react";
import { usePlaygroundAuth } from "../_components/playground-auth-provider";
import { Loader2, Plus, RefreshCw, Trash2, Eye, Pencil } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getPlaygroundPersonas, deletePlaygroundPersona, type PlaygroundPersona } from "@/app/actions/playground";
import { PlaygroundPersonaDialog } from "./_components/playground-persona-dialog";
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

export default function PlaygroundPersonaPage() {
    const { apiKey } = usePlaygroundAuth();
    const [personas, setPersonas] = useState<PlaygroundPersona[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<PlaygroundPersona | undefined>(undefined);

    const fetchPersonas = async () => {
        setIsLoading(true);
        try {
            const data = await getPlaygroundPersonas(apiKey || "");
            setPersonas(data);
        } catch (error) {
            console.error("Failed to fetch personas", error);
            toast.error("Failed to fetch personas");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (apiKey) {
            fetchPersonas();
        }
    }, [apiKey]);

    const handleDelete = async (id: string) => {
        try {
            const result = await deletePlaygroundPersona(apiKey || "", id);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success("Persona deleted");
            fetchPersonas();
        } catch (error: any) {
            console.error("Failed to delete persona", error);
            toast.error(error.message || "Failed to delete persona");
        }
    };

    const handleEdit = (persona: PlaygroundPersona) => {
        setSelectedPersona(persona);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedPersona(undefined);
        setIsDialogOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Personas</h1>
                    <p className="text-muted-foreground">
                        Manage your personas for the playground.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={fetchPersonas} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Create Persona
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Personas</CardTitle>
                    <CardDescription>A list of personas associated with your API Key.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && personas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : personas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No personas found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                personas.map((persona) => (
                                    <TableRow key={persona.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleEdit(persona)}>
                                        <TableCell className="font-medium">{persona.name}</TableCell>
                                        <TableCell>{persona.description}</TableCell>
                                        <TableCell>
                                            <Badge variant={persona.is_system ? "secondary" : "default"}>
                                                {persona.is_system ? "System" : "Custom"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {persona.tenant_id ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(persona); }}>
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
                                                                    This action cannot be undone. This will permanently delete the persona &quot;{persona.name}&quot;.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={(e) => { e.stopPropagation(); handleDelete(persona.id); }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            ) : (
                                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(persona); }}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <PlaygroundPersonaDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                persona={selectedPersona}
                onSuccess={fetchPersonas}
                readOnly={selectedPersona && !selectedPersona.tenant_id}
            />
        </div>
    );
}
