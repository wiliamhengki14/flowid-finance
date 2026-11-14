<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Models\Category;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Menampilkan halaman form Pencatatan Transaksi (/transactions/create)
     */
    public function create(): Response
    {
        // 1. Ambil semua kategori untuk difilter secara instan di sisi klien (React)
        $categories = Category::select('id', 'name', 'group_name', 'type', 'color_hex')
            ->orderBy('name')
            ->get();

        // 2. Hitung Saldo Usaha terkini dalam 1 SQL query yang cepat
        $currentBalance = (int) Transaction::selectRaw("
            COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE -amount END), 0) as balance
        ")->value('balance');

        // 3. Hitung Arus Kas 7 Hari Terakhir untuk kartu "Info Hari Ini"
        $latestDateStr = Transaction::max('transaction_date');
        $referenceDate = $latestDateStr ? Carbon::parse($latestDateStr) : Carbon::now();

        $startDate = $referenceDate->copy()->subDays(6)->startOfDay();
        $endDate = $referenceDate->copy()->endOfDay();

        $dailyFlows = Transaction::selectRaw("
            transaction_date as t_date,
            COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) as income,
            COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) as expense,
            COALESCE(SUM(amount), 0) as total_volume
        ")
            ->whereBetween('transaction_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->groupBy('transaction_date')
            ->get()
            ->keyBy(function ($item) {
                return Carbon::parse($item->t_date)->format('Y-m-d');
            });

        $monthNamesId = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
        ];

        $recentCashFlow = [];
        $maxVolume = 0;

        for ($i = 6; $i >= 0; $i--) {
            $curDate = $referenceDate->copy()->subDays($i);
            $dateKey = $curDate->format('Y-m-d');
            $flow = $dailyFlows->get($dateKey);

            $income = $flow ? (int) $flow->income : 0;
            $expense = $flow ? (int) $flow->expense : 0;
            $volume = $flow ? (int) $flow->total_volume : 0;

            if ($volume > $maxVolume) {
                $maxVolume = $volume;
            }

            $m = (int) $curDate->format('n');
            $dayLabel = $curDate->format('d') . ' ' . ($monthNamesId[$m] ?? $curDate->format('M'));

            $recentCashFlow[] = [
                'date' => $dateKey,
                'dayLabel' => $dayLabel,
                'isToday' => ($i === 0),
                'income' => $income,
                'expense' => $expense,
                'total' => $volume,
                'heightPercent' => 30,
            ];
        }

        // Tentukan persentase tinggi bar (min 20%, max 100%)
        // Jika tidak ada volume, berikan variasi proporsional default yang harmonis
        $fallbackHeights = [35, 48, 28, 62, 45, 70, 92];
        foreach ($recentCashFlow as $idx => &$item) {
            if ($maxVolume > 0 && $item['total'] > 0) {
                $item['heightPercent'] = (int) round(($item['total'] / $maxVolume) * 75) + 25;
            } else {
                $item['heightPercent'] = $fallbackHeights[$idx % count($fallbackHeights)];
            }
        }
        unset($item);

        return Inertia::render('Transactions/Create', [
            'categories' => $categories,
            'currentBalance' => $currentBalance,
            'balanceGrowth' => '+12%',
            'recentCashFlow' => $recentCashFlow,
        ]);
    }

    /**
     * Menyimpan transaksi baru ke database (POST /transactions)
     */
    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Transaction::create([
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'transaction_date' => $validated['transaction_date'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'payment_method' => $validated['payment_method'],
            'is_verified' => true,
        ]);

        // Redirect kembali ke halaman create; Inertia otomatis me-refresh currentBalance & recentCashFlow
        return redirect()
            ->route('transactions.create')
            ->with('success', 'Transaksi berhasil disimpan ke buku kas.');
    }

    public function index(Request $request): Response
    {
        // Validasi parameter filter (termasuk validasi rentang tanggal agar start_date <= end_date)
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'string', 'in:pemasukan,pengeluaran,semua'],
            'category_id' => ['nullable'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ], [
            'end_date.after_or_equal' => 'Tanggal akhir tidak boleh lebih awal dari tanggal mulai.',
        ]);
        
        $transactions = Transaction::with('category')
            ->filter($validated)
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->paginate(5)
            ->withQueryString();

        $categories = Category::select('id', 'name', 'group_name', 'type', 'color_hex')
            ->orderBy('name')
            ->get();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'filters' => $request->only(['search', 'type', 'category_id', 'start_date', 'end_date']),
        ]);
    }

    public function update(StoreTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $transaction->update($request->validated());

        return Redirect::back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $transaction->delete();

        return Redirect::back()->with('success', 'Transaksi berhasil dihapus dari buku kas.');
    }
}
