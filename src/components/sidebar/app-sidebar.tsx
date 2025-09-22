"use client";

import * as React from "react";
import { BookOpen, Home, LayoutDashboard } from "lucide-react";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = {
    name: Cookies.get("name") || "Unknown User",
    email: Cookies.get("email") || "Unknown Email",
    role: Cookies.get("role") || "Unknown Role",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center p-1">
          <Image src={logo} alt="logo" width={62} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {user.role === "PROFESSOR" && (
          <div className="mt-2 px-2 space-y-2">
            <div>
              <Link
                href="/professor"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            </div>

            <div>
              <Link
                href="/professor/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            </div>

            <div>
              <Link
                href="/professor/turmas"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Turmas
              </Link>
            </div>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
