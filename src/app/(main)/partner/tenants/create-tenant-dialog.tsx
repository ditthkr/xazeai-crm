"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createPartnerTenant, PartnerModel } from "@/app/actions/partner";

export function CreateTenantDialog({ models }: { models: PartnerModel[] }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createPartnerTenant({}, formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Tenant created successfully");
                setOpen(false);
                router.refresh();
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Tenant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Tenant</DialogTitle>
                        <DialogDescription>
                            Add a new tenant to your partner account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="My Tenant"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="my-tenant"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="initial_balance">Initial Balance</Label>
                            <Input
                                id="initial_balance"
                                name="initial_balance"
                                type="number"
                                step="0.01"
                                placeholder="1000.00"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="markup_rate">Markup Rate</Label>
                            <Input
                                id="markup_rate"
                                name="markup_rate"
                                type="number"
                                step="0.01"
                                placeholder="0.1"
                                defaultValue="0.1"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="model_config_id">Model</Label>
                            <Select name="model_config_id" required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent className="w-full min-w-0">
                                    {models.map((model) => (
                                        <SelectItem key={model.id} value={model.id}>
                                            {model.name} ({parseFloat(model.rate).toFixed(4)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Tenant"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
