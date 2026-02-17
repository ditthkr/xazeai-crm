import { getSystemOverview, getSystemUsage } from "@/app/actions/system";
import { OverviewCards } from "./_components/overview-cards";
import { UsageStats } from "./_components/usage-stats";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
    const [overview, usage] = await Promise.all([
        getSystemOverview(),
        getSystemUsage(),
    ]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    System overview and usage statistics.
                </p>
            </div>

            <Suspense fallback={<StatsSkeleton />}>
                <OverviewCards data={overview} />
            </Suspense>

            <Suspense fallback={<UsageSkeleton />}>
                <UsageStats data={usage} />
            </Suspense>
        </div>
    )
}

function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
        </div>
    )
}

function UsageSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="col-span-4 h-[300px] rounded-xl" />
            <Skeleton className="col-span-3 h-[300px] rounded-xl" />
        </div>
    )
}
