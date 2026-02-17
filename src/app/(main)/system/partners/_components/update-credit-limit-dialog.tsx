"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Coins } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionState, Partner, updatePartnerCreditLimit } from "@/app/actions/system";

export function UpdateCreditLimitDialog({
    partner,
    open,
    onOpenChange
}: {
    partner: Partner;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Credit Limit</DialogTitle>
                    <DialogDescription>
                        Set new credit limit for {partner.name}.
                    </DialogDescription>
                </DialogHeader>
                <UpdateCreditLimitForm partner={partner} onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}

function UpdateCreditLimitForm({ partner, onSuccess }: { partner: Partner; onSuccess: () => void }) {
    const initialState: ActionState = {};
    const [state, formAction, isPending] = useActionState(updatePartnerCreditLimit, initialState);
    const router = useRouter();
    const lastToastRef = useRef(state.timestamp);
    const [limit, setLimit] = useState(partner.credit_limit);

    useEffect(() => {
        if (state.timestamp && state.timestamp !== lastToastRef.current) {
            lastToastRef.current = state.timestamp;

            if (state.success) {
                toast.success("Credit limit updated successfully");
                onSuccess();
                router.refresh();
            } else if (state.error) {
                toast.error(state.error);
            }
        }
    }, [state, onSuccess, router]);

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and one decimal point
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setLimit(value);
        }
    };

    return (
        <form action={formAction} className="grid gap-4 py-4">
            <input type="hidden" name="partnerId" value={partner.id} />

            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credit_limit" className="text-right">
                    Limit
                </Label>
                <Input
                    id="credit_limit"
                    name="credit_limit"
                    value={limit}
                    onChange={handleLimitChange}
                    className="col-span-3"
                    required
                    autoComplete="off"
                />
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update
                </Button>
            </DialogFooter>
        </form>
    );
}
