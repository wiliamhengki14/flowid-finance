import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationProps {
    links?: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
    currentPage?: number;
    lastPage?: number;
    onPageChange?: (page: number) => void;
    className?: string;
}

export default function Pagination({
    links,
    from,
    to,
    total,
    currentPage = 1,
    lastPage = 1,
    onPageChange,
    className = '',
}: PaginationProps) {
    // Jika menggunakan links dari Inertia Laravel Pagination
    if (links && links.length > 0) {
        return (
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 select-none ${className}`}>
                {/* Info Text */}
                <span className="text-xs text-text-secondary">
                    {from && to && total ? (
                        <>Menampilkan <span className="font-semibold text-text-primary">{from}–{to}</span> dari <span className="font-semibold text-text-primary">{total}</span> data</>
                    ) : (
                        <>Total <span className="font-semibold text-text-primary">{total || 0}</span> data</>
                    )}
                </span>

                {/* Page Buttons */}
                <div className="flex items-center gap-1">
                    {links.map((link, idx) => {
                        const isPrev = idx === 0;
                        const isNext = idx === links.length - 1;
                        const cleanLabel = link.label
                            .replace('&laquo;', '')
                            .replace('&raquo;', '')
                            .trim();

                        if (!link.url && !link.active) {
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled
                                    className="px-2.5 py-1.5 text-xs rounded-lg text-text-muted opacity-40 cursor-not-allowed border border-border-subtle/50"
                                >
                                    {isPrev ? <ChevronLeft className="w-3.5 h-3.5" /> : isNext ? <ChevronRight className="w-3.5 h-3.5" /> : cleanLabel}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`
                                    min-w-[32px] h-8 px-2 flex items-center justify-center text-xs font-medium rounded-lg transition-all
                                    ${link.active
                                        ? 'bg-brand-primary text-white shadow-sm font-semibold'
                                        : 'bg-white text-text-secondary hover:text-text-primary hover:bg-bg-surface-muted border border-border-subtle'
                                    }
                                `}
                            >
                                {isPrev ? <ChevronLeft className="w-3.5 h-3.5" /> : isNext ? <ChevronRight className="w-3.5 h-3.5" /> : cleanLabel}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Fallback: Mode manual currentPage & lastPage
    return (
        <div className={`flex items-center justify-between gap-4 py-3 select-none ${className}`}>
            <span className="text-xs text-text-secondary">
                Halaman <span className="font-semibold text-text-primary">{currentPage}</span> dari <span className="font-semibold text-text-primary">{lastPage}</span>
            </span>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange && onPageChange(currentPage - 1)}
                    className="p-1.5 rounded-lg border border-border-subtle text-text-secondary hover:bg-bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    disabled={currentPage >= lastPage}
                    onClick={() => onPageChange && onPageChange(currentPage + 1)}
                    className="p-1.5 rounded-lg border border-border-subtle text-text-secondary hover:bg-bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

