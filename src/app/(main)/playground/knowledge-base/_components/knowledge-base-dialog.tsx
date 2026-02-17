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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    getPlaygroundPersonas,
    getPlaygroundBusinessProfiles,
    createPlaygroundKnowledgeBase,
    updatePlaygroundKnowledgeBase,
    type BusinessProfile,
} from "@/app/actions/playground";

interface Persona {
    id: string;
    name: string;
}

interface KnowledgeBaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kb?: any;
    onSuccess: () => void;
}

export function KnowledgeBaseDialog({ open, onOpenChange, kb, onSuccess }: KnowledgeBaseDialogProps) {
    const { apiKey } = usePlaygroundAuth();
    const [isPending, setIsPending] = useState(false);
    const isEdit = !!kb;

    // Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [personaId, setPersonaId] = useState("");
    const [businessProfileId, setBusinessProfileId] = useState("");

    // Options States
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);

    useEffect(() => {
        if (open && apiKey) {
            fetchOptions();
            if (kb) {
                setName(kb.name || "");
                setDescription(kb.description || "");
                setPersonaId(kb.persona_id || "");
                setBusinessProfileId(kb.business_profile_id || "");
            } else {
                // Reset form
                setName("");
                setDescription("");
                setPersonaId("");
                setBusinessProfileId("");
            }
        }
    }, [open, kb, apiKey]);

    const fetchOptions = async () => {
        try {
            const [personasData, bpData] = await Promise.all([
                getPlaygroundPersonas(apiKey || ""),
                getPlaygroundBusinessProfiles(apiKey || ""),
            ]);
            setPersonas(personasData);
            setBusinessProfiles(bpData);
        } catch (error) {
            console.error("Failed to fetch options", error);
            toast.error("Failed to fetch options");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        const payload = {
            name,
            description,
            persona_id: personaId,
            business_profile_id: businessProfileId
        };

        try {
            const result = isEdit
                ? await updatePlaygroundKnowledgeBase(apiKey || "", kb.id, payload)
                : await createPlaygroundKnowledgeBase(apiKey || "", payload);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success(isEdit ? "Knowledge Base updated" : "Knowledge Base created");
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Knowledge Base" : "Create Knowledge Base"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update knowledge base details." : "Create a new knowledge base linking a Persona and Business Profile."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. My Product Knowledge"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this knowledge base covers..."
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="persona">Persona</Label>
                        <Select value={personaId} onValueChange={setPersonaId}>
                            <SelectTrigger id="persona"><SelectValue placeholder="Select Persona" /></SelectTrigger>
                            <SelectContent>
                                {personas.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="business_profile">Business Profile</Label>
                        <Select value={businessProfileId} onValueChange={setBusinessProfileId}>
                            <SelectTrigger id="business_profile"><SelectValue placeholder="Select Business Profile" /></SelectTrigger>
                            <SelectContent>
                                {businessProfiles.map((bp) => (
                                    <SelectItem key={bp.id} value={bp.id}>{bp.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Save Changes" : "Create Knowledge Base"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
