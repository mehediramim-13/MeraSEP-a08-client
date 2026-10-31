"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, HeartHandshake, MapPin, Sparkles } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { IMPACT_STATS } from "@/lib/constants";

interface AuthBrandPanelProps {
  mode: "login" | "register";
  alternateHref?: string;
}

const COPY = {
  login: {
    eyebrow: "Welcome back",
    headline: "Your neighbourhood is waiting for a hand.",
    body:
      "Sign in to see the events you joined, the ones you created, and the people you served alongside.",
    cta: "New here? Create an account",
    ctaHref: "/register",
  },
  register: {
    eyebrow: "Join the movement",
    headline: "Small acts. Real neighbourhoods. Measured impact.",
    body:
      "Create an account in under a minute and start showing up for cleanups, health camps, donation drives and more across Bangladesh.",
    cta: "Already a volunteer? Sign in",
    ctaHref: "/login",
  },
} as const;

export function AuthBrandPanel({ mode, alternateHref }: AuthBrandPanelProps) {
  const copy = COPY[mode];
  const ctaHref = alternateHref ?? copy.ctaHref;

  return (
    <aside className="relative flex w-full flex-1 flex-col justify-between overflow-hidden bg-[#07130F] p-6 text-[#E8F1EC] sm:p-8 lg:p-10 xl:p-12">
      {/* Animated mesh gradient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-32 -left-20 size-[34rem] rounded-full bg-emerald-500/25 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 bottom-0 size-[28rem] rounded-full bg-amber-400/20 blur-[110px]"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 size-[20rem] rounded-full bg-emerald-300/10 blur-[90px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
      </div>

      {/* Top section: Header with Logo */}
      <div className="relative z-10 mb-5 flex items-center justify-between sm:mb-6">
        <Logo href="/" size="md" tone="inverse" priority />
        <Link
          href={ctaHref}
          className="text-xs font-semibold text-emerald-300 underline-offset-4 hover:underline sm:text-sm lg:hidden"
        >
          {mode === "register" ? "Sign in" : "Create account"}
        </Link>
      </div>

      {/* Middle content: Badge, Heading, Paragraph, Stats */}
      <div className="relative z-10 flex w-full flex-col">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-emerald-200 uppercase backdrop-blur"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            {copy.eyebrow}
          </motion.span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 font-heading text-2xl font-extrabold leading-tight tracking-tight text-white break-words sm:mt-5 sm:text-3xl lg:text-3xl xl:text-4xl"
        >
          {copy.headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-3.5 text-sm leading-relaxed text-[#E8F1EC]/75 sm:mt-4 sm:text-base"
        >
          {copy.body}
        </motion.p>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-5 grid w-full grid-cols-2 gap-3 sm:mt-6 lg:grid-cols-4"
        >
          {IMPACT_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur sm:p-3.5"
            >
              <p className="font-heading text-lg font-extrabold text-white tracking-tight sm:text-xl">
                {stat.value.toLocaleString()}
                {stat.suffix}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-[#E8F1EC]/65">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer on desktop: Testimonial + Location row */}
      <div className="relative z-10 mt-5 hidden w-full flex-col gap-4 sm:mt-6 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur xl:p-5"
        >
          <p className="text-xs leading-relaxed text-[#E8F1EC]/80 sm:text-sm">
            &ldquo;I joined a winter blanket drive in Kurigram last December. By
            February I was organising one in my own ward. MeraSEP made the first
            step small enough to take.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
              <HeartHandshake className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white sm:text-sm">Rafiq Ahmed</p>
              <p className="text-[11px] text-[#E8F1EC]/55">Volunteer, Rangpur Division</p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-between text-xs text-[#E8F1EC]/45">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden="true" />
            Dhaka · Chattogram · Sylhet · Rajshahi
          </span>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1 font-semibold text-emerald-200 transition-colors hover:text-white"
          >
            {copy.cta}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
