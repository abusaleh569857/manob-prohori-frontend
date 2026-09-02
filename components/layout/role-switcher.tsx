"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ShieldAlert,
  User,
  HeartPulse,
  LayoutDashboard,
  Check,
  ChevronsUpDown,
  Sparkles,
  PlusCircle,
  Siren,
  Flame,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface RoleOption {
  id: string;
  roleKey: string;
  label: string;
  sublabel: string;
  href: string;
  icon: any;
  color: string;
  badgeBg: string;
}

const allRoleOptions: RoleOption[] = [
  {
    id: "user",
    roleKey: "USER",
    label: "Citizen Workspace",
    sublabel: "Report incidents & find help",
    href: "/dashboard?workspace=citizen",
    icon: User,
    color: "text-brand-navy",
    badgeBg: "bg-slate-100 text-slate-700",
  },
  {
    id: "volunteer",
    roleKey: "VOLUNTEER",
    label: "Volunteer Workspace",
    sublabel: "Emergency responder dispatch",
    href: "/volunteer/dashboard",
    icon: Siren,
    color: "text-brand-red",
    badgeBg: "bg-red-50 text-brand-red border border-red-200",
  },
  {
    id: "donor",
    roleKey: "BLOOD_DONOR",
    label: "Blood Donor Portal",
    sublabel: "Urgent blood requests & history",
    href: "/donor/dashboard",
    icon: HeartPulse,
    color: "text-rose-600",
    badgeBg: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  {
    id: "admin",
    roleKey: "ADMIN",
    label: "Admin Portal",
    sublabel: "System operations & verification",
    href: "/admin/dashboard",
    icon: ShieldAlert,
    color: "text-brand-blue",
    badgeBg: "bg-blue-50 text-brand-blue border border-blue-200",
  },
];

export function RoleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const userRoles = (session?.user?.roles as string[]) || ["USER"];

  // Determine current active workspace mode based on pathname
  let activeMode = allRoleOptions[0]; // default Citizen
  if (pathname.startsWith("/admin")) {
    activeMode = allRoleOptions[3];
  } else if (pathname.startsWith("/volunteer")) {
    activeMode = allRoleOptions[1];
  } else if (pathname.startsWith("/donor")) {
    activeMode = allRoleOptions[2];
  }

  // Filter workspaces the user has access to
  const availableWorkspaces = allRoleOptions.filter((opt) => {
    if (opt.id === "user") return true; // Every logged in user has citizen workspace
    return userRoles.includes(opt.roleKey);
  });

  const ActiveIcon = activeMode.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-3.5 py-2 text-left shadow-xs transition hover:border-slate-300 hover:bg-slate-50/80 focus:outline-none",
          className
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-xl bg-slate-50 shadow-2xs",
              activeMode.color
            )}
          >
            <ActiveIcon className="size-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
              Workspace Mode
            </span>
            <span className="text-xs font-bold text-brand-navy truncate mt-0.5">
              {activeMode.label}
            </span>
          </div>
        </div>

        <ChevronsUpDown className="size-3.5 text-slate-400 shrink-0 group-hover:text-brand-navy transition" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-68 p-2 rounded-2xl shadow-xl">
        <DropdownMenuLabel className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
          Switch Workspace Mode
        </DropdownMenuLabel>

        <DropdownMenuGroup className="space-y-1 mt-1">
          {availableWorkspaces.map((workspace) => {
            const Icon = workspace.icon;
            const isSelected = workspace.id === activeMode.id;

            return (
              <DropdownMenuItem
                key={workspace.id}
                asChild
                className={cn(
                  "cursor-pointer rounded-xl px-2.5 py-2 transition flex items-center justify-between",
                  isSelected
                    ? "bg-slate-100 text-brand-navy font-bold"
                    : "hover:bg-slate-50"
                )}
              >
                <Link href={workspace.href} className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "grid size-7.5 place-items-center rounded-lg bg-white shadow-2xs shrink-0",
                        workspace.color
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-brand-navy leading-tight truncate">
                        {workspace.label}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 truncate">
                        {workspace.sublabel}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="size-4 text-brand-red shrink-0" />
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        {/* Action to unlock more roles if not present */}
        {(!userRoles.includes("VOLUNTEER") || !userRoles.includes("BLOOD_DONOR")) && (
          <>
            <DropdownMenuSeparator className="my-1.5" />
            <div className="px-1 py-1 space-y-1">
              {!userRoles.includes("VOLUNTEER") && (
                <Link
                  href="/volunteer/apply"
                  className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-brand-red hover:bg-brand-red-soft transition"
                >
                  <PlusCircle className="size-3.5" />
                  <span>Become a Volunteer</span>
                </Link>
              )}
              {!userRoles.includes("BLOOD_DONOR") && (
                <Link
                  href="/donor/register"
                  className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition"
                >
                  <PlusCircle className="size-3.5" />
                  <span>Register as Blood Donor</span>
                </Link>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
