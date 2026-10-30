import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface SectionProps extends ComponentProps<"section"> {
  /** Adds the site-wide `py-16 md:py-24` rhythm. */
  flush?: boolean;
}

export function Section({ className, flush = false, ...props }: SectionProps) {
  return (
    <section
      className={cn("relative", !flush && "section-padding", className)}
      {...props}
    />
  );
}
