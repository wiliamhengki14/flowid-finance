import React, { forwardRef } from 'react';
import { Search, Calendar as CalendarIcon } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    variant?: 'default' | 'currency' | 'search' | 'date';
    label?: string;
    error?: string;
    helperText?: string;
    suffixAction?: React.ReactNode;
    onRawChange?: (rawValue: number) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    variant = 'default',
    label,
    error,
    helperText,
    suffixAction,
    value,
    onChange,
    onRawChange,
    placeholder,
    disabled = false,
    className = '',
    id,
    type = 'text',
    ...props
}, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    // Helper format ribuan rupiah
    const formatRupiah = (val: string | number): string => {
        if (!val && val !== 0) return '';
        const cleanNumber = String(val).replace(/[^0-9]/g, '');
        if (!cleanNumber) return '';
        return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Handler khusus untuk variant currency
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawDigits = e.target.value.replace(/[^0-9]/g, '');
        const numericVal = rawDigits ? parseInt(rawDigits, 10) : 0;
        
        if (onRawChange) {
            onRawChange(numericVal);
        }

        if (onChange) {
            // Modifikasi target value agar sinkron jika parent memakai e.target.value
            e.target.value = rawDigits;
            onChange(e);
        }
    };

    // Tampilan value untuk input
    const displayValue = variant === 'currency' 
        ? formatRupiah(value as string | number)
        : value;

    const baseInputStyles = `
        w-full rounded-xl border text-sm text-text-primary bg-white
        placeholder:text-text-muted transition-all duration-150
        focus:outline-none focus:ring-2
        ${error 
            ? 'border-finance-expense-text focus:border-finance-expense-text focus:ring-finance-expense-text/20' 
            : 'border-border-subtle hover:border-[#84928A] focus:border-brand-primary focus:ring-brand-primary/20'
        }
        ${disabled ? 'opacity-60 cursor-not-allowed bg-bg-surface-muted' : ''}
    `;

    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && (
                <label 
                    htmlFor={inputId} 
                    className="text-xs font-semibold text-text-secondary tracking-wide uppercase"
                >
                    {label}
                </label>
            )}

            <div className="relative flex items-center">
                {/* Prefix Icon Search */}
                {variant === 'search' && (
                    <div className="absolute left-3.5 pointer-events-none text-text-muted">
                        <Search className="w-4 h-4" />
                    </div>
                )}

                {/* Prefix Currency Rp */}
                {variant === 'currency' && (
                    <div className="absolute left-3.5 pointer-events-none text-sm font-semibold text-text-secondary select-none">
                        Rp
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    type={variant === 'currency' ? 'text' : type}
                    value={displayValue ?? ''}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={variant === 'currency' ? handleCurrencyChange : onChange}
                    className={`
                        ${baseInputStyles}
                        ${variant === 'currency' ? 'pl-11 pr-4 tabular-nums font-medium' : ''}
                        ${variant === 'search' ? 'pl-10 pr-4' : ''}
                        ${variant === 'date' ? 'pr-10 pl-4 tabular-nums' : ''}
                        ${variant === 'default' ? (suffixAction ? 'pl-4 pr-11' : 'px-4') : ''}
                        py-2.5
                        ${className}
                    `}
                    {...props}
                />

                {/* Suffix Action / Icon */}
                {suffixAction && (
                    <div className="absolute right-3 flex items-center">
                        {suffixAction}
                    </div>
                )}

                {/* Suffix Icon Date */}
                {variant === 'date' && (
                    <div className="absolute right-3.5 pointer-events-none text-brand-primary">
                        <CalendarIcon className="w-4 h-4" />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <span className="text-xs font-medium text-finance-expense-text flex items-center gap-1 mt-0.5">
                    {error}
                </span>
            )}

            {/* Helper Text */}
            {!error && helperText && (
                <span className="text-xs text-text-muted mt-0.5">
                    {helperText}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;

