import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";

export default function EventDetailLoading() {
  return (
    <div className="pb-16">
      <Skeleton className="h-72 w-full sm:h-96" />
      <Container className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </Container>
    </div>
  );
}
