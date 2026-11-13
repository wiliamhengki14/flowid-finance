import React, { PropsWithChildren, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Flower2, Sparkles } from 'lucide-react';

export interface AuthLayoutProps extends PropsWithChildren {
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({
    children,
    title = 'Masuk',
    subtitle = 'Flower Board & More Finance',
}: AuthLayoutProps) {
    // Observer & Scroll Handler untuk Efek Reveal Otomatis
    useEffect(() => {
        const selector = '.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-on-scroll, .reveal-from-left, .reveal-from-right';

        const checkReveal = () => {
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const elements = document.querySelectorAll(selector);

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < windowHeight * 0.92 && rect.bottom > 20;

                if (isVisible) {
                    el.classList.add('revealed');
                } else if (rect.top >= windowHeight * 0.92) {
                    el.classList.remove('revealed');
                }
            });
        };

        const timer = setTimeout(checkReveal, 60);
        window.addEventListener('scroll', checkReveal, { passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', checkReveal);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans text-slate-700 relative overflow-hidden selection:bg-brand-subtle selection:text-brand-primary">
            <Head title={`${title} - FLOWID Finance`} />

            {/* Ornamen Bunga Watercolor di Sudut Kanan Atas */}
            <div className="absolute right-0 top-0 w-96 h-80 pointer-events-none opacity-70 select-none overflow-hidden">
                <svg viewBox="0 0 320 256" fill="none" className="w-full h-full transform translate-x-16 -translate-y-12">
                    <path d="M280 20 C220 50, 180 110, 150 180" stroke="#85B69D" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="270" cy="50" r="45" fill="#F8B4C0" fillOpacity="0.5" />
                    <circle cx="285" cy="40" r="32" fill="#F48E9E" fillOpacity="0.6" />
                    <circle cx="160" cy="140" r="26" fill="#F48E9E" fillOpacity="0.4" />
                    <path d="M190 60 C175 40, 150 50, 160 70 Z" fill="#85B69D" fillOpacity="0.45" />
                </svg>
            </div>

            {/* Ornamen Bunga Watercolor di Sudut Kiri Bawah */}
            <div className="absolute left-0 bottom-0 w-80 h-72 pointer-events-none opacity-60 select-none overflow-hidden">
                <svg viewBox="0 0 300 300" fill="none" className="w-full h-full transform -translate-x-12 translate-y-10">
                    <circle cx="60" cy="240" r="50" fill="#F48E9E" fillOpacity="0.35" />
                    <circle cx="110" cy="220" r="35" fill="#85B69D" fillOpacity="0.3" />
                    <path d="M30 250 C50 200, 90 210, 120 180" stroke="#3D7D5D" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>

            {/* Container Kartu Autentikasi */}
            <div className="w-full max-w-md relative z-10">
                {/* Header Identitas Brand FLOWID */}
                <div className="reveal-down reveal-delay-100 text-center mb-7">
                    <div className="inline-flex w-20 h-20 items-center justify-center mb-2 hover:scale-105 transition-transform duration-300">
                        <img src="/images/logo.png" alt="logo" />
                    </div>
                    <h1 className="font-display font-bold text-3xl text-[#23533B] tracking-tight uppercase">
                        FLOWID
                    </h1>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-0.5">
                        {subtitle}
                    </p>
                </div>

                {/* Kartu Form Anak */}
                <div className="reveal-up reveal-delay-200 bg-white p-7 sm:p-8 rounded-3xl shadow-xl border border-[#EDE4D6] relative overflow-hidden">
                    <div className="absolute top-3 right-3 text-[#EBB459] opacity-70">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    {children}
                </div>

                {/* Slogan Botani Penutup */}
                <p className="reveal-up reveal-delay-300 text-center text-xs text-slate-500 mt-5 italic select-none">
                    “Bersama FLOWID, kelola usaha papan bunga jadi lebih tenang & rapi.” 🌸
                </p>
            </div>
        </div>
    );
}

