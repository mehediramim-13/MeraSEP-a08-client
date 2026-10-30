import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

/** Full-page skeleton used while the auth state is loading on private routes. */
export function FullPageSkeleton() {
  return (
    <Container className="py-16 md:py-24">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-sm text-muted-foreground">Loading your workspace…</span>
        </div>
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-10 w-5/6 rounded-xl" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-9 w-56 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
            <Skeleton className="h-4 w-2/3 max-w-lg rounded-md" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
