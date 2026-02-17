"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SystemModel } from "@/app/actions/system";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatCurrency } from "@/lib/utils";
import { EditModelDialog } from "@/app/(main)/system/settings/_components/models/edit-model-dialog";

export const modelColumns: ColumnDef<SystemModel>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.getValue("name")}</span>
                    <span className="text-xs text-muted-foreground uppercase">{row.original.provider}</span>
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
                <div className="flex items-center">
                    <span className="capitalize">{row.getValue("type")}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "base_cost",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Base Cost" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("base_cost"));
            return <div>{formatCurrency(amount, { minimumFractionDigits: 6 })}</div>;
        },
    },
    {
        accessorKey: "enabled",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const enabled = row.getValue("enabled") as boolean;
            return (
                <Badge variant={enabled ? "default" : "secondary"}>
                    {enabled ? "Enabled" : "Disabled"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <EditModelDialog model={row.original} />,
    },
];
