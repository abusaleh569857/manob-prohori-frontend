"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Siren, ArrowLeft, ShieldAlert, Clock, PhoneCall } from "lucide-react";
import { IncidentForm } from "./components/incident-form";
import { useCreateIncident } from "./hooks/use-create-incident";

export function MasterCreateIncidentComponent() {
  const router = useRouter();
  const hook = useCreateIncident();

  return (
    <div className="min-h-screen bg-brand-canvas py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-text-secondary transition hover:text-brand-red cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <Link
            href="/incidents/my"
            className="text-xs font-bold text-brand-red hover:underline"
          >
            View My Reports →
          </Link>
        </div>

        {/* Emergency Alert Header Banner */}
        <div className="mb-6 rounded-3xl border border-brand-red/25 bg-brand-red-soft p-5 backdrop-blur-sm sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid size-12 place-items-center rounded-2xl bg-brand-red text-white shadow-md shadow-brand-red/30">
                <Siren className="size-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-brand-navy">
                  Report an Emergency
                </h1>
                <p className="mt-0.5 text-xs font-medium text-brand-text-secondary">
                  Instant alert to nearby verified volunteers, hospitals, and emergency services.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-brand-surface px-3.5 py-2 text-xs font-bold text-brand-red shadow-xs border border-brand-red/20">
              <PhoneCall className="size-3.5" />
              <span>Immediate Life Threat? Call 999</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Form Container & Right Emergency Guide Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: Incident Form Box */}
          <div className="rounded-3xl border border-brand-border bg-brand-surface p-6 sm:p-8 shadow-sm">
            <IncidentForm hook={hook} />
          </div>

          {/* Right: Emergency Instructions & Tips */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-brand-border bg-brand-surface p-5 shadow-xs">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-navy">
                <ShieldAlert className="size-4 text-brand-red" />
                Emergency Guidelines
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-brand-text-secondary font-medium">
                <li className="flex items-start gap-2">
                  <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-brand-red-soft text-[10px] font-bold text-brand-red">
                    1
                  </span>
                  <span>Ensure your personal safety first before reporting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-brand-red-soft text-[10px] font-bold text-brand-red">
                    2
                  </span>
                  <span>Keep GPS enabled for 5 km precision responder matching.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-brand-red-soft text-[10px] font-bold text-brand-red">
                    3
                  </span>
                  <span>Verified responders will coordinate via the incident chat.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-brand-border bg-brand-surface p-5 shadow-xs">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-navy">
                <Clock className="size-4 text-brand-emerald" />
                Response Timeline
              </h3>
              <p className="mt-2 text-xs text-brand-text-secondary leading-relaxed font-medium">
                Once submitted, your incident starts in <strong>REPORTED</strong> status and alerts nearby verified teams immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
