<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Penjualan Papan Bunga', 'group_name' => 'Penjualan', 'type' => 'pemasukan', 'color_hex' => '#2F6B4F'],
            ['name' => 'Uang Muka Pesanan (DP)', 'group_name' => 'Penjualan', 'type' => 'pemasukan', 'color_hex' => '#4A9B73'],
            ['name' => 'Pembelian Bunga Segar', 'group_name' => 'Bahan Bunga', 'type' => 'pengeluaran', 'color_hex' => '#F299A9'],
            ['name' => 'Pembelian Bahan Papan & Styrofoam', 'group_name' => 'Bahan Papan', 'type' => 'pengeluaran', 'color_hex' => '#93B899'],
            ['name' => 'Biaya Transportasi & Pengiriman', 'group_name' => 'Operasional', 'type' => 'pengeluaran', 'color_hex' => '#F7CB73'],
            ['name' => 'Pengeluaran Lain-lain', 'group_name' => 'Lainnya', 'type' => 'pengeluaran', 'color_hex' => '#C7B2DE'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['name' => $cat['name']], $cat);
        }
    }
}
