"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/app/actions/system";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";

export const transactionColumns: ColumnDef<Transaction>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return (
                <div className="flex w-[150px] flex-col">
                    <span className="truncate font-medium">
                        {date.toLocaleDateString()}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                        {date.toLocaleTimeString()}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "reference_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ref Type" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <span className="truncate capitalize">
                        {row.getValue("reference_type")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "reference_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ref ID" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="truncate text-xs text-muted-foreground" title={row.getValue("reference_id")}>
                        {row.getValue("reference_id")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[80px] items-center">
                    <span className="truncate font-medium capitalize">
                        {row.getValue("type")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            // Format as currency, user didn't specify currency so defaulting to generic or THB/USD if context implies
            // Using formatCurrency utility
            const formatted = formatCurrency(amount);

            return (
                <div className={`font-medium ${amount < 0 ? "text-red-500" : "text-green-500"}`}>
                    {formatted}
                </div>
            );
        },
    },
    {
        accessorKey: "balance_after",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Balance After" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("balance_after"));
            return <div>{formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: "owner_type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Owner" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[80px] items-center">
                    <span className="truncate font-medium text-xs">
                        {row.getValue("owner_type")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "wallet_id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Wallet ID" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span className="truncate text-xs text-muted-foreground" title={row.getValue("wallet_id")}>
                        {row.getValue("wallet_id")}
                    </span>
                </div>
            );
        },
    },
];
