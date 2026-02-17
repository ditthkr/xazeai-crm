"use client";

import { useActionState, useEffect, useState } from "react";
import { Copy, Plus, Loader2, Check } from "lucide-react";
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
import { createPartner } from "@/app/actions/system";


export function CreatePartnerDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Partner
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {open && <CreatePartnerForm />}
            </DialogContent>
        </Dialog>
    );
}

function CreatePartnerForm() {
    const [state, formAction, isPending] = useActionState(createPartner, {});
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        } else if (state.partner && state.admin_user) {
            toast.success("Partner created successfully");
            router.refresh();
        }
    }, [state, router]);

    const copyToClipboard = () => {
        if (state.admin_user) {
            const text = `Email: ${state.admin_user.email}\nPassword: ${state.admin_user.password}`;
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success("Credentials copied to clipboard");
        }
    };

    if (state.partner && state.admin_user) {
        return (
            <>
                <DialogHeader>
                    <DialogTitle>Partner Created</DialogTitle>
                    <DialogDescription>
                        The partner <strong>{state.partner.name}</strong> has been created.
                        Please save these credentials immediately.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <div className="rounded-md border p-2 bg-muted text-sm">
                                {state.partner.name}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Slug</Label>
                            <div className="rounded-md border p-2 bg-muted text-sm">
                                {state.partner.slug}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Wallet Balance</Label>
                            <div className="rounded-md border p-2 bg-muted text-sm">
                                {state.partner.wallet_balance}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Credit Limit</Label>
                            <div className="rounded-md border p-2 bg-muted text-sm">
                                {state.partner.credit_limit}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Admin Email</Label>
                        <div className="rounded-md border p-2 bg-muted text-sm">
                            {state.admin_user.email}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Admin Password</Label>
                        <div className="rounded-md border p-2 bg-muted text-sm font-mono">
                            {state.admin_user.password}
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={copyToClipboard}
                    >
                        {copied ? (
                            <Check className="mr-2 h-4 w-4" />
                        ) : (
                            <Copy className="mr-2 h-4 w-4" />
                        )}
                        {copied ? "Copied" : "Copy Credentials"}
                    </Button>
                </DialogFooter>
            </>
        );
    }

    return (
        <form action={formAction}>
            <DialogHeader>
                <DialogTitle>Create Partner</DialogTitle>
                <DialogDescription>
                    Add a new partner to the system. They will receive an admin account.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Partner Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Acme Corp"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        name="slug"
                        placeholder="e.g. acme"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="initial_balance">Initial Balance</Label>
                        <Input
                            id="initial_balance"
                            name="initial_balance"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="credit_limit">Credit Limit</Label>
                        <Input
                            id="credit_limit"
                            name="credit_limit"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Partner
                </Button>
            </DialogFooter>
        </form>
    );
}
