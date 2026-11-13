import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface InsightCardProps {
    title: string;
    mainValue: string;
    subtext?: string;
    icon: LucideIcon;
    variant?: 'gold' | 'rose' | 'mint' | 'neutral';
    className?: string;
}

export default function InsightCard({
    title,
    mainValue,
    subtext,
    icon: Icon,
    variant = 'neutral',
    className = '',
}: InsightCardProps) {
    const variantStyles = {
        gold: {
            container: 'bg-accent-gold-subtle/70 border-accent-gold/20',
            iconBox: 'bg-accent-gold text-white',
            titleColor: 'text-accent-gold-text',
        },
        rose: {
            container: 'bg-finance-expense-subtle/70 border-finance-expense/20',
            iconBox: 'bg-finance-expense text-white',
            titleColor: 'text-finance-expense-text',
        },
        mint: {
            container: 'bg-brand-subtle/70 border-brand-primary/15',
            iconBox: 'bg-brand-primary text-white',
            titleColor: 'text-brand-primary',
        },
        neutral: {
            container: 'bg-white border-border-subtle shadow-sm',
            iconBox: 'bg-bg-sidebar text-text-primary',
            titleColor: 'text-text-secondary',
        },
    };

    const currentStyle = variantStyles[variant] || variantStyles.neutral;

    return (
        <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${currentStyle.container} ${className}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${currentStyle.iconBox}`}>
                <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
                <span className={`text-xs font-semibold uppercase tracking-wider block ${currentStyle.titleColor}`}>
                    {title}
                </span>
                <span className="text-base font-bold text-text-primary block mt-0.5 tracking-tight truncate">
                    {mainValue}
                </span>
                {subtext && (
                    <span className="text-xs text-text-muted block mt-0.5 truncate">
                        {subtext}
                    </span>
                )}
            </div>
        </div>
    );
}

