import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function Loading() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-2/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Container>
    </section>
  );
}
