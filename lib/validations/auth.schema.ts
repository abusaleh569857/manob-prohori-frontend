import { z } from "zod";

export const phoneRegex = /^(?:\+?880|0)?1[3-9]\d{8}$/;

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(150, "Full name is too long"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        phoneRegex,
        "Enter a valid 11-digit Bangladeshi phone number (e.g. 01712345678)"
      ),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  identifier: z
    .string()
    .min(1, "Please enter your phone number or email address"),
  password: z.string().min(1, "Please enter your password"),
  rememberMe: z.boolean().optional(),
});

export type SigninFormValues = z.infer<typeof signinSchema>;
