import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fftc-yellow focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-fftc-yellow text-fftc-black shadow hover:bg-fftc-yellow/90",
        destructive: "bg-error text-white shadow-sm hover:bg-error/90",
        outline:
          "border border-gov-300 bg-gov-200 text-gov-800 shadow-sm hover:bg-gov-300",
        secondary:
          "bg-gov-200 border border-gov-300 text-gov-800 shadow-sm hover:bg-gov-300",
        ghost: "text-gov-800 hover:bg-gov-100",
        link: "text-fftc-black underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm rounded-[var(--radius)]",
        sm: "h-8 px-3 text-[13px] rounded-sm",
        lg: "h-10 px-5 text-base rounded-[var(--radius)]",
        icon: "h-9 w-9 rounded-[var(--radius)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
