"use client";

// External dependencies
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, BarChart3, Receipt } from "lucide-react";
import Image from "next/image";

// Internal components
import { NavUser } from "@/components/dashboard/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const corporateAdminNavItems = [
  { title: "Overview", url: "/corporate-admin", icon: LayoutDashboard },
  { title: "Employees", url: "/corporate-admin/employees", icon: Users },
  { title: "Programs & Workshops", url: "/corporate-admin/programs", icon: CalendarCheck },
  { title: "Engagement", url: "/corporate-admin/engagement", icon: BarChart3 },
  { title: "Billing", url: "/corporate-admin/billing", icon: Receipt },
];

/**
 * AppSidebar Component - Corporate Admin Version
 *
 * Sidebar for a corporate account's own admin — manages their employee
 * roster, sees their booked programs, aggregate engagement, and billing.
 * Distinct from /admin (STRENTOR-staff-facing) and /dashboard (individual
 * client/corporate-employee coaching dashboard).
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const pathname = usePathname();

  React.useEffect(() => {
    localStorage.setItem("sidebar-open", open.toString());
  }, [open]);

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
      aria-label="Corporate admin navigation"
    >
      <SidebarHeader>
        <SidebarMenu className="items-center">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/corporate-admin"
                className="hover:bg-transparent"
                aria-label="Go to corporate admin dashboard"
              >
                <div className="bg-sidebar text-sidebar-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src="/strentor-icon.png" alt="Strentor logo" width={16} height={16} className="rounded" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Strentor</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">Corporate Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {corporateAdminNavItems.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/corporate-admin" && pathname.startsWith(item.url));

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} className="hover:bg-accent/50 data-[state=open]:bg-accent">
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4 flex-shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
