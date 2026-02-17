"use client";

import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { columns } from "./columns";
import { SystemPersona } from "@/app/actions/system";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PersonaDialog } from "./_components/persona-dialog";
import { Plus } from "lucide-react";

export function PersonasTable({ data }: { data: SystemPersona[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize filter from URL
    const initialIsSystem = searchParams.get("is_system");
    const [isSystemFilter, setIsSystemFilter] = useState<string>(initialIsSystem ?? "all");

    const table = useDataTableInstance({
        data,
        columns,
        defaultPageSize: 10,
        getRowId: (row) => row.id,
    });

    const handleFilterChange = (value: string) => {
        setIsSystemFilter(value);
        const params = new URLSearchParams(searchParams);
        if (value === "all") {
            params.delete("is_system");
        } else {
            params.set("is_system", value);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center space-x-2">
                        <Input
                            placeholder="Filter personas by name..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                    </div>
                    <Select value={isSystemFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[180px] h-8">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Personas</SelectItem>
                            <SelectItem value="true">System Only</SelectItem>
                            <SelectItem value="false">Partner Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <PersonaDialog>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Persona
                        </Button>
                    </PersonaDialog>
                </div>
            </div>
            <div className="rounded-md border">
                <DataTable table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
