"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
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
  Loader2,
  Siren,
  Droplets,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  signupSchema,
  type SignupFormValues,
} from "@/lib/validations/auth.schema";
import { useRegisterMutation } from "@/redux/api/authApi";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function MasterSignupComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const router = useRouter();
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      accountType: "USER",
      bloodGroup: "O+",
      password: "",
      confirmPassword: "",
      agreeToTerms: true,
    },
    mode: "onTouched",
  });

  const selectedAccountType = watch("accountType") || "USER";

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const response = await registerUser({
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        password: values.password,
        accountType: values.accountType,
        bloodGroup: values.accountType === "BLOOD_DONOR" ? values.bloodGroup : undefined,
      }).unwrap();

      if (response.success) {
        if (values.accountType === "VOLUNTEER") {
          toast.success("Account created! Your volunteer application has been submitted for admin verification.");
        } else if (values.accountType === "BLOOD_DONOR") {
          toast.success("Account created! Your blood donor profile is registered for verification.");
        } else {
          toast.success("Account created successfully! Signing you in...");
        }
        setIsSigningIn(true);

        const signInResult = await signIn("credentials", {
          identifier: values.phone,
          password: values.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          toast.success("Welcome to Manob Prohori!");
          if (values.accountType === "VOLUNTEER") {
            router.push("/volunteer/dashboard");
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        } else {
          toast.info("Account created. Please sign in to continue.");
          router.push("/signin");
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Registration failed. Please check your details.";
      toast.error(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  const isLoading = isRegistering || isSigningIn;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-brand-canvas px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* Main Container */}
      <div className="relative mx-auto grid w-full max-w-332.5 grid-cols-1 overflow-hidden rounded-[36px] border border-brand-border bg-brand-surface shadow-[0_25px_80px_rgba(15,23,42,0.10)] lg:grid-cols-[510px_1fr] xl:grid-cols-[550px_1fr]">
        {/* ====================================================================
            LEFT COLUMN: SIGNUP REGISTRATION FORM
            ==================================================================== */}
        <div className="flex flex-col justify-between bg-brand-surface p-7 sm:p-9 lg:p-10 xl:p-11">
          <div>
            {/* Brand Logo */}
            <Link href="/" className="inline-block">
              <Image
                src="/images/manob-prohori-logo-v3.png"
                alt="Manob Prohori"
                width={220}
                height={75}
                priority
                className="h-auto w-46.25 sm:w-51.25 object-contain"
              />
            </Link>

            {/* Form Heading & Subtitle */}
            <div className="mt-6">
              <h1 className="text-3xl font-black tracking-tight text-brand-navy sm:text-[32px]">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm font-medium text-brand-text-secondary">
                Join Manob Prohori and be a part of a safer community.
              </p>
            </div>

            {/* Social Authentication Buttons */}
            <div className="mt-5 space-y-2.5">
              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={() => signIn("google")}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-red px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-red/20 transition hover:bg-brand-red-dark active:scale-[0.99] cursor-pointer"
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
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-[0.99] cursor-pointer"
              >
                <svg
                  className="size-5 text-[#1877F2] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Sign up with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-border" />
              </div>
              <span className="relative bg-brand-surface px-4 text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                or
              </span>
            </div>

            {/* Registration Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              {/* --------------------------------------------------------------
                  1. ROLE SELECTION (Citizen, Volunteer, Blood Donor)
                  -------------------------------------------------------------- */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-brand-text-primary">
                  I want to join as: <span className="text-brand-red">*</span>
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
                        : "border-brand-border bg-white text-slate-600 hover:bg-slate-50"
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
                        ? "border-brand-red bg-brand-red text-white shadow-md ring-2 ring-brand-red/15"
                        : "border-brand-border bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Siren className={cn("size-5", selectedAccountType === "VOLUNTEER" ? "text-white" : "text-brand-red")} />
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
                        : "border-brand-border bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Droplets className={cn("size-5", selectedAccountType === "BLOOD_DONOR" ? "text-white" : "text-rose-500")} />
                    <span className="mt-1 text-xs font-extrabold">Blood Donor</span>
                    <span className={cn("text-[10px]", selectedAccountType === "BLOOD_DONOR" ? "text-rose-100" : "text-slate-400")}>
                      Life Saver
                    </span>
                  </button>
                </div>

                {/* Verification Notice */}
                {selectedAccountType !== "USER" && (
                  <div className="mt-2 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200/80 p-2.5 text-xs text-amber-800">
                    <Info className="size-4 shrink-0 text-amber-600" />
                    <span>
                      <strong>Verification Notice:</strong> {selectedAccountType === "VOLUNTEER" ? "Volunteer" : "Blood Donor"} registrations require Admin Verification upon signup.
                    </span>
                  </div>
                )}
              </div>

              {/* Row 1: Full Name & Email Address */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand-text-primary">
                    Full Name <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-text-muted" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      {...register("fullName")}
                      className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-brand-text-primary placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20"
                          : "border-brand-border focus:border-brand-red focus:bg-white focus:ring-brand-red/20"
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-[11px] font-medium text-brand-red">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand-text-primary">
                    Email Address <span className="text-xs font-normal text-slate-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-text-muted" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...register("email")}
                      className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-brand-text-primary placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20"
                          : "border-brand-border focus:border-brand-red focus:bg-white focus:ring-brand-red/20"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-[11px] font-medium text-brand-red">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone Number & Conditional Blood Group */}
              <div className={cn("grid grid-cols-1 gap-3", selectedAccountType === "BLOOD_DONOR" && "sm:grid-cols-3")}>
                {/* Phone Number */}
                <div className={selectedAccountType === "BLOOD_DONOR" ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-xs font-bold text-brand-text-primary">
                    Phone Number <span className="text-brand-red">*</span>
                  </label>
                  <div
                    className={`flex rounded-xl border bg-slate-50/50 transition focus-within:bg-white focus-within:ring-2 ${
                      errors.phone
                        ? "border-brand-red focus-within:border-brand-red focus-within:ring-brand-red/20"
                        : "border-brand-border focus-within:border-brand-red focus-within:bg-white focus-within:ring-brand-red/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 border-r border-brand-border px-3 py-2.5 text-brand-text-primary">
                      <Phone className="size-3.5 text-brand-text-muted" />
                      <span className="text-xs font-bold">+880</span>
                      <ChevronDown className="size-3 text-brand-text-muted" />
                    </div>
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      {...register("phone")}
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-medium text-brand-text-primary placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-[11px] font-medium text-brand-red">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Blood Group Select for Blood Donors */}
                {selectedAccountType === "BLOOD_DONOR" && (
                  <div>
                    <label className="mb-1 block text-xs font-bold text-brand-text-primary">
                      Blood Group <span className="text-brand-red">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register("bloodGroup")}
                        className="w-full appearance-none rounded-xl border border-brand-border bg-slate-50/50 px-3.5 py-2.5 text-sm font-extrabold text-brand-navy focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-text-muted" />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Password */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand-text-primary">
                    Password <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...register("password")}
                      className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm font-medium text-brand-text-primary placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                        errors.password
                          ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20"
                          : "border-brand-border focus:border-brand-red focus:bg-white focus:ring-brand-red/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-primary cursor-pointer"
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

                {/* Confirm Password */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-brand-text-primary">
                    Confirm Password <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-text-muted" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...register("confirmPassword")}
                      className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm font-medium text-brand-text-primary placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
                        errors.confirmPassword
                          ? "border-brand-red focus:border-brand-red focus:ring-brand-red/20"
                          : "border-brand-border focus:border-brand-red focus:bg-white focus:ring-brand-red/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-text-primary cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] font-medium text-brand-red">
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
                    className="size-4 rounded border-brand-border text-brand-red accent-brand-red focus:ring-brand-red cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs font-medium text-brand-text-secondary"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-bold text-brand-red hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-bold text-brand-red hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-[11px] font-medium text-brand-red">
                    {errors.agreeToTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-xl bg-brand-red py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand-red/25 transition hover:bg-brand-red-dark active:scale-[0.99] disabled:opacity-70 cursor-pointer"
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

            {/* Bottom Sign In Link */}
            <div className="mt-5 text-center text-xs text-brand-text-secondary">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-brand-red hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* ====================================================================
            RIGHT COLUMN: HERO SHOWCASE WITH FLOATING BADGES
            ==================================================================== */}
        <div className="relative hidden lg:block">
          {/* Background Visual Asset */}
          <div className="relative h-full w-full">
            <Image
              src="/images/signup-bg-image.png"
              alt="Community Volunteers in Action"
              fill
              priority
              className="object-cover object-center"
            />
            {/* Ambient Multi-layer Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />
          </div>

          {/* Floating UI Badge 1: 24/7 Fast Response */}
          <div className="absolute right-8 top-12 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 p-3.5 shadow-xl backdrop-blur-md">
            <div className="grid size-10 place-items-center rounded-xl bg-brand-red-soft text-brand-red shadow-xs">
              <Zap className="size-5" />
            </div>
            <div>
              <p className="text-xs font-black text-brand-navy">Fast Response</p>
              <p className="text-[11px] font-bold text-slate-500">
                Average &lt; 3 mins dispatch
              </p>
            </div>
          </div>

          {/* Floating UI Badge 2: Verified Volunteer Network */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 p-3.5 shadow-xl backdrop-blur-md">
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 shadow-xs">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-black text-brand-navy">
                Verified Responders
              </p>
              <p className="text-[11px] font-bold text-slate-500">
                100% Background Verified
              </p>
            </div>
          </div>

          {/* Floating UI Badge 3: Blood Donor Network */}
          <div className="absolute right-8 bottom-32 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 p-3.5 shadow-xl backdrop-blur-md">
            <div className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-600 shadow-xs">
              <HandHeart className="size-5" />
            </div>
            <div>
              <p className="text-xs font-black text-brand-navy">Blood Donors</p>
              <p className="text-[11px] font-bold text-slate-500">
                12,000+ Ready to Donate
              </p>
            </div>
          </div>

          {/* Bottom Hero Text Banner */}
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <h2 className="text-2xl font-black leading-tight tracking-tight">
              Stand with your community.
              <br />
              Save lives together.
            </h2>
            <p className="mt-2 text-xs font-medium text-white/80">
              Join thousands of citizens, certified volunteers, and blood donors
              nationwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
