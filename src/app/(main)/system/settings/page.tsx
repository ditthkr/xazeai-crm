import { Suspense } from "react";
import { getModels, getProviders } from "@/app/actions/system";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelsTable } from "./_components/models/models-table";
import { ProvidersList } from "./_components/providers/providers-list";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
    const [models, providers] = await Promise.all([
        getModels(),
        getProviders(),
    ]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold">Settings</h1>

            <Tabs defaultValue="models" className="w-full">
                <TabsList>
                    <TabsTrigger value="models">Models</TabsTrigger>
                    <TabsTrigger value="providers">Providers</TabsTrigger>
                </TabsList>
                <TabsContent value="models" className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        Configure available AI models and their pricing.
                    </div>
                    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                        <ModelsTable data={models} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="providers" className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        Manage AI providers and API keys.
                    </div>
                    <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                        <ProvidersList data={providers} />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
}


