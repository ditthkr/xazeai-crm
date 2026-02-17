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
import { ActionState, SystemProvider, updateProvider } from "@/app/actions/system";

export function EditProviderDialog({ provider }: { provider: SystemProvider }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Configure
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Configure {provider.name}</DialogTitle>
                    <DialogDescription>
                        Update API key and settings for {provider.name}.
                    </DialogDescription>
                </DialogHeader>
                <EditProviderForm provider={provider} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

function EditProviderForm({ provider, onSuccess }: { provider: SystemProvider; onSuccess: () => void }) {
    const initialState: ActionState = {};
    const [state, formAction, isPending] = useActionState(updateProvider, initialState);
    const router = useRouter();


    const lastToastRef = useRef(state.timestamp);

    useEffect(() => {
        if (state.timestamp && state.timestamp !== lastToastRef.current) {
            lastToastRef.current = state.timestamp;

            if (state.success) {
                toast.success("Provider updated successfully");
                onSuccess();
                router.refresh();
            } else if (state.error) {
                toast.error(state.error);
            }
        }
    }, [state, onSuccess, router]);

    return (
        <form action={formAction} className="grid gap-4 py-4">
            <input type="hidden" name="name" value={provider.name} />

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="api_key" className="text-right">
                    API Key
                </Label>
                <Input
                    id="api_key"
                    name="api_key"
                    type="password"
                    placeholder="sk-..."
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                    Priority
                </Label>
                <Input
                    id="priority"
                    name="priority"
                    type="number"
                    defaultValue={10} // Default priority if unknown
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="enabled" className="text-right">
                    Enabled
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                    <Switch id="enabled" name="enabled" defaultChecked={provider.enabled} />
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
