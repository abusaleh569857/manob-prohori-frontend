"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Siren,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// Shared Navigation Bar Component
// Renders brand logo, primary desktop navigation links, and auth action buttons.
// ============================================================================
export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  return (
    <header className="relative z-20 flex h-24 items-center justify-between border-b border-slate-100/80">
      {/* Brand Identity Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/images/manob-prohori-logo-v3.png"
          alt="Manob Prohori Logo"
          width={260}
          height={90}
          priority
          className="h-auto w-52.5 object-contain sm:w-61.25"
        />
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden items-center gap-7 text-[13.5px] font-semibold text-brand-text-secondary lg:flex">
        {["Home", "How It Works", "Features", "Find Help", "About Us", "Contact"].map(
          (item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              className={
                i === 0
                  ? "font-bold text-brand-red"
                  : "transition hover:text-brand-red"
              }
            >
              {item}
            </a>
          )
        )}
      </nav>

      {/* Authentication Action Buttons */}
      <div className="hidden items-center gap-2.5 sm:flex">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-border bg-card px-3.5 py-1.5 shadow-xs transition-all hover:border-brand-red/30 hover:bg-brand-red-soft/40 hover:shadow-sm focus:outline-none">
              <div className="grid size-8 place-items-center rounded-full bg-brand-red-soft text-brand-red ring-1 ring-brand-red/20 transition-transform group-hover:scale-105">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    width={32}
                    height={32}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="size-4.5" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] font-bold text-brand-navy leading-tight group-hover:text-brand-red transition-colors">
                  {session.user.name || "User"}
                </span>
                <span className="text-[12px] font-medium text-brand-text-secondary">
                  {session.user.phone || session.user.email || "Member"}
                </span>
              </div>
              <ChevronDown className="size-3.5 text-brand-text-muted transition-transform duration-200 group-data-pressed:rotate-180" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-2.5 shadow-xl rounded-2xl border-brand-border">
              {/* User Identity Header */}
              <div className="flex items-center gap-3 px-2.5 py-2">
                <div className="grid size-9.5 shrink-0 place-items-center rounded-full bg-brand-red-soft text-brand-red font-bold text-sm shadow-xs">
                  {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14.5px] font-black text-brand-navy">
                    {session.user.name || "User"}
                  </span>
                  <span className="truncate text-[12px] font-medium text-brand-text-secondary">
                    {session.user.email || session.user.phone || ""}
                  </span>
                  {session.user.roles && session.user.roles.length > 0 && (
                    <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-md bg-brand-red-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-red">
                      <Shield className="size-2.5" />
                      {session.user.roles[0]}
                    </span>
                  )}
                </div>
              </div>

              <DropdownMenuSeparator className="my-1.5" />

              {/* Navigation Options */}
              <DropdownMenuGroup>
                {session.user.roles?.some((r: string) => r === "ADMIN" || r === "SUPER_ADMIN") ? (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin/dashboard"
                      className="flex w-full items-center gap-2.5 px-2.5 py-2 text-[13px] font-bold text-brand-navy"
                    >
                      <ShieldAlert className="size-4 text-brand-blue" />
                      <span>Admin Command Center</span>
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex w-full items-center gap-2.5 px-2.5 py-2 text-[13px] font-semibold text-brand-navy"
                    >
                      <LayoutDashboard className="size-4 text-brand-navy" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1" />

              {/* Sign Out Option */}
              <DropdownMenuItem
                variant="destructive"
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-[13px] font-bold"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/signin">
              <Button
                variant="ghost"
                className="rounded-xl px-4 py-2 text-[13.5px] font-bold text-brand-text-primary transition hover:bg-brand-red-soft hover:text-brand-red"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-xl bg-brand-red px-5 py-2 text-[13.5px] font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red-dark">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
