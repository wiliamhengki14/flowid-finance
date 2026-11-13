import React from 'react';
import { ListFilter, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import CurrencyText from '../atoms/CurrencyText';
import Badge from '../atoms/Badge';

export interface RecentTransactionItem {
    id: number;
    date: string;
    description: string;
    category_name: string;
    category_color?: string;
    type: 'pemasukan' | 'pengeluaran';
    amount: number;
    is_verified?: boolean;
}

export interface RecentTransactionsTableProps {
    transactions?: RecentTransactionItem[];
    className?: string;
}

declare function route(name?: string, params?: any): any;

export default function RecentTransactionsTable({
    transactions = [],
    className = '',
}: RecentTransactionsTableProps) {
    const defaultList: RecentTransactionItem[] = [
        { id: 1, date: '05 Nov 2026', description: 'Penjualan Papan Bunga', category_name: 'Penjualan', type: 'pemasukan', amount: 750000, is_verified: true },
        { id: 2, date: '04 Nov 2026', description: 'Pembelian Bunga', category_name: 'Bahan Baku', type: 'pengeluaran', amount: 300000, is_verified: true },
        { id: 3, date: '03 Nov 2026', description: 'DP Pesanan Acara', category_name: 'Penjualan', type: 'pemasukan', amount: 500000, is_verified: true },
        { id: 4, date: '02 Nov 2026', description: 'Biaya Transportasi', category_name: 'Operasional', type: 'pengeluaran', amount: 150000, is_verified: true },
    ];

    const items = transactions.length > 0 ? transactions : defaultList;

    return (
        <div className={`bg-white border border-[#EDE4D6] rounded-2xl p-5 shadow-2xs flex flex-col justify-between ${className}`}>
            <div>
                {/* Header & Link Lihat Semua */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-[#2E6B4E] text-white">
                            <ListFilter className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm tracking-tight">
                            Transaksi Terbaru
                        </h4>
                    </div>

                    <Link
                        href={typeof route !== 'undefined' && route().has('transactions.index') ? route('transactions.index') : '/transactions'}
                        className="text-xs font-semibold text-[#2E6B4E] hover:underline flex items-center gap-1 transition-all"
                    >
                        <span>Lihat Semua</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="text-slate-400 font-medium border-b border-slate-100">
                                <th className="py-3 px-2 font-medium">Tanggal</th>
                                <th className="py-3 px-2 font-medium">Keterangan</th>
                                <th className="py-3 px-2 font-medium">Kategori</th>
                                <th className="py-3 px-2 font-medium">Jenis</th>
                                <th className="py-3 px-2 font-medium text-right sm:text-left">Nominal</th>
                                <th className="py-3 px-2 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {items.map((row) => (
                                <tr key={row.id} className="hover:bg-[#FAF8F5] transition-colors">
                                    <td className="py-3 px-2 whitespace-nowrap text-slate-500 font-medium">
                                        {row.date}
                                    </td>
                                    <td className="py-3 px-2 font-semibold text-slate-800 whitespace-nowrap">
                                        {row.description}
                                    </td>
                                    <td className="py-3 px-2 whitespace-nowrap">
                                        <Badge 
                                            variant={row.category_name === 'Penjualan' ? 'income' : row.category_name === 'Operasional' ? 'warning' : 'expense'} 
                                            size="sm"
                                        >
                                            {row.category_name}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-2 whitespace-nowrap">
                                        <Badge 
                                            variant={row.type === 'pemasukan' ? 'income' : 'expense'} 
                                            size="sm"
                                        >
                                            {row.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-2 font-bold text-slate-900 text-right sm:text-left whitespace-nowrap tabular-nums">
                                        <CurrencyText amount={row.amount} type="neutral" />
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        <span className="inline-flex items-center justify-center text-emerald-600 font-bold select-none text-sm">
                                            ✓
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

