import React, { useState } from 'react';
import { Calendar, ChevronDown, TrendingUp, TrendingDown, Check } from 'lucide-react';
import CurrencyText from '../atoms/CurrencyText';

export interface MonthlyDigestData {
    monthNumber?: number;
    monthName?: string;
    income: number;
    expense: number;
    endingBalance: number;
    topExpenseCategory: string;
    topExpensePercentage: number;
}

export interface MonthlySummaryWidgetProps {
    data?: MonthlyDigestData;
    allDigests?: Record<number, MonthlyDigestData>;
    className?: string;
}

export default function MonthlySummaryWidget({
    data,
    allDigests = {},
    className = '',
}: MonthlySummaryWidgetProps) {
    const defaultData: MonthlyDigestData = {
        monthNumber: 11,
        monthName: 'November 2026',
        income: 8000000,
        expense: 4700000,
        endingBalance: 3300000,
        topExpenseCategory: 'Bahan Bunga',
        topExpensePercentage: 45,
    };

    const [activeDigest, setActiveDigest] = useState<MonthlyDigestData>(data || defaultData);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // List pilihan bulan dari allDigests
    const availableMonths = Object.values(allDigests);

    const handleSelectMonth = (digest: MonthlyDigestData) => {
        setActiveDigest(digest);
        setIsDropdownOpen(false);
    };

    return (
        <div className={`bg-white border border-[#EDE4D6] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 relative transition-all duration-300 ${className}`}>
            {/* Header & Interactive Month Dropdown */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-[#2E6B4E] text-white">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm tracking-tight">
                        Ringkasan Bulanan
                    </h4>
                </div>

                {/* Tombol Pilih Bulan */}
                <div className="relative">
                    <button 
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xl border border-[#E5DACB] text-slate-700 bg-white hover:bg-slate-50 font-medium transition-all active:scale-95 shadow-2xs cursor-pointer"
                    >
                        <span>{activeDigest.monthName || 'November 2026'}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {/* Menu Dropdown Bulan 2026 */}
                    {isDropdownOpen && availableMonths.length > 0 && (
                        <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E5DACB] rounded-xl shadow-lg p-1.5 z-30 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                            {availableMonths.map((m) => (
                                <button
                                    key={m.monthNumber || m.monthName}
                                    type="button"
                                    onClick={() => handleSelectMonth(m)}
                                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                                        activeDigest.monthNumber === m.monthNumber
                                            ? 'bg-[#2E6B4E]/10 text-[#2E6B4E] font-semibold'
                                            : 'text-slate-600 hover:bg-[#FAF7F2]'
                                    }`}
                                >
                                    <span>{m.monthName}</span>
                                    {activeDigest.monthNumber === m.monthNumber && (
                                        <Check className="w-3.5 h-3.5 text-[#2E6B4E]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Income & Expense Breakdown Rows */}
            <div className="space-y-2.5">
                {/* Pemasukan */}
                <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E5F3EB] flex items-center justify-center text-[#2E6B4E]">
                            <TrendingUp className="w-3.5 h-3.5 font-bold" />
                        </div>
                        <span className="font-medium text-slate-600">Pemasukan</span>
                    </div>
                    <span className="font-bold text-slate-900 text-sm tabular-nums">
                        <CurrencyText amount={activeDigest.income} type="neutral" />
                    </span>
                </div>

                {/* Pengeluaran */}
                <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FCE8EC] flex items-center justify-center text-[#D8435E]">
                            <TrendingDown className="w-3.5 h-3.5 font-bold" />
                        </div>
                        <span className="font-medium text-slate-600">Pengeluaran</span>
                    </div>
                    <span className="font-bold text-slate-900 text-sm tabular-nums">
                        <CurrencyText amount={activeDigest.expense} type="neutral" />
                    </span>
                </div>
            </div>

            {/* Highlight Box: Saldo Akhir Bulan */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#EBF5EE] to-[#E3F2E8] border border-[#CDE5D6] rounded-xl p-3.5 flex items-center gap-3.5 shadow-2xs">
                {/* Trophy Graphic */}
                <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#DEEADE] flex items-center justify-center text-xl shrink-0 shadow-2xs select-none">
                    🏆
                </div>
                <div>
                    <p className="text-[11px] font-semibold text-slate-600">
                        Saldo Akhir Bulan
                    </p>
                    <h5 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight tabular-nums">
                        <CurrencyText amount={activeDigest.endingBalance} type="neutral" />
                    </h5>
                </div>
                {/* Decorative celebratory sparks */}
                <div className="absolute right-2 top-2 text-[#EBB459] text-xs opacity-60 select-none">
                    ✨
                </div>
            </div>

            {/* Insight Box: Pengeluaran Terbesar */}
            <div className="bg-[#FFF5F7] border border-[#FAD6DC] rounded-xl p-3 flex items-start gap-2.5">
                <span className="text-base shrink-0 select-none">💡</span>
                <p className="text-xs text-slate-700 leading-snug">
                    Pengeluaran terbesar bulan ini:<br />
                    <strong className="text-[#A43B4E]">
                        {activeDigest.topExpenseCategory} ({activeDigest.topExpensePercentage}%)
                    </strong>
                </p>
            </div>
        </div>
    );
}
