import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ToggleOption {
    value: string;
    label: string;
    icon?: LucideIcon;
}

export interface SegmentedToggleProps {
    options: ToggleOption[];
    value: string;
    onChange: (value: string) => void;
    size?: 'sm' | 'md';
    className?: string;
}

export default function SegmentedToggle({
    options,
    value,
    onChange,
    size = 'md',
    className = '',
}: SegmentedToggleProps) {
    const sizeClasses = {
        sm: 'py-1 px-3 text-xs gap-1.5',
        md: 'py-1.5 px-4 text-sm gap-2',
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        let nextIndex = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % options.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            nextIndex = (currentIndex - 1 + options.length) % options.length;
        }

        if (nextIndex !== -1) {
            onChange(options[nextIndex].value);
            // Pindahkan fokus ke tombol tab yang baru dipilih
            const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
            if (buttons && buttons[nextIndex]) {
                buttons[nextIndex].focus();
            }
        }
    };

    return (
        <div 
            role="tablist"
            aria-label="Pilih Jenis Transaksi"
            className={`inline-flex items-center bg-bg-sidebar p-1 rounded-full border border-border-subtle/60 select-none ${className}`}
        >
            {options.map((option, index) => {
                const isSelected = option.value === value;
                const Icon = option.icon;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => onChange(option.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`
                            inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23533B] focus-visible:ring-offset-2
                            ${sizeClasses[size] || sizeClasses.md}
                            ${isSelected 
                                ? 'bg-brand-primary text-white shadow-sm font-semibold' 
                                : 'text-text-secondary hover:text-text-primary bg-transparent'
                            }
                        `}
                    >
                        {Icon && (
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-text-muted'}`} />
                        )}
                        <span>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

