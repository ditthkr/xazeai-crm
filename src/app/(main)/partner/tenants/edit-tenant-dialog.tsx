"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updatePartnerTenant, PartnerTenant, PartnerModel } from "@/app/actions/partner";

interface EditTenantDialogProps {
    tenant: PartnerTenant;
    models: PartnerModel[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditTenantDialog({ tenant, models, open, onOpenChange }: EditTenantDialogProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [markupRate, setMarkupRate] = useState<string>("");

    useEffect(() => {
        if (open) {
            setMarkupRate(tenant.rate.markup_rate?.toString() || "");
        }
    }, [open, tenant]);

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const name = formData.get("name") as string;
            const slug = formData.get("slug") as string;
            const model_config_id = formData.get("model_config_id") as string;
            const markup_rate_str = formData.get("markup_rate") as string;

            const updates: any = {};

            if (name !== tenant.data.name) updates.name = name;
            if (slug !== tenant.data.slug) updates.slug = slug;
            if (model_config_id !== tenant.data.model_config_id) updates.model_config_id = model_config_id;

            if (markup_rate_str !== "") {
                const newMarkup = parseFloat(markup_rate_str);
                if (!isNaN(newMarkup) && newMarkup !== tenant.rate.markup_rate) {
                    updates.markup_rate = newMarkup;
                }
            } else if (tenant.rate.markup_rate !== null && tenant.rate.markup_rate !== undefined) {
                // Should we handle clearing markup rate? The API optional might allow it if we send null?
                // Current interface says markup_rate?: number. It doesn't accept null explicitly in the action payload logic for now
                // But let's assume we just update if it's a valid number.
            }


            if (Object.keys(updates).length === 0) {
                toast.info("No changes to save");
                onOpenChange(false);
                return;
            }

            const result = await updatePartnerTenant(tenant.data.id, updates);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Tenant updated successfully");
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
                        <DialogTitle>Edit Tenant</DialogTitle>
                        <DialogDescription>
                            Make changes to your tenant here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={tenant.data.name}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                defaultValue={tenant.data.slug}
                                required
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
                                value={markupRate}
                                onChange={(e) => setMarkupRate(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="model_config_id">Model</Label>
                            <Select name="model_config_id" defaultValue={tenant.data.model_config_id}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent className="w-full min-w-0">
                                    {models.map((model) => (
                                        <SelectItem key={model.id} value={model.id}>
                                            {model.name} ({parseFloat(model.rate).toFixed(4)} USD/1M Token)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
