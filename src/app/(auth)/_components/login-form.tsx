"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login } from "../../actions/auth"; // We will fix the import path if needed
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, null);

  useEffect(() => {
    if (state?.success && state.role) {
      toast.success("Login successful");
      if (state.role === "SYSTEM_ADMIN") {
        router.push("/system");
      } else if (state.role === "PARTNER_ADMIN") {
        router.push("/partner");
      } else {
        // Fallback or handle other roles
        toast.error("Unauthorized role");
      }
    } else if (state?.success === false && state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="flex flex-row items-center space-x-2">
        <Checkbox id="remember" name="remember" />
        <Label htmlFor="remember" className="text-muted-foreground text-sm font-medium">
          Remember me for 30 days
        </Label>
      </div>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
