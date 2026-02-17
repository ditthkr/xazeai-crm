import { getPartners } from "@/app/actions/system";
import { PartnersTable } from "./partners-table";

export default async function PartnersPage() {
    const partners = await getPartners();

    return (
        <div className="@container/main flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
            </div>
            <PartnersTable data={partners} />
        </div>
    );
}
