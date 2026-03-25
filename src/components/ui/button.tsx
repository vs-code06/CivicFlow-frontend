import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-civic-blue-600 text-white hover:bg-civic-blue-700": variant === "default",
                        "border border-input bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700": variant === "outline",
                        "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:text-gray-300 dark:hover:text-white": variant === "ghost",
                        "text-civic-blue-600 underline-offset-4 hover:underline dark:text-civic-blue-400": variant === "link",
                        "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-11 rounded-md px-8": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
