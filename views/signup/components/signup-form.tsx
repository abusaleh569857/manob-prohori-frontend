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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { useSignup } from "../hooks/use-signup";

interface SignupFormProps {
  signupHook: ReturnType<typeof useSignup>;
}

export function SignupForm({ signupHook }: SignupFormProps) {
  const {
    form: {
      register,
      formState: { errors },
    },
    onSubmit,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = signupHook;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
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

      {/* Row 2: Phone Number */}
      <div>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
        className="mt-2 w-full rounded-xl bg-red-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-70"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Creating Account & Signing In...
          </span>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
