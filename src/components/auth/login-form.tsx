"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";

import { authClient } from "@/lib/better-auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { PasswordField } from "@/components/auth/password-field";
import { useAuth } from "@/hooks/use-auth";

function getSafeCallbackUrl(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) {
    return raw;
  }
  return "/";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl") ?? searchParams.get("redirect");
  const safeCallback = getSafeCallbackUrl(rawCallback);
  const registerHref = rawCallback
    ? `/register?callbackUrl=${encodeURIComponent(safeCallback)}`
    : "/register";

  const { user, isLoading } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(safeCallback);
    }
  }, [user, isLoading, router, safeCallback]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: LoginValues) => {
    const toastId = toast.loading("Signing in…");
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        const message = error.message || "Invalid credentials. Please try again.";
        toast.error(message, { id: toastId });
        form.setError("root", { type: "server", message });
        return;
      }

      void data;
      toast.success("Signed in successfully", { id: toastId });
      router.push(safeCallback);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      toast.error(message, { id: toastId });
      form.setError("root", { type: "server", message });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: safeCallback,
      });

      if (res?.error) {
        toast.error(res.error.message || "Failed to sign in with Google. Please try again.");
        setIsGoogleLoading(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in with Google. Please try again.";
      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  const onError = () => {
    toast.error("Please fix the highlighted fields and try again.");
  };

  if (!isLoading && user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <LoaderCircle className="size-6 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-4 sm:gap-5"
      noValidate
    >
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <PasswordField
        id="login-password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {errors.root?.message ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive"
        >
          {errors.root.message}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || isGoogleLoading}
        className="mt-1 h-11 w-full rounded-xl font-semibold"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/70" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 font-medium text-muted-foreground">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={isSubmitting || isGoogleLoading}
        onClick={handleGoogleSignIn}
        className="h-11 w-full rounded-xl font-semibold"
      >
        {isGoogleLoading ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Connecting to Google…
          </>
        ) : (
          <>
            <GoogleMark />
            Continue with Google
          </>
        )}
      </Button>

      <p className="pt-1 text-center text-sm text-muted-foreground">
        New to MeraSEP?{" "}
        <Link
          href={registerHref}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}
