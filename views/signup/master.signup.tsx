"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Eye,
  EyeOff,
  HandHeart,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================================
// Master Signup View Component
// Clean two-column layout: Form on the left and hero image with floating cards on the right.
// ============================================================================
export function MasterSignupComponent() {
  // Password visibility toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f4f6f8] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      
      {/* Main Container */}
      <div className="relative mx-auto grid w-full max-w-[1330px] grid-cols-1 overflow-hidden rounded-[36px] border border-slate-200/80 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)] lg:grid-cols-[510px_1fr] xl:grid-cols-[550px_1fr]">
        
        {/* ====================================================================
            LEFT COLUMN: SIGNUP REGISTRATION FORM
            ==================================================================== */}
        <div className="flex flex-col justify-between bg-white p-7 sm:p-9 lg:p-10 xl:p-11">
          <div>
            {/* Brand Logo */}
            <Link href="/" className="inline-block">
              <Image
                src="/images/manob-prohori-logo-v3.png"
                alt="Manob Prohori"
                width={220}
                height={75}
                priority
                className="h-auto w-[185px] sm:w-[205px] object-contain"
              />
            </Link>

            {/* Form Heading & Subtitle */}
            <div className="mt-6">
              <h1 className="text-3xl font-black tracking-tight text-[#10233f] sm:text-[32px]">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm font-medium text-slate-500">
                Join Manob Prohori and be a part of a safer community.
              </p>
            </div>

            {/* Social Authentication Buttons */}
            <div className="mt-5 space-y-2.5">
              {/* Google Sign Up Button */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-red-700 active:scale-[0.99]"
              >
                <div className="grid size-5.5 place-items-center rounded bg-white shadow-xs">
                  <svg className="size-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                Sign up with Google
              </button>

              {/* Facebook Sign Up Button */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-[0.99]"
              >
                <svg className="size-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Sign up with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                or
              </span>
            </div>

            {/* Registration Form Fields */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              
              {/* Row 1: Full Name & Email Address */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone Number with Country Code */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Phone Number
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-slate-50/50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500/20">
                  <div className="flex items-center gap-1.5 border-r border-slate-200 px-3 py-2.5 text-slate-700">
                    <Phone className="size-3.5 text-slate-400" />
                    <span className="text-xs font-bold">+880</span>
                    <ChevronDown className="size-3 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full bg-transparent px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Password */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms of Service & Privacy Policy Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-red-600 accent-red-600 focus:ring-red-500"
                />
                <label htmlFor="terms" className="text-xs font-medium text-slate-600">
                  I agree to the{" "}
                  <Link href="/terms" className="font-bold text-red-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-bold text-red-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="mt-2 w-full rounded-xl bg-red-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.99]"
              >
                Create Account
              </Button>
            </form>
          </div>

          {/* Footer Sign in Link */}
          <div className="mt-5 text-center text-xs font-semibold text-slate-600">
            Already have an account?{" "}
            <Link href="/signin" className="font-extrabold text-red-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* ====================================================================
            RIGHT COLUMN: HERO RESCUE IMAGE ASSET & FLOATING CARDS
            ==================================================================== */}
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
                  Be the help<br />
                  someone needs
                </h2>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                  Sign up today and help us<br />
                  respond faster, together.
                </p>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              Bottom Floating 4-Feature Pillars Card (Eye-Catching Glass Card)
              ------------------------------------------------------------------ */}
          <div className="absolute bottom-6 left-6 right-6 z-10 rounded-3xl border border-white/90 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="grid grid-cols-4 divide-x divide-slate-300">
              
              {/* Pillar 1: Quick Response */}
              <div className="flex flex-col items-center px-3 text-center">
                <div className="grid size-12 place-items-center rounded-full border border-rose-100 bg-rose-50 text-red-500 shadow-sm transition-transform hover:scale-105">
                  <Zap className="size-5.5 fill-red-500 text-red-500" />
                </div>
                <h3 className="mt-2.5 text-[13px] font-black tracking-tight text-[#10233f]">
                  Quick Response
                </h3>
                <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-500">
                  Get help when every<br />second counts.
                </p>
              </div>

              {/* Pillar 2: Trusted Community */}
              <div className="flex flex-col items-center px-3 text-center">
                <div className="grid size-12 place-items-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition-transform hover:scale-105">
                  <ShieldCheck className="size-5.5 fill-blue-500/20 text-blue-600" />
                </div>
                <h3 className="mt-2.5 text-[13px] font-black tracking-tight text-[#10233f]">
                  Trusted Community
                </h3>
                <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-500">
                  Connect with verified<br />volunteers and services.
                </p>
              </div>

              {/* Pillar 3: Save Lives */}
              <div className="flex flex-col items-center px-3 text-center">
                <div className="grid size-12 place-items-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm transition-transform hover:scale-105">
                  <HandHeart className="size-5.5 fill-emerald-500/20 text-emerald-600" />
                </div>
                <h3 className="mt-2.5 text-[13px] font-black tracking-tight text-[#10233f]">
                  Save Lives
                </h3>
                <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-500">
                  Your action today can<br />save lives tomorrow.
                </p>
              </div>

              {/* Pillar 4: Secure & Private */}
              <div className="flex flex-col items-center px-3 text-center">
                <div className="grid size-12 place-items-center rounded-full border border-amber-100 bg-amber-50 text-amber-600 shadow-sm transition-transform hover:scale-105">
                  <Lock className="size-5.5 text-amber-600" />
                </div>
                <h3 className="mt-2.5 text-[13px] font-black tracking-tight text-[#10233f]">
                  Secure & Private
                </h3>
                <p className="mt-1 text-[11px] font-semibold leading-tight text-slate-500">
                  Your data is protected<br />and never shared.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
