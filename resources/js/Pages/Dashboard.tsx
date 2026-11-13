import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { Wallet, TrendingUp, TrendingDown, Scale, PlusCircle, Sparkles } from 'lucide-react';
import CurrencyText from '../Components/atoms/CurrencyText';
import FinancialChart, { ChartMonthData } from '../Components/organisms/FinancialChart';
import ExpenseDonutChart, { CategoryDistribution } from '../Components/organisms/ExpenseDonutChart';
import RecentTransactionsTable, { RecentTransactionItem } from '../Components/organisms/RecentTransactionsTable';
import MonthlySummaryWidget, { MonthlyDigestData } from '../Components/organisms/MonthlySummaryWidget';

export interface DashboardSummary {
    balance: number;
    totalIncome: number;
    totalExpense: number;
    netIncome: number;
    incomeGrowth?: string;
    expenseGrowth?: string;
    balanceGrowth?: string;
    selectedMonth?: number;
    selectedMonthName?: string;
}

export interface DashboardProps {
    summary: DashboardSummary;
    allMonthlyData?: ChartMonthData[];
    expenseCategories?: CategoryDistribution[];
    recentTransactions?: RecentTransactionItem[];
    monthlyDigests?: Record<number, MonthlyDigestData>;
    initialDigest?: MonthlyDigestData;
}

declare function route(name?: string, params?: any): any;

export default function Dashboard({
    summary,
    allMonthlyData = [],
    expenseCategories = [],
    recentTransactions = [],
    monthlyDigests = {},
    initialDigest,
}: DashboardProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard - FLOWID Finance" />

            <div className="space-y-6">
                {/* ========================================================== */}
                {/* GREETING BANNER & ACTION SHORTCUT (REVEAL LEFT & RIGHT)    */}
                {/* ========================================================== */}
                <section 
                    data-purpose="greeting-banner"
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div className="reveal-left reveal-delay-100">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
                                Selamat datang di FLOWID Finance!
                            </h2>
                            <span className="text-2xl select-none animate-bounce">🌸</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                            Kelola keuangan usaha papan bunga Anda dengan lebih mudah, tenang, dan transparan.
                        </p>
                    </div>

                    {/* Tombol Aksi Cepat Tambah Transaksi (Muncul dari Kanan) */}
                    <div className="reveal-right reveal-delay-150 self-start sm:self-auto">
                        <Link
                            href={typeof route !== 'undefined' && route().has('transactions.create') ? route('transactions.create') : '/transactions/create'}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E6B4E] hover:bg-[#23533C] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Catat Transaksi Baru</span>
                        </Link>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* ROW 1: 4 KPI SUMMARY CARDS DENGAN REVEAL-UP PROGRESSIVE    */}
                {/* ========================================================== */}
                <section 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" 
                    data-purpose="kpi-cards"
                >
                    {/* KPI 1: Saldo Usaha Kumulatif */}
                    <div className="reveal-up reveal-delay-100 group relative overflow-hidden bg-gradient-to-br from-[#EBF5EE] to-[#E2F0E7] border border-[#CFE7D8] rounded-2xl p-4 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <svg className="absolute -right-3 -bottom-3 w-16 h-16 text-[#347A55] opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 100 100">
                            <path d="M10,90 Q40,10 90,10 Q90,60 10,90 Z" />
                        </svg>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#2E6B4E] flex items-center justify-center text-white shadow-2xs group-hover:rotate-6 transition-transform">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">Saldo Usaha</p>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight tabular-nums">
                                    <CurrencyText amount={summary.balance} type="neutral" />
                                </h3>
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] font-medium text-[#2E6B4E] flex items-center gap-1">
                            <span>↑</span> <span>{summary.balanceGrowth || '+12%'} dari bulan lalu</span>
                        </div>
                    </div>

                    {/* KPI 2: Total Pemasukan Bulan Berjalan */}
                    <div className="reveal-up reveal-delay-150 group relative overflow-hidden bg-gradient-to-br from-[#FDF0F3] to-[#FCE6EB] border border-[#F8D2DB] rounded-2xl p-4 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <svg className="absolute -right-3 -bottom-3 w-16 h-16 text-[#E0677C] opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 100 100">
                            <path d="M90,90 Q60,10 10,10 Q10,60 90,90 Z" />
                        </svg>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F0788C] flex items-center justify-center text-white shadow-2xs group-hover:rotate-6 transition-transform">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">Total Pemasukan</p>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight tabular-nums">
                                    <CurrencyText amount={summary.totalIncome} type="neutral" />
                                </h3>
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] font-medium text-[#2E6B4E] flex items-center gap-1">
                            <span>↑</span> <span>{summary.incomeGrowth || '+15%'} dari bulan lalu</span>
                        </div>
                    </div>

                    {/* KPI 3: Total Pengeluaran Bulan Berjalan */}
                    <div className="reveal-up reveal-delay-200 group relative overflow-hidden bg-gradient-to-br from-[#EEF7F2] to-[#E3F2E9] border border-[#CFE7D8] rounded-2xl p-4 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <svg className="absolute -right-3 -bottom-3 w-16 h-16 text-[#4F956F] opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 100 100">
                            <path d="M10,90 Q40,10 90,10 Q90,60 10,90 Z" />
                        </svg>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#5EA37F] flex items-center justify-center text-white shadow-2xs group-hover:rotate-6 transition-transform">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">Total Pengeluaran</p>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight tabular-nums">
                                    <CurrencyText amount={summary.totalExpense} type="neutral" />
                                </h3>
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] font-medium text-[#387F5A] flex items-center gap-1">
                            <span>{summary.expenseGrowth?.startsWith('+') ? '↑' : '↓'}</span>
                            <span>{summary.expenseGrowth || '-8%'} dari bulan lalu</span>
                        </div>
                    </div>

                    {/* KPI 4: Selisih Bersih (Net Income) */}
                    <div className="reveal-up reveal-delay-250 group relative overflow-hidden bg-gradient-to-br from-[#FDF0F3] to-[#FCE5EB] border border-[#F8D0DA] rounded-2xl p-4 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute right-2 top-2 text-[#E2768A] opacity-40 text-xs select-none">
                            <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#E87388] flex items-center justify-center text-white shadow-2xs group-hover:rotate-6 transition-transform">
                                <Scale className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 font-medium">Selisih</p>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight tabular-nums">
                                    <CurrencyText amount={summary.netIncome} type="neutral" />
                                </h3>
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] font-semibold">
                            {summary.netIncome >= 0 ? (
                                <span className="text-[#2E6B4E]">Keuangan dalam kondisi baik!</span>
                            ) : (
                                <span className="text-rose-600 font-bold">⚠️ Peringatan: Keuangan mengalami defisit!</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* ========================================================== */}
                {/* ROW 2: CHARTS SECTION (GRAFIK KIRI col-span-7 & DONUT KANAN col-span-5) */}
                {/* ========================================================== */}
                <section 
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5" 
                    data-purpose="charts-row"
                >
                    <div className="reveal-left reveal-delay-200 lg:col-span-7 flex flex-col">
                        <FinancialChart 
                            data={allMonthlyData} 
                            className="h-full" 
                        />
                    </div>
                    <div className="reveal-right reveal-delay-250 lg:col-span-5 flex flex-col">
                        <ExpenseDonutChart 
                            categories={expenseCategories} 
                            className="h-full" 
                        />
                    </div>
                </section>

                {/* ========================================================== */}
                {/* ROW 3: TRANSAKSI TERBARU (KIRI) & RINGKASAN BULANAN (KANAN)*/}
                {/* ========================================================== */}
                <section 
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5" 
                    data-purpose="transactions-and-summary"
                >
                    <div className="reveal-left reveal-delay-200 lg:col-span-8 flex flex-col">
                        <RecentTransactionsTable 
                            transactions={recentTransactions} 
                            className="h-full" 
                        />
                    </div>
                    <div className="reveal-right reveal-delay-250 lg:col-span-4 flex flex-col">
                        <MonthlySummaryWidget 
                            data={initialDigest}
                            allDigests={monthlyDigests}
                            className="h-full" 
                        />
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
