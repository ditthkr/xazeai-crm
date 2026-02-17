"use client";

import { useTransition, useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Checkbox } from "@/components/ui/checkbox";
import { createSystemPersona, updateSystemPersona, SystemPersona, getSystemPersonaOptions, SystemPersonaOptions } from "@/app/actions/system";
import { useRouter } from "next/navigation";

// ... (existing imports)

// ... (inside component)


interface PersonaDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    persona?: SystemPersona;
    children?: React.ReactNode;
}

export function PersonaDialog({ open, onOpenChange, persona, children }: PersonaDialogProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [options, setOptions] = useState<SystemPersonaOptions | null>(null);
    const isEdit = !!persona;

    const defaultConfig = {
        tone: "",
        emoji: "",
        language: "",
        self_reference: "",
        user_reference: "",
        gender: "",
        greeting: ""
    };

    const currentConfig = persona?.config || defaultConfig;

    useEffect(() => {
        getSystemPersonaOptions().then(setOptions);
    }, []);

    async function onSubmit(formData: FormData) {
        // Construct config JSON from individual fields
        const config = {
            tone: formData.get("tone"),
            emoji: formData.get("emoji"),
            language: formData.get("language"),
            self_reference: formData.get("self_reference"),
            user_reference: formData.get("user_reference"),
            gender: formData.get("gender"),
            greeting: formData.get("greeting"),
        };

        // Add config to formData as JSON string (expected by server action)
        formData.set("config", JSON.stringify(config));

        startTransition(async () => {
            const result = isEdit
                ? await updateSystemPersona(null, formData)
                : await createSystemPersona(null, formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(isEdit ? "Persona updated successfully" : "Persona created successfully");
                if (onOpenChange) {
                    onOpenChange(false);
                } else {
                    // For trigger usage
                    (document.querySelector('button[data-state="open"]') as HTMLElement)?.click();
                }
                router.refresh();
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Persona" : "Create Persona"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update existing persona details." : "Add a new persona to the system."}
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit} ref={formRef}>
                    {isEdit && <input type="hidden" name="id" value={persona.id} />}
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={persona?.name}
                                placeholder="e.g. Friendly Assistant"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={persona?.description}
                                placeholder="Describe the persona's purpose..."
                                required
                            />
                        </div>

                        <div className="border-t my-2"></div>
                        <div className="font-semibold text-lg">Configuration</div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tone">Tone</Label>
                                <Select name="tone" defaultValue={currentConfig.tone}>
                                    <SelectTrigger className="w-full" id="tone">
                                        <SelectValue placeholder="Select tone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.tones.map((tone) => (
                                            <SelectItem key={tone} value={tone} className="capitalize">
                                                {tone}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="emoji">Emoji</Label>
                                <Select name="emoji" defaultValue={currentConfig.emoji}>
                                    <SelectTrigger className="w-full" id="emoji">
                                        <SelectValue placeholder="Select emoji usage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.emojis.map((emoji) => (
                                            <SelectItem key={emoji} value={emoji} className="capitalize">
                                                {emoji}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="language">Language</Label>
                                <Select name="language" defaultValue={currentConfig.language}>
                                    <SelectTrigger className="w-full" id="language">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.languages.map((lang) => (
                                            <SelectItem key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender" defaultValue={currentConfig.gender}>
                                    <SelectTrigger className="w-full" id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full min-w-0">
                                        {options?.genders.map((gender) => (
                                            <SelectItem key={gender} value={gender} className="capitalize">
                                                {gender}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="self_reference">Self Reference</Label>
                                <Input id="self_reference" name="self_reference" defaultValue={currentConfig.self_reference} placeholder="e.g. หนู" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="user_reference">User Reference</Label>
                                <Input id="user_reference" name="user_reference" defaultValue={currentConfig.user_reference} placeholder="e.g. พี่จ๋า" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="greeting">Greeting</Label>
                            <Textarea id="greeting" name="greeting" defaultValue={currentConfig.greeting} placeholder="Greeting message..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Save Changes" : "Create Persona"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
