import { Suspense } from "react";

import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account",
  description: "Join MeraSEP and start showing up for community events across Bangladesh.",
};

interface RegisterPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function BrandPanel({ searchParams }: RegisterPageProps) {
  const params = searchParams ? await searchParams : {};
  const rawCallback =
    typeof params.callbackUrl === "string"
      ? params.callbackUrl
      : typeof params.redirect === "string"
        ? params.redirect
        : undefined;
  const loginHref = rawCallback
    ? `/login?callbackUrl=${encodeURIComponent(rawCallback)}`
    : "/login";

  return <AuthBrandPanel mode="register" alternateHref={loginHref} />;
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/60 shadow-2xl backdrop-blur-xl lg:grid lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-6 xl:col-span-6">
          <Suspense
            fallback={
              <div className="h-full min-h-[400px] w-full animate-pulse bg-[#07130F]" />
            }
          >
            <BrandPanel searchParams={searchParams} />
          </Suspense>
        </div>

        <section className="flex flex-1 flex-col justify-center p-6 sm:p-10 lg:col-span-6 lg:p-12 xl:col-span-6">
          <div className="mx-auto w-full max-w-md">
            <div className="space-y-2">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Create your account
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Join volunteers across Bangladesh in under a minute.
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-2xl bg-muted/40" />
                }
              >
                <RegisterForm />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
