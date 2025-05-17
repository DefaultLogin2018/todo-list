import * as React from "react";
import { cn } from "@/lib/utils";

const AuthInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    // Стили из .auth-input
                    "bg-transparent outline-none border-2 border-[#5e5d5d] text-white text-[0.875rem] rounded-[0.5rem] p-[0.625rem] w-full box-border transition-all duration-300 ease-in-out",
                    "placeholder:text-white placeholder:opacity-100 placeholder:font-bold",
                    "focus:border-[#8b5cf6] focus:shadow-[0_0_0_2px_rgba(139,92,246,0.5)]",
                    "mx-2.5", // Отступы слева и справа по 10px (2.5 * 4 = 10px в Tailwind)
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
AuthInput.displayName = "AuthInput";

export { AuthInput };