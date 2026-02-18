"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { Switch } from "@/components/ui/switch";
import { ActionState, SystemModel, updateModel } from "@/app/actions/system";

export function EditModelDialog({ model }: { model: SystemModel }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Model</DialogTitle>
                    <DialogDescription>
                        Update configuration for {model.name}.
                    </DialogDescription>
                </DialogHeader>
                <EditModelForm model={model} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

function EditModelForm({ model, onSuccess }: { model: SystemModel; onSuccess: () => void }) {
    const initialState: ActionState = {};
    const [state, formAction, isPending] = useActionState(updateModel, initialState);
    const router = useRouter();


    const lastToastRef = useRef(state.timestamp);

    useEffect(() => {
        if (state.timestamp && state.timestamp !== lastToastRef.current) {
            lastToastRef.current = state.timestamp;

            if (state.success) {
                toast.success("Model updated successfully");
                onSuccess();
                router.refresh();
            } else if (state.error) {
                toast.error(state.error);
            }
        }
    }, [state, onSuccess, router]);

    return (
        <form action={formAction} className="grid gap-6 py-4">
            <input type="hidden" name="id" value={model.id} />

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">1</span>
                    Model Metadata
                </div>
                <div className="grid gap-4 rounded-lg border p-4">
                    <div className="grid gap-2">
                        <Label className="text-muted-foreground text-xs">Provider</Label>
                        <div className="flex h-10 w-full items-center rounded-md border bg-muted/50 px-3 py-2 text-sm font-medium capitalize text-muted-foreground">
                            {model.provider}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={model.name}
                                className="font-medium"
                                placeholder="e.g. GPT-4 Turbo"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="embedding_model" className="text-muted-foreground text-xs">Embedding Model</Label>
                            <Input
                                id="embedding_model"
                                name="embedding_model"
                                defaultValue={model.embedding_model || ""}
                                placeholder="None"
                                className="h-10 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">2</span>
                    Pricing & Configuration
                </div>
                <div className="grid gap-4 rounded-lg border bg-muted/20 p-4">
                    <div className="grid gap-2">
                        <Label htmlFor="base_cost">Base Rate (USD / 1M Token)</Label>
                        <div className="relative">
                            <Input
                                id="base_cost"
                                name="base_cost"
                                defaultValue={model.base_cost}
                                type="number"
                                step="0.01"
                            />
                        </div>
                        <p className="text-[0.8rem] text-muted-foreground">
                            Define the base cost for this model per million tokens.
                        </p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-background p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor="enabled" className="text-base cursor-pointer">Active Status</Label>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Enable availability for all tenants
                            </p>
                        </div>
                        <Switch id="enabled" name="enabled" defaultChecked={model.enabled} />
                    </div>
                </div>
            </div>

            <DialogFooter className="pt-2">
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
    );
}
