import type { Metadata } from "next";
import { MasterSignupComponent } from "@/views/signup/master.signup";

// ============================================================================
// Page Metadata
// ============================================================================
export const metadata: Metadata = {
  title: "Sign Up - Manob Prohori",
  description:
    "Create your account on Manob Prohori to connect with verified volunteers, hospitals, and emergency services.",
};

// ============================================================================
// Signup Page Entry Point
// ============================================================================
export default function SignupPage() {
  return <MasterSignupComponent />;
}
