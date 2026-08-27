import Image from "next/image";
import { HandHeart, ShieldCheck, Zap } from "lucide-react";

export function SignupHero() {
  return (
    <div className="relative hidden min-h-[720px] overflow-hidden lg:block">
      {/* Background Rescue Operations Image */}
      <Image
        src="/images/signup-bg-image.png"
        alt="Manob Prohori Rescue Team"
        fill
        priority
        className="pointer-events-none object-cover object-center"
      />

      {/* Top-Left Floating Motivation Quote & Shield Logo */}
      <div className="absolute left-8 top-8 z-10 max-w-85">
        <div className="flex items-start gap-3.5">
          {/* Circular Logo Container */}
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-rose-200/90 p-2 shadow-xs backdrop-blur-sm">
            <Image
              src="/images/manob-prohori-logo.png"
              alt="Manob Prohori Shield"
              width={36}
              height={36}
              className="size-7 object-contain"
            />
          </div>
          <div>
            <h2 className="text-[19px] font-black leading-[1.2] text-[#10233f]">
              Be the help
              <br />
              someone needs
            </h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
              Sign up today and help us
              <br />
              respond faster, together.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          Bottom Floating Feature Cards (Pill Cards with Flex Layout)
          ------------------------------------------------------------------ */}
      <div className="absolute inset-x-6 bottom-6 z-10 flex flex-col gap-3.5">
        {/* Card 1: 5 km Rapid Dispatch */}
        <div className="flex items-center gap-4.5 rounded-[26px] border border-white/80 bg-white/90 px-6 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.12)] backdrop-blur-md transition-transform hover:-translate-y-0.5">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-red-100/90 text-red-600">
            <Zap className="size-5.5 fill-red-600/20 text-red-600" />
          </div>
          <div>
            <h4 className="text-[15px] font-black tracking-tight text-[#10233f]">
              5 km Rapid Dispatch
            </h4>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Automatic alert to verified nearby volunteers
            </p>
          </div>
        </div>

        {/* Card 2: 100% Verified Responders */}
        <div className="flex items-center gap-4.5 rounded-[26px] border border-white/80 bg-white/90 px-6 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.12)] backdrop-blur-md transition-transform hover:-translate-y-0.5">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-100/90 text-emerald-600">
            <ShieldCheck className="size-5.5 fill-emerald-600/20 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-[15px] font-black tracking-tight text-[#10233f]">
              100% Verified Responders
            </h4>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Admin-verified volunteers, blood donors &amp; services
            </p>
          </div>
        </div>

        {/* Card 3: Emergency Blood & Relief */}
        <div className="flex items-center gap-4.5 rounded-[26px] border border-white/80 bg-white/90 px-6 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.12)] backdrop-blur-md transition-transform hover:-translate-y-0.5">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-100/90 text-blue-600">
            <HandHeart className="size-5.5 fill-blue-600/20 text-blue-600" />
          </div>
          <div>
            <h4 className="text-[15px] font-black tracking-tight text-[#10233f]">
              Emergency Blood &amp; Relief
            </h4>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Instant matching for emergency blood and verified aid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
