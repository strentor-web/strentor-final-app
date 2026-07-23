"use client";

// External dependencies
import * as React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import Image from "next/image";

// Internal components
import { NavMain } from "@/components/dashboard/sidebar/nav-main";
import { NavWorkspace } from "@/components/dashboard/sidebar/nav-workspace";
import { NavSecondary } from "@/components/dashboard/sidebar/nav-secondary";
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
import { clientSidebarMenus } from "@/data/sidebar-data/client-sidebar-menus";

// ALL_IN_ONE is a bundle that also grants FITNESS access (mirrors
// lib/auth-utils.ts's hasActiveSubscription). It does not currently grant
// AI_COACHING — that category has no bundling rule yet.
function hasCategoryAccess(activeSubscriptionCategories: string[], required: string): boolean {
  if (activeSubscriptionCategories.includes(required)) return true;
  if (required === "FITNESS" && activeSubscriptionCategories.includes("ALL_IN_ONE")) return true;
  return false;
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  activeSubscriptionCategories?: string[];
};

/**
 * AppSidebar Component
 *
 * Main application sidebar with navigation sections for the dashboard.
 * Includes app logo/header, main navigation, workspace selection,
 * secondary links, and user profile. Nav items with a `requiredCategory`
 * (e.g. AI Trainer) are enabled only once the client has an active
 * subscription in that category.
 */
export function AppSidebar({ activeSubscriptionCategories = [], ...props }: AppSidebarProps) {
  const { open } = useSidebar();

  // Persist sidebar open state in localStorage
  React.useEffect(() => {
    localStorage.setItem("sidebar-open", open.toString());
  }, [open]);

  const navMainItems = React.useMemo(
    () =>
      clientSidebarMenus.navMain.map(({ requiredCategory, ...item }) => ({
        ...item,
        disabled: requiredCategory
          ? !hasCategoryAccess(activeSubscriptionCategories, requiredCategory)
          : item.disabled,
      })),
    [activeSubscriptionCategories]
  );

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
      aria-label="Main navigation"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/dashboard"
                className="hover:bg-transparent"
                aria-label="Go to dashboard home"
              >
                <div
                  className="bg-sidebar text-sidebar-foreground flex aspect-square size-8 items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  <Image
                    src="/strentor-icon.png"
                    alt="Strentor logo"
                    width={16}
                    height={16}
                    className="rounded"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Strentor</span>
                  {/* <span className="truncate text-xs">Enterprise</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        {/* <NavWorkspace workspaces={sidebarMenus.workspaces} /> */}
        {/* <NavSecondary items={sidebarMenus.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
