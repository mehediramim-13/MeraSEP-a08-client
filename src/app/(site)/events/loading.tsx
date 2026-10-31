import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function EventsLoading() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <Skeleton className="mx-auto h-4 w-24" />
          <Skeleton className="mx-auto h-9 w-3/4" />
          <Skeleton className="mx-auto h-4 w-2/3" />
        </div>
        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border/70 bg-card">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
