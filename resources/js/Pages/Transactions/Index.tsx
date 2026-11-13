import React, { useState, FormEventHandler, useMemo } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { 
    FileText, 
    Search, 
    Filter as FilterIcon, 
    Calendar, 
    Pencil, 
    Trash2, 
    X, 
    AlertTriangle, 
    Save,
    ChevronDown,
    RotateCcw,
    SearchX
} from 'lucide-react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/atoms/Button';
import Input from '@/Components/atoms/Input';
import Toast from '@/Components/molecules/Toast';
import Modal from '@/Components/Modal';

declare function route(name?: string, params?: any): any;

// 1. Deklarasi Interface Data
export interface CategoryItem {
    id: number;
    name: string;
    group_name: string;
    type: 'pemasukan' | 'pengeluaran';
    color_hex: string;
}

export interface TransactionItem {
    id: number;
    transaction_date: string;
    description: string;
    category_id: number;
    category: CategoryItem;
    type: 'pemasukan' | 'pengeluaran';
    amount: number;
    payment_method: 'transfer' | 'tunai' | 'qris';
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTransactions {
    data: TransactionItem[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
}

interface TransactionsIndexProps {
    transactions: PaginatedTransactions;
    categories: CategoryItem[];
    filters: {
        search?: string;
        type?: string;
        category_id?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function Index({ transactions, categories = [], filters = {} }: TransactionsIndexProps) {
    const { flash } = usePage<PageProps>().props;
    const [toastMessage, setToastMessage] = useState<string | null>(flash?.success || null);

    // State Filter Toolbar
    const [search, setSearch] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    // State Error Validasi Rentang Tanggal Terbalik
    const [dateRangeError, setDateRangeError] = useState<string | null>(null);

    // State Modal Edit & Modal Hapus
    const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);
    const [deletingTransaction, setDeletingTransaction] = useState<TransactionItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Form Edit
    const [editForm, setEditForm] = useState({
        transaction_date: '',
        category_id: 0,
        type: 'pemasukan' as 'pemasukan' | 'pengeluaran',
        amount: 0,
        description: '',
        payment_method: 'transfer' as 'transfer' | 'tunai' | 'qris',
    });

    // Format Tanggal: YYYY-MM-DD -> DD/MM/YYYY
    const formatDate = (dateStr: string): string => {
        if (!dateStr) return '-';
        const parts = dateStr.split('T')[0].split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    // Format Nominal Rupiah (+Rp750.000 / -Rp300.000)
    const formatNominal = (amount: number, type: 'pemasukan' | 'pengeluaran'): string => {
        const formatted = new Intl.NumberFormat('id-ID').format(amount);
        return type === 'pemasukan' ? `+Rp${formatted}` : `-Rp${formatted}`;
    };

    // Filter kategori untuk dropdown edit modal
    const editFilteredCategories = useMemo(() => {
        return categories.filter((cat) => cat.type === editForm.type);
    }, [categories, editForm.type]);

    // Opsi Kategori untuk Filter Bar
    const categoryFilterOptions = useMemo(() => {
        const filtered = selectedType 
            ? categories.filter((c) => c.type === selectedType)
            : categories;
        return [
            { value: '', label: 'Semua Kategori' },
            ...filtered.map((cat) => ({ value: String(cat.id), label: cat.name })),
        ];
    }, [categories, selectedType]);

    // Batasi tombol nomor paginasi maksimal 5 tombol halaman
    const { prevLink, nextLink, visiblePageLinks } = useMemo(() => {
        if (!transactions.links || transactions.links.length === 0) {
            return { prevLink: null, nextLink: null, visiblePageLinks: [] };
        }

        const prev = transactions.links[0];
        const next = transactions.links[transactions.links.length - 1];
        const pages = transactions.links.slice(1, -1);

        const totalPages = transactions.last_page || 1;
        const currentPage = transactions.current_page || 1;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        const visible = pages.filter((link) => {
            const pageNum = parseInt(link.label, 10);
            return !isNaN(pageNum) && pageNum >= startPage && pageNum <= endPage;
        });

        return { prevLink: prev, nextLink: next, visiblePageLinks: visible };
    }, [transactions.links, transactions.last_page, transactions.current_page]);

    // Eksekusi Filter
    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi rentang tanggal terbalik (Start > End) di sisi klien
        if (startDate && endDate && startDate > endDate) {
            setDateRangeError('Tanggal Mulai tidak boleh lebih besar dari Tanggal Akhir. Silakan perbaiki rentang tanggal.');
            return;
        }

        setDateRangeError(null);
        router.get(
            route('transactions.index'),
            {
                search: search || undefined,
                type: selectedType || undefined,
                category_id: selectedCategory || undefined,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Reset Semua Filter
    const handleResetFilter = () => {
        setSearch('');
        setSelectedType('');
        setSelectedCategory('');
        setStartDate('');
        setEndDate('');
        setDateRangeError(null);
        router.get(route('transactions.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const hasActiveFilters = Boolean(search || selectedType || selectedCategory || startDate || endDate);

    // Buka Modal Edit
    const openEditModal = (item: TransactionItem) => {
        setEditingTransaction(item);
        setEditForm({
            transaction_date: item.transaction_date.split('T')[0],
            category_id: item.category_id,
            type: item.type,
            amount: item.amount,
            description: item.description,
            payment_method: item.payment_method,
        });
    };

    // Simpan Perubahan Edit
    const handleUpdateSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingTransaction) return;

        setIsSubmitting(true);
        router.put(
            route('transactions.update', editingTransaction.id),
            editForm,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingTransaction(null);
                    setIsSubmitting(false);
                    setToastMessage('Transaksi berhasil diperbarui.');
                },
                onError: () => setIsSubmitting(false),
            }
        );
    };

    // Konfirmasi Hapus Data
    const handleDeleteConfirm = () => {
        if (!deletingTransaction) return;

        setIsSubmitting(true);
        router.delete(route('transactions.destroy', deletingTransaction.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingTransaction(null);
                setIsSubmitting(false);
                setToastMessage('Transaksi berhasil dihapus dari buku kas.');
            },
            onError: () => setIsSubmitting(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Transaksi - FLOWID Finance" />

            {/* Floating Toast Notification */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 animate-bounce-subtle">
                    <Toast
                        type="success"
                        message={toastMessage}
                        onClose={() => setToastMessage(null)}
                    />
                </div>
            )}

            {/* Header Halaman (Reveal Up) */}
            <div className="mb-6 reveal-up reveal-delay-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shadow-xs">
                        <FileText className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                            Riwayat Transaksi
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                            Lihat seluruh transaksi keuangan usaha Anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* Toolbar Filter Responsif & Rapi (Reveal Up Delay 150) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-card mb-6 reveal-up reveal-delay-150">
                <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-3" data-purpose="filter-toolbar">
                    
                    {/* 1. Input Pencarian Keterangan */}
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari keterangan transaksi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 text-sm bg-stone-50/50 hover:bg-white focus:bg-white border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#2E6B4E] focus:border-[#2E6B4E] transition-all shadow-2xs"
                        />
                    </div>

                    {/* 2. Dropdown Filter: Jenis (Clean Single Chevron) */}
                    <div className="relative min-w-[140px]">
                        <select
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                setSelectedCategory('');
                            }}
                            className="w-full h-11 appearance-none bg-none [background-image:none] bg-white border border-stone-200 text-stone-700 py-2 pl-3.5 pr-9 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#2E6B4E] focus:border-[#2E6B4E] cursor-pointer shadow-2xs transition-all"
                        >
                            <option value="">Semua Jenis</option>
                            <option value="pemasukan">Pemasukan</option>
                            <option value="pengeluaran">Pengeluaran</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 3. Dropdown Filter: Kategori (Clean Single Chevron) */}
                    <div className="relative min-w-[170px]">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full h-11 appearance-none bg-none [background-image:none] bg-white border border-stone-200 text-stone-700 py-2 pl-3.5 pr-9 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#2E6B4E] focus:border-[#2E6B4E] cursor-pointer shadow-2xs transition-all"
                        >
                            {categoryFilterOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 4. Filter Rentang Tanggal (Date Range Selector Rapi) */}
                    <div className={`flex items-center h-11 bg-white border rounded-xl px-3.5 text-xs sm:text-sm text-stone-600 gap-2 shadow-2xs transition-all ${
                        dateRangeError
                            ? 'border-[#A83244] ring-1 ring-[#A83244]/20'
                            : 'border-stone-200 focus-within:border-[#2E6B4E] focus-within:ring-1 focus-within:ring-[#2E6B4E]/20'
                    }`}>
                        <Calendar className={`w-4 h-4 shrink-0 ${dateRangeError ? 'text-[#A83244]' : 'text-[#2E6B4E]'}`} />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setDateRangeError(null);
                            }}
                            aria-label="Tanggal Mulai"
                            title="Tanggal Mulai"
                            className="border-none p-0 text-xs font-medium text-stone-700 focus:ring-0 bg-transparent cursor-pointer w-28 sm:w-32"
                        />
                        <span className="text-stone-300 font-semibold text-xs">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setDateRangeError(null);
                            }}
                            aria-label="Tanggal Selesai"
                            title="Tanggal Selesai"
                            className="border-none p-0 text-xs font-medium text-stone-700 focus:ring-0 bg-transparent cursor-pointer w-28 sm:w-32"
                        />
                    </div>

                    {/* 5. Kelompok Tombol Eksekusi & Reset Filter */}
                    <div className="flex items-center gap-2">
                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="md" 
                            className="h-11 px-5 gap-2 shadow-xs font-semibold text-sm"
                        >
                            <FilterIcon className="w-4 h-4" />
                            <span>Filter</span>
                        </Button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                title="Reset Filter"
                                aria-label="Reset Filter"
                                className="h-11 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-all active:scale-95 shadow-2xs"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Pesan Error Validasi Rentang Tanggal Terbalik (WCAG AA Edge Case) */}
                {dateRangeError && (
                    <div
                        role="alert"
                        className="flex items-start gap-2.5 mt-3 p-3 bg-[#FCECEE] border border-[#F0C4CA] rounded-xl text-xs text-[#A83244] font-medium animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#A83244]" />
                        <span>{dateRangeError}</span>
                    </div>
                )}
            </div>

            {/* Tabel Data Riwayat Transaksi (Reveal Up Delay 200) */}
            <div 
                className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-card reveal-up reveal-delay-200"
                data-purpose="transactions-table-card"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" id="transactions-table">
                        <thead>
                            <tr className="border-b border-stone-200/80 bg-[#FAFCFA] text-[11px] font-bold text-stone-700 tracking-wider">
                                <th className="py-4 px-6 font-semibold" scope="col">Tanggal</th>
                                <th className="py-4 px-6 font-semibold" scope="col">Keterangan</th>
                                <th className="py-4 px-6 font-semibold" scope="col">Kategori</th>
                                <th className="py-4 px-6 font-semibold text-center" scope="col">Jenis</th>
                                <th className="py-4 px-6 font-semibold text-right" scope="col">Nominal</th>
                                <th className="py-4 px-6 font-semibold text-center" scope="col">Metode</th>
                                <th className="py-4 px-6 font-semibold text-center" scope="col">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                            {transactions.data && transactions.data.length > 0 ? (
                                transactions.data.map((item) => {
                                    const isIncome = item.type === 'pemasukan';
                                    return (
                                        <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                                            {/* 1. Tanggal */}
                                            <td className="py-4 px-6 whitespace-nowrap text-stone-600 font-medium">
                                                {formatDate(item.transaction_date)}
                                            </td>

                                            {/* 2. Keterangan */}
                                            <td className="py-4 px-6 font-medium text-stone-800 max-w-xs md:max-w-md truncate">
                                                {item.description}
                                            </td>

                                            {/* 3. Kategori (Pill Lembut) */}
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span 
                                                    className="inline-block px-3 py-1 rounded-full text-xs font-medium border"
                                                    style={{ 
                                                        backgroundColor: item.category?.color_hex ? `${item.category.color_hex}15` : '#F1F7F4', 
                                                        color: item.category?.color_hex || '#2E6B4E',
                                                        borderColor: item.category?.color_hex ? `${item.category.color_hex}30` : '#E2E8E5'
                                                    }}
                                                >
                                                    {item.category?.name || '-'}
                                                </span>
                                            </td>

                                            {/* 4. Jenis (Badge Pemasukan / Pengeluaran Sesuai Desain) */}
                                            <td className="py-4 px-6 text-center whitespace-nowrap">
                                                <span 
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                                                        isIncome 
                                                            ? 'bg-[#E7F7ED] text-[#1D7A46] border-[#CDEED8]' 
                                                            : 'bg-[#FDECEB] text-[#D64242] border-[#FAD0CE]'
                                                    }`}
                                                >
                                                    {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                                                </span>
                                            </td>

                                            {/* 5. Nominal (+Rp / -Rp Sesuai Desain) */}
                                            <td 
                                                className={`py-4 px-6 text-right font-bold whitespace-nowrap tabular-nums text-sm ${
                                                    isIncome ? 'text-[#1D7A46]' : 'text-[#D64242]'
                                                }`}
                                            >
                                                {formatNominal(item.amount, item.type)}
                                            </td>

                                            {/* 6. Metode Pembayaran */}
                                            <td className="py-4 px-6 text-center text-stone-600 capitalize whitespace-nowrap">
                                                {item.payment_method === 'transfer' ? 'Transfer' : item.payment_method === 'qris' ? 'QRIS' : 'Tunai'}
                                            </td>

                                            {/* 7. Tombol Aksi (Edit & Hapus) */}
                                            <td className="py-4 px-6 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        title="Edit Transaksi"
                                                        aria-label={`Edit transaksi ${item.description}`}
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition active:scale-95"
                                                    >
                                                        <Pencil className="w-4 h-4 stroke-[1.8]" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Hapus Transaksi"
                                                        aria-label={`Hapus transaksi ${item.description}`}
                                                        onClick={() => setDeletingTransaction(item)}
                                                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition active:scale-95"
                                                    >
                                                        <Trash2 className="w-4 h-4 stroke-[1.8]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-14 px-4 text-center">
                                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                            <div className="w-14 h-14 rounded-2xl bg-stone-100/80 border border-stone-200/60 flex items-center justify-center text-stone-400 mb-3.5 shadow-2xs">
                                                <SearchX className="w-7 h-7 text-stone-400 stroke-[1.7]" />
                                            </div>
                                            <h3 className="text-base font-bold text-stone-800 tracking-tight">
                                                Tidak Ada Transaksi Ditemukan
                                            </h3>
                                            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                                                {hasActiveFilters
                                                    ? 'Tidak ada data transaksi yang cocok dengan kriteria filter atau kata kunci pencarian Anda.'
                                                    : 'Belum ada data transaksi yang tercatat di dalam buku kas.'}
                                            </p>
                                            {hasActiveFilters && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={handleResetFilter}
                                                    className="mt-4 gap-2 text-xs font-semibold shadow-2xs hover:border-brand-primary"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                                                    <span>Reset Filter</span>
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Pagination (Sesuai Desain Mockup) */}
                <div 
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-stone-100 text-xs text-stone-500" 
                    data-purpose="pagination-footer"
                >
                    <div>
                        Menampilkan <span className="font-semibold text-stone-700">{transactions.from || 0}–{transactions.to || 0}</span> dari <span className="font-semibold text-stone-700">{transactions.total || 0}</span> data
                    </div>

                    {/* Pagination Controls Responsif (Maksimal 5 Nomor Halaman) */}
                    <div className="inline-flex items-center gap-1.5 select-none py-1">
                        {/* Tombol Sebelumnya (‹) */}
                        {prevLink && (
                            prevLink.url ? (
                                <Link
                                    href={prevLink.url}
                                    preserveState={true}
                                    preserveScroll={true}
                                    aria-label="Halaman Sebelumnya"
                                    className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 border border-stone-200 transition text-xs font-semibold"
                                >
                                    ‹
                                </Link>
                            ) : (
                                <span
                                    aria-disabled="true"
                                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 text-stone-300 cursor-not-allowed opacity-40 text-xs"
                                >
                                    ‹
                                </span>
                            )
                        )}

                        {/* Maksimal 5 Nomor Halaman */}
                        {visiblePageLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                preserveState={true}
                                preserveScroll={true}
                                className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition ${
                                    link.active
                                        ? 'bg-[#2E6B4E] text-white shadow-xs'
                                        : 'text-stone-600 hover:bg-stone-100 border border-stone-200'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Tombol Selanjutnya (›) */}
                        {nextLink && (
                            nextLink.url ? (
                                <Link
                                    href={nextLink.url}
                                    preserveState={true}
                                    preserveScroll={true}
                                    aria-label="Halaman Selanjutnya"
                                    className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 border border-stone-200 transition text-xs font-semibold"
                                >
                                    ›
                                </Link>
                            ) : (
                                <span
                                    aria-disabled="true"
                                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 text-stone-300 cursor-not-allowed opacity-40 text-xs"
                                >
                                    ›
                                </span>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* MODAL EDIT TRANSAKSI                                           */}
            {/* ============================================================== */}
            <Modal
                show={Boolean(editingTransaction)}
                onClose={() => setEditingTransaction(null)}
                maxWidth="md"
            >
                <div className="p-6 bg-white rounded-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-subtle text-brand-primary flex items-center justify-center">
                                <Pencil className="w-4 h-4 text-brand-primary" />
                            </div>
                            <h3 className="text-base font-bold text-stone-900">
                                Edit Transaksi #{editingTransaction?.id}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setEditingTransaction(null)}
                            aria-label="Tutup modal edit"
                            title="Tutup modal"
                            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                        {/* Tanggal */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Tanggal Transaksi
                            </label>
                            <input
                                type="date"
                                value={editForm.transaction_date}
                                onChange={(e) => setEditForm({ ...editForm, transaction_date: e.target.value })}
                                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:border-[#2E6B4E] focus:ring-1 focus:ring-[#2E6B4E]"
                                required
                            />
                        </div>

                        {/* Jenis Transaksi */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Jenis Transaksi
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newType = 'pemasukan';
                                        const firstCat = categories.find((c) => c.type === newType);
                                        setEditForm({
                                            ...editForm,
                                            type: newType,
                                            category_id: firstCat ? firstCat.id : 0,
                                        });
                                    }}
                                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                                        editForm.type === 'pemasukan'
                                            ? 'bg-[#E7F7ED] text-[#1D7A46] border-[#1D7A46]'
                                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                                    }`}
                                >
                                    Pemasukan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newType = 'pengeluaran';
                                        const firstCat = categories.find((c) => c.type === newType);
                                        setEditForm({
                                            ...editForm,
                                            type: newType,
                                            category_id: firstCat ? firstCat.id : 0,
                                        });
                                    }}
                                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                                        editForm.type === 'pengeluaran'
                                            ? 'bg-[#FDECEB] text-[#D64242] border-[#D64242]'
                                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                                    }`}
                                >
                                    Pengeluaran
                                </button>
                            </div>
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Kategori
                            </label>
                            <select
                                value={editForm.category_id}
                                onChange={(e) => setEditForm({ ...editForm, category_id: Number(e.target.value) })}
                                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:border-[#2E6B4E] focus:ring-1 focus:ring-[#2E6B4E]"
                                required
                            >
                                {editFilteredCategories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Nominal (Rupiah) */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Nominal (Rp)
                            </label>
                            <Input
                                variant="currency"
                                value={editForm.amount}
                                onRawChange={(rawVal) => setEditForm({ ...editForm, amount: rawVal })}
                                required
                            />
                        </div>

                        {/* Keterangan */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Keterangan
                            </label>
                            <input
                                type="text"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:border-[#2E6B4E] focus:ring-1 focus:ring-[#2E6B4E]"
                                required
                            />
                        </div>

                        {/* Metode Pembayaran */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                                Metode Pembayaran
                            </label>
                            <select
                                value={editForm.payment_method}
                                onChange={(e) => setEditForm({ ...editForm, payment_method: e.target.value as 'transfer' | 'tunai' | 'qris' })}
                                className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-sm focus:border-[#2E6B4E] focus:ring-1 focus:ring-[#2E6B4E]"
                            >
                                <option value="transfer">Transfer</option>
                                <option value="tunai">Tunai</option>
                                <option value="qris">QRIS</option>
                            </select>
                        </div>

                        {/* Tombol Aksi Modal */}
                        <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={() => setEditingTransaction(null)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                isLoading={isSubmitting}
                            >
                                <Save className="w-4 h-4 mr-1.5" />
                                <span>Simpan Perubahan</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ============================================================== */}
            {/* MODAL KONFIRMASI HAPUS                                         */}
            {/* ============================================================== */}
            <Modal
                show={Boolean(deletingTransaction)}
                onClose={() => setDeletingTransaction(null)}
                maxWidth="sm"
            >
                <div className="p-6 bg-white rounded-2xl text-center">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900">
                        Hapus Transaksi?
                    </h3>
                    <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                        Data transaksi <span className="font-semibold text-stone-800">"{deletingTransaction?.description}"</span> akan dihapus permanen dan mempengaruhi saldo kas usaha Anda.
                    </p>

                    <div className="flex justify-center gap-3 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={() => setDeletingTransaction(null)}
                        >
                            Batalkan
                        </Button>
                        <Button
                            type="button"
                            variant="tonal-danger"
                            size="md"
                            isLoading={isSubmitting}
                            onClick={handleDeleteConfirm}
                        >
                            Ya, Hapus Data
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
