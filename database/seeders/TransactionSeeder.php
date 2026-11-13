<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::first();
        if (! $admin) {
            return;
        }

        if (Transaction::count() > 0) {
            return;
        }

        $categories = Category::all()->keyBy('name');

        $catPenjualan = $categories->get('Penjualan Papan Bunga');
        $catDp = $categories->get('Uang Muka Pesanan (DP)');
        $catBunga = $categories->get('Pembelian Bunga Segar');
        $catPapan = $categories->get('Pembelian Bahan Papan & Styrofoam');
        $catOps = $categories->get('Biaya Transportasi & Pengiriman');
        $catLain = $categories->get('Pengeluaran Lain-lain');

        // Data transaksi historis hingga bulan 11 (November 2026 - bulan berjalan)
        // Desember 2026 belum ada karena saat ini masih 10 November 2026
        // Dirancang selaras dengan PRD (Bulan Terbaik: Mei 2026 dengan Rp 9.000.000; Pengeluaran terbesar Bahan Bunga ~45%)
        $monthlyBudgets = [
            1  => ['income' => 6500000, 'expense' => 3800000],
            2  => ['income' => 7000000, 'expense' => 4100000],
            3  => ['income' => 6800000, 'expense' => 3900000],
            4  => ['income' => 7500000, 'expense' => 4500000],
            5  => ['income' => 9000000, 'expense' => 5200000], // Bulan Terbaik sesuai PRD
            6  => ['income' => 7200000, 'expense' => 4200000],
            7  => ['income' => 7800000, 'expense' => 4400000],
            8  => ['income' => 8100000, 'expense' => 4600000],
            9  => ['income' => 7400000, 'expense' => 4300000],
            10 => ['income' => 8500000, 'expense' => 4800000],
            11 => ['income' => 8000000, 'expense' => 4700000], // Bulan berjalan (1 - 10 Nov 2026)
        ];

        $incomeDescriptions = [
            'Pesanan Papan Bunga Pernikahan (Gedung Graha)',
            'Pelunasan Papan Bunga Ucapan Selamat & Sukses',
            'Pesanan Papan Bunga Duka Cita VIP',
            'Uang Muka (DP) Pesanan Papan Bunga Wisuda 3 Unit',
            'Pesanan Papan Bunga Grand Opening Restoran',
            'Pelunasan Papan Bunga HUT Korporat Bank',
            'Pesanan Karangan Papan Bunga Rustic Modern',
            'DP Pesanan Bunga Meja & Papan Acara Pelantikan',
        ];

        foreach ($monthlyBudgets as $month => $budget) {
            // 1. Generate Pemasukan
            $targetIncome = $budget['income'];
            $incomePortions = [0.35, 0.25, 0.20, 0.20];
            // Khusus bulan 11 (berjalan hingga tanggal 10 Nov), pakai tanggal <= 10
            $days = ($month === 11) ? [2, 4, 7, 9] : [4, 11, 18, 25];

            foreach ($incomePortions as $idx => $portion) {
                $amt = (int) round(($targetIncome * $portion) / 50000) * 50000;
                $cat = ($idx === 3) ? $catDp : $catPenjualan;
                $day = ($month === 11) ? $days[$idx] : min(28, $days[$idx] + ($month % 3));

                Transaction::create([
                    'user_id' => $admin->id,
                    'category_id' => $cat->id,
                    'transaction_date' => Carbon::create(2026, $month, $day),
                    'type' => 'pemasukan',
                    'amount' => $amt,
                    'description' => $incomeDescriptions[($month + $idx) % count($incomeDescriptions)],
                    'payment_method' => ($idx % 2 === 0) ? 'transfer' : 'tunai',
                    'is_verified' => true,
                ]);
            }

            // 2. Generate Pengeluaran sesuai proporsi PRD:
            // Bahan Bunga ~45%, Bahan Papan ~30%, Operasional ~15%, Lainnya ~10%
            $targetExpense = $budget['expense'];
            $expensePlan = [
                ['cat' => $catBunga, 'ratio' => 0.45, 'desc' => 'Beli bunga mawar segar, krisan & aster dari supplier', 'day' => ($month === 11 ? 3 : 5)],
                ['cat' => $catPapan, 'ratio' => 0.30, 'desc' => 'Bahan rangka kayu, styrofoam busa & kain beludru', 'day' => ($month === 11 ? 5 : 12)],
                ['cat' => $catOps,   'ratio' => 0.15, 'desc' => 'Biaya bensin & ongkos kirim armada pengantaran', 'day' => ($month === 11 ? 8 : 19)],
                ['cat' => $catLain,  'ratio' => 0.10, 'desc' => 'Perlengkapan jarum pentul, lem tembak & isolasi', 'day' => ($month === 11 ? 10 : 26)],
            ];

            foreach ($expensePlan as $plan) {
                $amt = (int) round(($targetExpense * $plan['ratio']) / 25000) * 25000;
                $day = ($month === 11) ? $plan['day'] : min(28, $plan['day'] + ($month % 2));

                Transaction::create([
                    'user_id' => $admin->id,
                    'category_id' => $plan['cat']->id,
                    'transaction_date' => Carbon::create(2026, $month, $day),
                    'type' => 'pengeluaran',
                    'amount' => $amt,
                    'description' => $plan['desc'],
                    'payment_method' => ($plan['day'] <= 5) ? 'transfer' : 'tunai',
                    'is_verified' => true,
                ]);
            }
        }
    }
}
