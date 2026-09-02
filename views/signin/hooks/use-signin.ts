"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  signinSchema,
  type SigninFormValues,
} from "@/lib/validations/auth.schema";

export function useSignin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const hasShownRedirectToast = useRef(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Show friendly notification if redirected from a protected page
  useEffect(() => {
    const callback = searchParams.get("callbackUrl");
    if (callback && !hasShownRedirectToast.current) {
      hasShownRedirectToast.current = true;
      if (callback.includes("/incidents/create")) {
        toast.info("Please sign in first to report an emergency.", {
          id: "auth-required-toast",
        });
      } else if (
        callback.includes("/dashboard") ||
        callback.includes("/admin") ||
        callback.includes("/incidents/my")
      ) {
        toast.info("Please sign in first to access this page.", {
          id: "auth-required-toast",
        });
      }
    }
  }, [searchParams]);

  const form = useForm<SigninFormValues>({
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
        toast.error(result.error || "Invalid phone/email or password.");
        return;
      }

      if (result?.ok) {
        toast.success("Login successful! Welcome back.");

        // Fetch the fresh session to determine roles accurately
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

        let targetUrl = rawCallbackUrl || "/dashboard";

        // If user is ADMIN, priority always goes to /admin/dashboard
        if (isAdmin && (!rawCallbackUrl || rawCallbackUrl === "/" || rawCallbackUrl === "/dashboard")) {
          targetUrl = "/admin/dashboard";
        }

        // Trigger full navigation so all components mount with the new session
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

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    showPassword,
    setShowPassword,
  };
}
