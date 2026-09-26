"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HeartHandshake,
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Plus,
  Loader2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  Send,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  useGetPublicReliefCampaignsQuery,
  useRecordDonationMutation,
} from "@/redux/api/reliefApi";
import { ReliefCampaign } from "@/types/relief.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MasterReliefDirectoryView() {
  const [search, setSearch] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<ReliefCampaign | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Donation Report Form State
  const [donationForm, setDonationForm] = useState({
    amount: "",
    paymentMethod: "BKASH" as "BKASH" | "NAGAD" | "ROCKET" | "BANK",
    transactionReference: "",
    donorName: "",
    donorPhone: "",
  });

  const {
    data: campaignsData,
    isLoading,
    refetch,
  } = useGetPublicReliefCampaignsQuery({
    search: search || undefined,
    limit: 50,
  });

  const [recordDonation, { isLoading: isRecordingDonation }] = useRecordDonationMutation();

  const campaigns: ReliefCampaign[] = campaignsData?.data?.campaigns || [];
  const totalRaised = campaigns.reduce((acc, c) => acc + (Number(c.current_amount) || 0), 0);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    toast.success(`${label} number copied to clipboard!`);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleOpenDonateModal = (campaign: ReliefCampaign) => {
    setSelectedCampaign(campaign);
    setDonationForm({
      amount: "",
      paymentMethod: "BKASH",
      transactionReference: "",
      donorName: "",
      donorPhone: "",
    });
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    const numAmount = Number(donationForm.amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid donation amount in BDT");
      return;
    }

    try {
      await recordDonation({
        reliefRequestId: selectedCampaign.id,
        amount: numAmount,
        paymentMethod: donationForm.paymentMethod,
        transactionReference: donationForm.transactionReference || undefined,
        donorName: donationForm.donorName || "Kind Citizen",
        donorPhone: donationForm.donorPhone || undefined,
      }).unwrap();

      toast.success(
        `Thank you! ৳${numAmount.toLocaleString()} donation reported. Public campaign progress updated.`
      );
      setSelectedCampaign(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to record donation report");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-950 via-slate-900 to-brand-navy p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
          <HeartHandshake className="size-96" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-300">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>100% Direct Peer-to-Peer Relief (Zero Middleman Fees)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Verified Emergency Relief &amp; Community Aid
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Every disaster campaign on Manob Prohori is verified with administrative identity and damage proof.
            Donate directly to victims&apos; bKash, Nagad, or Rocket accounts without any platform commission.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/relief/apply"
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition"
            >
              <Plus className="size-4" />
              <span>Apply for Emergency Relief</span>
            </Link>

            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md">
              <Sparkles className="size-4 text-amber-400" />
              <span>Total Mobilized Aid: <strong>৳{totalRaised.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns by area, disaster, or victim name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
          <span>Active Campaigns: <strong className="text-brand-navy font-bold">{campaigns.length}</strong></span>
          <span>·</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="size-3.5" />
            <span>Admin Verified</span>
          </span>
        </div>
      </div>

      {/* 3. Relief Campaigns Grid */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
          <p className="mt-2 text-xs font-semibold text-slate-400">Loading verified relief campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <HeartHandshake className="size-12 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-brand-navy">No Active Relief Campaigns</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            If you or your community are affected by a flood, fire, or disaster, submit an application for verification.
          </p>
          <Link
            href="/relief/apply"
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <Plus className="size-3.5" />
            <span>Create Relief Request</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs transition hover:border-emerald-200 hover:shadow-md"
            >
              {/* Cover Photo / Header */}
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  {camp.cover_image ? (
                    <img
                      src={camp.cover_image}
                      alt={camp.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center bg-linear-to-br from-emerald-100 to-slate-100 text-emerald-600">
                      <HeartHandshake className="size-12 opacity-60" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                    <ShieldCheck className="size-3.5 text-emerald-200" />
                    <span>Verified Victim Aid</span>
                  </div>

                  {camp.address_text && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-slate-200">
                      <MapPin className="size-3 text-red-400 shrink-0" />
                      <span className="truncate max-w-[220px]">{camp.address_text}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-brand-navy leading-snug line-clamp-2">
                      {camp.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {camp.description}
                    </p>
                  </div>

                  {/* Progress Bar & Amounts */}
                  <div className="space-y-1.5 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700">
                        ৳{Number(camp.current_amount).toLocaleString()} Raised
                      </span>
                      <span className="text-slate-400 font-semibold">
                        Goal: ৳{Number(camp.required_amount).toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, camp.progress_percent || 0))}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>{camp.progress_percent}% Funded</span>
                      <span>{camp.donations_count || 0} Direct Contributions</span>
                    </div>
                  </div>

                  {/* Direct Payment Numbers Quick-Copy */}
                  <div className="space-y-1.5 text-xs">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Send Direct Aid To Victim:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {camp.bkash_number && (
                        <button
                          type="button"
                          onClick={() => handleCopy(camp.bkash_number!, "bKash")}
                          className="flex items-center justify-between rounded-xl border border-pink-200 bg-pink-50/60 px-2.5 py-1.5 text-[11px] font-bold text-pink-700 hover:bg-pink-100 transition cursor-pointer"
                        >
                          <span className="truncate">bKash: {camp.bkash_number}</span>
                          <Copy className="size-3 shrink-0 ml-1 opacity-70" />
                        </button>
                      )}

                      {camp.nagad_number && (
                        <button
                          type="button"
                          onClick={() => handleCopy(camp.nagad_number!, "Nagad")}
                          className="flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/60 px-2.5 py-1.5 text-[11px] font-bold text-orange-700 hover:bg-orange-100 transition cursor-pointer"
                        >
                          <span className="truncate">Nagad: {camp.nagad_number}</span>
                          <Copy className="size-3 shrink-0 ml-1 opacity-70" />
                        </button>
                      )}

                      {camp.rocket_number && (
                        <button
                          type="button"
                          onClick={() => handleCopy(camp.rocket_number!, "Rocket")}
                          className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50/60 px-2.5 py-1.5 text-[11px] font-bold text-purple-700 hover:bg-purple-100 transition cursor-pointer"
                        >
                          <span className="truncate">Rocket: {camp.rocket_number}</span>
                          <Copy className="size-3 shrink-0 ml-1 opacity-70" />
                        </button>
                      )}

                      <a
                        href={`tel:${camp.contact_phone}`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <span className="truncate">Call: {camp.contact_phone}</span>
                        <Phone className="size-3 shrink-0 ml-1 text-slate-500" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenDonateModal(camp)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition cursor-pointer"
                >
                  <Send className="size-3.5" />
                  <span>Send Direct Relief / Report Aid</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Direct Peer-to-Peer Donation Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setSelectedCampaign(null)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 text-emerald-600">
              <HeartHandshake className="size-5" />
              <h2 className="text-lg font-black text-brand-navy">Send Direct Relief Aid</h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 line-clamp-1">
              For: <strong>{selectedCampaign.title}</strong>
            </p>

            {/* Direct Payment Instructions */}
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <AlertCircle className="size-4 shrink-0 text-emerald-600" />
                <span>How Direct Donation Works:</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                1. Copy the recipient&apos;s verified mobile account number below.
                <br />
                2. Send money directly from your bKash, Nagad, or Rocket app (No middleman, 0% platform fee).
                <br />
                3. Fill in the amount below to update the campaign&apos;s public transparent progress bar.
              </p>

              {/* Number Copy Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedCampaign.bkash_number && (
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedCampaign.bkash_number!, "bKash")}
                    className="flex items-center gap-1.5 rounded-xl border border-pink-300 bg-white px-3 py-1.5 font-bold text-pink-700 shadow-2xs hover:bg-pink-50 transition cursor-pointer"
                  >
                    <span>bKash: {selectedCampaign.bkash_number}</span>
                    <Copy className="size-3" />
                  </button>
                )}
                {selectedCampaign.nagad_number && (
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedCampaign.nagad_number!, "Nagad")}
                    className="flex items-center gap-1.5 rounded-xl border border-orange-300 bg-white px-3 py-1.5 font-bold text-orange-700 shadow-2xs hover:bg-orange-50 transition cursor-pointer"
                  >
                    <span>Nagad: {selectedCampaign.nagad_number}</span>
                    <Copy className="size-3" />
                  </button>
                )}
                {selectedCampaign.rocket_number && (
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedCampaign.rocket_number!, "Rocket")}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-300 bg-white px-3 py-1.5 font-bold text-purple-700 shadow-2xs hover:bg-purple-50 transition cursor-pointer"
                  >
                    <span>Rocket: {selectedCampaign.rocket_number}</span>
                    <Copy className="size-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Donation Form */}
            <form onSubmit={handleSubmitDonation} className="mt-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount Sent (৳ BDT) *</label>
                  <input
                    type="number"
                    min="10"
                    placeholder="e.g. 1000"
                    value={donationForm.amount}
                    onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={donationForm.paymentMethod}
                    onChange={(e) => setDonationForm({ ...donationForm, paymentMethod: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="BKASH">bKash</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="ROCKET">Rocket</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction ID / TrxID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 9J3K8L2M"
                  value={donationForm.transactionReference}
                  onChange={(e) => setDonationForm({ ...donationForm, transactionReference: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave blank for Anonymous"
                    value={donationForm.donorName}
                    onChange={(e) => setDonationForm({ ...donationForm, donorName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+8801..."
                    value={donationForm.donorPhone}
                    onChange={(e) => setDonationForm({ ...donationForm, donorPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRecordingDonation}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {isRecordingDonation ? (
                    <Loader2 className="size-4 animate-spin text-white" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  <span>Log Contribution</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
