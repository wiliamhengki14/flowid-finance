<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #18221D; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #23533B; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { font-size: 18px; margin: 0; color: #23533B; text-transform: uppercase; letter-spacing: 1px; }
        .header p { margin: 4px 0 0; color: #526058; font-size: 11px; }
        
        .kpi-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .kpi-table td { width: 33.3%; padding: 10px; border: 1px solid #E6E2DD; text-align: center; }
        .kpi-label { font-size: 10px; text-transform: uppercase; color: #526058; font-weight: bold; }
        .kpi-val { font-size: 14px; font-weight: bold; margin-top: 4px; }
        .income-val { color: #23533B; }
        .expense-val { color: #A83244; }

        table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.data-table th, table.data-table td { padding: 7px 10px; border: 1px solid #E6E2DD; text-align: left; }
        table.data-table th { background-color: #F2EFE9; font-weight: bold; font-size: 10px; text-transform: uppercase; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .footer { margin-top: 30px; font-size: 9px; text-align: right; color: #84928A; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FLOWID Florist</h1>
        <p>Laporan Rekapitulasi Arus Kas & Laba Bersih</p>
        <p>Periode: <strong>{{ $startDate }} s.d. {{ $endDate }}</strong></p>
    </div>

    <!-- Ringkasan KPI -->
    <table class="kpi-table">
        <tr>
            <td>
                <div class="kpi-label">Total Pemasukan</div>
                <div class="kpi-val income-val">Rp {{ number_format($totalIncome, 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="kpi-label">Total Pengeluaran</div>
                <div class="kpi-val expense-val">Rp {{ number_format($totalExpense, 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="kpi-label">Laba Bersih</div>
                <div class="kpi-val income-val">Rp {{ number_format($netProfit, 0, ',', '.') }}</div>
            </td>
        </tr>
    </table>

    <!-- Rincian Transaksi -->
    <table class="data-table">
        <thead>
            <tr>
                <th class="text-center" style="width: 12%;">Tanggal</th>
                <th>Keterangan</th>
                <th style="width: 20%;">Kategori</th>
                <th class="text-center" style="width: 12%;">Jenis</th>
                <th class="text-right" style="width: 18%;">Nominal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transactions as $t)
                <tr>
                    <td class="text-center">{{ $t->transaction_date->format('d/m/Y') }}</td>
                    <td>{{ $t->description }}</td>
                    <td>{{ $t->category->name ?? '-' }}</td>
                    <td class="text-center">{{ ucfirst($t->type) }}</td>
                    <td class="text-right" style="color: {{ $t->type == 'pemasukan' ? '#23533B' : '#A83244' }}">
                        {{ $t->type == 'pemasukan' ? '+' : '-' }}Rp {{ number_format($t->amount, 0, ',', '.') }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Dicetak otomatis dari Sistem FLOWID Finance pada: {{ date('d/m/Y H:i') }}
    </div>
</body>
</html>