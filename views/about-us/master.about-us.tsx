"use client";

import Link from "next/link";
import {
  ShieldCheck,
  HeartHandshake,
  Users,
  MapPin,
  Radio,
  Sparkles,
  ArrowRight,
  Flame,
  Droplets,
  Activity,
  Award,
  Globe2,
} from "lucide-react";

export function MasterAboutUsComponent() {
  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-linear-to-r from-brand-navy via-slate-900 to-brand-navy p-8 sm:p-12 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-64 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3.5 py-1 text-xs font-black uppercase text-white shadow-xs">
            <HeartHandshake className="size-3.5" /> Our Mission &amp; Purpose
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Protecting Every Life Across Bangladesh
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Manob Prohori (মানব প্রহরী) was founded to solve Bangladesh's most critical emergency challenge: connecting distressed victims with verified nearby responders in under 3 minutes.
          </p>
        </div>
      </div>

      {/* 2. OUR PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs space-y-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-red-50 text-brand-red border border-red-200">
            <Radio className="size-6 animate-pulse" />
          </div>
          <h3 className="text-base font-black text-brand-navy">5km Proximity Radar</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Autonomously matches emergencies with the closest verified responders and volunteer squads within 5km.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs space-y-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <ShieldCheck className="size-6" />
          </div>
          <h3 className="text-base font-black text-brand-navy">100% Verified Responders</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Every volunteer and blood donor undergoes verification, ensuring trustworthy and genuine aid during crises.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs space-y-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-brand-blue border border-blue-200">
            <Globe2 className="size-6" />
          </div>
          <h3 className="text-base font-black text-brand-navy">National GIS Telemetry</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Live incident clusters and red-zone disaster heatmaps across all 8 divisions and 64 districts.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs space-y-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
            <Droplets className="size-6" />
          </div>
          <h3 className="text-base font-black text-brand-navy">Life-Saving Blood Connect</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Zero-delay blood donor requests directly matched with nearby matching group donors and hospitals.
          </p>
        </div>
      </div>

      {/* 3. IMPACT STATS */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-8 sm:p-12 backdrop-blur-xl shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-brand-red">
            Nationwide Reach
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Our Growing Impact in Numbers
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-3xl sm:text-4xl font-black text-brand-navy">64</span>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Districts Covered</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-3xl sm:text-4xl font-black text-brand-red">8,500+</span>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Verified Volunteers</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-3xl sm:text-4xl font-black text-rose-600">12,400+</span>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Blood Donors</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600">&lt; 4 min</span>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Avg. Alert Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
