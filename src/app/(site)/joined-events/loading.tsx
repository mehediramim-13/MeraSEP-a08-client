import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function Loading() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-1/3" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border/70 bg-card">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
