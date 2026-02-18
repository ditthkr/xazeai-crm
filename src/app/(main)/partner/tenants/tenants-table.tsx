"use client";

import { useMemo } from "react";
import { PartnerTenant, PartnerModel } from "@/app/actions/partner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { getColumns } from "./columns";
import { CreateTenantDialog } from "./create-tenant-dialog";

import { Input } from "@/components/ui/input";

export function TenantsTable(props: {
    data: PartnerTenant[];
    models: PartnerModel[];
    defaultMarkupRate?: number;
}) {
    const { data, models } = props;
    const columns = useMemo(() => getColumns(models), [models]);

    const table = useDataTableInstance({
        data,
        columns,
        defaultPageSize: 10,
        getRowId: (row) => row.data.id,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Filter tenants..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <CreateTenantDialog
                        models={models}
                        defaultMarkupRate={props.defaultMarkupRate}
                    />
                </div>
            </div>
            <div className="rounded-md border">
                <DataTable table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
