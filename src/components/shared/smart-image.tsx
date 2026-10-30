"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export const FALLBACK_EVENT_IMAGE = "/fallback-event.svg";

type SmartImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
};

/**
 * next/image with a graceful branded fallback when a pasted thumbnail URL is
 * broken, blocked or empty. Tracking the failed URL (instead of a boolean)
 * resets automatically when the source changes — no effect needed.
 */
export function SmartImage({ src, alt, ...props }: SmartImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const isFallback = !src || failedSrc === src;
  const resolvedSrc = isFallback ? FALLBACK_EVENT_IMAGE : src;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      unoptimized={isFallback || props.unoptimized}
      onError={() => setFailedSrc(src ?? null)}
    />
  );
}
