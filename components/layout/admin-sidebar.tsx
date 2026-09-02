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
  User,
} from "lucide-react";
import { RoleSwitcher } from "./role-switcher";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    label: "Overview & Analytics",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Incident Triage & Dispatch",
    href: "/admin/incidents",
    icon: AlertTriangle,
    badge: "5 Active",
    isUrgent: true,
  },
  {
    label: "Volunteer Verification",
    href: "/admin/volunteers",
    icon: UserCheck,
    badge: "3 Pending",
  },
  {
    label: "Blood Donor Requests",
    href: "/admin/blood-donors",
    icon: HeartPulse,
    badge: "Review",
  },
  {
    label: "Relief Requests",
    href: "/admin/relief",
    icon: HandHeart,
    badge: null,
  },
  {
    label: "Hospitals Directory",
    href: "/admin/hospitals",
    icon: Building2,
    badge: null,
  },
  {
    label: "Emergency Hotlines",
    href: "/admin/emergency-services",
    icon: PhoneCall,
    badge: null,
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: History,
    badge: null,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-screen w-72 flex-col justify-between border-r border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs">
      <div>
        {/* 1. Brand Logo Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link href="/" className="flex items-center">
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

        {/* 2. Workspace / Role Mode Switcher */}
        <div className="px-4 pt-4 pb-2">
          <RoleSwitcher />
        </div>

        {/* 3. Navigation Links */}
        <div className="px-4 py-2">
          <p className="mb-2 px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Admin Operations
          </p>

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
                    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-all",
                    isActive
                      ? "bg-brand-navy text-white font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-brand-navy"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "size-5 transition-transform group-hover:scale-110",
                        isActive
                          ? "text-brand-red-light"
                          : "text-slate-400 group-hover:text-brand-navy"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide",
                        isActive
                          ? "bg-white/20 text-white"
                          : item.isUrgent
                          ? "bg-red-50 text-brand-red border border-red-200"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. Bottom User Profile & Sign Out */}
      <div className="border-t border-slate-100 p-4 space-y-2.5 bg-slate-50/60">
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-xs border border-slate-100">
          <div className="grid size-9.5 shrink-0 place-items-center rounded-xl bg-brand-navy text-white font-bold text-xs">
            <Shield className="size-4.5 text-brand-red-light" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[13.5px] font-bold text-brand-navy">
                {session?.user?.name || "System Admin"}
              </p>
              <span className="rounded bg-brand-red-soft px-1.5 py-0.2 text-[9.5px] font-extrabold text-brand-red uppercase">
                ADMIN
              </span>
            </div>
            <p className="truncate text-xs text-slate-400 mt-0.5">
              {session?.user?.email || session?.user?.phone || "Command Authority"}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/70 py-2.5 text-xs font-bold text-brand-red hover:bg-red-100 hover:border-red-200 transition cursor-pointer shadow-2xs"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
