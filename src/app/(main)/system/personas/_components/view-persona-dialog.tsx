"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SystemPersona } from "@/app/actions/system";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ViewPersonaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    persona: SystemPersona;
}

export function ViewPersonaDialog({ open, onOpenChange, persona }: ViewPersonaDialogProps) {
    const config = persona.config || {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Persona Details</DialogTitle>
                    <DialogDescription>
                        View full details of the persona.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input value={persona.name} readOnly className="bg-muted/50" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea value={persona.description} readOnly className="bg-muted/50" />
                    </div>

                    <div className="border-t my-2"></div>
                    <div className="font-semibold text-lg">Configuration</div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Tone</Label>
                            <Input value={config.tone || "-"} readOnly className="bg-muted/50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Emoji</Label>
                            <Input value={config.emoji || "-"} readOnly className="bg-muted/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Language</Label>
                            <Input value={config.language || "-"} readOnly className="bg-muted/50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Gender</Label>
                            <Input value={config.gender || "-"} readOnly className="capitalize bg-muted/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Self Reference</Label>
                            <Input value={config.self_reference || "-"} readOnly className="bg-muted/50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>User Reference</Label>
                            <Input value={config.user_reference || "-"} readOnly className="bg-muted/50" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Greeting</Label>
                        <Textarea value={config.greeting || "-"} readOnly className="bg-muted/50" />
                    </div>

                    <div className="border-t my-2"></div>
                    <div className="font-semibold text-lg">System Info</div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Tenant</Label>
                            <Input value={persona.tenant_name || "-"} readOnly className="bg-muted/50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Partner</Label>
                            <Input value={persona.partner_name || "-"} readOnly className="bg-muted/50" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded text-xs font-medium border ${persona.is_default ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-transparent"}`}>
                                {persona.is_default ? "Default Persona" : "Standard Persona"}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
