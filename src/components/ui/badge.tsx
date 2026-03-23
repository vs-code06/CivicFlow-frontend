import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    "border-transparent bg-civic-blue-50 text-civic-blue-600 hover:bg-civic-blue-100": variant === "default",
                    "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200": variant === "secondary",
                    "border-transparent bg-red-50 text-civic-red hover:bg-red-100": variant === "destructive",
                    "text-foreground": variant === "outline",
                    "border-transparent bg-civic-green-50 text-civic-green-500 hover:bg-civic-green-100": variant === "success",
                    "border-transparent bg-yellow-50 text-civic-yellow hover:bg-yellow-100": variant === "warning",
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }
