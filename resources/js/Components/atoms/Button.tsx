import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tonal-green' | 'tonal-danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

export default function Button({
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    // Mapping style token sesuai Design System Botanical Ledger
    const sizeStyles: Record<string, string> = {
        sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
        md: 'px-4 py-2 text-sm rounded-xl gap-2',
        lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
    };

    const variantStyles: Record<string, string> = {
        primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover focus:ring-brand-primary shadow-sm',
        secondary: 'bg-white border border-border-subtle text-text-primary hover:bg-bg-surface-muted focus:ring-brand-primary',
        'tonal-green': 'bg-brand-subtle text-brand-primary hover:bg-emerald-100 focus:ring-brand-primary',
        'tonal-danger': 'bg-finance-expense-subtle text-finance-expense-text hover:bg-red-100 focus:ring-finance-expense',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-muted',
    };

    const isButtonDisabled = disabled || isLoading;

    return (
        <button
            type={type}
            disabled={isButtonDisabled}
            className={`
                ${baseStyles}
                ${sizeStyles[size] || sizeStyles.md}
                ${variantStyles[variant] || variantStyles.primary}
                ${isButtonDisabled ? 'opacity-60 cursor-not-allowed' : ''}
                ${className}
            `}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            {children}
        </button>
    );
}