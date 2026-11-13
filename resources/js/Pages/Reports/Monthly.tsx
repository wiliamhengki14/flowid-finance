import React, { useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    CalendarRange, 
    Trophy, 
    AlertTriangle, 
    TrendingUp, 
    TrendingDown, 
    Sparkles, 
    Filter,
    ChevronDown,
    Calendar,
    ArrowUpRight,
    Wallet
} from 'lucide-react';
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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyText from '@/Components/atoms/CurrencyText';

// Registrasi modul Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// 1. Interface Data dari Backend
export interface MonthlyItem {
    month: number;
    shortName: string;
    fullName: string;
    income: number;
    expense: number;
    net: number;
}

export interface BestMonthInsight {
    month: number;
    name: string;
    income: number;
    formattedIncome: string;
}

export interface HighestExpenseInsight {
    month: number;
    name: string;
    amount: number;
    categoryGroup: string;
    formattedAmount: string;
}

export interface MonthlyInsights {
    bestMonth: BestMonthInsight;
    highestExpense: HighestExpenseInsight;
    endingBalance: number;
    formattedEndingBalance: string;
    activeMonthLabel: string;
}

export interface AnnualSummary {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
}

export interface MonthlyReportProps {
    selectedYear: number;
    selectedRange?: string;
    availableYears?: number[];
    chartData?: MonthlyItem[];
    allMonthlyData?: MonthlyItem[];
    insights?: MonthlyInsights;
    annualSummary?: AnnualSummary;
}

export default function Monthly({
    selectedYear = 2026,
    selectedRange = 'all',
    availableYears = [2026, 2025, 2024],
    chartData = [],
    allMonthlyData = [],
    insights = {
        bestMonth: {
            month: 5,
            name: 'Mei 2026',
            income: 9000000,
            formattedIncome: 'Rp 9.000.000',
        },
        highestExpense: {
            month: 5,
            name: 'Mei 2026',
            amount: 5200000,
            categoryGroup: 'Biaya Bunga',
            formattedAmount: 'Rp 5.200.000',
        },
        endingBalance: 40000000,
        formattedEndingBalance: 'Rp 40.000.000',
        activeMonthLabel: 'November 2026',
    },
    annualSummary = {
        totalIncome: 84000000,
        totalExpense: 49400000,
        netProfit: 34600000,
    },
}: MonthlyReportProps) {

    // 1. Handler Filter Tahun
    const handleYearChange = (year: number) => {
        router.get(
            route('reports.monthly'),
            { year, range: selectedRange },
            { preserveState: true, preserveScroll: true }
        );
    };

    // 2. Handler Filter Rentang Bulan (All 12 Bulan, Semester 1, Semester 2, Kuartal)
    const handleRangeChange = (range: string) => {
        router.get(
            route('reports.monthly'),
            { year: selectedYear, range },
            { preserveState: true, preserveScroll: true }
        );
    };

    // 3. Konfigurasi Data Grouped Bar Chart Chart.js
    const barChartData = useMemo(() => {
        const labels = chartData.map((d) => d.shortName);
        const incomeValues = chartData.map((d) => d.income);
        const expenseValues = chartData.map((d) => d.expense);

        return {
            labels,
            datasets: [
                {
                    label: 'Pemasukan',
                    data: incomeValues,
                    backgroundColor: '#367554',
                    hoverBackgroundColor: '#24563E',
                    borderRadius: { topLeft: 6, topRight: 6 },
                    borderSkipped: false,
                    barPercentage: 0.85,
                    categoryPercentage: 0.75,
                    maxBarThickness: 52,
                },
                {
                    label: 'Pengeluaran',
                    data: expenseValues,
                    backgroundColor: '#F47B8F',
                    hoverBackgroundColor: '#E26D85',
                    borderRadius: { topLeft: 6, topRight: 6 },
                    borderSkipped: false,
                    barPercentage: 0.85,
                    categoryPercentage: 0.75,
                    maxBarThickness: 52,
                },
            ],
        };
    }, [chartData]);

    // 4. Konfigurasi Opsi Tampilan Grafik
    const barChartOptions = useMemo(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index' as const,
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false, // Dikelola kustom di UI header kartu
                },
                tooltip: {
                    backgroundColor: '#1E2922',
                    titleColor: '#FFFFFF',
                    bodyColor: '#E2E8F0',
                    borderColor: '#2E6B4E',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 10,
                    titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' as const },
                    bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
                    callbacks: {
                        label: function (context: any) {
                            const val = context.raw || 0;
                            return ` ${context.dataset.label}: Rp ${new Intl.NumberFormat('id-ID').format(val)}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' as const },
                        color: '#64748B',
                    },
                },
                y: {
                    border: { dash: [4, 4] },
                    grid: { color: '#F1F5F2' },
                    ticks: {
                        font: { family: 'Plus Jakarta Sans', size: 11 },
                        color: '#94A3B8',
                        callback: function (val: any) {
                            return val >= 1000000 ? `${Math.round(val / 1000000)} jt` : val;
                        },
                    },
                },
            },
        };
    }, []);

    // Rentang label periode untuk teks deskripsi
    const rangeDescription = useMemo(() => {
        switch (selectedRange) {
            case 's1': return 'Semester 1 (Januari - Juni)';
            case 's2': return 'Semester 2 (Juli - Desember)';
            case 'q1': return 'Kuartal 1 (Jan - Mar)';
            case 'q2': return 'Kuartal 2 (Apr - Jun)';
            case 'q3': return 'Kuartal 3 (Jul - Sep)';
            case 'q4': return 'Kuartal 4 (Okt - Des)';
            default: return `12 Bulan Lengkap (${selectedYear})`;
        }
    }, [selectedRange, selectedYear]);

    // Deskripsi Aksesibilitas WCAG AA untuk elemen Canvas Bar Chart
    const barChartAriaLabel = useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return `Grafik batang perbandingan rekap bulanan tahun ${selectedYear}, belum ada data.`;
        }
        const totalInc = chartData.reduce((acc, d) => acc + (d.income || 0), 0);
        const totalExp = chartData.reduce((acc, d) => acc + (d.expense || 0), 0);
        const formattedInc = new Intl.NumberFormat('id-ID').format(totalInc);
        const formattedExp = new Intl.NumberFormat('id-ID').format(totalExp);
        return `Grafik batang perbandingan rekap bulanan tahun ${selectedYear} (${rangeDescription}). Total akumulasi pemasukan Rp ${formattedInc}, total pengeluaran Rp ${formattedExp}.`;
    }, [chartData, selectedYear, rangeDescription]);

    return (
        <AuthenticatedLayout>
            <Head title={`Rekap Bulanan Tahun ${selectedYear} - FLOWID Finance`} />

            <div className="space-y-6">

                {/* ============================================================== */}
                {/* 1. HEADER HALAMAN & FILTER TAHUN                              */}
                {/* ============================================================== */}
                <section 
                    data-purpose="page-headline"
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/80 reveal-up reveal-delay-100"
                >
                    <div className="flex items-center gap-3">
                        {/* Round Botanical Icon Badge Sesuai Referensi */}
                        <div className="w-10 h-10 rounded-full bg-[#EAF2ED] border border-[#CDE1D4] flex items-center justify-center text-[#2E6B4E] shadow-sm shrink-0">
                            <CalendarRange className="w-5 h-5 stroke-[2]" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-[#143124] tracking-tight">
                                Rekap Bulanan
                            </h1>
                            <p className="text-xs sm:text-sm text-stone-500 font-medium">
                                Lihat ringkasan keuangan usaha FLOWID Florist setiap bulan.
                            </p>
                        </div>
                    </div>

                    {/* Filter Bar Terintegrasi: Tahun & Periode */}
                    <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto" data-purpose="filter-bar">
                        
                        {/* Filter Rentang Periode */}
                        <div className="relative">
                            <select
                                value={selectedRange}
                                onChange={(e) => handleRangeChange(e.target.value)}
                                aria-label="Pilih Rentang Periode"
                                className="appearance-none bg-white border border-stone-200 text-stone-700 text-xs font-semibold pl-3 pr-8 py-2 rounded-xl hover:border-stone-400 focus:border-[#2E6B4E] focus:ring-1 focus:ring-[#2E6B4E] outline-none transition cursor-pointer shadow-2xs"
                            >
                                <option value="all">Semua 12 Bulan</option>
                                <option value="s1">Semester 1 (Jan - Jun)</option>
                                <option value="s2">Semester 2 (Jul - Des)</option>
                                <option value="q1">Kuartal 1 (Q1)</option>
                                <option value="q2">Kuartal 2 (Q2)</option>
                                <option value="q3">Kuartal 3 (Q3)</option>
                                <option value="q4">Kuartal 4 (Q4)</option>
                            </select>
                            <Filter className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Filter Tahun Utama (Default 2026) */}
                        <div className="relative" data-purpose="year-filter">
                            <select
                                value={selectedYear}
                                onChange={(e) => handleYearChange(Number(e.target.value))}
                                aria-label="Pilih Tahun Evaluasi"
                                className="appearance-none bg-white border border-stone-200 text-stone-900 text-xs font-bold pl-3.5 pr-8 py-2 rounded-xl hover:border-stone-400 focus:border-[#2E6B4E] focus:ring-1 focus:ring-[#2E6B4E] outline-none transition cursor-pointer shadow-2xs"
                            >
                                {availableYears.map((yr) => (
                                    <option key={yr} value={yr}>
                                        Tahun {yr}
                                    </option>
                                ))}
                            </select>
                            <Calendar className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 2. 2-COLUMN DASHBOARD GRID (8 COLS KIRI & 4 COLS KANAN)        */}
                {/* ============================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* ========================================================== */}
                    {/* KOLOM KIRI (8 COLS): GROUPED BAR CHART PERBANDINGAN        */}
                    {/* ========================================================== */}
                    <section 
                        className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm flex flex-col justify-between reveal-left reveal-delay-200" 
                        data-purpose="chart-container"
                    >
                        <div className="flex-1 flex flex-col ">
                            {/* Judul & Header Grafik */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                                <div>
                                    <h2 className="text-sm sm:text-base font-bold text-stone-800 tracking-tight">
                                        Perbandingan Pemasukan dan Pengeluaran
                                    </h2>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                        Tren arus kas per bulan ({rangeDescription})
                                    </p>
                                </div>

                                {/* Legends Interaktif Sesuai Referensi */}
                                <div className="flex items-center gap-5 self-start sm:self-auto bg-[#FAF8F5] px-3.5 py-1.5 rounded-xl border border-stone-200/70">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                                        <span className="w-3 h-3 rounded-full bg-[#367554] shadow-2xs"></span>
                                        <span>Pemasukan</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                                        <span className="w-3 h-3 rounded-full bg-[#F47B8F] shadow-2xs"></span>
                                        <span>Pengeluaran</span>
                                    </div>
                                </div>
                            </div>

                            {/* Canvas Grafik Grouped Bar Chart - Tinggi Fleksibel Mengikuti Card Div */}
                            <div className="relative mt-4 flex-1 w-full min-h-[350px] h-[350px]" data-purpose="bar-chart">
                                <Bar 
                                    data={barChartData} 
                                    options={barChartOptions} 
                                    role="img"
                                    aria-label={barChartAriaLabel}
                                />
                            </div>
                        </div>

                        {/* Strip Ringkasan Akumulasi di Bagian Bawah Grafik */}
                        <div className="pt-4 mt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60">
                                <span className="text-[11px] text-stone-500 font-medium block">Total Pemasukan ({selectedYear})</span>
                                <span className="text-sm sm:text-base font-bold text-[#2E6B4E] tabular-nums mt-0.5 block">
                                    <CurrencyText amount={annualSummary.totalIncome} type="neutral" />
                                </span>
                            </div>
                            <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60">
                                <span className="text-[11px] text-stone-500 font-medium block">Total Pengeluaran ({selectedYear})</span>
                                <span className="text-sm sm:text-base font-bold text-[#D96B7B] tabular-nums mt-0.5 block">
                                    <CurrencyText amount={annualSummary.totalExpense} type="neutral" />
                                </span>
                            </div>
                            <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60">
                                <span className="text-[11px] text-stone-500 font-medium block">Akumulasi Laba Bersih</span>
                                <span className="text-sm sm:text-base font-bold text-[#143124] tabular-nums mt-0.5 block">
                                    <CurrencyText amount={annualSummary.netProfit} type="neutral" />
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* ========================================================== */}
                    {/* KOLOM KANAN (4 COLS): PANEL RINGKASAN BULANAN (INSIGHTS)   */}
                    {/* ========================================================== */}
                    <section 
                        className="lg:col-span-4 flex flex-col justify-start gap-4 reveal-right reveal-delay-250" 
                        data-purpose="monthly-summary"
                    >
                        <div className="flex items-center justify-between pb-1">
                            <h2 className="text-sm sm:text-base font-bold text-stone-800 tracking-tight flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>Ringkasan Bulanan</span>
                            </h2>
                            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200/60">
                                Evaluasi {selectedYear}
                            </span>
                        </div>

                        {/* 3 Kartu Insight Vertikal Sesuai Referensi Gambar 2 */}
                        <div className="flex flex-col gap-4">
                            
                            {/* KARTU 1: Bulan Terbaik (Trophy Solid Emas & Background Cream Lembut) */}
                            <div 
                                className="w-full bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm flex items-center gap-4 hover:border-amber-300 hover:shadow-md transition-all duration-200 group" 
                                data-purpose="best-month-card"
                            >
                                {/* Trophy Icon Badge Solid Emas Sesuai Referensi */}
                                <div className="w-14 h-14 rounded-full bg-[#FEF6E6] border border-amber-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                                    <svg className="w-7 h-7 text-[#D9822B]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-stone-600 leading-none">
                                        Bulan Terbaik
                                    </p>
                                    <p className="text-xl font-bold text-stone-900 mt-1.5 truncate">
                                        {insights.bestMonth.name}
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1 tracking-tight truncate font-medium">
                                        (dengan pemasukan {insights.bestMonth.formattedIncome})
                                    </p>
                                </div>
                            </div>

                            {/* KARTU 2: Pengeluaran Terbesar (Alert Segitiga Merah & Border Lembut Pink) */}
                            <div 
                                className="w-full bg-white rounded-3xl p-5 border border-[#FAC7CF] shadow-sm flex items-center gap-4 hover:border-rose-400 hover:shadow-md transition-all duration-200 group" 
                                data-purpose="highest-expense-card"
                            >
                                {/* Alert Triangle Badge Merah Sesuai Referensi */}
                                <div className="w-14 h-14 rounded-full bg-[#FCECEE] border border-rose-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                                    <svg className="w-7 h-7 text-[#DE5B6F]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        <line x1="12" x2="12" y1="9" y2="13" />
                                        <line x1="12" x2="12.01" y1="17" y2="17" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-stone-600 leading-none">
                                        Pengeluaran Terbesar
                                    </p>
                                    <p className="text-xl font-bold text-stone-900 mt-1.5 truncate">
                                        {insights.highestExpense.name}
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1 tracking-tight font-medium truncate">
                                        ({insights.highestExpense.categoryGroup})
                                    </p>
                                </div>
                            </div>

                            {/* KARTU 3: Saldo Akhir Bulan Ini (Kantong Uang / Hijau Botani) */}
                            <div 
                                className="w-full bg-white rounded-3xl p-5 border border-[#CEE4D7] shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200 group" 
                                data-purpose="ending-balance-card"
                            >
                                {/* Money Bag Badge Hijau Botani */}
                                <div className="w-14 h-14 rounded-2xl bg-[#D2EADA] border border-[#BBDCC7] flex items-center justify-center shrink-0 text-3xl group-hover:scale-105 transition-transform shadow-2xs">
                                    <span aria-label="Kantong Uang" role="img">💰</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-stone-600 leading-none">
                                        Saldo Akhir Bulan ini
                                    </p>
                                    <p className="text-2xl font-extrabold text-[#1B4B36] mt-1.5 tracking-tight tabular-nums truncate">
                                        {insights.formattedEndingBalance}
                                    </p>
                                    <p className="text-xs text-[#2E6B4E] mt-1 font-medium truncate">
                                        Periode berjalan: {insights.activeMonthLabel}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </section>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
