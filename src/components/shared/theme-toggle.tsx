"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsClient } from "@/hooks/use-is-client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Change theme"
        className="opacity-0"
        tabIndex={-1}
      />
    );
  }

  const activeTheme = theme ?? "system";
  const ActiveIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Change theme"
            className="relative overflow-hidden rounded-full"
          />
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={ActiveIcon.displayName ?? resolvedTheme ?? "theme"}
            initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="inline-flex"
          >
            <ActiveIcon className="size-[1.15rem]" aria-hidden="true" />
          </motion.span>
        </AnimatePresence>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {THEME_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="cursor-pointer justify-between"
          >
            <span className="flex items-center gap-2.5">
              <option.icon className="size-4 text-muted-foreground" aria-hidden="true" />
              {option.label}
            </span>
            {activeTheme === option.value ? (
              <Check className="size-4 text-primary" aria-hidden="true" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
