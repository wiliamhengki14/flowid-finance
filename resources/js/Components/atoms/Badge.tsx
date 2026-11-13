import React from 'react';

export type BadgeVariant = 
    | 'income' 
    | 'expense' 
    | 'role-owner' 
    | 'role-admin' 
    | 'role-cashier' 
    | 'status-active' 
    | 'status-inactive' 
    | 'warning' 
    | 'neutral';

export interface BadgeProps {
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
    withDot?: boolean;
    children: React.ReactNode;
    className?: string;
}

export default function Badge({
    variant = 'neutral',
    size = 'md',
    withDot = false,
    children,
    className = '',
}: BadgeProps) {
    // Mapping style token sesuai Design System Botanical Ledger
    const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
        income: {
            bg: 'bg-brand-subtle',
            text: 'text-brand-primary',
            dot: 'bg-brand-primary',
        },
        'role-owner': {
            bg: 'bg-brand-subtle',
            text: 'text-brand-primary',
            dot: 'bg-brand-primary',
        },
        'status-active': {
            bg: 'bg-brand-subtle',
            text: 'text-brand-primary',
            dot: 'bg-brand-primary',
        },
        expense: {
            bg: 'bg-finance-expense-subtle',
            text: 'text-finance-expense-text',
            dot: 'bg-finance-expense-text',
        },
        'role-admin': {
            bg: 'bg-finance-expense-subtle',
            text: 'text-finance-expense-text',
            dot: 'bg-finance-expense-text',
        },
        warning: {
            bg: 'bg-accent-gold-subtle',
            text: 'text-accent-gold-text',
            dot: 'bg-accent-gold',
        },
        'role-cashier': {
            bg: 'bg-accent-gold-subtle',
            text: 'text-accent-gold-text',
            dot: 'bg-accent-gold',
        },
        'status-inactive': {
            bg: 'bg-bg-sidebar',
            text: 'text-text-secondary',
            dot: 'bg-text-muted',
        },
        neutral: {
            bg: 'bg-bg-sidebar',
            text: 'text-text-secondary',
            dot: 'bg-text-secondary',
        },
    };

    const currentStyle = variantStyles[variant] || variantStyles.neutral;

    const sizeStyles = {
        sm: 'px-2.5 py-0.5 text-[11px] gap-1',
        md: 'px-3 py-1 text-xs gap-1.5',
    };

    return (
        <span
            className={`
                inline-flex items-center font-medium rounded-full select-none
                ${currentStyle.bg}
                ${currentStyle.text}
                ${sizeStyles[size] || sizeStyles.md}
                ${className}
            `}
        >
            {withDot && (
                <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot} shrink-0`} />
            )}
            <span>{children}</span>
        </span>
    );
}

