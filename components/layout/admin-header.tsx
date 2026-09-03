"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Bell,
  Radio,
  User,
  LogOut,
  ChevronDown,
  Shield,
  ShieldAlert,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  let sectionName = "Command Center";
  if (pathname.includes("/incidents")) sectionName = "Incident Triage & Dispatch";
  else if (pathname.includes("/volunteers")) sectionName = "Volunteer Verification";
  else if (pathname.includes("/blood-donors")) sectionName = "Blood Donor Requests";
  else if (pathname.includes("/relief")) sectionName = "Relief Verification";
  else if (pathname.includes("/hospitals")) sectionName = "Hospital Directory";
  else if (pathname.includes("/emergency-services")) sectionName = "Emergency Hotlines";
  else if (pathname.includes("/audit-logs")) sectionName = "Audit History";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-8 backdrop-blur-xl shadow-2xs">
      {/* 1. Left: Breadcrumb Navigation */}
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-sm font-medium">
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard" className="text-slate-500 hover:text-brand-navy">
                Admin Portal
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-brand-navy">
                {sectionName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 2. Center: Live Operations Status Pill */}
      <div className="hidden md:flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-1.5 text-xs font-bold text-brand-blue shadow-xs">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-blue-600" />
        </span>
        <Radio className="size-3.5 text-brand-blue animate-pulse" />
        <span>Operations Command Live · National Grid</span>
      </div>

      {/* 3. Right: Alerts & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Alert Bell */}
        <button
          aria-label="Admin Alerts"
          className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 transition hover:bg-slate-100 hover:text-brand-navy shadow-2xs cursor-pointer"
        >
          <Bell className="size-5 text-brand-red" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand-red ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/90 p-1.5 pr-3.5 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition">
            <div className="grid size-8.5 place-items-center rounded-xl bg-brand-navy text-white font-bold text-xs">
              {session?.user?.name ? (
                session.user.name.charAt(0).toUpperCase()
              ) : (
                <Shield className="size-4.5 text-brand-red-light" />
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold text-brand-navy leading-tight">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-brand-red font-extrabold uppercase tracking-wide">
                Administrator
              </p>
            </div>
            <ChevronDown className="size-3.5 text-slate-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-58 p-2 rounded-2xl shadow-xl">
            <div className="px-2.5 py-2">
              <p className="text-xs font-bold text-brand-navy">
                {session?.user?.name || "System Admin"}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {session?.user?.email || "Command Authority"}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard?workspace=citizen"
                  className="flex w-full items-center gap-2.5"
                >
                  <User className="size-4 text-brand-navy" />
                  <span>Citizen Workspace</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard"
                  className="flex w-full items-center gap-2.5"
                >
                  <ShieldAlert className="size-4 text-brand-blue" />
                  <span>Admin Command</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="cursor-pointer flex w-full items-center gap-2.5"
            >
              <LogOut className="size-4 text-brand-red" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
