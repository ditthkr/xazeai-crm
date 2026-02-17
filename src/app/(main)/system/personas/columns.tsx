"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SystemPersona } from "@/app/actions/system";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PersonaDialog } from "./_components/persona-dialog";
import { ViewPersonaDialog } from "./_components/view-persona-dialog";
import { useState } from "react";

export const columns: ColumnDef<SystemPersona>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return <div className="max-w-[300px] truncate" title={row.original.description}>{row.original.description}</div>;
        },
    },
    {
        accessorKey: "tenant_name",
        header: "Tenant",
        cell: ({ row }) => row.original.tenant_name || "-",
    },
    {
        accessorKey: "partner_name",
        header: "Partner",
        cell: ({ row }) => row.original.partner_name || "-",
    },
    {
        accessorKey: "is_default",
        header: "Default",
        cell: ({ row }) => (
            row.original.is_default ? <Badge variant="default">Default</Badge> : null
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const persona = row.original;
            const [showEditDialog, setShowEditDialog] = useState(false);
            const [showViewDialog, setShowViewDialog] = useState(false);

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <PersonaDialog
                        open={showEditDialog}
                        onOpenChange={setShowEditDialog}
                        persona={persona}
                    />
                    <ViewPersonaDialog
                        open={showViewDialog}
                        onOpenChange={setShowViewDialog}
                        persona={persona}
                    />
                </>
            );
        },
    },
];
