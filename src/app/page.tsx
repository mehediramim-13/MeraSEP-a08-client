import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { SectionHeading } from "@/components/shared/section-heading";
import { ThemeToggle } from "@/components/shared/theme-toggle";

/**
 * Temporary foundation preview. The full home page is assembled in phase 4;
 * this page exists so the design tokens, fonts, logo and theme toggle can be
 * reviewed in both themes straight away.
 */
export default function HomePage() {
  return (
    <main id="main-content" className="mesh-glow grain-overlay relative min-h-svh">
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>
      <Container className="flex min-h-svh flex-col items-center justify-center gap-10 py-24 text-center">
        <Logo size="lg" href="/" priority />
        <SectionHeading
          eyebrow="Foundation ready"
          title={
            <>
              Your community.{" "}
              <span className="text-gradient-brand">Your cause.</span> Your move.
            </>
          }
          subtitle="MeraSEP connects people across Bangladesh with social service events happening in their own neighbourhood. The home page is being built section by section."
        />
      </Container>
    </main>
  );
}
