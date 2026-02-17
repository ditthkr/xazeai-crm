import {
    MessageSquare,
    Users,
    Building2,
    Database,
} from "lucide-react";
import { NavGroup } from "./sidebar-items";

export const playgroundSidebarItems: NavGroup[] = [
    {
        id: 1,
        label: "Playground",
        items: [
            {
                title: "Chat",
                url: "/playground/chat",
                icon: MessageSquare,
            },
            {
                title: "Persona",
                url: "/playground/persona",
                icon: Users,
            },
            {
                title: "Business Profile",
                url: "/playground/business-profile",
                icon: Building2,
            },
            {
                title: "Knowledge Base",
                url: "/playground/knowledge-base",
                icon: Database,
            }
        ],
    },
];
