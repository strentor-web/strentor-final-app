import {
  type LucideIcon,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  Map,
  Calculator,
  Settings,

  LayoutDashboard,
  Dumbbell,
  LineChart,
  HeartPulse,
  ClipboardCheck,
  Building2,
  Gift,
  Apple,
  Users,

} from "lucide-react";
import type { UserRole } from "@/types/auth";

export interface ClientNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  disabled?: boolean;
  badge?: string;
  /** Gates this item on an active SubscriptionCategory (see prisma schema). */
  requiredCategory?: "FITNESS" | "ALL_IN_ONE";
  /** Restricts this item to specific roles. Omit to show for all dashboard users. */
  roles?: UserRole[];
}

export const clientSidebarMenus: {
  user: { name: string; email: string; avatar: string };
  navMain: ClientNavItem[];
  navSecondary: { title: string; url: string; icon: LucideIcon }[];
  workspaces: { name: string; url: string; icon: LucideIcon }[];
} = {
  user: {
    name: "James",
    email: "james@example.com",
    avatar: "/avatars/avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Workout Plans",
      url: "/plans",
      icon: Dumbbell,
      isActive: true,
    },
    {
      title: "Personal Records",
      url: "/personal-records",
      icon: LineChart,
    },
    {
      title: "Body Check",
      url: "/tracker",
      icon: HeartPulse,
    },
    {
      title: "Weekly Reflection",
      url: "/check-in",
      icon: ClipboardCheck,
    },
    {
      title: "Nutrition",
      url: "/nutrition",
      icon: Apple,
    },
    {
      title: "Calculators",
      url: "/calculator",
      icon: Calculator,
    },
    {
      title: "Company Workshops",
      url: "/company-workshops",
      icon: Building2,
      roles: ["CORPORATE_EMPLOYEE"],
    },
    {
      title: "Community",
      url: "/community/feed",
      icon: Users,
    },
    {
      title: "Refer a Friend",
      url: "/refer",
      icon: Gift,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },

  ],
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: Send,
    },
  ],
  workspaces: [
    {
      name: "Customer Management",
      url: "/dashboard/customers",
      icon: Frame,
    },
    {
      name: "Sales Performance",
      url: "/dashboard/reports/sales",
      icon: PieChart,
    },
    {
      name: "Business Expansion",
      url: "/dashboard/reports/sales",
      icon: Map,
    },
  ],
};
