"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check, LoaderCircle, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, PASSWORD_RULES, type RegisterValues } from "@/lib/validations";
import { getInitials } from "@/lib/format";
import { PasswordField } from "@/components/auth/password-field";
import { authClient } from "@/lib/better-auth-client";
import { useAuth } from "@/hooks/use-auth";

function getSafeCallbackUrl(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) {
    return raw;
  }
  return "/";
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl") ?? searchParams.get("redirect");
  const safeCallback = getSafeCallbackUrl(rawCallback);
  const loginHref = rawCallback
    ? `/login?callbackUrl=${encodeURIComponent(safeCallback)}`
    : "/login";

  const { user, isLoading } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(safeCallback);
    }
  }, [user, isLoading, router, safeCallback]);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", image: "", password: "" },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const imageValue = useWatch({ control, name: "image" }) ?? "";
  const nameValue = useWatch({ control, name: "name" }) ?? "";

  const photoPreview = imageValue.trim();

  const onSubmit = async (values: RegisterValues) => {
    const toastId = toast.loading("Creating your account…");
    try {
      const { data, error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        image: values.image?.trim() || undefined,
      });

      if (error) {
        const message = error.message || "Failed to create account. Please try again.";
        toast.error(message, { id: toastId });
        if (message.toLowerCase().includes("email")) {
          form.setError("email", { type: "server", message });
        }
        form.setError("root", { type: "server", message });
        return;
      }

      void data;
      toast.success("Account created successfully! Welcome to MeraSEP.", { id: toastId });
      router.push(safeCallback);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create account. Please try again.";
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
      <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-muted/40 p-3">
        <Avatar className="size-12 ring-2 ring-background">
          <AvatarImage src={photoPreview} alt="" />
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {getInitials(nameValue || "New Volunteer")}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Your photo preview</p>
          <p className="text-xs text-muted-foreground">
            Optional: paste an image URL and it will show up here.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="register-name" className="text-sm font-medium text-foreground">
          Full name
        </label>
        <div className="relative">
          <UserIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Nusrat Jahan"
            aria-invalid={!!errors.name}
            className="pl-10"
            {...register("name")}
          />
        </div>
        {errors.name ? (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="register-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="register-email"
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

      <div className="space-y-1.5">
        <label htmlFor="register-image" className="text-sm font-medium text-foreground">
          Photo URL <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="register-image"
          type="url"
          autoComplete="photo"
          placeholder="https://images.unsplash.com/..."
          aria-invalid={!!errors.image}
          {...register("image")}
        />
        {errors.image ? (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.image.message}
          </p>
        ) : null}
      </div>

      <PasswordField
        id="register-password"
        label="Password"
        placeholder="Create a strong password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <ul className="space-y-1.5 rounded-xl border border-border/70 bg-muted/40 p-3">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(passwordValue);
          return (
            <li
              key={rule.id}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className={
                  passed
                    ? "inline-flex size-4 items-center justify-center rounded-full bg-primary/15 text-primary"
                    : "inline-flex size-4 items-center justify-center rounded-full bg-muted text-muted-foreground"
                }
              >
                <Check className="size-3" aria-hidden="true" />
              </span>
              <span className={passed ? "text-foreground" : "text-muted-foreground"}>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>

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
            Creating account…
          </>
        ) : (
          "Create account"
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
        Already a volunteer?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
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
