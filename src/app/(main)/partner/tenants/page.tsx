import { getPartnerTenants, getPartnerModels, getPartnerProfile } from "@/app/actions/partner";
import { TenantsTable } from "./tenants-table";

export default async function TenantsPage() {
    const tenants = await getPartnerTenants();
    const models = await getPartnerModels();
    const profile = await getPartnerProfile();

    return (
        <div className="@container/main flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
            </div>

            <TenantsTable
                data={tenants}
                models={models}
                defaultMarkupRate={profile?.default_tenant_markup_rate}
            />
        </div>
    );
}
