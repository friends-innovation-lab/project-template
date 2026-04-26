import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius)] border border-gov-300 bg-gov-50 px-3 py-2.5 text-sm text-gov-800 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gov-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fftc-yellow focus-visible:border-fftc-yellow disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-gov-100 disabled:border-gov-200",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
