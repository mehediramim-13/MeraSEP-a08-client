import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const MARK_SIZES: Record<LogoSize, number> = {
  sm: 28,
  md: 36,
  lg: 48,
};

const TEXT_SIZES: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl sm:text-3xl",
};

interface LogoProps {
  size?: LogoSize;
  showWordmark?: boolean;
  tone?: "default" | "inverse";
  className?: string;
  href?: string;
  priority?: boolean;
  /** Called when the linked logo is activated (used to close mobile menus). */
  onClick?: () => void;
}

/**
 * The one MeraSEP logo component. The mark is an SVG; the wordmark is real
 * text so "SEP" can follow the primary colour in both themes. `tone="inverse"`
 * is used on dark surfaces such as the footer and auth brand panel.
 */
export function Logo({
  size = "md",
  showWordmark = true,
  tone = "default",
  className,
  href,
  priority = false,
  onClick,
}: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5 align-middle", className)}>
      <Image
        src="/logo/merasep-logo.svg"
        alt={showWordmark ? "" : "MeraSEP"}
        aria-hidden={showWordmark}
        width={MARK_SIZES[size]}
        height={MARK_SIZES[size]}
        priority={priority}
        unoptimized
        className="shrink-0 drop-shadow-[0_4px_12px_rgba(5,150,105,0.25)] transition-transform duration-300 group-hover/logo:-rotate-6 group-hover/logo:scale-105"
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-heading leading-none font-extrabold tracking-tight",
            TEXT_SIZES[size],
          )}
        >
          <span className={tone === "inverse" ? "text-white" : "text-foreground"}>Mera</span>
          <span className={tone === "inverse" ? "text-emerald-300" : "text-primary"}>SEP</span>
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="MeraSEP home"
        onClick={onClick}
        className="group/logo inline-flex rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        {content}
      </Link>
    );
  }

  return content;
}
