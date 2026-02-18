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
import { formatCurrency } from "@/lib/utils";

export function CreateTenantDialog({ models, defaultMarkupRate }: { models: PartnerModel[], defaultMarkupRate?: number }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [markupRate, setMarkupRate] = useState<string>(defaultMarkupRate?.toString() || "0.2");
    const [selectedModelId, setSelectedModelId] = useState<string>("");

    const selectedModel = models.find(m => m.id === selectedModelId);
    // Calculation: Base Rate * (1 + Markup Rate)
    // markupRate is usually a percentage (e.g. 0.2 for 20%) or value?
    // Assuming it works as (1 + rate) based on "0.2" context.
    // If input is 0.2, it means 20% markup?
    // User said "default_tenant_markup_rate: 0.2".
    // Let's assume standard markup: Cost * (1 + Markup).

    const finalRate = selectedModel && !isNaN(parseFloat(markupRate))
        ? (parseFloat(selectedModel.rate) * (1 + parseFloat(markupRate))).toFixed(6)
        : null;

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
            <DialogContent className="sm:max-w-[500px]">
                <form action={onSubmit} className="grid gap-6">
                    <DialogHeader>
                        <DialogTitle>Create New Tenant</DialogTitle>
                        <DialogDescription>
                            Configure a new tenant with specific model rates and balance.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">1</span>
                            Tenant Details
                        </div>
                        <div className="grid gap-4 rounded-lg border p-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Acme Corp"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="text-xs text-muted-foreground">Slug (URL Identifier)</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="acme-corp"
                                    required
                                    className="font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">2</span>
                            Financial Configuration
                        </div>
                        <div className="grid gap-4 rounded-lg border bg-muted/20 p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="initial_balance">Initial Balance</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                                        <Input
                                            id="initial_balance"
                                            name="initial_balance"
                                            type="number"
                                            step="0.01"
                                            placeholder="1000.00"
                                            className="pl-6 font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="markup_rate">Markup Rate</Label>
                                    <Input
                                        id="markup_rate"
                                        name="markup_rate"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.2"
                                        value={markupRate}
                                        onChange={(e) => setMarkupRate(e.target.value)}
                                        className="font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2 pt-2 border-t">
                                <Label htmlFor="model_config_id">Base Model</Label>
                                <Select
                                    name="model_config_id"
                                    required
                                    onValueChange={setSelectedModelId}
                                >
                                    <SelectTrigger className="w-full bg-background">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {models.map((model) => (
                                            <SelectItem key={model.id} value={model.id}>
                                                <span className="font-medium">{model.name}</span>
                                                <span className="ml-2 text-muted-foreground text-xs">
                                                    ({formatCurrency(parseFloat(model.rate))}/1M)
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedModel && finalRate && (
                                    <div className="mt-2 rounded-md border bg-background p-3 text-sm shadow-sm">
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Base Cost:</span>
                                            <span className="font-mono">{formatCurrency(parseFloat(selectedModel.rate))}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-muted-foreground">Markup ({markupRate}):</span>
                                            <span className="font-mono text-green-600">
                                                +{formatCurrency(parseFloat(selectedModel.rate) * parseFloat(markupRate))}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                                            <span>Final Customer Rate:</span>
                                            <span className="font-mono">{formatCurrency(parseFloat(finalRate))} / 1M Token</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                            {isPending ? "Creating..." : "Create Tenant"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
