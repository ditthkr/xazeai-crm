"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { Partner } from "@/app/actions/system";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { PartnerActions } from "./_components/partner-actions";

export const partnerColumns: ColumnDef<Partner>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "slug",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
    },
    {
        accessorKey: "contact_email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contact Email" />
        ),
    },
    {
        accessorKey: "wallet_balance",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Wallet Balance" className="text-right" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("wallet_balance"));
            const formatted = formatCurrency(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "credit_limit",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Credit Limit" className="text-right" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("credit_limit"));
            const formatted = formatCurrency(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" className="text-right" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            const formatted = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            return <div className="text-right">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <PartnerActions partner={row.original} />,
    },
];
