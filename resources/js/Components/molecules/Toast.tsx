import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    id?: string;
    type?: ToastType;
    message: string;
    description?: string;
    duration?: number;
    onClose: () => void;
}

export default function Toast({
    type = 'success',
    message,
    description,
    duration = 3500,
    onClose,
}: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const typeConfig = {
        success: {
            bg: 'bg-brand-primary text-white border-brand-primary-hover',
            icon: CheckCircle2,
            iconColor: 'text-emerald-300',
        },
        error: {
            bg: 'bg-finance-expense-text text-white border-red-800',
            icon: AlertCircle,
            iconColor: 'text-red-200',
        },
        info: {
            bg: 'bg-white text-text-primary border-border-subtle shadow-dropdown',
            icon: Info,
            iconColor: 'text-brand-primary',
        },
    };

    const current = typeConfig[type] || typeConfig.success;
    const Icon = current.icon;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`
                fixed top-6 right-6 z-50 flex items-start gap-3 p-4 rounded-2xl border shadow-xl
                max-w-md w-full sm:w-auto animate-in fade-in slide-in-from-top-3 duration-200 select-none
                ${current.bg}
            `}
        >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${current.iconColor}`} />

            <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-semibold tracking-tight">
                    {message}
                </p>
                {description && (
                    <p className="text-xs opacity-85 mt-0.5 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="Tutup notifikasi"
                className="text-white/70 hover:text-white p-0.5 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

