import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { Container } from "@/components/shared/container";
import { CurrentYear } from "@/components/shared/current-year";
import { Logo } from "@/components/shared/logo";
import { SOCIAL_ICONS } from "@/components/shared/social-icons";
import {
  FOOTER_INVOLVED_LINKS,
  FOOTER_QUICK_LINKS,
  SITE,
  SOCIAL_LINKS,
} from "@/lib/constants";

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex w-fit items-center gap-1.5 text-sm text-[#E8F1EC]/65 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:outline-none"
    >
      <span className="h-px w-0 bg-emerald-300/80 transition-all duration-300 group-hover:w-3" />
      {children}
    </Link>
  );
}

function ColumnHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-heading text-xs font-semibold tracking-[0.18em] text-[#E8F1EC]/50 uppercase">
      {children}
    </h3>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#07130F] text-[#E8F1EC]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 size-[28rem] rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute right-0 bottom-0 size-[22rem] rounded-full bg-amber-400/10 blur-[100px]" />
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-10 text-background sm:h-14">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          fill="currentColor"
          className="size-full"
        >
          <path d="M0 0h1440v20c-180 52-400 12-640 6S200 76 0 34V0Z" />
        </svg>
      </div>

      <Container className="relative z-10 pt-24 pb-8 sm:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.25fr]">
          <div className="flex flex-col items-start gap-5">
            <Logo href="/" size="md" tone="inverse" />
            <p className="max-w-sm text-sm leading-relaxed text-[#E8F1EC]/65">
              A volunteer-run platform for social service in Bangladesh. Find a cause near you,
              bring a friend, and leave your neighbourhood a little better than you found it.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`MeraSEP on ${social.label}`}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#E8F1EC]/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-emerald-400/10 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:outline-none"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
            <p className="text-xs text-[#E8F1EC]/40">
              Registered as a community initiative · Dhaka, Bangladesh
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <ColumnHeading>Explore</ColumnHeading>
            <nav aria-label="Footer quick links" className="flex flex-col gap-3">
              {FOOTER_QUICK_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <ColumnHeading>Get involved</ColumnHeading>
            <nav aria-label="Get involved links" className="flex flex-col gap-3">
              {FOOTER_INVOLVED_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
              <FooterLink href="/events">Browse all events</FooterLink>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <ColumnHeading>Visit or call</ColumnHeading>
            <address className="flex flex-col gap-3 text-sm not-italic text-[#E8F1EC]/65">
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                <span>{SITE.contact.address}</span>
              </span>
              <a
                href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Phone className="size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                {SITE.contact.phone}
              </a>
              <a
                href={`mailto:${SITE.contact.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                {SITE.contact.email}
              </a>
            </address>
            <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#E8F1EC]/50">
              Office hours: Saturday–Thursday, 10:00 AM – 6:00 PM
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#E8F1EC]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> MeraSEP. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5">
            Made with
            <Heart className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            by volunteers in Dhaka
          </p>
        </div>
      </Container>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 font-heading text-[19vw] leading-[0.7] font-extrabold whitespace-nowrap text-white/[0.025] select-none"
      >
        MeraSEP
      </span>
    </footer>
  );
}
