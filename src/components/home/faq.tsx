"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const FAQS = [
  {
    question: "Is MeraSEP free to use?",
    answer:
      "Yes. Creating an account, browsing events and joining them are all free. Organisers never pay to publish an event.",
  },
  {
    question: "Who can create an event?",
    answer:
      "Anyone with an account. You can create cleanups, plantation drives, donation runs, health camps, food distributions and more.",
  },
  {
    question: "How do I join an event?",
    answer:
      "Open an event page and click Join. Your spot is saved to your profile and you'll see it under Joined Events.",
  },
  {
    question: "Can I edit or remove an event I created?",
    answer:
      "Yes. Manage Events lists only your own events, where you can update details or delete them with a confirmation.",
  },
  {
    question: "What happens if an event is cancelled?",
    answer:
      "Organisers can delete the event; joined volunteers will see it removed from their Joined Events list.",
  },
  {
    question: "Do I need to be part of an NGO?",
    answer:
      "Not at all. Most events are run by individuals and small neighbourhood groups. NGOs are welcome too.",
  },
] as const;

export function Faq() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered."
          subtitle="Everything you need to know before your first event."
        />

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <Accordion className="w-full">
            {FAQS.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`item-${index}`}
                className="border-b border-border/60"
              >
                <AccordionTrigger className="py-5 text-left font-heading text-base font-semibold text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
