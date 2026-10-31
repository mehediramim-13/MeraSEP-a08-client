import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function Loading() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-1/3" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.45fr_0.55fr]">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Container>
    </section>
  );
}
