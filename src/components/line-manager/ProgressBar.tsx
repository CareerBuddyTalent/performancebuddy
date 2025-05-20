
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressVariants = cva("h-2 w-full overflow-hidden rounded-full bg-secondary", {
  variants: {
    variant: {
      default: "",
      success: "",
      warning: "",
      danger: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const progressIndicatorVariants = cva("h-full w-full flex-1 transition-all", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant, ...props }, ref) => {
    const percentage = (value / max) * 100;

    const derivedVariant = 
      !variant && percentage >= 0 ? 
        percentage < 40 ? "danger" : 
        percentage < 70 ? "warning" : 
        "success" : 
        variant;

    return (
      <div
        ref={ref}
        className={cn(progressVariants({ variant: derivedVariant }), className)}
        {...props}
      >
        <div
          className={cn(progressIndicatorVariants({ variant: derivedVariant }))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";
