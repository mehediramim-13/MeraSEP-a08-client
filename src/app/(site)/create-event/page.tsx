"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PrivateRoute } from "@/components/auth/private-route";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EventForm } from "@/components/events/event-form";
import { createEvent } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import type { EventFormValues } from "@/lib/validations";

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (values: EventFormValues) => {
    if (!user) {
      toast.error("You must be signed in to create an event.");
      return;
    }
    try {
      await createEvent({
        ...values,
        creatorEmail: user.email,
        creatorName: user.name,
      });
      toast.success("Event created. It's now live for the community.");
      router.push("/events");
    } catch {
      toast.error("Could not create the event. Please try again.");
    }
  };

  return (
    <PrivateRoute>
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Create event"
            title="Start something in your neighbourhood."
            subtitle="Fill in the details below. Your event will be visible to the whole community right away."
          />

          <div className="mt-10">
            <EventForm submitLabel="Create event" onSubmit={handleSubmit} />
          </div>
        </Container>
      </section>
    </PrivateRoute>
  );
}
