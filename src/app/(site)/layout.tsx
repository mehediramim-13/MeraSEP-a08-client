import type { ReactNode } from "react";

import { BackToTop } from "@/components/layout/back-to-top";
import { CommandPalette } from "@/components/layout/command-palette";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <BackToTop />
      <CommandPalette />
    </>
  );
}
