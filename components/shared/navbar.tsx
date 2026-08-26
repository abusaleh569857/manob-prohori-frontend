import Image from "next/image";
import { Button } from "@/components/ui/button";

// ============================================================================
// Shared Navigation Bar Component
// Renders brand logo, primary desktop navigation links, and auth action buttons.
// ============================================================================
export function Navbar() {
  return (
    <header className="relative z-20 flex h-24 items-center justify-between border-b border-slate-100/80">
      
      {/* Brand Identity Logo */}
      <a href="#" className="flex items-center">
        <Image
          src="/images/manob-prohori-logo-v3.png"
          alt="Manob Prohori Logo"
          width={260}
          height={90}
          priority
          className="h-auto w-52.5 object-contain sm:w-61.25"
        />
      </a>

      {/* Desktop Navigation Links */}
      <nav className="hidden items-center gap-7 text-[13px] font-semibold text-slate-700 lg:flex">
        {["Home", "How It Works", "Features", "Find Help", "About Us", "Contact"].map((item, i) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
            className={i === 0 ? "font-extrabold text-red-500" : "transition hover:text-red-500"}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Authentication Action Buttons (Sign In / Sign Up) */}
      <div className="hidden items-center gap-2.5 sm:flex">
        <Button
          variant="ghost"
          className="rounded-xl px-4 py-2 text-[13px] font-bold text-slate-700 transition hover:bg-red-50 hover:text-red-500"
        >
          Sign In
        </Button>
        <Button className="rounded-xl bg-red-500 px-5 py-2 text-[13px] font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600">
          Sign Up
        </Button>
      </div>
    </header>
  );
}
