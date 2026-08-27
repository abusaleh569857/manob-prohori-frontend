"use client";

import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { useSignin } from "../hooks/use-signin";

interface SigninFormProps {
  signinHook: ReturnType<typeof useSignin>;
}

export function SigninForm({ signinHook }: SigninFormProps) {
  const {
    form: {
      register,
      formState: { errors },
    },
    onSubmit,
    isLoading,
    showPassword,
    setShowPassword,
  } = signinHook;

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {/* Field 1: Phone or Email Address */}
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-700">
          Phone Number or Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="e.g. 01712345678 or user@email.com"
            {...register("identifier")}
            className={`w-full rounded-xl border bg-slate-50/50 py-3 pl-10 pr-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
              errors.identifier
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
            }`}
          />
        </div>
        {errors.identifier && (
          <p className="mt-1 text-[11px] font-medium text-red-500">
            {errors.identifier.message}
          </p>
        )}
      </div>

      {/* Field 2: Password */}
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-700">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
            className={`w-full rounded-xl border bg-slate-50/50 py-3 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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

      {/* Forgot Password Link */}
      <div className="flex justify-end pt-0.5">
        <Link
          href="/forgot-password"
          className="text-xs font-bold text-red-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Primary Sign In Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-red-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-70"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Signing In...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
