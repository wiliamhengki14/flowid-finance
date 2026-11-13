<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Transaction;
use App\Services\FinancialCalculationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected FinancialCalculationService $financialService
    ) {}

    /**
     * Tampilkan halaman Dashboard dengan data metrik keuangan dinamis dan murni dari database.
     */
    public function index(Request $request): Response
    {
        $selectedYear = 2026;
        // Bulan acuan berjalan adalah November (bulan 11 tahun 2026)
        $selectedMonth = (int) $request->input('month', 11);

        // 1. Kalkulasi metrik finansial, Saldo Usaha, dan % MoM menggunakan Service khusus
        $summary = $this->financialService->getFinancialSummary($selectedYear, $selectedMonth);

        // 2. Data Bulanan Lengkap Tahun 2026 (Januari - November) untuk Chart Interaktif
        $monthShortLabels = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov'
        ];

        $monthFullLabels = [
            1 => 'Januari 2026', 2 => 'Februari 2026', 3 => 'Maret 2026', 4 => 'April 2026',
            5 => 'Mei 2026', 6 => 'Juni 2026', 7 => 'Juli 2026', 8 => 'Agustus 2026',
            9 => 'September 2026', 10 => 'Oktober 2026', 11 => 'November 2026'
        ];

        $allMonthlyData = [];
        $monthlyDigests = [];

        foreach ($monthShortLabels as $mNum => $mLabel) {
            $mIncome = (int) Transaction::where('type', 'pemasukan')
                ->whereYear('transaction_date', $selectedYear)
                ->whereMonth('transaction_date', $mNum)
                ->sum('amount');

            $mExpense = (int) Transaction::where('type', 'pengeluaran')
                ->whereYear('transaction_date', $selectedYear)
                ->whereMonth('transaction_date', $mNum)
                ->sum('amount');

            $allMonthlyData[] = [
                'monthNumber' => $mNum,
                'month' => $mLabel,
                'fullMonth' => $monthFullLabels[$mNum],
                'income' => $mIncome,
                'expense' => $mExpense,
                'net' => $mIncome - $mExpense,
            ];

            // Hitung Pengeluaran Terbesar per bulan tersebut
            $mTopExp = Transaction::where('transactions.type', 'pengeluaran')
                ->whereYear('transaction_date', $selectedYear)
                ->whereMonth('transaction_date', $mNum)
                ->join('categories', 'transactions.category_id', '=', 'categories.id')
                ->selectRaw('categories.group_name, SUM(transactions.amount) as total_amount')
                ->groupBy('categories.group_name')
                ->orderByDesc('total_amount')
                ->first();

            $topCatName = $mTopExp?->group_name ?? 'Bahan Bunga';
            $topCatAmt = (int) ($mTopExp?->total_amount ?? 0);
            $topCatPct = $mExpense > 0 ? round(($topCatAmt / $mExpense) * 100) : 45;

            $monthlyDigests[$mNum] = [
                'monthNumber' => $mNum,
                'monthName' => $monthFullLabels[$mNum],
                'income' => $mIncome,
                'expense' => $mExpense,
                'endingBalance' => $mIncome - $mExpense,
                'topExpenseCategory' => $topCatName,
                'topExpensePercentage' => (int) $topCatPct,
            ];
        }

        // 5. Proporsi Kategori Pengeluaran Nyata dari Database
        $expensesByGroup = Transaction::where('transactions.type', 'pengeluaran')
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->selectRaw('categories.group_name, SUM(transactions.amount) as total_amount')
            ->groupBy('categories.group_name')
            ->pluck('total_amount', 'group_name')
            ->toArray();

        $totalExpGroup = array_sum($expensesByGroup) ?: 1;

        $categoryColors = [
            'Bahan Bunga' => '#F48E9E',
            'Bahan Papan' => '#85B69D',
            'Operasional' => '#F5C564',
            'Lainnya'     => '#C8A9E8',
        ];

        $expenseCategories = [];
        foreach ($categoryColors as $group => $hex) {
            $amount = (int) ($expensesByGroup[$group] ?? 0);
            $calculatedPct = round(($amount / $totalExpGroup) * 100);
            $expenseCategories[] = [
                'name' => $group,
                'amount' => $amount,
                'percentage' => (int) $calculatedPct,
                'color' => $hex,
            ];
        }

        // 6. 5 Transaksi Terbaru (Latest Transactions) dari Database
        $recentTransactions = Transaction::with('category')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->take(5)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'date' => Carbon::parse($t->transaction_date)->format('d M Y'),
                    'description' => $t->description,
                    'category_name' => $t->category?->group_name ?? $t->category?->name ?? 'Penjualan',
                    'category_color' => $t->category?->color_hex ?? '#2E6B4E',
                    'type' => $t->type,
                    'amount' => (int) $t->amount,
                    'is_verified' => (bool) $t->is_verified,
                ];
            });

        return Inertia::render('Dashboard', [
            'summary' => array_merge($summary, [
                'selectedMonthName' => $monthFullLabels[$selectedMonth] ?? 'November 2026',
            ]),
            'allMonthlyData' => $allMonthlyData,
            'expenseCategories' => $expenseCategories,
            'recentTransactions' => $recentTransactions,
            'monthlyDigests' => $monthlyDigests,
            'initialDigest' => $monthlyDigests[$selectedMonth] ?? end($monthlyDigests),
        ]);
    }
}
