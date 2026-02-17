import { getPartnerTenants, getPartnerModels } from "@/app/actions/partner";
import { TenantsTable } from "./tenants-table";

export default async function TenantsPage() {
    const tenants = await getPartnerTenants();
    const models = await getPartnerModels();

    return (
        <div className="@container/main flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
            </div>

            <TenantsTable data={tenants} models={models} />
        </div>
    );
}
