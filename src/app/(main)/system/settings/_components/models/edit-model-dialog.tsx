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
        <form action={formAction} className="grid gap-4 py-4">
            <input type="hidden" name="name" value={model.name} />
            <input type="hidden" name="id" value={model.id} />

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="base_cost" className="text-right">
                    Rate (USD / 1M Token)
                </Label>
                <Input
                    id="base_cost"
                    name="base_cost"
                    defaultValue={model.base_cost}
                    className="col-span-3"
                    step="0.00001"
                    type="number"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="enabled" className="text-right">
                    Enabled
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                    <Switch id="enabled" name="enabled" defaultChecked={model.enabled} />
                    <Label htmlFor="enabled">Active</Label>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save changes
                </Button>
            </DialogFooter>
        </form>
    );
}
