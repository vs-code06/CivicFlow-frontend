import React from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
    return (
        <div className={`animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out ${className}`}>
            {children}
        </div>
    );
}
