"use client";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { PartnerTenant } from "@/app/actions/partner";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { CellAction } from "./cell-action";

import { PartnerModel } from "@/app/actions/partner";

export const getColumns = (models: PartnerModel[]): ColumnDef<PartnerTenant>[] => [
    {
        accessorKey: "data.name",
        id: "name", // Keep id as 'name' for easier filtering compatibility
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "data.slug",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ row }) => (
            <div className="font-mono text-xs">{row.original.data.slug}</div>
        ),
    },
    {
        accessorKey: "rate.model_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Model" />
        ),
        cell: ({ row }) => (
            <div className="font-mono text-xs">{row.original.rate.model_name}</div>
        ),
    },
    {
        accessorKey: "rate.markup_rate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Markup" className="text-right" />
        ),
        cell: ({ row }) => {
            const markup = row.original.rate.markup_rate;
            if (markup === null || markup === undefined) return <div className="text-right">-</div>;
            return <div className="text-right">{markup}</div>;
        },
    },
    {
        accessorKey: "rate.final_rate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Final Rate (USD / 1M Token)" className="text-right" />
        ),
        cell: ({ row }) => {
            const rate = parseFloat(row.original.rate.final_rate);
            return <div className="text-right font-medium">{formatCurrency(rate)}</div>;
        },
    },
    {
        accessorKey: "balance",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Balance" className="text-right" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.original.balance);
            const formatted = formatCurrency(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "data.created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" className="text-right" />
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.data.created_at);
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
        cell: ({ row }) => <CellAction data={row.original} models={models} />,
    },
];
