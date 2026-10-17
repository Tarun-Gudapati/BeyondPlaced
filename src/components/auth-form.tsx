"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup, type AuthState } from "@/app/actions/auth";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === "login" ? login : signup, undefined);
  const isSignup = mode === "signup";
  const other = isSignup ? "/login" : "/signup";
  const nextQuery = next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-6 py-2">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">{isSignup ? "Create your free account" : "Welcome back"}</h1>
          <p className="text-sm text-muted-foreground">
            {isSignup
              ? "Save your progress, keep your streak and unlock your certificate."
              : "Log in to continue where you left off."}
          </p>
        </div>
        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" autoComplete="name" placeholder="Priya Sharma" defaultValue={state?.fields?.name} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@college.edu" defaultValue={state?.fields?.email} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder={isSignup ? "At least 8 characters" : ""}
              required
            />
          </div>
          {state?.error && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          )}
          <Button type="submit" size="lg" className="h-10 w-full" disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {isSignup ? "Create account" : "Log in"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account? " : "New to ShipAI? "}
          <Link href={`${other}${nextQuery}`} className="text-primary hover:underline">
            {isSignup ? "Log in" : "Create a free account"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
