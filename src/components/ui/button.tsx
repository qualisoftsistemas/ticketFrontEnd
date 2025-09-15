import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--secondary)] text-[var(--extra)] shadow-xs hover:bg-[var(--extra)] hover:text-[var(--secondary)] focus-visible:ring-[var(--secondary)]/20 dark:focus-visible:ring-[var(--secondary)]/40 dark:bg-[var(--secondary)]/60 dark:text-[var(--extra)]",
        destructive:
          "bg-[var(--destructive)] text-[var(--extra)] shadow-xs hover:bg-[var(--extra)] hover:text-[var(--destructive)] focus-visible:ring-[var(--destructive)]/20 dark:focus-visible:ring-[var(--destructive)]/40 dark:bg-[var(--destructive)]/60",
        confirm:
          "bg-[var(--success)] text-[var(--extra)] shadow-xs hover:bg-[var(--extra)] hover:text-[var(--success)]  focus-visible:ring-[var(--success)]/20 dark:focus-visible:ring-[var(--success)]/40 dark:bg-[var(--success)]/60",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-xs hover:bg-[var(--secondary)]/80",
        ghost:
          "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:hover:bg-[var(--accent)]/50",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
