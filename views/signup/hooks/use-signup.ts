"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  signupSchema,
  type SignupFormValues,
} from "@/lib/validations/auth.schema";
import { useRegisterMutation } from "@/redux/api/authApi";

export function useSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();

  const form = useForm<SignupFormValues>({
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
          toast.success("Account created! Signing you in...");
        }
        setIsSigningIn(true);

        // Auto-login flow with NextAuth Auth.js credentials provider
        const signInResult = await signIn("credentials", {
          identifier: values.phone,
          password: values.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          if (values.accountType === "VOLUNTEER") {
            router.push("/volunteer/dashboard");
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        } else {
          toast.info("Account created. Please log in with your credentials.");
          router.push("/signin");
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Registration failed. Please check your information.";
      toast.error(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: isRegistering || isSigningIn,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
}
