import React, { useMemo, useState, useEffect, FormEventHandler } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { 
    FileText, 
    Save, 
    TrendingUp, 
    Sparkles, 
    RefreshCw,
    Palette,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Check
} from 'lucide-react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/atoms/Button';
import CurrencyText from '@/Components/atoms/CurrencyText';
import Input from '@/Components/atoms/Input';
import Select from '@/Components/atoms/Select';
import SegmentedToggle from '@/Components/molecules/SegmentedToggle';
import Toast from '@/Components/molecules/Toast';

declare function route(name?: string, params?: any): any;

// 1. Interface Data dari Backend
export interface CategoryItem {
    id: number;
    name: string;
    group_name: string;
    type: 'pemasukan' | 'pengeluaran';
    color_hex: string;
}

export interface CashFlowDay {
    date: string;
    dayLabel: string;
    isToday: boolean;
    income: number;
    expense: number;
    total: number;
    heightPercent: number;
}

interface CreateTransactionProps {
    categories: CategoryItem[];
    currentBalance: number;
    balanceGrowth?: string;
    recentCashFlow?: CashFlowDay[];
}

// Katalog Produk Papan Bunga FLOWID.ID untuk Dropdown Pemasukan
export interface BoardProduct {
    id: string;
    label: string;
    name: string;
    categoryGroup: string;
    price: number;
    isComingSoon?: boolean;
}

export const BOARD_PRODUCTS: BoardProduct[] = [
    // 1. Papan Akrilik
    { id: 'akrilik-bulat', label: 'Bulat (Rp 55.000)', name: 'Papan Akrilik Bulat', categoryGroup: '1. Papan Akrilik', price: 55000 },
    { id: 'akrilik-dome', label: 'Dome (Rp 55.000)', name: 'Papan Akrilik Dome', categoryGroup: '1. Papan Akrilik', price: 55000 },
    // 2. Papan Marbel
    { id: 'marbel-bulat', label: 'Marbel Bulat (Rp 65.000)', name: 'Papan Marbel Bulat', categoryGroup: '2. Papan Marbel', price: 65000 },
    { id: 'marbel-dome', label: 'Marbel Dome (Rp 65.000)', name: 'Papan Marbel Dome', categoryGroup: '2. Papan Marbel', price: 65000 },
    // 3. Flower Box
    { id: 'box-bulat', label: 'Box Bulat (Rp 70.000)', name: 'Flower Box Bulat', categoryGroup: '3. Flower Box', price: 70000 },
    { id: 'box-oval', label: 'Box Oval (Rp 70.000)', name: 'Flower Box Oval', categoryGroup: '3. Flower Box', price: 70000 },
    // New Collection
    { id: 'akrilik-buram', label: 'Akrilik Buram (Rp 55.000)', name: 'New Collection - Akrilik Buram', categoryGroup: 'New Collection', price: 55000 },
    { id: 'cermin-dome', label: 'Cermin Dome (Rp 100.000) [COMING SOON]', name: 'New Collection - Cermin Dome (COMING SOON)', categoryGroup: 'New Collection', price: 100000, isComingSoon: true },
];

// 5 Papan Bunga untuk Slider Pesanan Prioritas Toko (public/images/bunga1.jpeg - bunga5.jpeg)
export const SHOWCASE_BOARDS = [
    {
        id: 1,
        title: 'Papan Akrilik Bulat',
        category: 'Papan Akrilik',
        image: '/images/bunga1.jpeg',
        price: 'Rp 55.000 / unit',
        priceNumber: 55000,
        spec: 'Akrilik Bening Bulat 50cm Floral',
        description: 'Bentuk lingkaran modern dengan aransemen mawar segar & krisan elegan.',
    },
    {
        id: 2,
        title: 'Papan Akrilik Dome',
        category: 'Papan Akrilik',
        image: '/images/bunga2.jpeg',
        price: 'Rp 55.000 / unit',
        priceNumber: 55000,
        spec: 'Kubah Dome Arch Modern Floral',
        description: 'Desain kubah estetik minimalis dengan kombinasi bunga premium.',
    },
    {
        id: 3,
        title: 'Papan Marbel Bulat & Dome',
        category: 'Papan Marbel',
        image: '/images/bunga3.jpeg',
        price: 'Rp 65.000 / unit',
        priceNumber: 65000,
        spec: 'Tekstur Marbel Mewah Elegan',
        description: 'Corak marbel mewah berpadu bunga warna pastel untuk ucapan berkesan.',
    },
    {
        id: 4,
        title: 'Flower Box Bulat & Oval',
        category: 'Flower Box',
        image: '/images/bunga4.jpeg',
        price: 'Rp 70.000 / unit',
        priceNumber: 70000,
        spec: 'Silinder Box Eksklusif & Pita Satin',
        description: 'Aransemen bunga meja mewah dalam silinder box berkualitas tinggi.',
    },
    {
        id: 5,
        title: 'New Collection - Akrilik Buram & Cermin',
        category: 'New Collection',
        image: '/images/bunga5.jpeg',
        price: 'Mulai Rp 55.000 / unit',
        priceNumber: 55000,
        spec: 'Finishing Frost Buram & Mirror Dome',
        description: 'Koleksi edisi terbaru dengan sentuhan artistik kekinian dan reflektif.',
    },
];

export default function Create({ 
    categories = [], 
    currentBalance = 0, 
    balanceGrowth = '+12%',
    recentCashFlow = [] 
}: CreateTransactionProps) {
    const { flash } = usePage<PageProps>().props;
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [animateBalance, setAnimateBalance] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // State Status Online / Offline (WCAG AA & Edge Case Handling)
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Tanggal default hari ini (format YYYY-MM-DD untuk native date picker)
    const todayStr = useMemo(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    // 2. Inisialisasi Form State Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'pemasukan' as 'pemasukan' | 'pengeluaran',
        transaction_date: todayStr,
        category_id: '' as number | '',
        amount: '' as number | '',
        description: '',
        payment_method: 'transfer' as 'transfer' | 'tunai' | 'qris',
    });

    // 3. Filter kategori secara instan di sisi klien sesuai jenis transaksi aktif
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => cat.type === data.type);
    }, [categories, data.type]);

    // Opsi kategori untuk atom Select
    const categoryOptions = useMemo(() => {
        return filteredCategories.map((cat) => ({
            value: cat.id,
            label: cat.name,
        }));
    }, [filteredCategories]);

    // Otomatis pilih kategori pertama saat jenis transaksi berpindah
    useEffect(() => {
        if (filteredCategories.length > 0) {
            const exists = filteredCategories.some((cat) => cat.id === data.category_id);
            if (!exists) {
                setData('category_id', filteredCategories[0].id);
            }
        } else {
            setData('category_id', '');
        }
    }, [data.type, filteredCategories]);

    // Dengarkan flash message sukses dari redirect Laravel
    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setAnimateBalance(true);
            const timer = setTimeout(() => setAnimateBalance(false), 800);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // 4. Handler pergantian tab Pemasukan / Pengeluaran
    const handleTypeChange = (newType: string) => {
        const nextType = newType as 'pemasukan' | 'pengeluaran';
        setData((prev) => ({
            ...prev,
            type: nextType,
            description: '',
            amount: '',
        }));
    };

    // 5. Handler pemilihan jenis papan bunga dari dropdown mode pemasukan
    const handleBoardSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const product = BOARD_PRODUCTS.find((p) => p.name === selectedName);
        setData((prev) => ({
            ...prev,
            description: selectedName,
            amount: product ? product.price : prev.amount,
        }));
    };

    // 6. Handler tombol geser slide showcase pesanan prioritas
    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? SHOWCASE_BOARDS.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev === SHOWCASE_BOARDS.length - 1 ? 0 : prev + 1));
    };

    // 7. Handler cepat: Menggunakan produk dari showcase langsung ke formulir transaksi
    const handleApplyShowcaseToForm = (board: typeof SHOWCASE_BOARDS[0]) => {
        const matchingProduct = BOARD_PRODUCTS.find(
            (p) => p.name === board.title || board.title.includes(p.name)
        );
        const descToSet = matchingProduct ? matchingProduct.name : board.title;
        const priceToSet = matchingProduct ? matchingProduct.price : board.priceNumber;

        setData((prev) => ({
            ...prev,
            type: 'pemasukan',
            description: descToSet,
            amount: priceToSet,
        }));

        setToastMessage(`Produk "${board.title}" berhasil dipilih ke formulir!`);
    };

    // 8. Handler Submit Form
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!isOnline) {
            return;
        }
        post(route('transactions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('amount', 'description');
            },
        });
    };

    // Label tanggal 7 hari terakhir
    const firstDayLabel = recentCashFlow[0]?.dayLabel || '04 Nov';
    const lastDayLabel = recentCashFlow[recentCashFlow.length - 1]?.dayLabel || '10 Nov';
    const activeShowcase = SHOWCASE_BOARDS[currentSlide];

    return (
        <AuthenticatedLayout>
            <Head title="Pencatatan Transaksi - FLOWID Finance" />

            {/* Floating Toast Notification Sukses */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 animate-bounce-subtle">
                    <Toast
                        type="success"
                        message={toastMessage}
                        onClose={() => setToastMessage(null)}
                    />
                </div>
            )}

            {/* Header Halaman */}
            <div className="mb-6 reveal-up reveal-delay-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center shadow-xs">
                        <FileText className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                            Pencatatan Transaksi
                        </h1>
                        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                            Catat pemasukan dan pengeluaran usaha FLOWID Florist dengan mudah.
                        </p>
                    </div>
                </div>
            </div>

            {/* Grid Utama 12 Kolom (Kiri: Form 7 Kolom, Kanan: Info Hari Ini & Showcase 5 Kolom) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ==============================================================
                    KOLOM KIRI: Formulir Pencatatan Transaksi (7 Kolom)
                    ============================================================== */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 shadow-card border border-border-subtle reveal-left reveal-delay-200">
                    
                    {/* Segmented Pill Selector (Pemasukan / Pengeluaran) */}
                    <div className="mb-6" data-purpose="type-toggle">
                        <SegmentedToggle
                            options={[
                                { label: 'Pemasukan', value: 'pemasukan' },
                                { label: 'Pengeluaran', value: 'pengeluaran' },
                            ]}
                            value={data.type}
                            onChange={handleTypeChange}
                        />
                    </div>

                    {/* Formulir Input Transaksi */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* 1. Tanggal Transaksi */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                            <label 
                                htmlFor="tanggal_transaksi" 
                                className="sm:col-span-4 text-xs sm:text-sm font-medium text-stone-700"
                            >
                                Tanggal Transaksi
                            </label>
                            <div className="sm:col-span-8">
                                <Input
                                    id="tanggal_transaksi"
                                    type="date"
                                    variant="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    error={errors.transaction_date}
                                />
                            </div>
                        </div>

                        {/* 2. Kategori */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                            <label 
                                htmlFor="kategori" 
                                className="sm:col-span-4 text-xs sm:text-sm font-medium text-stone-700"
                            >
                                Kategori
                            </label>
                            <div className="sm:col-span-8">
                                <Select
                                    id="kategori"
                                    options={categoryOptions}
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', Number(e.target.value))}
                                    error={errors.category_id}
                                    placeholder="Pilih Kategori..."
                                />
                            </div>
                        </div>

                        {/* 3. Nominal (Auto Masked Rupiah) - Sesuai Alur Cepat Tab WCAG AA */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                            <label 
                                htmlFor="nominal" 
                                className="sm:col-span-4 text-xs sm:text-sm font-medium text-stone-700"
                            >
                                Nominal
                            </label>
                            <div className="sm:col-span-8">
                                <Input
                                    id="nominal"
                                    variant="currency"
                                    placeholder="55.000"
                                    value={data.amount}
                                    onRawChange={(rawVal) => setData('amount', rawVal)}
                                    error={errors.amount}
                                />
                            </div>
                        </div>

                        {/* 4. Keterangan: Dropdown untuk Pemasukan, Input Manual untuk Pengeluaran */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start sm:items-center">
                            <label 
                                htmlFor="keterangan" 
                                className="sm:col-span-4 text-xs sm:text-sm font-medium text-stone-700"
                            >
                                Keterangan
                                <span className="block text-[11px] text-stone-400 font-normal">
                                    {data.type === 'pemasukan' ? 'Pilihan Jenis Papan' : 'Input Rincian Manual'}
                                </span>
                            </label>
                            <div className="sm:col-span-8 space-y-1.5">
                                {data.type === 'pemasukan' ? (
                                    /* Mode Pemasukan: Dropdown Jenis Papan FLOWID.ID */
                                    <div className="relative">
                                        <select
                                            id="keterangan"
                                            value={data.description}
                                            onChange={handleBoardSelect}
                                            className={`w-full py-2.5 pl-4 pr-10 text-sm rounded-xl appearance-none bg-white border transition-all duration-150 focus:outline-none focus:ring-2 cursor-pointer ${
                                                errors.description
                                                    ? 'border-finance-expense-text focus:border-finance-expense-text focus:ring-finance-expense-text/20 text-stone-900'
                                                    : 'border-border-subtle hover:border-[#84928A] focus:border-brand-primary focus:ring-brand-primary/20 text-stone-800'
                                            }`}
                                        >
                                            <option value="" disabled className="text-stone-400">
                                                -- Pilih Jenis Papan Bunga FLOWID --
                                            </option>
                                            <optgroup label="1. PAPAN AKRILIK">
                                                <option value="Papan Akrilik Bulat">Bulat - Rp 55.000</option>
                                                <option value="Papan Akrilik Dome">Dome - Rp 55.000</option>
                                            </optgroup>
                                            <optgroup label="2. PAPAN MARBEL">
                                                <option value="Papan Marbel Bulat">Marbel Bulat - Rp 65.000</option>
                                                <option value="Papan Marbel Dome">Marbel Dome - Rp 65.000</option>
                                            </optgroup>
                                            <optgroup label="3. FLOWER BOX">
                                                <option value="Flower Box Bulat">Box Bulat - Rp 70.000</option>
                                                <option value="Flower Box Oval">Box Oval - Rp 70.000</option>
                                            </optgroup>
                                            <optgroup label="NEW COLLECTION">
                                                <option value="New Collection - Akrilik Buram">Akrilik Buram - Rp 55.000</option>
                                                <option value="New Collection - Cermin Dome (COMING SOON)">Cermin Dome - Rp 100.000 (COMING SOON)</option>
                                            </optgroup>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                ) : (
                                    /* Mode Pengeluaran: Input Teks Manual */
                                    <Input
                                        id="keterangan"
                                        type="text"
                                        placeholder="Contoh: Pembelian bunga mawar segar & styrofoam"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        error={errors.description}
                                    />
                                )}

                                {/* Auto-fill helper info saat mode pemasukan */}
                                {data.type === 'pemasukan' && data.description && (
                                    <p className="text-[11px] text-[#2E6B4E] flex items-center gap-1 font-medium">
                                        <Check className="w-3.5 h-3.5 shrink-0" />
                                        <span>Nominal harga otomatis disesuaikan. Dapat diubah jika memesan lebih dari 1 unit.</span>
                                    </p>
                                )}

                                {errors.description && (
                                    <span className="text-xs font-medium text-finance-expense-text block">
                                        {errors.description}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 5. Metode Pembayaran: Tambahkan QRIS */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                            <label 
                                htmlFor="metode_pembayaran" 
                                className="sm:col-span-4 text-xs sm:text-sm font-medium text-stone-700"
                            >
                                Metode Pembayaran
                            </label>
                            <div className="sm:col-span-8">
                                <Select
                                    id="metode_pembayaran"
                                    options={[
                                        { value: 'transfer', label: 'Transfer Bank' },
                                        { value: 'tunai', label: 'Tunai (Cash)' },
                                        { value: 'qris', label: 'QRIS' },
                                    ]}
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value as 'transfer' | 'tunai' | 'qris')}
                                    error={errors.payment_method}
                                />
                            </div>
                        </div>

                        {/* Tombol Simpan Transaksi & Kunci Otomatis Saat Offline (WCAG Edge Case) */}
                        <div className="pt-4 sm:pt-6">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                isLoading={processing}
                                disabled={processing || !isOnline}
                                aria-label={!isOnline ? "Tombol simpan dinonaktifkan sementara karena koneksi terputus" : "Simpan Transaksi"}
                                title={!isOnline ? "Koneksi terputus. Tombol simpan dinonaktifkan sementara." : undefined}
                                className={`w-full justify-center shadow-lg transition-all ${
                                    !isOnline
                                        ? 'opacity-60 cursor-not-allowed bg-stone-300 text-stone-500 hover:bg-stone-300 shadow-none'
                                        : 'shadow-brand-primary/20 hover:shadow-brand-primary/30'
                                }`}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                <span>{!isOnline ? 'Simpan Transaksi (Offline / Terkunci)' : 'Simpan Transaksi'}</span>
                            </Button>

                            {!isOnline && (
                                <p className="text-xs text-[#8C5E0A] bg-[#FEF6E6] border border-[#F6D389] rounded-xl p-2.5 mt-3 font-medium flex items-center justify-center gap-2 text-center animate-in fade-in duration-200">
                                    <span className="w-2 h-2 rounded-full bg-[#8C5E0A] animate-pulse shrink-0" />
                                    <span>Koneksi terputus. Tombol simpan dikunci otomatis agar data transaksi tidak hilang.</span>
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                {/* ==============================================================
                    KOLOM KANAN: Info Hari Ini & Showcase Papan Bunga (5 Kolom)
                    ============================================================== */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* KARTU 1: Info Hari Ini (Saldo Usaha & Arus Kas 7 Hari Terakhir) */}
                    <div 
                        aria-live="polite"
                        className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-card border border-border-subtle reveal-right reveal-delay-300 transition-all duration-300 ${
                            animateBalance ? 'scale-[1.02] ring-2 ring-brand-primary/40' : ''
                        }`}
                        data-purpose="summary-card"
                    >
                        {/* Header Kartu: Badge Info Hari Ini & Status Buku Kas Aktif */}
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-subtle text-brand-primary text-xs font-semibold">
                                <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                                <span>Info Hari Ini</span>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-stone-500">
                                Status Buku Kas Aktif
                            </span>
                        </div>

                        {/* Saldo Usaha Terkini & Badge Pertumbuhan */}
                        <div className="mt-4">
                            <p className="text-sm font-medium text-stone-600 mb-1">
                                Saldo Usaha Terkini
                            </p>
                            <div className="flex items-center gap-3">
                                <CurrencyText 
                                    amount={currentBalance} 
                                    className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight"
                                />
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-subtle text-brand-primary text-xs font-bold">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>{balanceGrowth}</span>
                                </span>
                            </div>
                        </div>

                        {/* Garis Pembatas Halus */}
                        <div className="h-px bg-stone-100 my-4" />

                        {/* Sub-Header Arus Kas 7 Hari Terakhir */}
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-semibold text-stone-700">
                                Arus Kas 7 Hari Terakhir
                            </span>
                            <span className="font-bold text-brand-primary">
                                Likuiditas Sehat
                            </span>
                        </div>

                        {/* 7 Mini Bars Arus Kas */}
                        <div className="flex items-end justify-between gap-2.5 h-14 mt-4 px-1">
                            {recentCashFlow.map((day, idx) => {
                                const isLast = idx === recentCashFlow.length - 1;
                                return (
                                    <div 
                                        key={day.date} 
                                        className="flex-1 flex flex-col items-center h-full justify-end group relative"
                                    >
                                        {/* Tooltip Dinamis saat Hover */}
                                        <div className="absolute -top-10 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                                            <div className="bg-stone-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                {day.dayLabel}: Rp {new Intl.NumberFormat('id-ID').format(day.total)}
                                            </div>
                                            <div className="w-1.5 h-1.5 bg-stone-900 rotate-45 -mt-0.5" />
                                        </div>

                                        {/* Bar Vertikal dengan Sudut Membulat */}
                                        <div 
                                            className={`w-full rounded-md transition-all duration-300 ${
                                                isLast 
                                                    ? 'bg-[#23523B] shadow-xs' 
                                                    : 'bg-[#D1E3D9] hover:bg-[#B8D3C4]'
                                            }`}
                                            style={{ height: `${day.heightPercent}%` }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Label Rentang Tanggal di Bawah Bar */}
                        <div className="flex justify-between items-center text-[11px] text-stone-500 font-medium mt-2 px-0.5">
                            <span>{firstDayLabel}</span>
                            <span>Hari Ini ({lastDayLabel})</span>
                        </div>

                        {/* Callout Box Catatan Real-time */}
                        <div className="mt-4 rounded-xl bg-[#FAF7F5] border border-stone-200/70 p-3.5 flex items-start gap-3">
                            <RefreshCw className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-stone-600 leading-relaxed font-normal">
                                Saldo otomatis disesuaikan secara real-time saat transaksi disimpan.
                            </p>
                        </div>

                        {/* Ornamen Daun Halus di Pojok Bawah */}
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 text-brand-primary/5 pointer-events-none">
                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100">
                                <path d="M50 0C50 0 45 25 25 35C5 45 0 50 0 50C0 50 25 45 35 25C45 5 50 0 50 0Z" />
                                <path d="M60 20C60 20 62 40 45 55C28 70 20 80 20 80C20 80 40 68 55 52C70 36 60 20 60 20Z" />
                            </svg>
                        </div>
                    </div>

                    {/* KARTU 2: Carousel Visual Karangan Bunga Papan Prioritas Toko */}
                    <div 
                        className="bg-bg-surface rounded-2xl border border-border-subtle shadow-card overflow-hidden flex flex-col group reveal-right reveal-delay-400"
                        data-purpose="product-showcase"
                    >
                        {/* Banner Visual Image Carousel dengan 5 Gambar Bunga */}
                        <div className="relative w-full h-64 overflow-hidden bg-stone-100 select-none">
                            
                            {/* Track Slider Gambar (Transisi Halus Menggeser) */}
                            <div 
                                className="flex w-full h-full transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {SHOWCASE_BOARDS.map((board) => (
                                    <div key={board.id} className="w-full h-full flex-shrink-0 relative">
                                        <img 
                                            src={board.image} 
                                            alt={board.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                                        />
                                        {/* Gradient Overlay untuk Kontras Teks */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-transparent pointer-events-none" />

                                        {/* Informasi Teks di Atas Gambar */}
                                        <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                                            <span className="text-[10px] tracking-wider uppercase text-emerald-300 font-bold block">
                                                {board.category} • Karya Unggulan
                                            </span>
                                            <p className="text-base sm:text-lg font-bold leading-tight text-white drop-shadow-sm mt-0.5">
                                                {board.title}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Header Top Controls & Badges */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
                                {/* Badge: Pesanan Prioritas Toko */}
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold-subtle text-accent-gold-text border border-accent-gold/30 text-xs font-bold shadow-xs backdrop-blur-xs">
                                    <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                                    <span>Pesanan Prioritas Toko</span>
                                </span>

                                {/* Slide Counter Badge */}
                                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider shadow-xs">
                                    {currentSlide + 1} / {SHOWCASE_BOARDS.length}
                                </span>
                            </div>

                            {/* Tombol Geser Kiri (Prev) */}
                            <button
                                type="button"
                                onClick={handlePrevSlide}
                                aria-label="Lihat gambar sebelumnya"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-brand-primary flex items-center justify-center shadow-lg backdrop-blur-xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
                            >
                                <ChevronLeft className="w-5 h-5 -ml-0.5" />
                            </button>

                            {/* Tombol Geser Kanan (Next) */}
                            <button
                                type="button"
                                onClick={handleNextSlide}
                                aria-label="Lihat gambar berikutnya"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-brand-primary flex items-center justify-center shadow-lg backdrop-blur-xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
                            >
                                <ChevronRight className="w-5 h-5 ml-0.5" />
                            </button>

                            {/* Indicator Dots Navigasi Slide */}
                            <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
                                {SHOWCASE_BOARDS.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentSlide(idx)}
                                        aria-label={`Pindah ke slide ${idx + 1}`}
                                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                            currentSlide === idx 
                                                ? 'w-5 bg-white' 
                                                : 'w-1.5 bg-white/50 hover:bg-white/80'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Bottom Specs & Tombol Aksi Cepat */}
                        <div className="p-4 bg-bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border-subtle text-xs sm:text-sm">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 font-medium text-text-secondary">
                                    <Palette className="w-4 h-4 text-brand-primary shrink-0" />
                                    <span className="font-semibold text-stone-800">{activeShowcase.spec}</span>
                                </div>
                                <p className="text-[11px] text-stone-500 leading-tight">
                                    {activeShowcase.description}
                                </p>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                                <span className="font-bold text-[#23533B] text-sm sm:text-base tabular-nums">
                                    {activeShowcase.price}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleApplyShowcaseToForm(activeShowcase)}
                                    aria-label={`Pilih produk ${activeShowcase.title} ke formulir`}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:text-[#1A3F2C] bg-brand-subtle hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer mt-1"
                                >
                                    <span>Pilih Produk Ini</span>
                                    <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
