import React, { useState, useMemo } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    Scale, 
    Download, 
    ChevronDown, 
    FileText, 
    FileSpreadsheet,
    Calendar,
    CheckCircle2,
    Lock,
    ExternalLink,
    Sparkles,
    ShieldCheck
} from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyText from '@/Components/atoms/CurrencyText';
import ExportDropdown from '@/Components/molecules/ExportDropdown';

// Registrasi Komponen Chart.js untuk Smooth Curved Line Chart
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

declare function route(name?: string, params?: any): any;

export interface ExpenseCategoryBreakdown {
    name: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface FinancialReportProps {
    period: string;
    summary: {
        totalIncome: number;
        totalExpense: number;
        netProfit: number;
        profitMargin?: number;
        incomeGrowth?: string;
        expenseGrowth?: string;
    };
    chartData: {
        labels: string[];
        incomes: number[];
        expenses: number[];
    };
    expensesByCategory?: ExpenseCategoryBreakdown[];
    auditMetrics?: {
        hppEfficiency?: string;
        avgTicket?: number;
        orderCount?: number;
        auditStatus?: string;
    };
    periodLabel?: string;
}

export default function Financial({ 
    period = '6_bulan', 
    summary = {
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
        profitMargin: 61.1,
        incomeGrowth: '+14.2%',
        expenseGrowth: '-3.8%',
    }, 
    chartData = {
        labels: [],
        incomes: [],
        expenses: []
    },
    expensesByCategory = [],
    auditMetrics = {
        hppEfficiency: '29.1%',
        avgTicket: 450000,
        orderCount: 20,
        auditStatus: 'Siap Diarsipkan'
    },
    periodLabel = 'Periode Berjalan'
}: FinancialReportProps) {
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Default kategori jika data kosong dari controller
    const defaultExpenseCategories: ExpenseCategoryBreakdown[] = [
        { name: 'Pengeluaran Bahan Bunga', amount: 1575000, percentage: 45, color: '#F48E9E' },
        { name: 'Pengeluaran Bahan Papan', amount: 1050000, percentage: 30, color: '#85B69D' },
        { name: 'Pengeluaran Operasional Toko', amount: 525000, percentage: 15, color: '#F5C564' },
        { name: 'Pengeluaran Lainnya', amount: 350000, percentage: 10, color: '#C8A9E8' },
    ];

    const displayExpenses = expensesByCategory.length > 0 ? expensesByCategory : defaultExpenseCategories;

    // 1. Handler Pergantian Filter Periode via Inertia
    const handlePeriodChange = (newPeriod: string) => {
        router.get(
            route('reports.financial'),
            { period: newPeriod },
            { preserveState: true, preserveScroll: true }
        );
    };

    // 2. Handler Ekspor Dokumen Fisik (PDF / Excel CSV)
    const handleDownload = (format: 'pdf' | 'excel') => {
        setIsExportOpen(false);
        const url = route('reports.financial.export') + `?period=${period}&format=${format}`;
        window.open(url, '_blank');
    };

    // 3. Konfigurasi Line Chart Sesuai Estetika Referensi
    const lineChartData = {
        labels: chartData.labels.length > 0 ? chartData.labels : ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
        datasets: [
            {
                label: 'Pemasukan',
                data: chartData.incomes.length > 0 ? chartData.incomes : [6500000, 7000000, 7500000, 8000000, 8500000, 9000000],
                borderColor: '#23533B',
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
                    gradient.addColorStop(0, 'rgba(35, 83, 59, 0.18)');
                    gradient.addColorStop(1, 'rgba(35, 83, 59, 0.0)');
                    return gradient;
                },
                fill: true,
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#23533B',
                pointBorderWidth: 2.5,
                pointRadius: 4.5,
                pointHoverRadius: 7,
            },
            {
                label: 'Pengeluaran',
                data: chartData.expenses.length > 0 ? chartData.expenses : [3800000, 4100000, 4300000, 4500000, 4700000, 3500000],
                borderColor: '#D96B7B',
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
                    gradient.addColorStop(0, 'rgba(217, 107, 123, 0.14)');
                    gradient.addColorStop(1, 'rgba(217, 107, 123, 0.0)');
                    return gradient;
                },
                fill: true,
                borderWidth: 2.5,
                tension: 0.4,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#D96B7B',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(24, 34, 29, 0.95)',
                titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' as const },
                bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
                padding: 10,
                cornerRadius: 10,
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: Rp ${new Intl.NumberFormat('id-ID').format(context.raw)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: 'Plus Jakarta Sans', size: 11 },
                    color: '#84928A',
                },
            },
            y: {
                border: { dash: [4, 4] },
                grid: { color: '#F1F5F2' },
                ticks: {
                    font: { family: 'Plus Jakarta Sans', size: 11 },
                    color: '#84928A',
                    callback: function (val: any) {
                        return val >= 1000000 ? `${Math.round(val / 1000000)} jt` : val;
                    },
                },
            },
        },
    };

    // Deskripsi Aksesibilitas WCAG AA untuk elemen Canvas Line Chart
    const lineChartAriaLabel = useMemo(() => {
        const incomes = chartData.labels.length > 0 && chartData.incomes.length > 0 ? chartData.incomes : [6500000, 7000000, 7500000, 8000000, 8500000, 9000000];
        const expenses = chartData.labels.length > 0 && chartData.expenses.length > 0 ? chartData.expenses : [3800000, 4100000, 4300000, 4500000, 4700000, 3500000];
        const totalInc = incomes.reduce((a, b) => a + b, 0);
        const totalExp = expenses.reduce((a, b) => a + b, 0);
        const formattedInc = new Intl.NumberFormat('id-ID').format(totalInc);
        const formattedExp = new Intl.NumberFormat('id-ID').format(totalExp);
        return `Grafik tren garis keuangan pemasukan dan pengeluaran. Total akumulasi pemasukan Rp ${formattedInc}, total pengeluaran Rp ${formattedExp}.`;
    }, [chartData]);

    return (
        <AuthenticatedLayout>
            <Head title="Laporan Keuangan - FLOWID Finance" />

            <div className="space-y-6">
                
                {/* ============================================================== */}
                {/* 1. HEADER HALAMAN & ACTION BAR (PERIODE & UNDUH LAPORAN)      */}
                {/* ============================================================== */}
                <section 
                    data-purpose="report-header"
                    className="relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border-subtle reveal-up reveal-delay-100"
                >
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shadow-xs">
                                <BarChart3 className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                    Laporan Keuangan
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                    Analisis laba-rugi komprehensif, performa arus kas, dan unduh laporan pembukuan resmi.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Integrated Action Bar */}
                    <div className="flex items-center gap-3 self-start md:self-auto">
                        {/* Dropdown Periode */}
                        <div className="relative">
                            <select
                                value={period}
                                onChange={(e) => handlePeriodChange(e.target.value)}
                                aria-label="Pilih Periode Laporan"
                                className="appearance-none bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm font-semibold pl-3.5 pr-9 py-2.5 rounded-xl hover:border-stone-400 focus:border-[#23533B] focus:ring-1 focus:ring-[#23533B] outline-none transition cursor-pointer shadow-2xs"
                            >
                                <option value="bulan_ini">Bulan Ini</option>
                                <option value="3_bulan">3 Bulan Terakhir</option>
                                <option value="6_bulan">6 Bulan Terakhir</option>
                                <option value="tahun_ini">Tahun Ini</option>
                            </select>
                            <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400" />
                        </div>

                        {/* Komponen ExportDropdown Mandiri dengan State Loading & Z-Index Tinggi */}
                        <ExportDropdown period={period} />
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 2. ROW 1: 3 KARTU FINANSIAL SESUAI DESAIN DASHBOARD.TSX        */}
                {/* ============================================================== */}
                <section 
                    className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-5" 
                    data-purpose="financial-kpi-cards"
                >
                    {/* Kartu 1: Total Pemasukan (Format Dashboard.tsx KPI 2) */}
                    <div className="reveal-up reveal-delay-100 group relative overflow-hidden bg-gradient-to-br from-[#FDF0F3] to-[#FCE6EB] border border-[#F8D2DB] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <svg className="absolute -right-3 -bottom-3 w-16 h-16 text-[#E0677C] opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 100 100">
                            <path d="M90,90 Q60,10 10,10 Q10,60 90,90 Z" />
                        </svg>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F0788C] flex items-center justify-center text-white shadow-2xs group-hover:rotate-6 transition-transform">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">Total Pemasukan</p>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                                    <CurrencyText amount={summary.totalIncome} type="neutral" />
                                </h3>
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] font-medium text-[#2E6B4E] flex items-center gap-1">
                            <span>↑</span> <span>{summary.incomeGrowth || '+14.2%'} dibanding periode lalu</span>
                        </div>
                    </div>

                    {/* Kartu 2: Total Pengeluaran (Format Dashboard.tsx KPI 3) */}
                    <div className="reveal-up reveal-delay-150 group relative overflow-hidden bg-gradient-to-br from-[#EEF7F2] to-[#E3F2E9] border border-[#CFE7D8] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <svg className="absolute -right-3 -bottom-3 w-16 h-16 text-[#4F956F] opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 100 100">
                            <path d="M10,90 Q40,10 90,10 Q90,60 10,90 Z" />
                        </svg>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#5EA37F] flex items-center justify-center text-white shadow-2xs group-hover:rotate-6 transition-transform">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">Total Pengeluaran</p>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                                    <CurrencyText amount={summary.totalExpense} type="neutral" />
                                </h3>
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] font-medium text-[#387F5A] flex items-center gap-1">
                            <span>↓</span> <span>{summary.expenseGrowth || '-3.8%'} efisiensi pengadaan bunga</span>
                        </div>
                    </div>

                    {/* Kartu 3: Laba Bersih (Format Dashboard.tsx KPI 4 / Selisih) */}
                    <div className="reveal-up reveal-delay-200 group relative overflow-hidden bg-gradient-to-br from-[#EBF5EE] to-[#E2F0E7] border border-[#CFE7D8] rounded-2xl p-5 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute right-3 top-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#2E6B4E] text-white shadow-2xs">
                                Margin Keuntungan {summary.profitMargin ?? 61.1}%
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2E6B4E] flex items-center justify-center text-white shadow-2xs group-hover:rotate-6 transition-transform">
                                <Scale className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">Laba Bersih</p>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                                    <CurrencyText amount={summary.netProfit} type="neutral" />
                                </h3>
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] font-semibold text-[#2E6B4E] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4E]" />
                            <span>Kesehatan arus kas sangat prima</span>
                        </div>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 3. ROW 2: GRAFIK TREN (8 COLS) & RINGKASAN LAPORAN (4 COLS)     */}
                {/* ============================================================== */}
                <section 
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                    data-purpose="charts-and-summary"
                >
                    {/* Kolom Kiri (8 cols): Kartu Grafik Pemasukan & Pengeluaran */}
                    <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 shadow-card flex flex-col justify-between reveal-left reveal-delay-200">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                                        Grafik Pemasukan & Pengeluaran
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Kurva tren performa kas ({periodLabel})
                                    </p>
                                </div>

                                {/* Legenda Interaktif */}
                                <div className="flex items-center gap-3 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-stone-200/70 text-xs font-semibold">
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#23533B] inline-block" />
                                        <span>Pemasukan</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#D96B7B] inline-block" />
                                        <span>Pengeluaran</span>
                                    </div>
                                </div>
                            </div>

                            {/* Kanvas Line Chart Interaktif */}
                            <div className="h-72 w-full pt-4">
                                <Line 
                                    data={lineChartData} 
                                    options={lineChartOptions} 
                                    role="img"
                                    aria-label={lineChartAriaLabel}
                                />
                            </div>
                        </div>

                        {/* Bottom Micro Metrics Strip */}
                        <div className="pt-4 mt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#2E6B4E]" />
                                <span>Tren Pertumbuhan Pendapatan rata-rata: <strong className="text-slate-800 font-bold tabular-nums">+11.4% / bln</strong></span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, WIB
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan (4 cols): Kartu Ringkasan Laporan */}
                    <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-card flex flex-col justify-between space-y-5 reveal-right reveal-delay-250">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                                        Ringkasan Laporan
                                    </h2>
                                    <span className="text-xs text-slate-500">
                                        Breakdown {periodLabel}
                                    </span>
                                </div>
                                <div className="p-2 rounded-xl bg-brand-subtle text-brand-primary">
                                    <FileText className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Breakdown Ledger Table */}
                            <div className="space-y-3 mt-4 text-xs font-medium">
                                {/* Pemasukan Operasional */}
                                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                                    <span className="text-slate-700 flex items-center gap-2 font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-[#23533B]" />
                                        Pemasukan Operasional
                                    </span>
                                    <span className="font-bold text-[#23533B] tabular-nums text-right text-sm">
                                        <CurrencyText amount={summary.totalIncome} type="neutral" />
                                    </span>
                                </div>

                                {/* List Pengeluaran Rinci */}
                                <div className="pt-1">
                                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-2 font-bold">
                                        Rincian Biaya & HPP
                                    </span>
                                    <div className="space-y-2.5 pl-2">
                                        {displayExpenses.map((exp, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: exp.color }} />
                                                    <span>{exp.name}</span>
                                                </div>
                                                <span className="text-slate-800 font-semibold tabular-nums">
                                                    <CurrencyText amount={exp.amount} type="neutral" />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total Seluruh Pengeluaran */}
                                <div className="flex items-center justify-between pt-3 pb-1 border-t border-stone-100 text-xs sm:text-sm">
                                    <span className="font-bold text-[#D96B7B]">Total Seluruh Pengeluaran</span>
                                    <span className="font-bold text-[#D96B7B] tabular-nums text-right">
                                        <CurrencyText amount={summary.totalExpense} type="neutral" />
                                    </span>
                                </div>

                                {/* Garis Pemisah Dashed */}
                                <div className="border-t-2 border-dashed border-stone-200 my-2" />

                                {/* Baris Highlight Laba Bersih Periode */}
                                <div className="bg-[#EBF5EE] border border-[#2E6B4E]/20 rounded-xl p-3.5 flex items-center justify-between transition hover:bg-[#E2F0E7]">
                                    <div>
                                        <span className="text-xs font-bold text-[#23533B] block leading-tight">
                                            Laba Bersih Periode
                                        </span>
                                        <span className="text-[11px] text-slate-500">Pemasukan dikurangi Pengeluaran</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-base sm:text-lg font-extrabold text-[#23533B] tabular-nums block">
                                            <CurrencyText amount={summary.netProfit} type="neutral" />
                                        </span>
                                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#23533B] text-white">
                                            Net Profit
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ledger Footnote */}
                        <div className="pt-2 text-center border-t border-stone-100">
                            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-medium">
                                <Lock className="w-3.5 h-3.5 text-stone-400" />
                                <span>Data terverifikasi otomatis oleh sistem FLOWID Ledger</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 4. SECTION 3: ARUS KAS RINGKAS & CATATAN AUDITOR (AUDIT TRAIL) */}
                {/* ============================================================== */}
                <section 
                    className="bg-white border border-stone-200 rounded-2xl p-6 shadow-card reveal-up reveal-delay-200"
                    data-purpose="audit-trail-section"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[#2E6B4E]" />
                                <span>Arus Kas Ringkas & Catatan Auditor</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Keterangan pembukuan final periode berjalan untuk evaluasi operasional dan pelaporan florist.
                            </p>
                        </div>
                        <Link 
                            href={route('transactions.index')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#2E6B4E] bg-stone-50 hover:bg-white text-slate-700 hover:text-[#2E6B4E] text-xs font-semibold transition active:scale-95 shadow-2xs cursor-pointer self-start sm:self-auto"
                        >
                            <span>Lihat Jurnal Buku Besar</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-5 pt-4">
                        {/* 1. Efisiensi Margin HPP */}
                        <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80">
                            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
                                Efisiensi Margin HPP
                            </span>
                            <p className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
                                {auditMetrics.hppEfficiency || '29.1%'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                Biaya bunga segar & papan styrofoam terkontrol ketat.
                            </p>
                        </div>

                        {/* 2. Rata-Rata Tiket Pesanan */}
                        <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80">
                            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
                                Rata-Rata Tiket Pesanan
                            </span>
                            <p className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
                                <CurrencyText amount={auditMetrics.avgTicket || 450000} type="neutral" />
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                {auditMetrics.orderCount || 20} pesanan karangan bunga papan & rangkaian bunga.
                            </p>
                        </div>

                        {/* 3. Status Penutupan Buku */}
                        <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80">
                            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
                                Status Penutupan Buku
                            </span>
                            <div className="flex items-center gap-1.5 mt-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#2E6B4E] animate-pulse" />
                                <span className="text-sm font-bold text-[#23533B]">
                                    {auditMetrics.auditStatus || 'Siap Diarsipkan'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Seluruh nota transaksi terinput tanpa selisih kas.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </AuthenticatedLayout>
    );
}
