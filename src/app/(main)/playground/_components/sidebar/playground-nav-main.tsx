"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { type NavGroup } from "@/navigation/sidebar/sidebar-items";

interface PlaygroundNavMainProps {
    items: NavGroup[];
}

export function PlaygroundNavMain({ items }: PlaygroundNavMainProps) {
    const path = usePathname();
    const { state, isMobile } = useSidebar();

    const isItemActive = (url: string) => {
        return path === url || path.startsWith(`${url}/`);
    };

    return (
        <>
            {items.map((group) => (
                <SidebarGroup key={group.id}>
                    {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isItemActive(item.url)}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    );
}
