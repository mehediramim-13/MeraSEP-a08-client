import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="mesh-glow grain-overlay relative flex min-h-svh flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo href="/" size="md" />
        <ThemeToggle />
      </div>

      <Container className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="relative flex items-center justify-center">
          <span
            aria-hidden="true"
            className="font-heading text-[7.5rem] leading-none font-extrabold tracking-tighter text-primary/10 select-none sm:text-[11rem]"
          >
            404
          </span>
          <span className="absolute inline-flex items-center justify-center rounded-full bg-card p-4 shadow-lift ring-1 ring-border">
            <Logo size="lg" showWordmark={false} />
          </span>
        </div>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          <Compass className="size-3.5" aria-hidden="true" />
          Off the map
        </span>

        <h1 className="mt-4 max-w-2xl font-heading text-3xl font-extrabold text-foreground sm:text-5xl">
          This cause isn&apos;t on the map.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          The page you are looking for may have ended, moved, or the link has a typo. There are
          plenty of neighbourhoods still waiting for a hand.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button render={<Link href="/events" />} nativeButton={false} size="lg" className="gap-2">
            Explore events
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="outline" render={<Link href="/" />} nativeButton={false} size="lg">
            Back to home
          </Button>
        </div>
      </Container>
    </main>
  );
}
