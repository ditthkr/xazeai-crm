"use client";

import { useTransition, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePartnerProfile, PartnerProfile } from "@/app/actions/partner";

export function ProfileSettings({ profile }: { profile: PartnerProfile }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function onSubmit(formData: FormData) {
        const markupRate = parseFloat(formData.get("default_tenant_markup_rate") as string);

        if (isNaN(markupRate) || markupRate < 0) {
            toast.error("Invalid markup rate");
            return;
        }

        startTransition(async () => {
            const result = await updatePartnerProfile({
                default_tenant_markup_rate: markupRate,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Profile updated successfully");
                router.refresh();
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Global Settings</CardTitle>
                <CardDescription>
                    Manage your default settings for new tenants.
                </CardDescription>
            </CardHeader>
            <form action={onSubmit}>
                <CardContent>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="default_tenant_markup_rate">Default Tenant Markup Rate</Label>
                        <Input
                            type="number"
                            id="default_tenant_markup_rate"
                            name="default_tenant_markup_rate"
                            step="0.01"
                            defaultValue={profile.default_tenant_markup_rate ?? 0}
                            placeholder="0.15"
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            This rate will be applied to new tenants by default.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
