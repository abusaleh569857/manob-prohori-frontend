"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Signin error:", err);
      toast.error(err?.message || "An unexpected error occurred. Please try again.");
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
