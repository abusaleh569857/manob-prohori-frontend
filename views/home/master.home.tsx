"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  Ambulance,
  Bell,
  Building2,
  Droplets,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroPhone } from "./components/hero-phone";
import { HeroCityRoute } from "./components/hero-city-route";
import { LiveVerifiedIncidents } from "./components/live-verified-incidents";

// ============================================================================
// 1. Live Platform Statistics Data
// ============================================================================
const stats = [
  {
    value: "8,547+",
    label: "Active Volunteers",
    icon: Users,
    tone: "bg-red-50 text-red-600",
  },
  {
    value: "512+",
    label: "Hospitals",
    icon: Building2,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    value: "12,430+",
    label: "Blood Donors",
    icon: Droplets,
    tone: "bg-rose-50 text-rose-600",
  },
  {
    value: "1,248+",
    label: "Ambulances",
    icon: Ambulance,
    tone: "bg-blue-50 text-blue-600",
  },
];

// ============================================================================
// 2. Core Platform Features Data
// ============================================================================
const features = [
  {
    title: "One Tap Emergency",
    body: "Report any emergency instantly with your live location.",
    icon: Bell,
    tone: "bg-red-50 text-red-500",
  },
  {
    title: "Instant Alerts",
    body: "Notify verified volunteers and responders in your area immediately.",
    icon: Bell,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Nearby Help",
    body: "Find nearby hospitals, ambulances and blood donors in real time.",
    icon: MapPin,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    title: "Live Communication",
    body: "Chat with volunteers, responders and victims instantly.",
    icon: HeartHandshake,
    tone: "bg-violet-50 text-violet-600",
  },
  {
    title: "Verified & Trusted",
    body: "All volunteers and organizations are verified for your safety.",
    icon: ShieldCheck,
    tone: "bg-amber-50 text-amber-600",
  },
];

// ============================================================================
// 3. Master Home View Component
// ============================================================================
export function MasterHomeComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleReportEmergency = () => {
    if (status !== "authenticated" || !session?.user) {
      toast.error("Please sign in first to report an emergency!", {
        id: "auth-required-emergency",
      });
      router.push("/signin?callbackUrl=/incidents/create");
    } else {
      router.push("/incidents/create");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#10233f]">
      {/* ----------------------------------------------------------------------
          SECTION 1: HERO SECTION & RESCUE VISUALS
          Outer boundary: max-w-360 mx-auto
          ---------------------------------------------------------------------- */}
      <section className="relative mx-auto min-h-190 max-w-360 overflow-hidden rounded-b-[38px] px-5 sm:px-8 lg:px-12 -mt-24 pt-24">
        {/* Background rescue operations visual */}
        <Image
          src="/images/hero-rescue-v2.png"
          alt="Emergency response"
          fill
          priority
          className="pointer-events-none object-cover object-center opacity-55"
        />

        {/* Ambient background gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-white/10" />
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-white/95 to-transparent" />

        {/* City skyline silhouettes, route path and glowing map markers */}
        <HeroCityRoute />

        {/* Hero grid: Left content column and right interactive mobile mockup */}
        <div className="relative z-10 grid min-h-155 items-center gap-8 pb-16 pt-8 sm:pt-10 lg:grid-cols-[1.05fr_.95fr] lg:pt-6">
          {/* Left Column: Heading, description, call-to-action buttons & stats */}
          <div className="max-w-160">
            {/* Live emergency siren pulse badge */}
            <p className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-red-200/80 bg-red-50/90 px-4 py-1.5 text-[13.5px] sm:text-sm font-extrabold text-red-600 shadow-sm shadow-red-500/10 backdrop-blur-sm">
              <span className="relative flex size-4 items-center justify-center">
                <span className="absolute inline-flex size-4 animate-ping rounded-full bg-red-400 opacity-60 duration-1000" />
                <Siren className="relative size-3.5 text-red-600 animate-pulse" />
              </span>
              Smart Emergency Response
            </p>

            {/* Primary Hero Heading */}
            <h1 className="text-4xl font-black leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[56px] xl:text-[60px]">
              Help arrives when
              <br />
              <span className="whitespace-nowrap">
                every <span className="text-red-500">second</span> counts
              </span>
            </h1>

            {/* Subtitle description */}
            <p className="mt-6 max-w-135 text-base leading-7 text-slate-600 sm:text-lg">
              Manob Prohori instantly connects you with nearby volunteers,
              <br />
              hospitals, blood donors and emergency services.{" "}
              <br className="hidden sm:inline" />
              Because together, we save lives.
            </p>

            {/* Call-to-action buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={handleReportEmergency}
                className="rounded-xl bg-red-500 px-6 font-bold shadow-xl shadow-red-500/20 hover:bg-red-600 cursor-pointer"
              >
                <AlertTriangle className="mr-2 size-4 fill-white text-red-500" />
                Report Emergency
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-slate-200 bg-white/80 px-6 font-bold"
              >
                <MapPin className="mr-2 size-4" />
                Find Nearby Help
              </Button>
            </div>

            {/* Unified Stats Card with Dividers */}
            <div className="mt-12 w-full max-w-177.5 rounded-3xl border border-slate-200/90 bg-white/95 p-3 sm:p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
              <div className="grid grid-cols-2 divide-y divide-slate-200/80 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                {stats.map(({ value, label, icon: Icon, tone }, index) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 py-2 sm:py-0.5 ${
                      index === 0
                        ? "sm:pl-0 sm:pr-2.5"
                        : index === 3
                          ? "sm:pl-2.5 sm:pr-0"
                          : "sm:px-2.5"
                    }`}
                  >
                    <div
                      className={`grid size-10 sm:size-11 shrink-0 place-items-center rounded-2xl ${tone} shadow-sm`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[18px] font-black leading-tight text-[#10233f] sm:text-[20px]">
                        {value}
                      </p>
                      <p className="mt-0.5 whitespace-nowrap text-[10.5px] font-bold text-slate-500 sm:text-[11.5px]">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity interactive mobile app mockup */}
          <div className="relative flex justify-center lg:justify-start">
            <HeroPhone />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          SECTION 2: KEY PLATFORM FEATURES
          Features card kept with its original compact floating look (max-w-332.5)
          ---------------------------------------------------------------------- */}
      <section
        id="features"
        className="relative z-20 mx-auto -mt-5 max-w-332.5 rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,23,42,.08)] backdrop-blur sm:p-7"
      >
        <div className="grid divide-y divide-slate-200 md:grid-cols-5 md:divide-x md:divide-y-0">
          {features.map(({ title, body, icon: Icon, tone }) => (
            <article
              key={title}
              className="px-5 py-4 text-center first:pt-4 md:py-2"
            >
              <div
                className={`mx-auto grid size-12 place-items-center rounded-full ${tone}`}
              >
                <Icon className="size-5" />
              </div>
              <h2 className="mt-3 text-sm font-black">{title}</h2>
              <p className="mx-auto mt-2 max-w-45 text-[11px] leading-5 text-slate-500">
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          SECTION 2.5: LIVE VERIFIED EMERGENCY INCIDENTS STREAM
          Outer boundary: max-w-360 mx-auto (matches hero section image width)
          ---------------------------------------------------------------------- */}
      <LiveVerifiedIncidents />

      {/* ----------------------------------------------------------------------
          SECTION 3: REAL-WORLD IMPACT & APP STORE DOWNLOADS
          Outer boundary: max-w-360 mx-auto (matches hero section image width)
          ---------------------------------------------------------------------- */}
      <section className="mx-auto mt-6 max-w-360 overflow-hidden rounded-3xl bg-[#102a52] px-7 py-8 text-white sm:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1.8fr_1fr]">
          {/* Contribution summary & Learn More */}
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-red-500">
                <HeartHandshake className="size-6" />
              </div>
              <h2 className="text-lg font-black">
                Every contribution makes a real impact
              </h2>
            </div>
            <p className="mt-3 max-w-65 text-xs leading-5 text-blue-100/70">
              Your help can bring hope when it&apos;s needed the most.
            </p>
            <Button
              variant="outline"
              className="mt-5 rounded-lg border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              Learn More <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>

          {/* Key Impact Statistics Grid */}
          <div className="grid grid-cols-2 gap-6 border-y border-white/10 py-6 sm:grid-cols-4 lg:border-y-0 lg:border-x lg:px-8">
            {[
              ["25,000+", "Lives Impacted"],
              ["3,200+", "Relief Requests Fulfilled"],
              ["150+", "Partner Organizations"],
              ["1.8M+", "BDT Funds Disbursed"],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-[10px] text-blue-100/70">{label}</p>
              </div>
            ))}
          </div>

          {/* App download store badges */}
          <div className="text-center lg:text-left">
            <p className="text-lg font-black">Download Manob Prohori App</p>
            <p className="mt-1 text-xs text-blue-100/70">
              Stay prepared. Stay connected. Stay safe.
            </p>
            <div className="mt-4 flex justify-center gap-2 lg:justify-start">
              <button className="rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-[9px] font-bold">
                ▶ Google Play
              </button>
              <button className="rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-[9px] font-bold">
                 App Store
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
