"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  signinSchema,
  type SigninFormValues,
} from "@/lib/validations/auth.schema";

// ============================================================================
// Master Signin View Component
// Two-column layout: Sign in form on the left, clean rescue image on the right.
// ============================================================================
export function MasterSigninComponent() {
  // Password visibility toggle state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: SigninFormValues) => {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        identifier: values.identifier.trim(),
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        console.log("Error : ", result?.error);
        toast.error("Invalid phone/email or password.");
        return;
      }

      if (result?.ok) {
        toast.success("Login successful! Welcome back.");

        // Fetch fresh session to inspect user roles
        let userRoles: string[] = [];
        try {
          const sessionRes = await fetch("/api/auth/session");
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            userRoles = sessionData?.user?.roles || [];
          }
        } catch (e) {
          console.error("Failed to read fresh session:", e);
        }

        const isAdmin =
          userRoles.includes("ADMIN") || userRoles.includes("SUPER_ADMIN");

        let targetUrl = callbackUrl || "/dashboard";

        // If user has ADMIN role, ALWAYS redirect directly to /admin/dashboard
        if (isAdmin && (!callbackUrl || callbackUrl === "/" || callbackUrl === "/dashboard")) {
          targetUrl = "/admin/dashboard";
        }

        // Instant navigation with fresh session
        window.location.href = targetUrl;
      }
    } catch (err: any) {
      console.error("Signin error:", err);
      toast.error(
        err?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-brand-canvas px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* Main Centered Container */}
      <div className="relative mx-auto grid w-full max-w-332.5 grid-cols-1 overflow-hidden rounded-[36px] border border-brand-border bg-brand-surface shadow-[0_25px_80px_rgba(15,23,42,0.10)] lg:grid-cols-[510px_1fr] xl:grid-cols-[550px_1fr]">
        {/* ====================================================================
            LEFT COLUMN: SIGN IN FORM
            ==================================================================== */}
        <div className="flex flex-col justify-between bg-brand-surface p-7 sm:p-9 lg:p-11 xl:p-12">
          <div>
            {/* Brand Logo */}
            <Link href="/" className="inline-block">
              <Image
                src="/images/manob-prohori-logo-v3.png"
                alt="Manob Prohori"
                width={220}
                height={75}
                priority
                className="h-auto w-[185px] sm:w-[210px] object-contain"
              />
            </Link>

            {/* Heading & Subtitle */}
            <div className="mt-8">
              <h1 className="text-3xl font-black tracking-tight text-brand-navy sm:text-[34px]">
                Welcome <span className="text-brand-red">Back</span>
              </h1>
              <p className="mt-1.5 text-sm font-medium text-brand-text-secondary">
                Sign in to continue to your account
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
              {/* Field 1: Email Address / Phone */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-brand-text-primary">
                  Email Address or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-text-muted" />
                  <input
                    type="text"
                    placeholder="Enter your phone or email"
                    {...register("identifier")}
                    className={`w-full rounded-xl border bg-slate-50/50 py-3 pl-10 pr-3 text-sm font-medium text-brand-text-primary placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.identifier
                        ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20"
                        : "border-brand-border focus:border-brand-red focus:bg-white focus:ring-brand-red/20"
                    }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-[11px] font-medium text-brand-red">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Field 2: Password */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-brand-text-primary">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full rounded-xl border bg-slate-50/50 py-3 pl-10 pr-10 text-sm font-medium text-brand-text-primary placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20"
                        : "border-brand-border focus:border-brand-red focus:bg-white focus:ring-brand-red/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] font-medium text-brand-red">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-brand-red hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-brand-red py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-red/25 transition hover:bg-brand-red-dark active:scale-[0.99] disabled:opacity-70"
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

              {/* Section Divider: or continue with */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-border" />
                </div>
                <span className="relative bg-brand-surface px-3 text-xs font-semibold text-brand-text-muted">
                  or continue with
                </span>
              </div>

              {/* Social Login Options Row (Google, Facebook, Apple) */}
              <div className="flex items-center justify-center gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  aria-label="Sign in with Google"
                  className="grid size-12 place-items-center rounded-xl border border-brand-border bg-white shadow-xs transition hover:bg-slate-50 active:scale-95"
                >
                  <svg className="size-4.5" viewBox="0 0 24 24">
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
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  aria-label="Sign in with Facebook"
                  className="grid size-12 place-items-center rounded-xl border border-brand-border bg-white shadow-xs transition hover:bg-slate-50 active:scale-95"
                >
                  <svg
                    className="size-5 text-[#1877F2] fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  aria-label="Sign in with Apple"
                  className="grid size-12 place-items-center rounded-xl border border-brand-border bg-white shadow-xs transition hover:bg-slate-50 active:scale-95"
                >
                  <svg
                    className="size-5 text-slate-900 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.61-.74 1.04-1.78.92-2.87-.9.04-2.02.6-2.67 1.34-.58.65-1.09 1.71-.95 2.76 1.01.08 2.07-.51 2.7-1.23z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Footer: Don't have an account link */}
          <div className="mt-8 text-center text-xs font-semibold text-brand-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-extrabold text-brand-red hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* ====================================================================
            RIGHT COLUMN: CLEAN RESCUE OPERATIONS IMAGE ASSET
            ==================================================================== */}
        <div className="relative hidden min-h-[700px] overflow-hidden lg:block">
          <Image
            src="/images/signup-bg-image.png"
            alt="Manob Prohori Rescue Team"
            fill
            priority
            className="pointer-events-none object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
