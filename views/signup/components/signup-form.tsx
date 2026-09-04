"use client";

import Link from "next/link";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Loader2,
  ShieldCheck,
  HeartPulse,
  Siren,
  Droplets,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { useSignup } from "../hooks/use-signup";

interface SignupFormProps {
  signupHook: ReturnType<typeof useSignup>;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function SignupForm({ signupHook }: SignupFormProps) {
  const {
    form: {
      register,
      watch,
      setValue,
      formState: { errors },
    },
    onSubmit,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = signupHook;

  const selectedAccountType = watch("accountType") || "USER";

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      {/* ------------------------------------------------------------------
          1. ACCOUNT ROLE SELECTION (Citizen, Volunteer, Blood Donor)
          ------------------------------------------------------------------ */}
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-700">
          I want to join as: <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Option 1: Citizen */}
          <button
            type="button"
            onClick={() => setValue("accountType", "USER")}
            className={cn(
              "flex flex-col items-center rounded-2xl border p-2.5 text-center transition cursor-pointer",
              selectedAccountType === "USER"
                ? "border-brand-navy bg-slate-900 text-white shadow-md ring-2 ring-slate-900/10"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            <User className={cn("size-5", selectedAccountType === "USER" ? "text-white" : "text-slate-500")} />
            <span className="mt-1 text-xs font-extrabold">Citizen</span>
            <span className={cn("text-[10px]", selectedAccountType === "USER" ? "text-slate-300" : "text-slate-400")}>
              General User
            </span>
          </button>

          {/* Option 2: Volunteer Responder */}
          <button
            type="button"
            onClick={() => setValue("accountType", "VOLUNTEER")}
            className={cn(
              "flex flex-col items-center rounded-2xl border p-2.5 text-center transition cursor-pointer",
              selectedAccountType === "VOLUNTEER"
                ? "border-red-600 bg-red-600 text-white shadow-md ring-2 ring-red-600/15"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            <Siren className={cn("size-5", selectedAccountType === "VOLUNTEER" ? "text-white" : "text-red-500")} />
            <span className="mt-1 text-xs font-extrabold">Volunteer</span>
            <span className={cn("text-[10px]", selectedAccountType === "VOLUNTEER" ? "text-red-100" : "text-slate-400")}>
              Responder
            </span>
          </button>

          {/* Option 3: Blood Donor */}
          <button
            type="button"
            onClick={() => setValue("accountType", "BLOOD_DONOR")}
            className={cn(
              "flex flex-col items-center rounded-2xl border p-2.5 text-center transition cursor-pointer",
              selectedAccountType === "BLOOD_DONOR"
                ? "border-rose-600 bg-rose-600 text-white shadow-md ring-2 ring-rose-600/15"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            )}
          >
            <Droplets className={cn("size-5", selectedAccountType === "BLOOD_DONOR" ? "text-white" : "text-rose-500")} />
            <span className="mt-1 text-xs font-extrabold">Blood Donor</span>
            <span className={cn("text-[10px]", selectedAccountType === "BLOOD_DONOR" ? "text-rose-100" : "text-slate-400")}>
              Life Saver
            </span>
          </button>
        </div>

        {/* Verification Info Banner for Volunteer / Donor */}
        {selectedAccountType !== "USER" && (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200/80 p-2.5 text-xs text-amber-800">
            <Info className="size-4 shrink-0 text-amber-600" />
            <span>
              <strong>Verification Required:</strong> {selectedAccountType === "VOLUNTEER" ? "Volunteer" : "Blood Donor"} accounts will be submitted for Admin Verification upon signup.
            </span>
          </div>
        )}
      </div>

      {/* Row 1: Full Name & Email Address */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
              className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Email Address <span className="text-xs font-normal text-slate-400">(Optional)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Phone Number & Conditional Blood Group */}
      <div className={cn("grid grid-cols-1 gap-3", selectedAccountType === "BLOOD_DONOR" && "sm:grid-cols-3")}>
        {/* Phone Number */}
        <div className={selectedAccountType === "BLOOD_DONOR" ? "sm:col-span-2" : ""}>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex rounded-xl border bg-slate-50/50 transition focus-within:bg-white focus-within:ring-2 ${
              errors.phone
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/20"
                : "border-slate-200 focus-within:border-red-500 focus-within:ring-red-500/20"
            }`}
          >
            <div className="flex items-center gap-1.5 border-r border-slate-200 px-3 py-2.5 text-slate-700">
              <Phone className="size-3.5 text-slate-400" />
              <span className="text-xs font-bold">+880</span>
              <ChevronDown className="size-3 text-slate-400" />
            </div>
            <input
              type="tel"
              placeholder="017XXXXXXXX"
              {...register("phone")}
              className="w-full bg-transparent px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Blood Group Dropdown (Visible for Blood Donors) */}
        {selectedAccountType === "BLOOD_DONOR" && (
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Blood Group <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("bloodGroup")}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-extrabold text-brand-navy focus:bg-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Row 3: Password & Confirm Password */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Password */}
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min 6 characters"
              {...register("password")}
              className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat password"
              {...register("confirmPassword")}
              className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Terms of Service & Privacy Policy Checkbox */}
      <div className="pt-1">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="terms"
            {...register("agreeToTerms")}
            className="size-4 rounded border-slate-300 text-red-600 accent-red-600 focus:ring-red-500 cursor-pointer"
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
        {errors.agreeToTerms && (
          <p className="mt-1 text-[11px] font-medium text-red-500">
            {errors.agreeToTerms.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-xl bg-red-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Creating Account &amp; Signing In...
          </span>
        ) : (
          `Create ${selectedAccountType === "VOLUNTEER" ? "Volunteer" : selectedAccountType === "BLOOD_DONOR" ? "Blood Donor" : "Citizen"} Account`
        )}
      </Button>
    </form>
  );
}
