import React, { useMemo } from 'react';
import { PieChart } from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Plugin
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registrasi modul Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export interface CategoryDistribution {
    name: string;
    percentage: number;
    color: string;
}

export interface ExpenseDonutChartProps {
    categories?: CategoryDistribution[];
    className?: string;
}

export default function ExpenseDonutChart({
    categories = [],
    className = '',
}: ExpenseDonutChartProps) {
    const defaultCategories: CategoryDistribution[] = [
        { name: 'Bahan Bunga', percentage: 45, color: '#F48E9E' },
        { name: 'Bahan Papan', percentage: 30, color: '#85B69D' },
        { name: 'Operasional', percentage: 15, color: '#F5C564' },
        { name: 'Lainnya', percentage: 10, color: '#C8A9E8' },
    ];

    const items = categories.length > 0 ? categories : defaultCategories;
    const topCategory = items.reduce(
        (prev, current) => (prev.percentage > current.percentage ? prev : current),
        items[0]
    );

    // Deskripsi Aksesibilitas WCAG AA untuk elemen Canvas Doughnut Chart
    const donutAriaLabel = useMemo(() => {
        if (!items || items.length === 0) {
            return 'Diagram lingkaran distribusi pengeluaran, belum ada data.';
        }
        const breakdown = items.map((i) => `${i.name} ${i.percentage}%`).join(', ');
        return `Diagram lingkaran proporsi pengeluaran berdasarkan kategori. Kategori terbesar adalah ${topCategory?.name || '-'} sebesar ${topCategory?.percentage || 0}%. Rincian: ${breakdown}.`;
    }, [items, topCategory]);

    // Data untuk Doughnut Chart Chart.js
    const doughnutData = {
        labels: items.map((i) => i.name),
        datasets: [
            {
                data: items.map((i) => i.percentage),
                backgroundColor: items.map((i) => i.color),
                borderWidth: 2,
                borderColor: '#FFFFFF',
                hoverOffset: 4,
            },
        ],
    };

    // Plugin kustom untuk render label teks persentase dan nama kategori di tengah Doughnut Chart
    const centerTextPlugin: Plugin<'doughnut'> = useMemo(() => {
        return {
            id: 'customCenterTextLabel',
            afterDraw(chart) {
                const { ctx, chartArea } = chart;
                if (!chartArea) return;

                const centerX = (chartArea.left + chartArea.right) / 2;
                const centerY = (chartArea.top + chartArea.bottom) / 2;

                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Baris 1: Persentase (contoh: 45%)
                ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
                ctx.fillStyle = '#1E293B';
                ctx.fillText(`${topCategory.percentage}%`, centerX, centerY - 8);

                // Baris 2: Nama Kategori (contoh: Bahan Bunga)
                ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
                ctx.fillStyle = '#64748B';
                ctx.fillText(topCategory.name, centerX, centerY + 12);

                ctx.restore();
            },
        };
    }, [topCategory]);

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
            legend: {
                display: false, // Legenda kustom rapi di sisi kanan
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${label}: ${value}%`;
                    },
                },
            },
        },
    };

    return (
        <div className={`bg-white border border-[#EDE4D6] rounded-2xl p-5 shadow-2xs flex flex-col justify-between relative overflow-hidden ${className}`}>
            {/* Card Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#2E6B4E]" />
                    <h4 className="font-bold text-slate-800 text-sm tracking-tight">
                        Kategori Pengeluaran
                    </h4>
                </div>
                {/* Decorative corner accent */}
                <span className="text-[#E07A8B] text-xs select-none">✦</span>
            </div>

            {/* Doughnut Chart di Kiri & Legenda di Sisi Kanan */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto pt-4 pb-2">
                {/* Circular Doughnut Chart dengan Custom Center Text Label Plugin */}
                <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                    <Doughnut 
                        data={doughnutData} 
                        options={doughnutOptions} 
                        plugins={[centerTextPlugin]} 
                        role="img"
                        aria-label={donutAriaLabel}
                    />
                </div>

                {/* Legenda di Sisi Kanan */}
                <div className="flex flex-col justify-center space-y-2.5 w-full sm:w-auto">
                    {items.map((item) => (
                        <div key={item.name} className="flex items-center justify-between gap-5 text-xs">
                            <div className="flex items-center gap-2">
                                <span 
                                    className="w-3 h-3 rounded-full shrink-0" 
                                    style={{ backgroundColor: item.color }} 
                                />
                                <span className="text-slate-600 font-medium">
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-bold text-slate-800 tabular-nums">
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom micro note */}
            <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100">
                Total {items.length} kategori belanja terdata
            </div>
        </div>
    );
}
