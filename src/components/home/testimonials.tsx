"use client";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const TESTIMONIALS = [
  {
    quote:
      "I joined a cleanup in Sadarghat one Saturday. By the next month I was leading one in my own ward. MeraSEP made the first step small enough to take.",
    name: "Rafiq Ahmed",
    role: "Volunteer, Rangpur Division",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&h=96&q=80",
  },
  {
    quote:
      "We used to organise donation drives over WhatsApp threads that got lost. Now our entire volunteer base lives in one place.",
    name: "Nusrat Jahan",
    role: "Organiser, Prottasha Foundation",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&h=96&q=80",
  },
  {
    quote:
      "My students joined a plantation drive through MeraSEP and asked to do another one the very next week. That's the kind of habit we want.",
    name: "Tanvir Hossain",
    role: "Teacher, Chattogram",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80",
  },
] as const;

export function Testimonials() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Voices"
          title="People who showed up."
          subtitle="Real words from volunteers and organisers across Bangladesh."
        />

        <Reveal className="mt-10">
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.name}
                className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
