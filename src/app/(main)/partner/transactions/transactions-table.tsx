"use client";

import { PartnerTransaction } from "@/app/actions/partner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { transactionColumns } from "./columns";
import { Input } from "@/components/ui/input";

export function TransactionsTable({ data }: { data: PartnerTransaction[] }) {
    const table = useDataTableInstance({
        data,
        columns: transactionColumns,
        searchKey: "reference_id", // Allow searching by reference ID
        searchPlaceholder: "Filter reference IDs...",
        paginationState: {
            pageIndex: 0,
            pageSize: 10,
        },
    });

    const handleWalletIdChange = (value: string) => {
        table.getColumn("wallet_id")?.setFilterValue(value);
    };

    return (
        <div className="space-y-4">
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
