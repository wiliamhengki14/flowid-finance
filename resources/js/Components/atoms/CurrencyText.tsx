import React from 'react';

export interface CurrencyTextProps {
    amount: number | string | null | undefined;
    type?: 'pemasukan' | 'pengeluaran' | 'neutral';
    showSign?: boolean;
    className?: string;
}

export default function CurrencyText({
    amount = 0,
    type = 'neutral',
    showSign = false,
    className = '',
}: CurrencyTextProps) {
    // 2. Defensive Type Narrowing: Ubah input ke number murni secara aman
    const numericAmount = typeof amount === 'number' 
        ? amount 
        : parseInt(String(amount || '0'), 10) || 0;

    // 3. Format lokal IDR tanpa desimal sen (,00)
    const formattedNumber = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.abs(numericAmount));

    // 4. Tentukan simbol & warna semantik sesuai Design System
    let sign = '';
    let colorClass = 'text-text-primary';

    if (type === 'pemasukan') {
        sign = showSign ? '+' : '';
        colorClass = 'text-brand-primary';
    } else if (type === 'pengeluaran') {
        sign = showSign ? '-' : '';
        colorClass = 'text-finance-expense-text';
    }

    return (
        <span className={`tabular-nums font-semibold tracking-tight ${colorClass} ${className}`}>
            {sign}{formattedNumber}
        </span>
    );
}