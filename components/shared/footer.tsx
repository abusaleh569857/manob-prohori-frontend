"use client";

import Link from "next/link";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  HeartHandshake,
  ArrowRight,
  Radio,
  ExternalLink,
  Globe,
  Mail,
  HelpCircle,
  Siren,
  Sparkles,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-16 border-t border-slate-200/80 bg-linear-to-b from-slate-900 via-[#0b192e] to-slate-950 text-slate-300">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 size-96 rounded-full bg-red-600/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-360 px-5 py-12 sm:px-8 lg:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand & Overview (2 cols on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-linear-to-br from-red-500 to-brand-red text-white shadow-lg shadow-red-500/20">
                  <Siren className="size-5" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-white">
                    Manob Prohori
                  </span>
                  <span className="block text-[10px] font-bold tracking-widest text-red-400 uppercase">
                    Crisis Response Network
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              National real-time disaster management, live crisis mapping, and volunteer dispatch platform connecting citizens with emergency responders instantly.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Web System Online
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-400">
                <Radio className="size-3" />
                24/7 Telemetry
              </span>
            </div>
          </div>

          {/* Column 2: Emergency Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-white">
              Emergency Services
            </p>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <Link
                  href="/incidents/create"
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold transition"
                >
                  <Siren className="size-3.5" />
                  <span>Report Emergency</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/crisis-map"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <MapPin className="size-3.5 text-blue-400" />
                  <span>Live Crisis Map</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/find-help"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <PhoneCall className="size-3.5 text-emerald-400" />
                  <span>Emergency Helplines</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 hover:text-white transition"
                >
                  <HeartHandshake className="size-3.5 text-amber-400" />
                  <span>Volunteer Registration</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Resources */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-white">
              Platform Info
            </p>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/about-us" className="hover:text-white transition">
                  About Mission
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-white transition">
                  Dashboard Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: National Emergency Numbers Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="size-4 text-brand-red animate-pulse" />
              <p className="text-xs font-black uppercase tracking-wider text-white">
                Emergency Hotlines
              </p>
            </div>
            
            <div className="space-y-2">
              <a
                href="tel:999"
                className="flex items-center justify-between rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition"
              >
                <span>Police / Fire / Ambulance</span>
                <span className="text-sm font-mono font-black text-white">999</span>
              </a>

              <a
                href="tel:333"
                className="flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/30 px-3 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/20 transition"
              >
                <span>Disaster & Citizen Info</span>
                <span className="text-sm font-mono font-black text-white">333</span>
              </a>

              <a
                href="tel:16263"
                className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <span>Health & Medical Hotline</span>
                <span className="text-sm font-mono font-black text-white">16263</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Manob Prohori — Open Citizen Crisis Response Initiative.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>OpenStreetMap GIS Data</span>
            <span>•</span>
            <span>Cloud Sync</span>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
