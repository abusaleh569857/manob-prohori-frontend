"use client";

import { useState } from "react";
import {
  PhoneCall,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  ShieldCheck,
  Clock,
  Radio,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How does Manob Prohori verify emergency incidents?",
    a: "Our central controllers cross-check reports with nearby verified volunteers and audio telemetry before elevating incidents to full disaster broadcast status.",
  },
  {
    q: "How can I join as an emergency volunteer?",
    a: "Click 'Sign Up', create a volunteer profile, submit your basic skills and district location, and undergo digital verification to receive emergency siren alerts.",
  },
  {
    q: "Is reporting an emergency free of cost?",
    a: "Yes, 100% free forever for all citizens of Bangladesh. Manob Prohori is a non-profit humanitarian initiative.",
  },
];

export function MasterContactComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("GENERAL");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent to our command support desk.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-linear-to-r from-brand-navy via-slate-900 to-brand-navy p-8 sm:p-12 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-64 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3.5 py-1 text-xs font-black uppercase text-white shadow-xs">
            <MessageSquare className="size-3.5" /> Support &amp; Partnerships
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Contact &amp; Emergency Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Have questions, partner inquiries, or need emergency assistance? Our support and coordination teams are available 24/7.
          </p>
        </div>
      </div>

      {/* 2. FORM & INFO SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-brand-navy">Send us a Message</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Fill out the form below and our team will get back to you promptly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  Full Name <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  Email Address <span className="text-brand-red">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tanvir@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10 cursor-pointer"
                >
                  <option value="GENERAL">General Inquiry</option>
                  <option value="VOLUNTEER">Volunteer &amp; Responder Partner</option>
                  <option value="HOSPITAL">Hospital / NGO Integration</option>
                  <option value="MEDIA">Press &amp; Media Relations</option>
                  <option value="BUG">Technical Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                Message <span className="text-brand-red">*</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you or collaborate?"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-red py-3.5 text-sm font-black text-white shadow-lg shadow-red-900/30 hover:bg-brand-red-dark transition cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Hotline Cards & Hubs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs space-y-4">
            <h3 className="text-base font-black text-brand-navy">National Command Hub</h3>
            <div className="space-y-3 text-xs text-slate-600 font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-brand-red shrink-0 mt-0.5" />
                <span>Manob Prohori Command HQ, Agargaon ICT Tower, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-brand-red shrink-0" />
                <span>support@manobprohori.org</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="size-4 text-emerald-600 shrink-0" />
                <span>+880 9612-999999 (24/7 Desk)</span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs space-y-3">
            <h3 className="text-base font-black text-brand-navy mb-2">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-brand-navy cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={cn("size-3.5 transition", openFaq === idx && "rotate-180")} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-3.5 pb-3.5 text-[11px] text-slate-600 font-medium leading-relaxed border-t border-slate-200/60 pt-2 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
