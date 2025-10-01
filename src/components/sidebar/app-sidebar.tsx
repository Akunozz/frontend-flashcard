"use client";

import type * as React from "react";
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
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const user = {
    name: Cookies.get("name") || "Unknown User",
    email: Cookies.get("email") || "Unknown Email",
    role: Cookies.get("role") || "Unknown Role",
  };

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center p-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur-lg opacity-50" />
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-2xl p-2">
              <Image
                src={logo || "/placeholder.svg"}
                alt="logo"
                width={56}
                height={56}
              />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {user.role === "PROFESSOR" && (
          <div className="mt-2 px-3 space-y-1">
            <Link
              href="/professor"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive("/professor")
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                  : "hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-foreground"
              }`}
            >
              <div
                className={`rounded-lg p-1.5 transition-colors ${
                  isActive("/professor")
                    ? "bg-white/20"
                    : "bg-emerald-100 dark:bg-emerald-800 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700"
                }`}
              >
                <Home
                  className={`w-4 h-4 ${
                    isActive("/professor")
                      ? "text-white"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                />
              </div>
              <span>Home</span>
            </Link>

            <Link
              href="/professor/dashboard"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive("/professor/dashboard")
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                  : "hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-foreground"
              }`}
            >
              <div
                className={`rounded-lg p-1.5 transition-colors ${
                  isActive("/professor/dashboard")
                    ? "bg-white/20"
                    : "bg-emerald-100 dark:bg-emerald-800 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700"
                }`}
              >
                <LayoutDashboard
                  className={`w-4 h-4 ${
                    isActive("/professor/dashboard")
                      ? "text-white"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                />
              </div>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/professor/turmas"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive("/professor/turmas")
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                  : "hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-foreground"
              }`}
            >
              <div
                className={`rounded-lg p-1.5 transition-colors ${
                  isActive("/professor/turmas")
                    ? "bg-white/20"
                    : "bg-emerald-100 dark:bg-emerald-800 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700"
                }`}
              >
                <BookOpen
                  className={`w-4 h-4 ${
                    isActive("/professor/turmas")
                      ? "text-white"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                />
              </div>
              <span>Turmas</span>
            </Link>
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
