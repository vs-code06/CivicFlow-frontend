import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    position?: 'fixed' | 'absolute';
    containerClassName?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, className, position = 'fixed', containerClassName }: DialogProps) {
    // Prevent scrolling when dialog is open
    useEffect(() => {
        if (isOpen && position === 'fixed') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            // Only reset if we set it (simplified logic, usually fine)
            if (position === 'fixed') document.body.style.overflow = 'unset';
        };
    }, [isOpen, position]);

    if (!isOpen) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className={cn(
            "inset-0 z-50 flex items-center justify-center p-4",
            position,
            containerClassName
        )}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={cn(
                "relative z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 fade-in duration-300 overflow-hidden",
                className
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        {title && <h2 className="text-xl font-bold text-civic-dark tracking-tight">{title}</h2>}
                        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white hover:text-civic-dark shrink-0">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
