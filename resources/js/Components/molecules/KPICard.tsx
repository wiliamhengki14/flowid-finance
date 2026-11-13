import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Flower2 } from 'lucide-react';
import CurrencyText from '../atoms/CurrencyText';

export interface KPICardProps {
    title: string;
    amount: number | string;
    variant?: 'mint' | 'blush' | 'white' | 'gold';
    icon?: LucideIcon;
    trend?: {
        value: string | number;
        label?: string;
        isPositive?: boolean;
    };
    statusText?: string;
    className?: string;
}

export default function KPICard({
    title,
    amount,
    variant = 'white',
    icon: Icon,
    trend,
    statusText,
    className = '',
}: KPICardProps) {
    const variantStyles = {
        white: {
            container: 'bg-white border-border-subtle shadow-card',
            iconBox: 'bg-bg-sidebar text-text-primary',
            watermark: 'text-text-muted/10',
        },
        mint: {
            container: 'bg-brand-subtle/70 border-brand-primary/15 shadow-sm',
            iconBox: 'bg-brand-primary text-white',
            watermark: 'text-brand-primary/15',
        },
        blush: {
            container: 'bg-finance-expense-subtle/80 border-finance-expense/20 shadow-sm',
            iconBox: 'bg-finance-expense text-white',
            watermark: 'text-finance-expense/15',
        },
        gold: {
            container: 'bg-accent-gold-subtle/80 border-accent-gold/20 shadow-sm',
            iconBox: 'bg-accent-gold text-white',
            watermark: 'text-accent-gold/20',
        },
    };

    const currentStyle = variantStyles[variant] || variantStyles.white;

    return (
        <div 
            className={`
                relative overflow-hidden rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200
                ${currentStyle.container}
                ${className}
            `}
        >
            {/* Header: Label & Icon */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {title}
                </span>
                {Icon && (
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${currentStyle.iconBox}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                )}
            </div>

            {/* Main KPI Value */}
            <div className="my-1">
                <span className="text-2xl font-bold tracking-tight text-text-primary tabular-nums">
                    <CurrencyText amount={amount} type="neutral" />
                </span>
            </div>

            {/* Footer: Trend Indicator atau Status Insight */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium">
                {trend && (
                    <div className="flex items-center gap-1">
                        {trend.isPositive !== false ? (
                            <span className="text-brand-primary flex items-center gap-0.5 font-semibold">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {typeof trend.value === 'number' ? `+${trend.value}%` : trend.value}
                            </span>
                        ) : (
                            <span className="text-finance-expense-text flex items-center gap-0.5 font-semibold">
                                <TrendingDown className="w-3.5 h-3.5" />
                                {typeof trend.value === 'number' ? `-${trend.value}%` : trend.value}
                            </span>
                        )}
                        {trend.label && (
                            <span className="text-text-muted">
                                {trend.label}
                            </span>
                        )}
                    </div>
                )}

                {statusText && !trend && (
                    <span className="text-brand-primary font-semibold flex items-center gap-1">
                        ● {statusText}
                    </span>
                )}
            </div>

            {/* Botanical Watermark Decoration (Aksen Daun & Bunga) */}
            <div className={`absolute -right-3 -bottom-3 pointer-events-none ${currentStyle.watermark}`}>
                <Flower2 className="w-20 h-20 transform -rotate-12" />
            </div>
        </div>
    );
}

