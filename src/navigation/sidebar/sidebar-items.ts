import {
  Home,
  LayoutGrid,
  Package,
  BookOpen,
  Settings,
  FileText,
  SquareTerminal,
  User,
  CircleDollarSign,
  Phone,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Represents a submenu item in the sidebar.
 */
export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

/**
 * Represents a main menu item in the sidebar, which can optionally have sub-items.
 */
export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

/**
 * Represents a group of menu items in the sidebar.
 */
export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

/**
 * Configuration for sidebar navigation items.
 * Grouped by section (e.g., Tools, Support).
 */
export const systemSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/system",
        icon: Home,
      },
      {
        title: "Partners",
        url: "/system/partners",
        icon: Users,
      },
      {
        title: "Transactions",
        url: "/system/transactions",
        icon: FileText,
      },
      {
        title: "Settings",
        url: "/system/settings",
        icon: Settings,
      },
      {
        title: "Personas",
        url: "/system/personas",
        icon: User,
      },
      {
        title: "Playground",
        url: "/playground/chat",
        icon: SquareTerminal,
      },

    ],
  },
];

export const partnerSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Tools",
    items: [
      {
        title: "Home",
        url: "/partner",
        icon: Home,
      },
      {
        title: "Models",
        url: "/partner/models",
        icon: Package,
      },
      {
        title: "Tenants",
        url: "/partner/tenants",
        icon: LayoutGrid,
      },
      {
        title: "Transactions",
        url: "/partner/transactions",
        icon: CircleDollarSign,
      },
    ],
  },
  {
    id: 2,
    label: "Support",
    items: [
      {
        title: "Settings",
        url: "/partner/settings",
        icon: Settings,
      },
      {
        title: "Terms & Conditions",
        url: "/partner/terms",
        icon: FileText,
      },
      {
        title: "Contact Us",
        url: "/partner/contact",
        icon: Phone,
      },
    ],
  },
];
