"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <nav className="hidden items-center gap-7 text-[13px] font-semibold text-slate-700 lg:flex">
        {["Home", "How It Works", "Features", "Find Help", "About Us", "Contact"].map(
          (item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              className={
                i === 0
                  ? "font-extrabold text-red-500"
                  : "transition hover:text-red-500"
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-100/90 px-3 py-1.5 text-xs font-semibold text-slate-800">
              <div className="grid size-7 place-items-center rounded-full bg-red-100 text-red-600">
                <User className="size-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-900 leading-tight">
                  {session.user.name || "User"}
                </span>
                <span className="text-[10px] text-slate-500">
                  {session.user.phone || session.user.email || "Member"}
                </span>
              </div>
            </div>

            <Link
              href="/incidents/my"
              className="text-xs font-bold text-slate-700 hover:text-red-600 transition"
            >
              My Reports
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="flex items-center gap-1.5 rounded-xl border-slate-200 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="size-3.5" />
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            <Link href="/signin">
              <Button
                variant="ghost"
                className="rounded-xl px-4 py-2 text-[13px] font-bold text-slate-700 transition hover:bg-red-50 hover:text-red-500"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-xl bg-red-500 px-5 py-2 text-[13px] font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
