import { Logo } from "@/components/shared/logo";

export default function Loading() {
  return (
    <div className="mesh-glow grain-overlay flex min-h-svh flex-col items-center justify-center gap-8 px-4">
      <Logo size="lg" priority />
      <div className="flex flex-col items-center gap-3">
        <div className="h-1 w-52 overflow-hidden rounded-full bg-muted">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <div className="absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-primary to-emerald-400 motion-safe:animate-shimmer" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Finding community events near you…</p>
      </div>
    </div>
  );
}
