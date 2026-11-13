import React, { useState, useMemo } from 'react';
import { BarChart3, ChevronDown, Check } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrasi modul Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export interface ChartMonthData {
    monthNumber?: number;
    month: string;
    fullMonth?: string;
    income: number;
    expense: number;
    net?: number;
}

export interface FinancialChartProps {
    data?: ChartMonthData[];
    className?: string;
}

export default function FinancialChart({ data = [], className = '' }: FinancialChartProps) {
    const [period, setPeriod] = useState<'6m' | '12m'>('6m');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Filter data berdasarkan periode (6 Bulan Terakhir / 12 Bulan Terakhir)
    const getFilteredData = (): ChartMonthData[] => {
        if (!data || data.length === 0) return [];
        if (period === '6m') {
            return data.slice(-6);
        }
        return data.slice(-12);
    };

    const displayData = getFilteredData();

    const periodLabels = {
        '6m': '6 Bulan Terakhir',
        '12m': '12 Bulan Terakhir',
    };

    // Deskripsi Aksesibilitas WCAG AA untuk elemen Canvas
    const chartAriaLabel = useMemo(() => {
        if (!displayData || displayData.length === 0) {
            return 'Grafik perbandingan pemasukan dan pengeluaran, belum ada data transaksi.';
        }
        const totalIncome = displayData.reduce((acc, d) => acc + (d.income || 0), 0);
        const totalExpense = displayData.reduce((acc, d) => acc + (d.expense || 0), 0);
        const highestMonth = [...displayData].sort((a, b) => (b.income || 0) - (a.income || 0))[0];
        const formattedInc = new Intl.NumberFormat('id-ID').format(totalIncome);
        const formattedExp = new Intl.NumberFormat('id-ID').format(totalExpense);
        const highestIncVal = new Intl.NumberFormat('id-ID').format(highestMonth?.income || 0);
        return `Grafik batang perbandingan pemasukan dan pengeluaran ${periodLabels[period]}. Total pemasukan Rp ${formattedInc}, total pengeluaran Rp ${formattedExp}, pemasukan tertinggi pada bulan ${highestMonth?.month || '-'} sebesar Rp ${highestIncVal}.`;
    }, [displayData, period]);

    // Konfigurasi data untuk Grouped Bar Chart Chart.js
    const chartData = {
        labels: displayData.map((d) => d.month),
        datasets: [
            {
                label: 'Pemasukan',
                data: displayData.map((d) => d.income),
                backgroundColor: '#2E6B4E',
                hoverBackgroundColor: '#23523B',
                borderRadius: 4,
                borderSkipped: false,
                barPercentage: 0.6,
                categoryPercentage: 0.7,
            },
            {
                label: 'Pengeluaran',
                data: displayData.map((d) => d.expense),
                backgroundColor: '#F48E9E',
                hoverBackgroundColor: '#E07A8B',
                borderRadius: 4,
                borderSkipped: false,
                barPercentage: 0.6,
                categoryPercentage: 0.7,
            },
        ],
    };

    // Opsi konfigurasi Chart.js
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Legenda kustom elegan ditampilkan di header
            },
            tooltip: {
                backgroundColor: 'rgba(28, 46, 36, 0.95)',
                titleFont: { size: 11, family: 'Plus Jakarta Sans', weight: 'bold' as const },
                bodyFont: { size: 11, family: 'Plus Jakarta Sans' },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: (context: any) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        return `${label}: Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 11, family: 'Plus Jakarta Sans', weight: 'bold' as const },
                    color: '#64748B',
                },
            },
            y: {
                grid: {
                    color: '#F1F5F2',
                },
                ticks: {
                    font: { size: 10, family: 'Plus Jakarta Sans' },
                    color: '#94A3B8',
                    callback: (value: any) => `${Math.round(value / 1000000)} jt`,
                },
            },
        },
    };

    return (
        <div className={`bg-white border border-[#EDE4D6] rounded-2xl p-5 shadow-2xs flex flex-col justify-between relative transition-all duration-300 ${className}`}>
            {/* Header, Legend & Filter Dropdown (6 Bulan / 12 Bulan) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#2E6B4E]" />
                    <BarChart3 className="w-5 h-5 text-[#2E6B4E]" />
                    <h4 className="font-bold text-slate-800 text-sm tracking-tight">
                        Grafik Keuangan
                    </h4>
                </div>

                {/* Legend & Filter Dropdown */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-3 text-xs select-none">
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4E]" /> Pemasukan
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#F48E9E]" /> Pengeluaran
                        </span>
                    </div>

                    {/* Tombol Filter Periode: 6 Bulan Terakhir / 12 Bulan Terakhir */}
                    <div className="relative">
                        <button 
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border border-[#E5DACB] text-slate-700 bg-white hover:bg-slate-50 font-medium transition-all active:scale-95 shadow-2xs cursor-pointer"
                        >
                            <span>{periodLabels[period]}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Menu Dropdown Periode */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E5DACB] rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                                {(Object.keys(periodLabels) as Array<'6m' | '12m'>).map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => {
                                            setPeriod(key);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                                            period === key 
                                                ? 'bg-[#2E6B4E]/10 text-[#2E6B4E] font-semibold' 
                                                : 'text-slate-600 hover:bg-[#FAF7F2]'
                                        }`}
                                    >
                                        <span>{periodLabels[key]}</span>
                                        {period === key && <Check className="w-3.5 h-3.5 text-[#2E6B4E]" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Container Grouped Bar Chart Chart.js */}
            <div className="pt-5 pb-1 relative h-60 w-full">
                <Bar 
                    data={chartData} 
                    options={chartOptions} 
                    role="img"
                    aria-label={chartAriaLabel}
                />
            </div>
        </div>
    );
}
