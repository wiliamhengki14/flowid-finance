import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    options: SelectOption[];
    variant?: 'form-select' | 'filter-select';
    label?: string;
    error?: string;
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    options = [],
    variant = 'form-select',
    label,
    error,
    placeholder,
    value,
    onChange,
    disabled = false,
    className = '',
    id,
    ...props
}, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const isFilter = variant === 'filter-select';

    const baseStyles = `
        appearance-none bg-white border text-text-primary transition-all duration-150
        focus:outline-none focus:ring-2 cursor-pointer
        ${error 
            ? 'border-finance-expense-text focus:border-finance-expense-text focus:ring-finance-expense-text/20' 
            : 'border-border-subtle hover:border-[#84928A] focus:border-brand-primary focus:ring-brand-primary/20'
        }
        ${disabled ? 'opacity-60 cursor-not-allowed bg-bg-surface-muted' : ''}
    `;

    const sizeStyles = isFilter
        ? 'py-2 pl-3.5 pr-8 text-xs font-medium rounded-xl shadow-sm'
        : 'w-full py-2.5 pl-4 pr-10 text-sm rounded-xl';

    return (
        <div className={`flex flex-col gap-1.5 ${isFilter ? 'w-auto' : 'w-full'}`}>
            {label && (
                <label 
                    htmlFor={selectId} 
                    className="text-xs font-semibold text-text-secondary tracking-wide uppercase"
                >
                    {label}
                </label>
            )}

            <div className="relative inline-flex items-center w-full">
                <select
                    ref={ref}
                    id={selectId}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        ${baseStyles}
                        ${sizeStyles}
                        ${className}
                    `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled className="text-text-muted">
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={String(opt.value)} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Custom Chevron Icon */}
                <div className={`absolute right-3 pointer-events-none text-text-muted ${isFilter ? 'right-2.5' : 'right-3.5'}`}>
                    <ChevronDown className={isFilter ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                </div>
            </div>

            {error && (
                <span className="text-xs font-medium text-finance-expense-text mt-0.5">
                    {error}
                </span>
            )}
        </div>
    );
});

Select.displayName = 'Select';
export default Select;

