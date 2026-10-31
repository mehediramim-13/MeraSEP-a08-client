import { Logo } from "@/components/shared/logo";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      <div className="hidden bg-primary/95 p-10 lg:flex lg:flex-col lg:justify-between">
        <Logo size="md" tone="inverse" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4 bg-white/20" />
          <Skeleton className="h-4 w-2/3 bg-white/20" />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
