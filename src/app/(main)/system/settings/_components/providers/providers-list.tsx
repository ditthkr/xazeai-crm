"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SystemProvider } from "@/app/actions/system";
import { EditProviderDialog } from "@/app/(main)/system/settings/_components/providers/edit-provider-dialog";

export function ProvidersList({ data }: { data: SystemProvider[] }) {
    if (!data.length) {
        return (
            <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                No providers found.
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((provider) => (
                <Card key={provider.name}>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="capitalize">{provider.name}</CardTitle>
                            <Badge variant={provider.enabled ? "default" : "secondary"}>
                                {provider.enabled ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <CardDescription>
                            {provider.model_count} models ({provider.enabled_model_count} enabled)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-end">
                            <EditProviderDialog provider={provider} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
