import {
  Ambulance,
  Bell,
  Building2,
  ChevronRight,
  Droplets,
  FileWarning,
  HandHeart,
  HeartPulse,
  Home,
  MapPin,
  Menu,
  Radio,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

// ============================================================================
// 1. Quick Access Services Data
// ============================================================================
const quickItems = [
  { label: "Volunteers", icon: Users, bg: "bg-red-50 text-red-600 border-red-100" },
  { label: "Hospitals", icon: Building2, bg: "bg-blue-50 text-blue-600 border-blue-100" },
  { label: "Blood Donors", icon: Droplets, bg: "bg-rose-50 text-rose-600 border-rose-100" },
  { label: "Ambulance", icon: Ambulance, bg: "bg-sky-50 text-sky-600 border-sky-100" },
  { label: "Incidents", icon: FileWarning, bg: "bg-amber-50 text-amber-600 border-amber-100" },
  { label: "Relief Help", icon: HandHeart, bg: "bg-violet-50 text-violet-600 border-violet-100" },
];

// ============================================================================
// 2. Hero Phone Mockup Component
// ============================================================================
export function HeroPhone({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto lg:mx-0 w-71.25 sm:w-76.25 lg:w-[320px] ${className}`}>
      
      {/* Smartphone Outer Frame & Shadow */}
      <div className="relative overflow-hidden rounded-[44px] border-8 border-slate-900 bg-white shadow-[0_25px_80px_rgba(15,23,42,.30)] ring-1 ring-slate-900/10">
        
        {/* Dynamic Island Speaker Pill */}
        <div className="absolute left-1/2 top-2.5 z-30 flex h-5 w-24 -translate-x-1/2 items-center justify-between rounded-full bg-slate-950 px-2.5 shadow-inner">
          <div className="size-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          <div className="size-1.5 rounded-full bg-slate-900/80" />
        </div>

        {/* Mobile Screen Container */}
        <div className="flex min-h-158.75 flex-col justify-between bg-[#f8fafc] px-3.5 pt-9 text-slate-900">
          
          <div className="space-y-3">
            
            {/* App Top Bar */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <button className="grid size-7 place-items-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/60">
                  <Menu className="size-3.5" />
                </button>
                <div>
                  <p className="text-[12px] font-black leading-tight text-[#10233f]">Manob Prohori</p>
                  <p className="text-[8.5px] font-semibold text-slate-400">Emergency Response</p>
                </div>
              </div>
              <button className="relative grid size-7 place-items-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/60">
                <Bell className="size-3.5" />
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
            </div>

            {/* SOS Emergency Action Card */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-red-500 via-red-600 to-rose-600 p-3.5 text-white shadow-md shadow-red-500/25">
              <div className="relative z-10 flex items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-black tracking-tight">Emergency?</p>
                  <p className="mt-1 text-[10px] sm:text-[10.5px] font-semibold leading-snug text-red-50">
                    Tap SOS button to send live location <br />
                    & alerts instantly
                  </p>
                </div>
                <button className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white text-[13px] font-black text-red-600 shadow-md">
                  SOS
                </button>
              </div>
            </div>

            {/* Quick Access Services (6 Cards Grid) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11.5px] font-black text-[#10233f]">Quick Access</p>
                <span className="text-[8.5px] font-bold text-slate-400">Services</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {quickItems.map(({ label, icon: Icon, bg }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-2 text-center shadow-[0_1px_4px_rgba(15,23,42,0.03)]"
                  >
                    <div className={`grid size-7.5 place-items-center rounded-lg border ${bg} mb-1 shadow-sm`}>
                      <Icon className="size-3.5" />
                    </div>
                    <p className="text-[9px] font-bold leading-tight text-slate-700">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Incidents Feed */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11.5px] font-black text-[#10233f]">Recent Incidents Near You</p>
                <span className="cursor-pointer text-[9px] font-extrabold text-red-500 hover:underline">
                  View All
                </span>
              </div>

              <div className="space-y-1.5">
                {/* Incident 1: Road Accident */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
                  <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500">
                    <MapPin className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-bold text-slate-800">Road Accident</p>
                    <p className="text-[8.5px] font-medium text-slate-400">2.4 km away · 5 min ago</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-extrabold text-emerald-600 border border-emerald-100">
                    Resolved
                  </span>
                </div>

                {/* Incident 2: Medical Assistance */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
                  <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-500">
                    <HeartPulse className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-bold text-slate-800">Medical Assistance</p>
                    <p className="text-[8.5px] font-medium text-slate-400">Nearby verified responders</p>
                  </div>
                  <ChevronRight className="size-3.5 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Verified Support Network Badge */}
            <div className="rounded-xl bg-[#091527] p-2.5 text-white border border-slate-800 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="grid size-7.5 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-[10.5px] font-black text-white leading-tight">
                      Verified Support Network
                    </p>
                    <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="mt-0.5 text-[8.5px] font-semibold text-slate-300">
                    Trusted emergency responders around you
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* App Bottom Navigation Bar */}
          <div className="mt-3 -mx-3.5 border-t border-slate-200/90 bg-white px-2.5 pt-2 pb-2.5">
            <div className="flex items-center justify-around">
              <button className="flex flex-col items-center gap-0.5 text-red-600">
                <Home className="size-4" />
                <span className="text-[8.5px] font-black">Home</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 text-slate-400">
                <Radio className="size-4" />
                <span className="text-[8.5px] font-bold">Alerts</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 text-slate-400">
                <MapPin className="size-4" />
                <span className="text-[8.5px] font-bold">Nearby</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 text-slate-400">
                <User className="size-4" />
                <span className="text-[8.5px] font-bold">Account</span>
              </button>
            </div>
            
            {/* iOS Home Indicator Bar */}
            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-slate-900/30" />
          </div>

        </div>
      </div>
    </div>
  );
}
