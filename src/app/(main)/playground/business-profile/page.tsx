"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Building2, Loader2, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { usePlaygroundAuth } from "../_components/playground-auth-provider";
import {
    getPlaygroundBusinessProfiles,
    deletePlaygroundBusinessProfile,
    type BusinessProfile,
} from "@/app/actions/playground";
import { BusinessProfileDialog } from "./_components/business-profile-dialog";

export default function BusinessProfilePage() {
    const { apiKey } = usePlaygroundAuth();
    const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfiles = async () => {
        if (!apiKey) return;
        setIsLoading(true);
        try {
            const data = await getPlaygroundBusinessProfiles(apiKey);
            setProfiles(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch profiles");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [apiKey]);

    const handleDelete = async (id: string) => {
        if (!apiKey) return;
        try {
            const res = await deletePlaygroundBusinessProfile(apiKey, id);
            if (res.error) throw new Error(res.error);

            toast.success("Profile deleted");
            fetchProfiles();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete profile");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Business Profiles</h1>
                    <p className="text-muted-foreground">
                        Manage business identities and context configuration.
                    </p>
                </div>
                <BusinessProfileDialog mode="create" onSuccess={fetchProfiles} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profiles</CardTitle>
                    <CardDescription>
                        List of all registered business profiles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : profiles.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No business profiles found. Create one to get started.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profiles.map((profile) => (
                                    <TableRow key={profile.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                {profile.name}
                                            </div>
                                        </TableCell>
                                        <TableCell><Badge variant="outline">{profile.type}</Badge></TableCell>
                                        <TableCell className="text-muted-foreground truncate max-w-[300px]">
                                            {profile.description}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <BusinessProfileDialog
                                                    mode="view"
                                                    profile={profile}
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                />
                                                <BusinessProfileDialog
                                                    mode="edit"
                                                    profile={profile}
                                                    onSuccess={fetchProfiles}
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the profile "{profile.name}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(profile.id)} className="bg-destructive hover:bg-destructive/90">
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
