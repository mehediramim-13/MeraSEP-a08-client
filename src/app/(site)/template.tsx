"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Light fade-and-rise between site routes. Lives inside the site group so the
 * navbar and footer stay still while page content transitions.
 */
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
