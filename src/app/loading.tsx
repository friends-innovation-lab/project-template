import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSkeleton />
    </div>
  );
}
