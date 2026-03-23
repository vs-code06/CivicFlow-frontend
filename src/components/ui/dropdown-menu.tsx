import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface DropdownMenuProps {
    children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
    onClick?: () => void;
}

interface DropdownMenuContentProps {
    children: React.ReactNode;
    className?: string;
    align?: 'start' | 'end' | 'center';
    side?: 'bottom' | 'top' | 'right';
}

interface DropdownMenuItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    inset?: boolean;
}

// Context to share state
const DropdownContext = React.createContext<{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function DropdownMenu({ children }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
            <div className="relative inline-block text-left" ref={containerRef}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

export function DropdownMenuTrigger({ children, className, onClick }: DropdownMenuTriggerProps) {
    const context = React.useContext(DropdownContext);
    if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

    return (
        <div
            className={cn("cursor-pointer", className)}
            onClick={(e) => {
                e.stopPropagation();
                context.setIsOpen(!context.isOpen);
                onClick?.();
            }}
        >
            {children}
        </div>
    );
}

export function DropdownMenuContent({ children, className, align = 'end', side = 'bottom' }: DropdownMenuContentProps) {
    const context = React.useContext(DropdownContext);
    if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");

    if (!context.isOpen) return null;

    let alignmentClasses = "";
    if (side === 'bottom') {
        if (align === 'end') alignmentClasses = "right-0 mt-2";
        else if (align === 'start') alignmentClasses = "left-0 mt-2";
        else alignmentClasses = "left-1/2 -translate-x-1/2 mt-2";
    } else if (side === 'top') {
        if (align === 'end') alignmentClasses = "right-0 mb-2 bottom-full";
        else if (align === 'start') alignmentClasses = "left-0 mb-2 bottom-full";
    } else if (side === 'right') {
        alignmentClasses = "left-full top-0 ml-2";
    }

    return (
        <div className={cn(
            "absolute z-50 min-w-[12rem] overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95 duration-200",
            alignmentClasses,
            className
        )}>
            {children}
        </div>
    );
}

export function DropdownMenuItem({ children, onClick, className, inset }: DropdownMenuItemProps) {
    const context = React.useContext(DropdownContext);

    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none transition-colors hover:bg-gray-50 focus:bg-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:text-civic-dark text-gray-600 font-medium cursor-pointer",
                inset && "pl-8",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
                context?.setIsOpen(false);
            }}
        >
            {children}
        </div>
    );
}

export const DropdownMenuLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider", className)}>
        {children}
    </div>
);

export const DropdownMenuSeparator = ({ className }: { className?: string }) => (
    <div className={cn("-mx-1 my-1 h-px bg-gray-100", className)} />
);
