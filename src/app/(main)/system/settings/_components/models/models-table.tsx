"use client";

import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { SystemModel } from "@/app/actions/system";
import { modelColumns } from "./columns";

export function ModelsTable({ data }: { data: SystemModel[] }) {
    const table = useDataTableInstance({
        data,
        columns: modelColumns,
        defaultPageSize: 10,
        getRowId: (row) => row.id,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Filter models..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                </div>
            </div>
            <div className="rounded-md border">
                <DataTable table={table} columns={modelColumns} />
            </div>
        </div>
    );
}
