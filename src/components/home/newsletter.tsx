"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderCircle, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { newsletterSchema, type NewsletterValues } from "@/lib/validations";

export function Newsletter() {
  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: NewsletterValues) => {
    void values;
    // TODO(mehedi): POST the email to the newsletter endpoint. For now we only
    // validate and acknowledge, as the backend does not exist yet.
    toast.success("You're on the list! Watch your inbox for the next update.");
    reset();
  };

  const onError = () => {
    toast.error("Please enter a valid email address.");
  };

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-highlight/10 p-8 sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-highlight/20 blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Reveal>
              <SectionHeading
                align="left"
                title="Get the next event in your inbox."
                subtitle="A short monthly note with upcoming drives, volunteer stories and ways to help near you. No spam, ever."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="flex flex-col gap-3 sm:flex-row"
                noValidate
              >
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      className="h-12 rounded-xl bg-background/80 pl-10 backdrop-blur"
                      {...register("email")}
                    />
                  </div>
                  {errors.email ? (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-12 rounded-xl px-6 font-semibold shadow-lg shadow-primary/15"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      Subscribing…
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                We respect your inbox. Unsubscribe in one click, anytime.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
