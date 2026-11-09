import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage({ searchParams }: PageProps<"/signup">) {
  return <AuthPage mode="signup" searchParams={searchParams} />;
}
