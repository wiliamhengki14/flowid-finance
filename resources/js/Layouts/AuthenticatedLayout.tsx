import React, { ReactNode, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Toast from '../Components/molecules/Toast';
import {
    LayoutDashboard,
    PlusCircle,
    History,
    BarChart3,
    CalendarRange,
    Users,
    LogOut,
    Bell,
    ChevronDown,
    Flower2,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
    UserCheck,
    CheckCircle2,
    Store,
    WifiOff,
    LucideIcon
} from 'lucide-react';

export interface UserAuth {
    id: number;
    name: string;
    email: string;
    role: 'pemilik' | 'admin' | 'kasir';
}

interface NavItem {
    name: string;
    routeName: string;
    icon: LucideIcon;
}

interface AuthenticatedLayoutProps {
    children: ReactNode;
    title?: string;
    header?: ReactNode;
}

declare function route(name?: string, params?: any): any;

export default function AuthenticatedLayout({ children, header }: AuthenticatedLayoutProps) {
    const { auth, flash } = usePage<{
        auth: { user: UserAuth };
        flash?: { success?: string; error?: string };
    }>().props;
    const user = auth?.user || { id: 1, name: 'Admin', email: 'admin@flowid.id', role: 'pemilik' };

    // State Sidebar Buka / Tutup
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // State Dropdown Topbar (Notifikasi & Profil User)
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // State Modal Konfirmasi Logout
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // State Online / Offline Network Status (WCAG Edge Case Handling)
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    // State Toast Notification
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Listener Window Online / Offline
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

    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setToast({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    // Responsive: auto tutup di layar mobile saat resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Active Window Scroll & Observer untuk Animasi Reveal Dinamis (Scroll Bawah & Atas)
    useEffect(() => {
        const selector = '.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-on-scroll, .reveal-from-left, .reveal-from-right';

        const checkReveal = () => {
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const elements = document.querySelectorAll(selector);

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                // Elemen dianggap masuk saat berada dalam viewport (dengan margin atas-bawah yang nyaman)
                const isVisible = rect.top < windowHeight * 0.90 && rect.bottom > 30;

                if (isVisible) {
                    el.classList.add('revealed');
                } else if (rect.top >= windowHeight * 0.90 || rect.bottom <= -30) {
                    // Ketika di-scroll ke atas atau ke bawah melewati layar, cabut class revealed
                    // sehingga saat di-scroll kembali, efek reveal aktif lagi
                    el.classList.remove('revealed');
                }
            });
        };

        // Jalankan segera saat mount dan setelah render awal
        const timer1 = setTimeout(checkReveal, 30);
        const timer2 = setTimeout(checkReveal, 120);
        const timer3 = setTimeout(checkReveal, 300);

        window.addEventListener('scroll', checkReveal, { passive: true });
        window.addEventListener('resize', checkReveal, { passive: true });

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            window.removeEventListener('scroll', checkReveal);
            window.removeEventListener('resize', checkReveal);
        };
    }, [children]);

    const navItems: NavItem[] = [
        { name: 'Dashboard', routeName: 'dashboard', icon: LayoutDashboard },
        { name: 'Pencatatan Transaksi', routeName: 'transactions.create', icon: PlusCircle },
        { name: 'Riwayat Transaksi', routeName: 'transactions.index', icon: History },
        { name: 'Laporan Keuangan', routeName: 'reports.financial', icon: BarChart3 },
        { name: 'Rekap Bulanan', routeName: 'reports.monthly', icon: CalendarRange },
        { name: 'Pengaturan Pengguna', routeName: 'users.index', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-700 font-sans relative selection:bg-brand-subtle selection:text-brand-primary">
            {/* ============================================================== */}
            {/* STICKY BANNER DETEKSI OFFLINE (WCAG AA & EDGE CASE HANDLING)   */}
            {/* ============================================================== */}
            {!isOnline && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="fixed top-0 left-0 right-0 z-50 bg-[#FEF6E6] border-b border-[#F6D389] text-[#8C5E0A] px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 shadow-sm select-none animate-in slide-in-from-top duration-300"
                >
                    <WifiOff className="w-4 h-4 shrink-0 text-[#8C5E0A]" />
                    <span className="text-center">
                        Koneksi terputus. Anda sedang dalam mode luar jaringan — tombol simpan dinonaktifkan sementara hingga koneksi kembali stabil.
                    </span>
                </div>
            )}

            {/* ============================================================== */}
            {/* BACKDROP OVERLAY UNTUK MOBILE / TABLET                         */}
            {/* ============================================================== */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 xl:hidden transition-opacity duration-300"
                    aria-hidden="true"
                />
            )}

            {/* ============================================================== */}
            {/* 1. SIDEBAR KIRI - FIXED, ZERO SCROLLBAR & BISA DIBUKA/DITUTUP  */}
            {/* ============================================================== */}
            <aside
                className={`
                    fixed left-0 w-64 bg-[#F5EFE6] border-r border-[#E8DFC8] 
                    flex flex-col justify-between z-40 
                    overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                    shadow-md transition-all duration-300 ease-in-out
                    ${!isOnline ? 'top-10 sm:top-10 h-[calc(100vh-2.5rem)]' : 'inset-y-0 h-screen'}
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Bagian Atas: Logo Brand & Navigasi */}
                <div className="flex flex-col">
                    {/* Brand Logo Header dengan Tombol Tutup Sidebar */}
                    <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-[#E8DFC8]/60">
                        <div className="flex items-center gap-3">
                            {/* Ilustrasi Bunga Maskot FLOWID */}
                            <div className="w-16 h-16 flex items-center justify-center relative select-none">
                                <img src="/images/logo.png" alt="FLOWID" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold tracking-tight text-[#23533B] font-display uppercase leading-none">
                                    FLOWID
                                </h1>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">
                                    Flower Board & More
                                </p>
                            </div>
                        </div>

                        {/* Tombol Tutup Drawer Khusus Layar Tablet / Mobile */}
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(false)}
                            aria-label="Tutup Menu Sidebar"
                            title="Tutup Menu Sidebar"
                            className="xl:hidden p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-[#EDE5D8] transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Menu Navigasi 6 Menu dengan Hover Menarik & Active State */}
                    <nav aria-label="Main Navigation" className="px-3.5 space-y-1.5 mt-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = typeof route !== 'undefined' && route().current(`${item.routeName}*`);

                            return (
                                <Link
                                    key={item.routeName}
                                    href={typeof route !== 'undefined' && route().has(item.routeName) ? route(item.routeName) : '#'}
                                    className={`
                                        group relative flex items-center gap-3.5 px-4 py-2.5 rounded-full font-medium transition-all duration-200
                                        ${isActive
                                            ? 'bg-[#2E6B4E] text-white shadow-sm font-semibold'
                                            : 'text-slate-600 hover:text-[#23533B] hover:bg-[#EDE5D8] hover:translate-x-1.5 hover:shadow-2xs active:scale-[0.98]'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#23533B] group-hover:scale-110'}`} />
                                    <span className="text-sm tracking-tight">{item.name}</span>
                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bagian Bawah: Ornamen Bunga & Tombol Logout */}
                <div className="px-4 pb-4 pt-2 relative">
                    {/* Kartu Quote Slogan Botani */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#F8EEE7] p-3 border border-[#F3DFE5] mb-2.5 shadow-2xs hover:border-[#E8C2CD] transition-all duration-200 cursor-default select-none">
                        {/* Background botanical watercolor flower sketch */}
                        <svg className="absolute -left-2 -bottom-2 w-20 h-20 opacity-70 pointer-events-none" fill="none" viewBox="0 0 100 100">
                            <circle cx="28" cy="75" fill="#FBCFE8" fillOpacity="0.5" r="22" />
                            <path d="M15 88C15 65 35 55 42 40" stroke="#84A98C" strokeLinecap="round" strokeWidth="2.5" />
                            <path d="M30 68C42 62 48 48 45 35" stroke="#90A955" strokeWidth="2" />
                            <circle cx="45" cy="35" fill="#F472B6" fillOpacity="0.4" r="9" />
                            <circle cx="25" cy="50" fill="#FCA5A5" fillOpacity="0.45" r="7" />
                        </svg>
                        <div className="relative z-10 pl-6 pr-1 py-1 text-right">
                            <p className="font-script text-[17px] leading-tight text-[#523B40] font-semibold tracking-wide">
                                Bersama FLOWID,<br />
                                Kelola Keuangan<br />
                                Lebih Mudah ♡
                            </p>
                        </div>
                    </div>

                    {/* Tombol Logout Memicu Modal Konfirmasi */}
                    <button
                        type="button"
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="group w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-[#E4D9C8] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 text-sm font-medium transition-all duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-600 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* ============================================================== */}
            {/* 2. NAVBAR ATAS - FIXED, RESPONSIVE TOGGLE & NO STORE DROPDOWN  */}
            {/* ============================================================== */}
            <header
                className={`
                    fixed right-0 h-16 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EFE8DD] 
                    px-4 sm:px-8 flex items-center justify-between shadow-2xs transition-all duration-300 ease-in-out
                    ${!isOnline ? 'top-10 sm:top-10' : 'top-0'}
                    ${isSidebarOpen ? 'left-0 xl:left-64' : 'left-0'}
                `}
            >
                {/* Sisi Kiri: Tombol Toggle Sidebar & Badge Toko Bersih (Tanpa Fake Dropdown) */}
                <div className="flex items-center gap-3">
                    {/* Tombol Buka/Tutup Sidebar */}
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label={isSidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
                        title={isSidebarOpen ? 'Tutup Menu' : 'Buka Menu'}
                        className="p-2 rounded-xl border border-[#E6DDCE] bg-white text-slate-700 hover:text-[#23533B] hover:bg-[#F2ECE1] hover:border-slate-300 transition-all active:scale-[0.96] shadow-2xs flex items-center justify-center"
                    >
                        {isSidebarOpen ? (
                            <PanelLeftClose className="w-5 h-5 text-[#23533B]" />
                        ) : (
                            <Menu className="w-5 h-5 text-[#23533B]" />
                        )}
                    </button>

                    {/* Badge Identitas Toko Bersih & Statis (Sesuai Single-Tenant Florist) */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2E6B4E]/10 border border-[#2E6B4E]/20 text-[#23533B] text-xs font-semibold select-none shadow-2xs">
                        <Store className="w-3.5 h-3.5 text-[#2E6B4E]" />
                        <span>FLOWID Florist</span>
                    </div>
                </div>

                {/* Sisi Kanan: Notifikasi & Profil Pengguna dengan Dropdown Interaktif */}
                <div className="flex items-center gap-3 sm:gap-4 relative">
                    {/* Notification Bell dengan Popup Interaktif */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setIsNotifOpen(!isNotifOpen);
                                setIsProfileOpen(false);
                            }}
                            aria-label="Notifikasi"
                            className="relative p-2 rounded-xl border border-transparent hover:border-[#E6DDCE] hover:bg-white/80 text-slate-600 hover:text-slate-900 transition-all active:scale-95"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E05263] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E05263]" />
                            </span>
                        </button>

                        {/* Dropdown Notifikasi */}
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E6DDCE] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                        Notifikasi
                                    </h5>
                                    <span className="text-[10px] bg-emerald-100 text-[#23533B] font-semibold px-2 py-0.5 rounded-full">
                                        Baru
                                    </span>
                                </div>
                                <div className="divide-y divide-slate-100 text-xs">
                                    <div className="py-2.5 flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-800">DP Pesanan Bunga Wisuda</p>
                                            <p className="text-[11px] text-slate-500">Pemasukan Rp 500.000 tercatat otomatis.</p>
                                        </div>
                                    </div>
                                    <div className="py-2.5 flex items-start gap-2.5">
                                        <Flower2 className="w-4 h-4 text-[#D76B7D] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-800">Pembelian Bahan Bunga</p>
                                            <p className="text-[11px] text-slate-500">Stok mawar & krisan telah diverifikasi kasir.</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsNotifOpen(false)}
                                    className="w-full mt-2 pt-2 text-center text-xs font-semibold text-[#2E6B4E] hover:underline border-t border-slate-100 block"
                                >
                                    Tutup Notifikasi
                                </button>
                            </div>
                        )}
                    </div>

                    {/* User Profile Pill dengan Dropdown Interaktif */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setIsProfileOpen(!isProfileOpen);
                                setIsNotifOpen(false);
                            }}
                            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-white/80 border border-transparent hover:border-[#E6DDCE] transition-all cursor-pointer select-none active:scale-95"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-rose-100 border border-rose-200 shrink-0 flex items-center justify-center font-bold text-xs text-[#984D5F] shadow-2xs">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-xs font-semibold text-slate-800 leading-tight">
                                    Halo, {user.name}
                                </span>
                                <span className="text-[10px] text-slate-500 capitalize leading-tight">
                                    {user.role}
                                </span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Dropdown Menu User */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E6DDCE] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                                </div>

                                <Link
                                    href={typeof route !== 'undefined' && route().has('users.index') ? route('users.index') : '#'}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-[#FAF7F2] hover:text-[#23533B] font-medium transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <UserCheck className="w-4 h-4 text-slate-400" />
                                    <span>Pengaturan Akun</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        setIsLogoutModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors mt-1 cursor-pointer text-left"
                                >
                                    <LogOut className="w-4 h-4 text-rose-500" />
                                    <span>Keluar dari Aplikasi</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ============================================================== */}
            {/* 3. AREA KONTEN UTAMA DENGAN OFFSET DINAMIS & ORNAMEN WATERCOLOR */}
            {/* ============================================================== */}
            <div
                className={`
                    flex-1 flex flex-col min-h-screen relative overflow-x-hidden transition-all duration-300 ease-in-out
                    ${!isOnline ? 'pt-26' : 'pt-16'}
                    ${isSidebarOpen ? 'xl:ml-64' : 'xl:ml-0'}
                `}
            >
                {/* Ornamen Bunga Watercolor di Pojok Kanan Atas Kanvas */}
                <div className="absolute right-0 top-0 w-80 h-64 pointer-events-none opacity-80 z-0 overflow-hidden select-none">
                    <svg viewBox="0 0 320 256" fill="none" className="w-full h-full transform translate-x-12 -translate-y-8">
                        {/* Batang & Tangkai Daun Hijau Botani */}
                        <path d="M280 20 C220 50, 180 110, 150 180" stroke="#85B69D" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M220 80 C180 70, 140 90, 120 120" stroke="#85B69D" strokeWidth="1.8" strokeLinecap="round" />

                        {/* Daun Sage */}
                        <path d="M190 60 C175 40, 150 50, 160 70 C175 80, 195 75, 190 60 Z" fill="#85B69D" fillOpacity="0.45" />
                        <path d="M140 100 C120 85, 105 100, 115 115 C130 125, 145 115, 140 100 Z" fill="#A1C9B3" fillOpacity="0.5" />
                        <path d="M240 40 C230 20, 210 25, 215 45 C225 55, 245 50, 240 40 Z" fill="#85B69D" fillOpacity="0.4" />

                        {/* Kelopak Bunga Mawar / Peony Watercolor Pink Lembut */}
                        <circle cx="270" cy="50" r="36" fill="#F8B4C0" fillOpacity="0.55" />
                        <circle cx="285" cy="40" r="28" fill="#F48E9E" fillOpacity="0.65" />
                        <circle cx="260" cy="65" r="24" fill="#EFA3B1" fillOpacity="0.6" />
                        <circle cx="280" cy="55" r="16" fill="#D76B7D" fillOpacity="0.5" />

                        {/* Kuncup Bunga Sekunder */}
                        <circle cx="160" cy="140" r="22" fill="#F48E9E" fillOpacity="0.5" />
                        <circle cx="170" cy="135" r="16" fill="#F8B4C0" fillOpacity="0.7" />
                        <circle cx="110" cy="170" r="14" fill="#F48E9E" fillOpacity="0.45" />
                    </svg>
                </div>

                {/* Konten Halaman Dinamis */}
                <main className="px-4 sm:px-8 lg:px-10 py-6 pb-28 space-y-6 max-w-7xl w-full mx-auto relative z-10 flex-1">
                    {header && <div className="mb-4">{header}</div>}
                    {children}
                </main>
            </div>

            {/* ============================================================== */}
            {/* 4. MODAL KONFIRMASI LOGOUT                                    */}
            {/* ============================================================== */}
            {isLogoutModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="logout-modal-title"
                >
                    {/* Backdrop click to dismiss */}
                    <div
                        className="fixed inset-0 -z-10"
                        onClick={() => setIsLogoutModalOpen(false)}
                    />

                    {/* Modal Card */}
                    <div className="bg-white rounded-3xl border border-[#EDE4D6] shadow-2xl max-w-sm w-full p-6 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Soft rose badge icon */}
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-[#D8435E] shadow-2xs">
                            <LogOut className="w-7 h-7" />
                        </div>

                        <h3 id="logout-modal-title" className="text-lg font-bold text-slate-800 tracking-tight">
                            Konfirmasi Keluar
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            Apakah Anda yakin ingin keluar dari sistem <strong className="text-slate-700">FLOWID Finance</strong>? Anda perlu memasukkan akun kembali untuk mengakses data keuangan.
                        </p>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-2xs"
                            >
                                Batal
                            </button>

                            <Link
                                method="post"
                                as="button"
                                href={typeof route !== 'undefined' ? route('logout') : '/logout'}
                                className="px-4 py-2.5 rounded-xl bg-[#D8435E] hover:bg-[#C2334D] text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm shadow-rose-200"
                            >
                                Ya, Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Toast Notification Global untuk Feedback CRUD */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
