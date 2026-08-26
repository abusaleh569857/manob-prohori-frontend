import type { Metadata } from "next";
import { MasterSigninComponent } from "@/views/signin/master.signin";

// ============================================================================
// Page Metadata
// ============================================================================
export const metadata: Metadata = {
  title: "Sign In - Manob Prohori",
  description:
    "Sign in to your Manob Prohori account to connect with verified volunteers, hospitals, and emergency services.",
};

// ============================================================================
// Signin Page Entry Point
// ============================================================================
export default function SigninPage() {
  return <MasterSigninComponent />;
}
