"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { usePlaygroundAuth } from "../playground-auth-provider";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";


export function PlaygroundNavUser({
    user,
}: {
    readonly user: {
        readonly name: string;
        readonly email: string;
        readonly avatar?: string;
    };
}) {
    const { isMobile } = useSidebar();
    const { logout } = usePlaygroundAuth();

    return (
        <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-1"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user.name}</span>
                        <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                    </div>
                </SidebarMenuButton>
                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                    <LogOut className="h-4 w-4" />
                </Button>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
