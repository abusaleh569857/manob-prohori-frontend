"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Siren,
  FileText,
  Users,
  AlertTriangle,
  MapPin,
  LogOut,
  User,
} from "lucide-react";
import { RoleSwitcher } from "./role-switcher";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Citizen Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: "Report Emergency",
    href: "/incidents/create",
    icon: Siren,
    badge: "SOS",
    isEmergency: true,
  },
  {
    label: "My Incident Reports",
    href: "/incidents/my",
    icon: FileText,
    badge: null,
  },
  {
    label: "Nearby Responders",
    href: "/dashboard#volunteers",
    icon: Users,
    badge: "12 Live",
  },
  {
    label: "Live Emergencies",
    href: "/dashboard#incidents",
    icon: AlertTriangle,
    badge: "5 Active",
  },
  {
    label: "Emergency Radar Map",
    href: "/dashboard#map",
    icon: MapPin,
    badge: null,
  },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="flex h-screen w-72 flex-col justify-between border-r border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs">
      <div>
        {/* 1. Brand Identity Logo Header */}
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

        {/* 2. Workspace Role Switcher */}
        <div className="px-4 pt-4 pb-2">
          <RoleSwitcher />
        </div>

        {/* 3. Main Navigation Links */}
        <div className="px-4 py-2">
          <p className="mb-2 px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Citizen Navigation
          </p>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-all",
                    isActive
                      ? "bg-brand-red-soft text-brand-red font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-brand-navy",
                    item.isEmergency &&
                      !isActive &&
                      "text-brand-red font-bold hover:bg-brand-red-soft/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "size-5 transition-transform group-hover:scale-110",
                        isActive
                          ? "text-brand-red"
                          : item.isEmergency
                          ? "text-brand-red"
                          : "text-slate-400 group-hover:text-brand-navy"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide",
                        item.isEmergency
                          ? "bg-brand-red text-white animate-pulse"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
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
        {/* User Card */}
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-xs border border-slate-100">
          <div className="grid size-9.5 shrink-0 place-items-center rounded-xl bg-brand-red-soft text-brand-red font-bold text-xs">
            {session?.user?.name ? (
              session.user.name.charAt(0).toUpperCase()
            ) : (
              <User className="size-4.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold text-brand-navy">
              {session?.user?.name || "Verified Citizen"}
            </p>
            <p className="truncate text-xs text-slate-400 mt-0.5">
              {session?.user?.email || session?.user?.phone || "Citizen Responder"}
            </p>
          </div>
        </div>

        {/* Action Button */}
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