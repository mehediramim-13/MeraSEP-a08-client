"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useSavedEvents } from "@/hooks/use-saved-events";
import { PRIMARY_NAV } from "@/lib/constants";
import { openCommandPalette } from "@/lib/ui-events";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const { count: savedCount } = useSavedEvents();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 12;
    setScrolled((current) => (current === next ? current : next));
  });

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-border/70 bg-background/80 shadow-[0_10px_40px_-26px_rgba(15,23,42,0.45)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
            : "border-transparent bg-background/0",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-3 md:h-[4.5rem]">
          <div className="flex min-w-0 items-center gap-8">
            <Logo href="/" size="md" priority />
            <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
              {PRIMARY_NAV.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                    {active ? (
                      <motion.span
                        layoutId="primary-nav-active"
                        className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <Button
              variant="outline"
              onClick={openCommandPalette}
              aria-label="Search events and pages (Ctrl K)"
              className="hidden h-9 gap-2 rounded-full border-border/70 bg-card/60 px-3 text-muted-foreground shadow-none hover:text-foreground lg:inline-flex"
            >
              <Search className="size-4" aria-hidden="true" />
              <span className="text-xs font-medium">Search</span>
              <kbd className="ml-3 rounded-md border border-border/70 bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </Button>

            <ThemeToggle />

            {isLoading ? (
              <Skeleton className="size-9 rounded-full" />
            ) : user ? (
              <>
                <UserMenu user={user} savedCount={savedCount} />
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Logout"
                        className="hidden rounded-full text-muted-foreground hover:text-destructive lg:inline-flex"
                        onClick={() => {
                          void logout();
                        }}
                      />
                    }
                  >
                    <LogOut aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Logout</TooltipContent>
                </Tooltip>
              </>
            ) : (
              <Button
                render={<Link href="/login" />}
                nativeButton={false}
                className="h-9 rounded-full px-4 text-sm font-semibold"
              >
                Login
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        isLoading={isLoading}
        savedCount={savedCount}
        onLogout={() => {
          setMobileOpen(false);
          void logout();
        }}
      />
    </>
  );
}
