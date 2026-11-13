<?php

namespace App\Services;

use App\Models\Transaction;

class FinancialCalculationService
{
    /**
     * Hitung total Saldo Usaha kumulatif dari seluruh transaksi (Pemasukan - Pengeluaran).
     */
    public function getCumulativeBalance(): int
    {
        return (int) Transaction::selectRaw("
            COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE -amount END), 0) as balance
        ")->value('balance');
    }

    /**
     * Hitung total Pemasukan untuk bulan dan tahun tertentu.
     */
    public function getMonthlyIncome(int $year, int $month): int
    {
        return (int) Transaction::where('type', 'pemasukan')
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $month)
            ->sum('amount');
    }

    /**
     * Hitung total Pengeluaran untuk bulan dan tahun tertentu.
     */
    public function getMonthlyExpense(int $year, int $month): int
    {
        return (int) Transaction::where('type', 'pengeluaran')
            ->whereYear('transaction_date', $year)
            ->whereMonth('transaction_date', $month)
            ->sum('amount');
    }

    /**
     * Hitung Selisih Bersih (Net Income = Pemasukan - Pengeluaran).
     */
    public function getNetIncome(int $income, int $expense): int
    {
        return $income - $expense;
    }

    /**
     * Rumus persentase Month-over-Month (% MoM).
     * Aman dari pembagian nol (division by zero jika bulan lalu = 0).
     */
    public function calculateMoMGrowth(int|float $current, int|float $previous): int
    {
        if ($previous <= 0) {
            return $current > 0 ? 100 : 0;
        }

        return (int) round((($current - $previous) / $previous) * 100);
    }

    /**
     * Kalkulasi ringkasan finansial bulanan lengkap dengan perbandingan MoM.
     *
     * @return array<string, mixed>
     */
    public function getFinancialSummary(int $year, int $month): array
    {
        $cumulativeBalance = $this->getCumulativeBalance();
        $currentIncome = $this->getMonthlyIncome($year, $month);
        $currentExpense = $this->getMonthlyExpense($year, $month);
        $netIncome = $this->getNetIncome($currentIncome, $currentExpense);

        // Bulan sebelumnya
        $prevMonth = $month > 1 ? $month - 1 : 12;
        $prevYear = $month > 1 ? $year : $year - 1;

        $prevIncome = $this->getMonthlyIncome($prevYear, $prevMonth);
        $prevExpense = $this->getMonthlyExpense($prevYear, $prevMonth);
        $prevNet = $this->getNetIncome($prevIncome, $prevExpense);

        $incomeGrowth = $this->calculateMoMGrowth($currentIncome, $prevIncome);
        $expenseGrowth = $this->calculateMoMGrowth($currentExpense, $prevExpense);
        $balanceGrowth = $this->calculateMoMGrowth($netIncome, $prevNet);

        return [
            'balance' => $cumulativeBalance,
            'totalIncome' => $currentIncome,
            'totalExpense' => $currentExpense,
            'netIncome' => $netIncome,
            'isDeficit' => $netIncome < 0,
            'incomeGrowth' => ($incomeGrowth >= 0 ? '+' : '') . $incomeGrowth . '%',
            'expenseGrowth' => ($expenseGrowth >= 0 ? '+' : '') . $expenseGrowth . '%',
            'balanceGrowth' => ($balanceGrowth >= 0 ? '+' : '') . $balanceGrowth . '%',
            'selectedMonth' => $month,
        ];
    }
}

