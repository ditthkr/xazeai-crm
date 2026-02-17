import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Activity, Zap } from "lucide-react";
import { SystemUsage } from "@/app/actions/system";

export function UsageStats({ data }: { data: SystemUsage | null }) {
    if (!data) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Usage Overview</CardTitle>
                    <CardDescription>
                        System-wide token usage and activity.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    {/* Placeholder for a chart or detailed breakdown */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-sm">Total Tokens</span>
                            <span className="text-2xl font-bold flex items-center gap-2">
                                <Zap className="h-5 w-5 text-yellow-500" />
                                {data.total_tokens.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-sm">Active Tenants (24h)</span>
                            <span className="text-2xl font-bold flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-500" />
                                {data.active_tenants_24h}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Usage by Model</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(data.tokens_by_model).map(([model, count]) => (
                            <div key={model} className="flex items-center">
                                <span className="text-sm font-medium w-full truncate capitalize">{model}</span>
                                <span className="text-sm  text-muted-foreground ml-auto">
                                    {count.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        {Object.keys(data.tokens_by_model).length === 0 && (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                No usage data available
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
