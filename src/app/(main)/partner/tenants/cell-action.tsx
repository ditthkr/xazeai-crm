import { useState } from "react";
import { MoreHorizontal, CreditCard, Key, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PartnerTenant, PartnerModel } from "@/app/actions/partner";
import { TopupTenantDialog } from "./topup-tenant-dialog";

import { TenantKeysDialog } from "./tenant-keys-dialog";
import { EditTenantDialog } from "./edit-tenant-dialog";

export function CellAction({ data, models }: { data: PartnerTenant; models: PartnerModel[] }) {
    const [topupOpen, setTopupOpen] = useState(false);
    const [keysOpen, setKeysOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <TopupTenantDialog
                tenant={data}
                open={topupOpen}
                onOpenChange={setTopupOpen}
            />
            <TenantKeysDialog
                tenant={data}
                open={keysOpen}
                onOpenChange={setKeysOpen}
            />
            <EditTenantDialog
                tenant={data}
                models={models}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Tenant
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTopupOpen(true)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Top-up Credit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setKeysOpen(true)}>
                        <Key className="mr-2 h-4 w-4" />
                        Manage API Keys
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
