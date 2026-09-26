"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  ShieldAlert,
  Ambulance,
  Flame,
  Shield,
  Search,
  MapPin,
  Clock,
  ChevronRight,
  ExternalLink,
  Building2,
  Filter,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetEmergencyServicesQuery } from "@/redux/api/emergencyServiceApi";

export function MasterEmergencyDirectoryView() {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const { data: servicesRes, isLoading } = useGetEmergencyServicesQuery({
    type: selectedType !== "ALL" ? selectedType : undefined,
    search: searchTerm.trim() || undefined,
    region: selectedRegion.trim() || undefined,
  });

  const services = servicesRes?.data || [];

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    toast.success(`Copied ${num} to clipboard!`);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "NATIONAL_EMERGENCY":
        return ShieldAlert;
      case "AMBULANCE":
        return Ambulance;
      case "FIRE":
        return Flame;
      case "POLICE":
        return Shield;
      default:
        return Phone;
    }
  };

  const getServiceTypeBadge = (type: string) => {
    switch (type) {
      case "NATIONAL_EMERGENCY":
        return "bg-red-50 text-brand-red border-red-200";
      case "AMBULANCE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "FIRE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "POLICE":
        return "bg-blue-50 text-brand-blue border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-linear-to-b from-white via-slate-50 to-slate-100/60 pt-10 pb-12">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-red shadow-2xs">
              <ShieldAlert className="size-3.5 animate-pulse" />
              <span>National Crisis Hotlines</span>
            </span>

            <h1 className="mt-3 text-2xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Emergency Services &amp; Agency Directory
            </h1>

            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Direct, verified emergency phone numbers for Bangladesh Police, Fire Service, Ambulance Fleets, and National Emergency Services with instant 1-tap calling.
            </p>

            {/* Central 999 Hotline Card */}
            <div className="mt-7 mx-auto max-w-xl rounded-3xl border-2 border-red-500/80 bg-linear-to-r from-red-600 via-brand-red to-red-600 p-6 text-white shadow-xl shadow-red-600/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="rounded bg-white/20 px-2 py-0.5 text-[10.5px] font-black uppercase tracking-wider text-white">
                    Toll-Free Nationwide 24/7
                  </span>
                  <h3 className="mt-1 text-xl sm:text-2xl font-black">
                    National Emergency Service (999)
                  </h3>
                  <p className="text-xs text-red-100 mt-0.5">
                    For Police, Fire Service, and Emergency Medical Ambulance anywhere in Bangladesh.
                  </p>
                </div>

                <a
                  href="tel:999"
                  className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-brand-red hover:bg-red-50 transition shadow-md cursor-pointer"
                >
                  <Phone className="size-5 animate-bounce" />
                  <span>Call 999 Now</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Filter Bar */}
          <div className="mt-8 mx-auto max-w-5xl space-y-3">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: "ALL", label: "All Services (সব)", icon: Phone },
                { id: "NATIONAL_EMERGENCY", label: "National Hotlines", icon: ShieldAlert },
                { id: "AMBULANCE", label: "Ambulance Fleets", icon: Ambulance },
                { id: "FIRE", label: "Fire Service & Rescue", icon: Flame },
                { id: "POLICE", label: "Bangladesh Police", icon: Shield },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedType === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedType(tab.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer shadow-xs",
                      isSelected
                        ? "bg-brand-navy text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Keyword and Region Search Bar */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="relative sm:col-span-8">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search agency, provider, or service name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-brand-red focus:outline-none transition"
                  />
                </div>

                <div className="relative sm:col-span-4">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter region (e.g. Dhaka, Highway)..."
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-brand-red focus:outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services and Contacts Grid */}
      <section className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 pt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-3xl border border-slate-200 bg-white p-6 animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center max-w-md mx-auto">
            <Phone className="mx-auto size-12 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-brand-navy">No emergency contacts found</h3>
            <p className="mt-1 text-xs text-slate-500">Try changing your search terms or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service) => {
              const Icon = getServiceTypeIcon(service.serviceType);
              const badgeClass = getServiceTypeBadge(service.serviceType);

              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition duration-200"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-3.5">
                      <div className={cn("grid size-12 shrink-0 place-items-center rounded-2xl border shadow-2xs", badgeClass)}>
                        <Icon className="size-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-black text-brand-navy">
                            {service.name}
                          </h3>
                          <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border", badgeClass)}>
                            {service.serviceType.replace("_", " ")}
                          </span>
                        </div>
                        {service.description && (
                          <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contacts List */}
                    <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        Available Response Numbers ({service.contacts?.length || 0})
                      </span>

                      {service.contacts && service.contacts.length > 0 ? (
                        service.contacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 hover:bg-slate-50 transition"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-brand-navy truncate">
                                  {contact.displayLabel || service.name}
                                </span>
                                {contact.isPrimary && (
                                  <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9.5px] font-black uppercase">
                                    Primary 24/7
                                  </span>
                                )}
                              </div>
                              {contact.regionName && (
                                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                  <MapPin className="size-3 text-slate-400" />
                                  <span>{contact.regionName}</span>
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleCopy(contact.phoneNumber)}
                                className="grid size-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition cursor-pointer"
                                title="Copy phone number"
                              >
                                {copiedNumber === contact.phoneNumber ? (
                                  <Check className="size-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </button>

                              <a
                                href={`tel:${contact.phoneNumber}`}
                                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-black text-white shadow-xs hover:bg-emerald-700 transition"
                              >
                                <Phone className="size-3" />
                                <span className="font-mono font-bold">{contact.phoneNumber}</span>
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No regional contacts recorded.</p>
                      )}
                    </div>
                  </div>

                  {/* Footer link to Hospitals locator if Ambulance */}
                  {service.serviceType === "AMBULANCE" && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Looking for hospital emergency rooms?</span>
                      <Link
                        href="/hospitals"
                        className="font-bold text-brand-red hover:underline flex items-center gap-1"
                      >
                        <span>Find Hospitals</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
