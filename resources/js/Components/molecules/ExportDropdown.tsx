import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileSpreadsheet, Loader2, Check } from 'lucide-react';

export interface ExportDropdownProps {
    period: string;
    className?: string;
}

export default function ExportDropdown({ period, className = '' }: ExportDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingFormat, setLoadingFormat] = useState<'pdf' | 'xlsx' | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Menutup dropdown jika user klik di luar area komponen
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Eksekusi download dokumen dengan state loading reaktif
    const handleDownload = (format: 'pdf' | 'xlsx') => {
        setLoadingFormat(format);
        setIsOpen(false);

        // Buat URL endpoint ekspor resmi
        const exportUrl = `/reports/financial/export?period=${encodeURIComponent(period)}&format=${format}`;

        // Trigger unduhan dokumen melalui iframe/link tersembunyi
        const link = document.createElement('a');
        link.href = exportUrl;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset state loading setelah dokumen mulai di-stream
        setTimeout(() => {
            setLoadingFormat(null);
        }, 2500);
    };

    const isDownloading = loadingFormat !== null;

    return (
        <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
            {/* Tombol Utama Unduh Laporan */}
            <button
                type="button"
                disabled={isDownloading}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={`
                    inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer
                    ${isDownloading 
                        ? 'bg-[#1F4834] text-white opacity-90 cursor-wait' 
                        : 'bg-[#2E6B4E] hover:bg-[#23533C] text-white active:scale-[0.98]'
                    }
                `}
            >
                {isDownloading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Menyiapkan {loadingFormat?.toUpperCase()}...</span>
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4 text-white" />
                        <span>Unduh Laporan</span>
                        <ChevronDown className={`w-4 h-4 ml-0.5 text-white/80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            {/* Menu Dropdown - Floating dengan z-50 dan shadow-2xl agar tidak bertabrakan */}
            {isOpen && (
                <div 
                    role="menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-stone-200/90 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right ring-1 ring-black/5"
                >
                    <div className="px-3.5 py-1.5 border-b border-stone-100 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Pilih Format Unduhan
                        </span>
                    </div>

                    {/* Opsi 1: PDF */}
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleDownload('pdf')}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] hover:text-[#2E6B4E] transition-colors text-left group"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="block font-bold">Unduh Dokumen PDF</span>
                                <span className="text-[10px] text-slate-400 font-normal">Format cetak resmi (.pdf)</span>
                            </div>
                        </div>
                    </button>

                    {/* Opsi 2: Excel (.xlsx) */}
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleDownload('xlsx')}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#FAF7F2] hover:text-[#2E6B4E] transition-colors text-left group"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <FileSpreadsheet className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="block font-bold">Unduh Spreadsheet Excel</span>
                                <span className="text-[10px] text-slate-400 font-normal">Format workbook (.xlsx)</span>
                            </div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}

