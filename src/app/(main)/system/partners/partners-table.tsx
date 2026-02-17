"use client";

import { Partner } from "@/app/actions/system";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { partnerColumns } from "./columns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


import { CreatePartnerDialog } from "./create-partner-dialog";

export function PartnersTable({ data }: { data: Partner[] }) {
    const table = useDataTableInstance({
        data,
        columns: partnerColumns,
        defaultPageSize: 5,
        getRowId: (row) => row.id,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Filter partners..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <CreatePartnerDialog />
                </div>
            </div>
            <div className="rounded-md border">
                <DataTable table={table} columns={partnerColumns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
