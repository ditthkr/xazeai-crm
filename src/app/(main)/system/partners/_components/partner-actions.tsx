"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Partner } from "@/app/actions/system";
import { TopupPartnerDialog } from "./topup-partner-dialog";
import { UpdateCreditLimitDialog } from "./update-credit-limit-dialog";
import { useState } from "react";

import { PartnerKeysDialog } from "./partner-keys-dialog";

export function PartnerActions({ partner }: { partner: Partner }) {
    const [showTopup, setShowTopup] = useState(false);
    const [showLimit, setShowLimit] = useState(false);
    const [showKeys, setShowKeys] = useState(false);

    return (
        <>
            <TopupPartnerDialog open={showTopup} onOpenChange={setShowTopup} partner={partner} />
            <UpdateCreditLimitDialog open={showLimit} onOpenChange={setShowLimit} partner={partner} />
            <PartnerKeysDialog open={showKeys} onOpenChange={setShowKeys} partner={partner} />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => setShowTopup(true)}>
                        Top-up Credit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setShowLimit(true)}>
                        Update Credit Limit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setShowKeys(true)}>
                        Manage API Keys
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
