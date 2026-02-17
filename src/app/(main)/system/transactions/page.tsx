import { getTransactions } from "@/app/actions/system";
import { TransactionsTable } from "./transactions-table";

interface TransactionsPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TransactionsPage({
    searchParams,
}: TransactionsPageProps) {
    // Await searchParams before access as per Next.js 15+ changes, 
    // but looking at existing code it might be Next 14. 
    // Safest is to treat it as a promise if in newer next versions or just direct access if older.
    // Given the project structure, I'll access it directly but type it correctly.
    // Ideally we should pass wallet_id from searchParams to getTransactions if we wanted server-side filtering.
    // But for now, user asked for optional filtering. 
    // The current requirement "Can view separately by wallet_id by sending ?wallet_id=xxxx" 
    // implies URL usage. 

    // IMPORTANT: Next.js 15 requires awaiting searchParams. 
    // Checking package.json would confirm version, but usually safe to await if async function.
    const params = await Promise.resolve(searchParams);
    const walletId = typeof params.wallet_id === "string" ? params.wallet_id : undefined;

    // Fetching 3000 records as per user example `limit=3000` to handle client-side pagination 
    // effectively for the initial request.
    const transactions = await getTransactions(3000, 0, walletId);

    return (
        <div className="@container/main flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
            </div>
            <TransactionsTable data={transactions} />
        </div>
    );
}
