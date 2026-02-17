"use client";

import Link from "next/link";
import { Command } from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { playgroundSidebarItems } from "@/navigation/sidebar/playground-items";
import { PlaygroundNavMain } from "./playground-nav-main";
import { PlaygroundNavUser } from "./playground-nav-user";

export function PlaygroundSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = {
        name: "Playground User",
        email: "guest@xaze.ai",
        avatar: "",
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <Link href="/playground">
                                <Command />
                                <span className="text-base font-semibold">Xaze.ai</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarContent>
                    <PlaygroundNavMain items={playgroundSidebarItems} />
                </SidebarContent>
            </SidebarContent>
            <SidebarFooter>
                <PlaygroundNavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
