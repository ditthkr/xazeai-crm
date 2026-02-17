"use client";

import { useEffect, useState, useRef } from "react";
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
    getPlaygroundPersonaOptions,
    createPlaygroundPersona,
    updatePlaygroundPersona,
    type PersonaOptions,
} from "@/app/actions/playground";

interface PlaygroundPersonaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    persona?: any;
    onSuccess: () => void;
    readOnly?: boolean;
}

export function PlaygroundPersonaDialog({ open, onOpenChange, persona, onSuccess, readOnly }: PlaygroundPersonaDialogProps) {
    const { apiKey } = usePlaygroundAuth();
    const [isPending, setIsPending] = useState(false);
    const isEdit = !!persona;

    // Form States
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Config States
    const [tone, setTone] = useState("");
    const [emoji, setEmoji] = useState("");
    const [language, setLanguage] = useState("");
    const [gender, setGender] = useState("");
    const [selfReference, setSelfReference] = useState("");
    const [userReference, setUserReference] = useState("");
    const [greeting, setGreeting] = useState("");

    // Options State
    const [options, setOptions] = useState<PersonaOptions>({
        tones: [],
        emojis: [],
        languages: [],
        genders: []
    });

    const fetchOptions = async () => {
        const data = await getPlaygroundPersonaOptions(apiKey || "");
        if (data) {
            setOptions(data);
        }
    };

    useEffect(() => {
        if (open) {
            fetchOptions();
            if (persona) {
                setName(persona.name || "");
                setDescription(persona.description || "");
                const config = persona.config || {};
                setTone(config.tone || "");
                setEmoji(config.emoji || "");
                setLanguage(config.language || "");
                setGender(config.gender || "");
                setSelfReference(config.self_reference || "");
                setUserReference(config.user_reference || "");
                setGreeting(config.greeting || "");
            } else {
                // Reset form
                setName("");
                setDescription("");
                setTone("");
                setEmoji("");
                setLanguage("");
                setGender("");
                setSelfReference("");
                setUserReference("");
                setGreeting("");
            }
        }
    }, [open, persona]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        const config = {
            tone,
            emoji,
            language,
            self_reference: selfReference,
            user_reference: userReference,
            gender,
            greeting
        };

        const payload = { name, description, config };

        try {
            const result = isEdit
                ? await updatePlaygroundPersona(apiKey || "", persona.id, payload)
                : await createPlaygroundPersona(apiKey || "", payload);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success(isEdit ? "Persona updated" : "Persona created");
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{readOnly ? "View Persona" : isEdit ? "Edit Persona" : "Create Persona"}</DialogTitle>
                    <DialogDescription>
                        {readOnly ? "View persona details." : isEdit ? "Update existing persona details." : "Add a new persona to your playground."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Friendly Assistant"
                            required
                            disabled={readOnly}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the persona's purpose..."
                            required
                            disabled={readOnly}
                        />
                    </div>

                    <div className="border-t my-2"></div>
                    <div className="font-semibold text-lg">Configuration</div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tone">Tone</Label>
                            <Select value={tone} onValueChange={setTone} disabled={readOnly}>
                                <SelectTrigger id="tone"><SelectValue placeholder="Select tone" /></SelectTrigger>
                                <SelectContent>
                                    {options.tones.map((t) => (
                                        <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="emoji">Emoji</Label>
                            <Select value={emoji} onValueChange={setEmoji} disabled={readOnly}>
                                <SelectTrigger id="emoji"><SelectValue placeholder="Select emoji" /></SelectTrigger>
                                <SelectContent>
                                    {options.emojis.map((e) => (
                                        <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="language">Language</Label>
                            <Select value={language} onValueChange={setLanguage} disabled={readOnly}>
                                <SelectTrigger id="language"><SelectValue placeholder="Select language" /></SelectTrigger>
                                <SelectContent>
                                    {options.languages.map((l) => (
                                        <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={gender} onValueChange={setGender} disabled={readOnly}>
                                <SelectTrigger id="gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                                <SelectContent>
                                    {options.genders.map((g) => (
                                        <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="self_reference">Self Reference</Label>
                            <Input
                                id="self_reference"
                                value={selfReference}
                                onChange={(e) => setSelfReference(e.target.value)}
                                placeholder="e.g. I, Me"
                                disabled={readOnly}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="user_reference">User Reference</Label>
                            <Input
                                id="user_reference"
                                value={userReference}
                                onChange={(e) => setUserReference(e.target.value)}
                                placeholder="e.g. You, Sir"
                                disabled={readOnly}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="greeting">Greeting</Label>
                        <Textarea
                            id="greeting"
                            value={greeting}
                            onChange={(e) => setGreeting(e.target.value)}
                            placeholder="Greeting message..."
                            disabled={readOnly}
                        />
                    </div>

                    {!readOnly && (
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEdit ? "Save Changes" : "Create Persona"}
                            </Button>
                        </DialogFooter>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
