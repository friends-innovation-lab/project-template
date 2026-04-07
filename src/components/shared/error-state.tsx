import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error | string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({ error, retry, className }: ErrorStateProps) {
  const message = typeof error === "string" ? error : error.message;

  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center",
        className,
      )}
      role="alert"
    >
      <h3 className="text-lg font-semibold text-destructive">
        Something went wrong
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{message}</p>
      {retry && (
        <div className="mt-6">
          <Button variant="outline" onClick={retry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
