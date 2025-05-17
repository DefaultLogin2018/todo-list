import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                gradient: `
          align-items-center 
          bg-[linear-gradient(144deg,#af40ff,#5b42f3_50%,#00ddeb)] 
          border-0 
          rounded-[8px] 
          box-shadow-[rgba(151,65,252,0.2)_0_15px_30px_-5px] 
          box-border 
          text-white 
          font-sans 
          text-[18px] 
          leading-[1em] 
          max-w-full 
          min-w-[140px] 
          p-[3px] 
          no-underline 
          select-none 
          touch-manipulation 
          whitespace-nowrap 
          cursor-pointer 
          transition-all 
          duration-300 
          hover:outline-0 
          active:outline-0 
          active:scale-[0.9]
        `,
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {variant === "gradient" ? (
                    <span
                        className={cn(
                            "bg-[rgb(5,6,45)] p-[16px_24px] rounded-[6px] w-full h-full transition duration-300",
                            "hover:bg-transparent"
                        )}
                    >
            {children}
          </span>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };