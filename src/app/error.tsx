"use client";

import Link from "next/link";
import { Home, RefreshCw, TriangleAlert } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main
      id="main-content"
      className="mesh-glow grain-overlay relative flex min-h-svh flex-col overflow-hidden"
    >
      <div className="flex items-center px-4 py-5 sm:px-6 lg:px-8">
        <Logo href="/" size="md" />
      </div>

      <Container className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-lg rounded-3xl border border-border/70 bg-card p-7 text-center shadow-lift sm:p-10">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
            A small hitch, not the end of the road.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            We could not load this page just now. Your events and saved items are safe — try again,
            or head back to the homepage and pick up where you left off.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={reset} size="lg" className="gap-2">
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/" />} nativeButton={false} className="gap-2">
              <Home aria-hidden="true" />
              Back home
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
