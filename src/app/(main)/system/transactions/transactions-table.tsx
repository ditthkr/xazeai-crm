"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/app/actions/system";
import { transactionColumns } from "./columns";

export function TransactionsTable({ data }: { data: Transaction[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const table = useDataTableInstance({
        data,
        columns: transactionColumns,
        defaultPageSize: 10,
        getRowId: (row) => row.id,
    });

    const handleWalletIdChange = (value: string) => {
        table.getColumn("wallet_id")?.setFilterValue(value);

        // Debounce URL update or update on blur/enter could be better, 
        // but for now let's just update the local filter which works on the fetched data. 
        // If we want server-side refetch, we need to push to router.
        // Given the requirement "can view separately by wallet_id by sending ?wallet_id=xxxx",
        // the user likely expects the URL to control the initial fetch (which page.tsx handles).
        // This input filters the *currently fetched* 3000 rows. 
        // To make it fully robust for deep linking, we should probably initialize the filter state 
        // from the URL param if present.
    };

    // Effect to sync URL param to table filter on mount
    React.useEffect(() => {
        const walletIdParam = searchParams.get("wallet_id");
        if (walletIdParam) {
            table.getColumn("wallet_id")?.setFilterValue(walletIdParam);
        }
    }, [searchParams, table]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Filter by Wallet ID..."
                        value={(table.getColumn("wallet_id")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            handleWalletIdChange(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[350px]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <div className="rounded-md border">
                <DataTable table={table} columns={transactionColumns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
