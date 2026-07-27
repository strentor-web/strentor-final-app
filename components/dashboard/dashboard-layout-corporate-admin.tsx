"use client";

// External dependencies
import React from "react";
import { useIsClient } from "@uidotdev/usehooks";

// Internal components
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar-corporate-admin";
import { DashboardHeader } from "./dashboard-header";
import { Separator } from "@/components/ui/separator";
import { DashboardSkeleton } from "./dashboard-skeleton";

type Props = {
  children: React.ReactNode;
};

function DashboardLayoutWrapper({ children }: Props) {
  const isClient = useIsClient();

  if (!isClient) {
    return <DashboardSkeleton />;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar id="main-sidebar" />
      <SidebarInset
        className="flex flex-col md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0"
        role="main"
      >
        <DashboardHeader />
        <Separator className="bg-secondary" aria-hidden="true" />
        <div className="flex-1 overflow-auto p-4 flex justify-center" aria-label="Dashboard content">
          <div className="w-full max-w-7xl">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayoutWrapper;
