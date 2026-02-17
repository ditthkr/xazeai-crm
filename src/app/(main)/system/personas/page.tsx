import { Suspense } from "react";
import { getSystemPersonas } from "@/app/actions/system";
import { PersonasTable } from "./personas-table";
import { columns } from "./columns";

export default async function SystemPersonasPage({
    searchParams,
}: {
    searchParams: Promise<{ is_system?: string }>;
}) {
    const { is_system } = await searchParams;

    // Determine is_system boolean based on search param
    let isSystem: boolean | undefined = undefined;
    if (is_system === "true") isSystem = true;
    if (is_system === "false") isSystem = false;

    // Fetching 1000 items to support client-side pagination consistent with PartnersTable
    const personas = await getSystemPersonas(1000, 0, isSystem);

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Personas</h1>
                    <p className="text-muted-foreground">
                        Manage system and partner personas.
                    </p>
                </div>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <PersonasTable data={personas} />
            </Suspense>
        </div>
    );
}
