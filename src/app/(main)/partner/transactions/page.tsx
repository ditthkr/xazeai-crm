import { getPartnerTransactions } from "@/app/actions/partner";
import { TransactionsTable } from "./transactions-table";

interface TransactionsPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TransactionsPage({
    searchParams,
}: TransactionsPageProps) {
    const params = await Promise.resolve(searchParams);
    const walletId = typeof params.wallet_id === "string" ? params.wallet_id : undefined;

    const transactions = await getPartnerTransactions(3000, 0, walletId);

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            </div>
            <TransactionsTable data={transactions} />
        </div>
    );
}
