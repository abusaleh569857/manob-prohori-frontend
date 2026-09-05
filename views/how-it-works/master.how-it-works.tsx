"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Siren,
  MapPin,
  Radio,
  ShieldCheck,
  Users,
  Building2,
  Droplets,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Flame,
  Activity,
  Navigation,
  Lock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    title: "1-Tap SOS Incident Report",
    subtitle: "Citizen Broadcasts Emergency",
    desc: "A citizen in distress or bystander reports an incident with 1-click GPS location, title, photos, and threat level (Low, Medium, High, Critical).",
    icon: Siren,
    color: "from-red-600 to-rose-600",
    bg: "bg-red-50 text-brand-red border-red-200",
    badge: "Instant SOS",
  },
  {
    step: "02",
    title: "5km Radar Proximity Match",
    subtitle: "Autonomous Dispatch Algorithm",
    desc: "Our geospatial dispatch engine immediately identifies verified emergency volunteers, ambulances, and rescue squads within a 5km radius.",
    icon: Navigation,
    color: "from-amber-600 to-orange-600",
    bg: "bg-amber-50 text-amber-600 border-amber-200",
    badge: "5km Smart Radar",
  },
  {
    step: "03",
    title: "Audio Siren & Real-Time Mission",
    subtitle: "Responders Accept & En-Route",
    desc: "Responder dashboard triggers audible siren alerts. Responders accept missions, get turn-by-turn navigation, and coordinate live with victims.",
    icon: Radio,
    color: "from-blue-600 to-indigo-600",
    bg: "bg-blue-50 text-brand-blue border-blue-200",
    badge: "Live Mission Stream",
  },
  {
    step: "04",
    title: "National GIS Crisis Radar",
    subtitle: "Central Verification & Triage",
    desc: "Central controllers verify the incident, deploy medical/fire services, and stream real-time hazard red-zones onto the nationwide public safety map.",
    icon: ShieldCheck,
    color: "from-emerald-600 to-teal-600",
    bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
    badge: "National Telemetry",
  },
];

const ROLES = [
  {
    id: "citizens",
    label: "For Citizens & Victims",
    icon: Users,
    title: "Instant Protection & Emergency Resources",
    points: [
      "Report disasters and life threats in under 30 seconds.",
      "Access the National Live Crisis Map to view red-zones and danger perimeters.",
      "Instant 1-click connection to nearby blood donors, ambulances, and hospital beds.",
      "Receive real-time notifications as verified volunteers are dispatched to your location.",
    ],
    ctaText: "Report an Incident",
    ctaLink: "/incidents/create",
  },
  {
    id: "volunteers",
    label: "For Emergency Volunteers",
    icon: HeartHandshake,
    title: "Turn Readiness into Life-Saving Action",
    points: [
      "Set your live availability status with custom service radiuses.",
      "Receive push alerts with audible tactical sirens for nearby emergencies.",
      "Direct GPS navigation to victim location with damage photos.",
      "Track your verified rescue missions and impact points on national leaderboard.",
    ],
    ctaText: "Join as Volunteer",
    ctaLink: "/signup",
  },
  {
    id: "medical",
    label: "For Hospitals & Blood Donors",
    icon: Droplets,
    title: "Critical Care Telemetry & Blood Matching",
    points: [
      "Emergency blood requests matched instantly with nearby eligible donors by blood group.",
      "Real-time hospital ICU and emergency bed availability stream.",
      "Seamless communication between ambulance paramedics and emergency room teams.",
      "Zero-delay donor verification and verified digital donor cards.",
    ],
    ctaText: "Register as Donor",
    ctaLink: "/signup",
  },
  {
    id: "admins",
    label: "For Crisis Controllers & Admins",
    icon: ShieldCheck,
    title: "Central Tactical Command & Heatmaps",
    points: [
      "Nationwide Leaflet GIS Telemetry Map with division-wise crisis index.",
      "1-Click tactical responder dispatch and volunteer radar management.",
      "Incident verification, priority escalation, and severity triage consoles.",
      "Automated audit logs and national disaster statistics reporting.",
    ],
    ctaText: "Explore Crisis Map",
    ctaLink: "/crisis-map",
  },
];

export function MasterHowItWorksComponent() {
  const [activeRole, setActiveRole] = useState("citizens");
  const selectedRole = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-linear-to-r from-brand-navy via-slate-900 to-brand-navy p-8 sm:p-12 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-64 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3.5 py-1 text-xs font-black uppercase text-white shadow-xs">
            <Radio className="size-3 animate-pulse" /> The Rescue Lifecycle
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            How Manob Prohori Works
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            From the instant an emergency is reported to the final rescue and medical care, Manob Prohori connects citizens, volunteers, blood donors, and response squads in real-time.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/incidents/create"
              className="flex items-center gap-2 rounded-2xl bg-brand-red px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-red-900/40 hover:bg-brand-red-dark transition"
            >
              <Siren className="size-4" />
              <span>Report Emergency</span>
            </Link>
            <Link
              href="/crisis-map"
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
            >
              <Radio className="size-4 text-emerald-400" />
              <span>View Live Crisis Radar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 4-STEP PROCESS TIMELINE */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-brand-red">
            4-Stage Response Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Seamless Coordination in 4 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Engineered with low-latency GIS algorithms to minimize response time across Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="group relative rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-200 group-hover:text-brand-red transition">
                      {s.step}
                    </span>
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase", s.bg)}>
                      {s.badge}
                    </span>
                  </div>

                  <div className={cn("grid size-12 place-items-center rounded-2xl bg-linear-to-br text-white shadow-md mb-4", s.color)}>
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-base font-black text-brand-navy leading-snug">
                    {s.title}
                  </h3>
                  <span className="text-xs font-bold text-brand-red block mt-0.5 mb-2">
                    {s.subtitle}
                  </span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-brand-navy transition">
                  <span>Phase {idx + 1}</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE ROLE EXPLORER */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-10 backdrop-blur-xl shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-brand-red">
            Ecosystem Integration
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            How It Serves Each Member of Society
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Select a role to see how Manob Prohori delivers tailored capabilities.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRole(r.id)}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer",
                  isActive
                    ? "bg-brand-navy text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Icon className={cn("size-4", isActive ? "text-brand-red" : "text-slate-500")} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Role Content Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-4">
            <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-black text-brand-red uppercase">
              {selectedRole.label}
            </span>
            <h3 className="text-2xl font-black text-brand-navy">
              {selectedRole.title}
            </h3>
            <ul className="space-y-3 pt-2">
              {selectedRole.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[11px] font-black text-emerald-800 mt-0.5">
                    ✓
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link
                href={selectedRole.ctaLink}
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-red px-5 py-3 text-xs sm:text-sm font-black text-white shadow-md hover:bg-brand-red-dark transition"
              >
                <span>{selectedRole.ctaText}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 to-red-50/40 p-6 space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-navy">
              <Lock className="size-4 text-emerald-600" />
              Security &amp; Verification Guarantee
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Every emergency responder and volunteer is verified via National ID and emergency contact checks before receiving tactical siren alerts.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 text-center">
                <span className="text-xl font-black text-brand-navy">5km</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Radius Matching</p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3 text-center">
                <span className="text-xl font-black text-emerald-600">100%</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Verified Badges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
