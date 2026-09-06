"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Siren, ArrowLeft, Home, ShieldAlert, Clock, PhoneCall, Radio, HeartPulse, Sparkles } from "lucide-react";
import { IncidentForm } from "./components/incident-form";
import { useCreateIncident } from "./hooks/use-create-incident";

export function MasterCreateIncidentComponent() {
  const router = useRouter();
  const hook = useCreateIncident();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100/90 via-slate-50 to-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Accents */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 size-96 rounded-full bg-red-400/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 size-96 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Navigation Top Bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 backdrop-blur-md transition hover:border-slate-300 hover:bg-white hover:text-brand-navy shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 backdrop-blur-md transition hover:border-slate-300 hover:bg-white hover:text-brand-navy shadow-2xs"
            >
              <Home className="size-3.5" />
              <span>Home</span>
            </Link>
          </div>

          <Link
            href="/incidents/my"
            className="flex items-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/80 px-3.5 py-2 text-xs font-extrabold text-brand-red backdrop-blur-md hover:bg-red-100 transition shadow-2xs"
          >
            <span>My Reported Incidents</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* Hero Emergency Alert Header Banner (Glassmorphic) */}
        <div className="relative mb-6 overflow-hidden rounded-3xl border border-red-500/30 bg-linear-to-r from-red-600 via-brand-red to-red-700 p-6 sm:p-7 text-white shadow-[0_20px_50px_rgba(220,38,38,0.22)] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-inner ring-1 ring-white/30">
                <Siren className="size-7 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black uppercase text-brand-red">
                    <Radio className="size-2.5 animate-pulse" /> Live Dispatch Network
                  </span>
                  <span className="text-xs font-mono font-bold text-red-100">
                    National Response
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mt-1">
                  Report an Emergency Incident
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-red-100 font-medium">
                  Instant geo-targeted alert broadcast to nearby verified volunteers, hospitals, and disaster response teams.
                </p>
              </div>
            </div>

            <a
              href="tel:999"
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs sm:text-sm font-black text-brand-red shadow-lg shadow-black/10 hover:bg-red-50 transition cursor-pointer shrink-0"
            >
              <PhoneCall className="size-4 animate-bounce" />
              <span>Life Threat? Call 999</span>
            </a>
          </div>
        </div>

        {/* Unified Glassmorphic Incident Form */}
        <IncidentForm hook={hook} />
      </div>
    </div>
  );
}

