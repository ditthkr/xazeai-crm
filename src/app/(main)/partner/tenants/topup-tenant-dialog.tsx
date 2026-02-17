"use client";

import { useTransition, useState } from "react";
import { Loader2, Plus, CreditCard } from "lucide-react";
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
import { topupPartnerTenant, PartnerTenant } from "@/app/actions/partner";

export function TopupTenantDialog({
    tenant,
    open,
    onOpenChange
}: {
    tenant: PartnerTenant;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await topupPartnerTenant({}, formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Tenant topped up successfully");
                onOpenChange(false);
                router.refresh();
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form action={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Top-up Tenant Credit</DialogTitle>
                        <DialogDescription>
                            Add balance to {tenant.data.name}'s wallet.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <input type="hidden" name="tenantId" value={tenant.data.id} />
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="0.01"
                                placeholder="100.00"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Top-up
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
