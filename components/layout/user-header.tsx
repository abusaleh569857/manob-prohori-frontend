"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Bell,
  MapPin,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Shield,
  Radio,
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

export default function UserHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-8 backdrop-blur-xl shadow-2xs">
      {/* 1. Left: Breadcrumb Navigation */}
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-sm font-medium">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-slate-500 hover:text-brand-navy">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-brand-navy">
                Emergency Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 2. Center: Live GPS Status Badge */}
      <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-4 py-1.5 text-xs font-bold text-emerald-700 shadow-xs">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
        <MapPin className="size-3.5 text-emerald-600" />
        <span>Live Dispatch Telemetry Active · Dhaka Zone</span>
      </div>

      {/* 3. Right: Alerts & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Alert Bell */}
        <button
          aria-label="View notifications"
          className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 transition hover:bg-slate-100 hover:text-brand-navy shadow-2xs cursor-pointer"
        >
          <Bell className="size-5 text-brand-red" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand-red ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/90 p-1.5 pr-3.5 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition">
            <div className="grid size-8.5 place-items-center rounded-xl bg-brand-red-soft text-brand-red font-bold text-xs">
              {session?.user?.name ? (
                session.user.name.charAt(0).toUpperCase()
              ) : (
                <User className="size-4.5" />
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold text-brand-navy leading-tight">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {session?.user?.roles?.[0] || "Citizen Member"}
              </p>
            </div>
            <ChevronDown className="size-3.5 text-slate-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-58 p-2 rounded-2xl shadow-xl">
            {/* Identity Header */}
            <div className="px-2.5 py-2">
              <p className="text-xs font-bold text-brand-navy">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {session?.user?.email || session?.user?.phone || ""}
              </p>
            </div>

            <DropdownMenuSeparator />

            {/* Navigation Options */}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-brand-navy">
                  <LayoutDashboard className="size-4 text-brand-navy" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Sign Out */}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}