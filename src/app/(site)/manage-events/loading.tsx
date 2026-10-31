import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function Loading() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-1/3" />
        <div className="mt-10 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </Container>
    </section>
  );
}
