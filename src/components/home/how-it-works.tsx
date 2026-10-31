"use client";

import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
  {
    number: "01",
    title: "Sign up or sign in",
    body: "Create an account in under a minute, or browse as a guest.",
  },
  {
    number: "02",
    title: "Find or create an event",
    body: "Filter by district and type, or publish your own cause for the community.",
  },
  {
    number: "03",
    title: "Join with one click",
    body: "Save your spot. We'll remind you as the date approaches.",
  },
  {
    number: "04",
    title: "Show up and make impact",
    body: "Meet your neighbours, serve together, and watch the numbers grow.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From idea to impact in four steps."
          subtitle="No committees, no paperwork. Just people showing up for their neighbourhood."
        />

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <RevealItem key={step.number}>
              <div className="relative h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                <span className="font-heading text-5xl font-extrabold text-primary/15">
                  {step.number}
                </span>
                <h3 className="mt-3 font-heading text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
                {index < STEPS.length - 1 ? (
                  <ArrowRight
                    className="absolute top-6 right-4 hidden size-4 text-muted-foreground/40 lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
