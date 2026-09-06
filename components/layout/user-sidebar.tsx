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
  MapPin,
  LogOut,
  User,
  ShieldCheck,
} from "lucide-react";
import { RoleSwitcher } from "./role-switcher";
import { cn } from "@/lib/utils";

const citizenNavigation = [
  {
    label: "Citizen Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Report Emergency",
    href: "/incidents/create",
    icon: Siren,
    isEmergency: true,
  },
  {
    label: "My Incident Reports",
    href: "/incidents/my",
    icon: FileText,
  },
  // {
  //   label: "Nearby Responders",
  //   href: "/dashboard#volunteers",
  //   icon: Users,
  // },
  {
    label: "Emergency Radar Map",
    href: "/crisis-map",
    icon: MapPin,
  },
];

const volunteerNavigation = [
  {
    label: "Volunteer Dispatch Hub",
    href: "/volunteer/dashboard",
    icon: Siren,
    isEmergency: true,
  },
  {
    label: "Verification & Skills",
    href: "/volunteer/verification",
    icon: ShieldCheck,
  },
  {
    label: "Emergency Radar Map",
    href: "/crisis-map",
    icon: MapPin,
  },
  {
    label: "My Incident Reports",
    href: "/incidents/my",
    icon: FileText,
  },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isVolunteerMode = pathname.startsWith("/volunteer");
  const navItems = isVolunteerMode ? volunteerNavigation : citizenNavigation;

  return (
    <aside className="relative flex h-screen w-72 flex-col justify-between border-r border-slate-200/80 bg-white/80 backdrop-blur-2xl shadow-[4px_0_30px_rgba(0,0,0,0.03)] transition-all z-20">
      {/* Subtle glass reflection gradient at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/60 to-transparent" />

      <div className="relative z-10 flex flex-col min-h-0 flex-1 overflow-y-auto">
        {/* 1. Brand Identity Logo Header */}
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

        {/* 3. Main Navigation Links */}
        <div className="px-3.5 py-2 space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10.5px] font-black uppercase tracking-widest text-slate-400">
              {isVolunteerMode ? "Volunteer Dashboard" : "Citizen Navigation"}
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200",
                    isActive
                      ? isVolunteerMode
                        ? "bg-linear-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-600/20 font-bold"
                        : "bg-linear-to-r from-slate-900 to-brand-navy text-white shadow-md shadow-slate-900/15 font-bold"
                      : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900",
                    item.isEmergency &&
                      !isActive &&
                      "text-brand-red font-bold hover:bg-red-50/70"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-xl transition-colors",
                        isActive
                          ? "bg-white/15 text-white"
                          : item.isEmergency
                          ? "bg-red-50 text-brand-red group-hover:bg-red-100"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-brand-navy group-hover:shadow-2xs"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    {/* Always 1 clean line */}
                    <span className="truncate whitespace-nowrap text-left select-none text-[13.5px]">
                      {item.label}
                    </span>
                  </div>

                  {/* Pulsing indicator for emergency items when idle */}
                  {item.isEmergency && !isActive && (
                    <span className="relative flex size-2 shrink-0 ml-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full size-2 bg-red-500" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. User Profile & Logout Section */}
      <div className="relative z-10 border-t border-slate-200/60 p-3.5 space-y-2.5 bg-linear-to-b from-white/40 to-slate-50/80 backdrop-blur-md">
        <div className="flex items-center justify-between rounded-2xl bg-white/95 p-3 shadow-xs border border-slate-200/70">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid size-9.5 shrink-0 place-items-center rounded-xl bg-linear-to-br from-slate-900 to-brand-navy text-white text-xs font-bold shadow-xs">
              {session?.user?.name ? (
                session.user.name.charAt(0).toUpperCase()
              ) : (
                <User className="size-4" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-brand-navy truncate">
                {session?.user?.name || "Citizen User"}
              </span>
              <span className="text-[11px] font-medium text-slate-400 truncate">
                {session?.user?.email || session?.user?.phone || "user@manobprohori.org"}
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            title="Sign Out"
            className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-brand-red transition cursor-pointer border border-transparent hover:border-red-100"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}