"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  AlertTriangle,
  UserCheck,
  HeartPulse,
  HandHeart,
  Building2,
  PhoneCall,
  History,
  LogOut,
  Shield,
  Radio,
  Layers,
  Map,
} from "lucide-react";
import { RoleSwitcher } from "./role-switcher";
import { cn } from "@/lib/utils";
import { useGetAdminOverviewStatsQuery } from "@/redux/api/incidentApi";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Dynamic real-time backend stats
  const { data: statsData } = useGetAdminOverviewStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const metrics = statsData?.data?.metrics;
  const activeDispatches = metrics?.activeDispatches ?? 0;
  const pendingVerification = metrics?.pendingVerification ?? 0;
  const pendingVolunteers = metrics?.pendingVolunteers ?? 0;
  const pendingDonors = metrics?.pendingDonors ?? 0;

  const adminNavItems = [
    {
      label: "Overview & Analytics",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      tooltip: "Platform telemetry and national dispatch metrics",
      badgeCount: null,
      badgeType: null,
    },
    {
      label: "National Crisis Map",
      href: "/admin/crisis-map",
      icon: Map,
      tooltip: "National GIS crisis heatmap & live telemetry radar",
      badgeCount: null,
      badgeType: null,
    },
    {
      label: "Incident Triage & Dispatch",
      href: "/admin/incidents",
      icon: AlertTriangle,
      tooltip: `${activeDispatches} Active Dispatches · ${pendingVerification} Pending Verification`,
      badgeCount: activeDispatches > 0 ? activeDispatches : pendingVerification > 0 ? pendingVerification : null,
      badgeType: activeDispatches > 0 ? ("urgent" as const) : ("warning" as const),
    },
    {
      label: "Incident Categories",
      href: "/admin/categories",
      icon: Layers,
      tooltip: "Dynamic emergency category taxonomy & icons",
      badgeCount: null,
      badgeType: null,
    },
    {
      label: "Volunteer Verification",
      href: "/admin/volunteers",
      icon: UserCheck,
      tooltip: `${pendingVolunteers} Volunteers awaiting verification`,
      badgeCount: pendingVolunteers > 0 ? pendingVolunteers : null,
      badgeType: "warning" as const,
    },
    {
      label: "Blood Donor Requests",
      href: "/admin/blood-donors",
      icon: HeartPulse,
      tooltip: `${pendingDonors} Blood donor review applications`,
      badgeCount: pendingDonors > 0 ? pendingDonors : null,
      badgeType: "rose" as const,
    },
    {
      label: "Relief Requests",
      href: "/admin/relief",
      icon: HandHeart,
      tooltip: "Disaster and emergency relief requests triage",
      badgeCount: null,
      badgeType: null,
    },
    {
      label: "Hospitals Directory",
      href: "/admin/hospitals",
      icon: Building2,
      tooltip: "Hospital capacity & ICU bed directory",
      badgeCount: null,
      badgeType: null,
    },
    {
      label: "Emergency Hotlines",
      href: "/admin/emergency-services",
      icon: PhoneCall,
      tooltip: "National emergency hotlines & station contacts",
      badgeCount: null,
      badgeType: null,
    },
    {
      label: "Audit Logs",
      href: "/admin/audit-logs",
      icon: History,
      tooltip: "System activity logs and administrative audit trail",
      badgeCount: null,
      badgeType: null,
    },
  ];

  return (
    <aside className="relative flex h-screen w-72 flex-col justify-between border-r border-slate-200/80 bg-white/80 backdrop-blur-2xl shadow-[4px_0_30px_rgba(0,0,0,0.03)] transition-all z-20">
      {/* Subtle glass reflection gradient at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/60 to-transparent" />

      <div className="relative z-10 flex flex-col min-h-0 flex-1 overflow-y-auto">
        {/* 1. Brand Logo Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100/90 px-6 backdrop-blur-md">
          <Link href="/" className="flex items-center transition-transform hover:scale-[1.02]">
            <Image
              src="/images/manob-prohori-logo-v3.png"
              alt="Manob Prohori Logo"
              width={220}
              height={65}
              priority
              className="h-auto w-48 object-contain"
            />
          </Link>
        </div>

        {/* 2. Workspace Role Switcher */}
        <div className="px-4 pt-4 pb-2">
          <RoleSwitcher />
        </div>

        {/* 3. Navigation Menu */}
        <div className="px-3.5 py-2 space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10.5px] font-black uppercase tracking-widest text-slate-400">
              Admin Operations
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
              </span>
              Live
            </div>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-2xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200",
                    isActive
                      ? "bg-linear-to-r from-slate-900 to-brand-navy text-white shadow-md shadow-slate-900/15 font-bold"
                      : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-xl transition-colors",
                        isActive
                          ? "bg-white/15 text-brand-red-light"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-brand-navy group-hover:shadow-2xs"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    {/* Always 1 line, strictly single line text */}
                    <span className="truncate whitespace-nowrap text-left select-none text-[13px]">
                      {item.label}
                    </span>
                  </div>

                  {/* Compact numeric pill badge */}
                  {item.badgeCount != null && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-black tracking-tight transition-all ml-1.5 flex items-center gap-1 shadow-2xs",
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeType === "urgent"
                          ? "bg-red-50 text-brand-red border border-red-200"
                          : item.badgeType === "warning"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      )}
                    >
                      {item.badgeType === "urgent" && !isActive && (
                        <span className="relative flex size-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full size-1.5 bg-red-500" />
                        </span>
                      )}
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. Bottom Glassmorphic User Profile & Sign Out */}
      <div className="relative z-10 border-t border-slate-200/60 p-3.5 space-y-2.5 bg-linear-to-b from-white/40 to-slate-50/80 backdrop-blur-md">
        <div className="flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-xs border border-slate-200/70">
          <div className="grid size-9.5 shrink-0 place-items-center rounded-xl bg-linear-to-br from-slate-900 to-brand-navy text-white font-bold text-xs shadow-xs">
            <Shield className="size-4.5 text-brand-red-light" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[13px] font-extrabold text-brand-navy">
                {session?.user?.name || "System Admin"}
              </p>
              <span className="rounded-md bg-brand-red px-1.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider shadow-2xs">
                ADMIN
              </span>
            </div>
            <p className="truncate text-[11px] font-medium text-slate-400 mt-0.5">
              {session?.user?.email || session?.user?.phone || "Command Authority"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200/80 bg-red-50/80 py-2.5 text-xs font-bold text-brand-red hover:bg-red-100/90 hover:border-red-300 transition cursor-pointer shadow-2xs active:scale-[0.99]"
        >
          <LogOut className="size-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
