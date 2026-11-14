# PANDUAN PENGGUNAAN SISTEM (USER MANUAL)
## FLOWID Finance - Flower Board & More Management System

Selamat datang di **FLOWID Finance**, sistem informasi manajemen keuangan terpadu yang dirancang khusus untuk operasional usaha toko karangan papan bunga (*flower board*), karangan ucapan, dan dekorasi florist.

Sistem ini mengusung estetika visual **Botanical Floral** yang bersih, modern, dan profesional, serta telah memenuhi standar aksesibilitas **WCAG 2.1 Level AA** dan mendukung ketahanan jaringan (*offline resilience*).

---

## 1. Matriks Hak Akses Pengguna (*User Roles & Permissions*)

Sistem FLOWID Finance memiliki 3 tingkatan hak akses pengguna (*Role Based Access Control*):

```
┌─────────────────────────────────────────────────────────────┐
│                       PEMILIK USAHA                         │
│  (Akses Penuh: Dashboard, Transaksi, Laporan, User Mgmt)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌─────────────────────────────┐         ┌─────────────────────────────┐
│         ADMIN TOKO          │         │            KASIR            │
│ (Dashboard, Input Transaksi,│         │ (Dashboard, Input Transaksi,│
│  Riwayat, Laporan & Rekap)  │         │   Lihat Riwayat Terbatas)   │
└─────────────────────────────┘         └─────────────────────────────┘
```

| Fitur / Modul | Pemilik Usaha | Admin Toko | Kasir |
| :--- | :---: | :---: | :---: |
| **Melihat Dashboard & KPI Keuangan** | ✅ Penuh | ✅ Penuh | ✅ Terbatas |
| **Mencatat Transaksi Baru (Pemasukan/Pengeluaran)** | ✅ Ya | ✅ Ya | ✅ Ya |
| **Melihat Riwayat Transaksi** | ✅ Penuh | ✅ Penuh | ✅ Terkini |
| **Mengubah (Edit) & Menghapus Transaksi** | ✅ Ya | ✅ Ya | ❌ Tidak |
| **Melihat Laporan Keuangan Komprehensif** | ✅ Ya | ✅ Ya | ❌ Tidak |
| **Mengunduh Laporan Format PDF & Excel (.xlsx)** | ✅ Ya | ✅ Ya | ❌ Tidak |
| **Melihat Rekap Bulanan & Evaluasi Tahunan** | ✅ Ya | ✅ Ya | ❌ Tidak |
| **Manajemen Pengguna (Tambah/Edit/Hapus User)** | ✅ Ya | ❌ Tidak | ❌ Tidak |

---

## 2. Masuk dan Keluar Sistem (*Authentication*)

### A. Cara Masuk ke Sistem (Login)
1. Buka browser dan arahkan ke alamat aplikasi:
   * **Versi Cloud/Online**: `https://flowid-finance-production.up.railway.app/login`
   * **Versi Lokal (Laragon)**: `http://localhost:8000/login` atau `http://flowid-finance.test/login`
2. Pada form login:
   * Masukkan **Email Pengguna** (misal: `admin@flowid.id`).
   * Masukkan **Kata Sandi** (misal: `password123`).
   * *(Opsional)* Klik ikon **Mata** di sisi kanan kolom sandi untuk memeriksa ketepatan karakter yang diketik.
   * Centang **"Ingat saya di perangkat ini"** jika menggunakan perangkat pribadi.
3. Klik tombol **"Masuk ke Sistem"**. Sistem akan memverifikasi kredensial dan langsung mengarahkan Anda ke Dashboard Utama.

### B. Cara Keluar dari Sistem (Logout)
1. Klik tombol **"Keluar"** di sudut kiri bawah sidebar (atau menu profil di sudut kanan atas pada tampilan *mobile*).
2. Sistem akan menghapus sesi login aktif dan mengembalikan Anda ke halaman login secara aman.

---

## 3. Navigasi Antarmuka & Aksesibilitas

* **Desktop Navigation**: Sidebar tetap di sisi kiri dengan indikator rute aktif beraksen hijau botani (`#23533B`).
* **Mobile Drawer Navigation**: Pada layar ponsel/tablet, klik ikon menu (hamburger) di sudut kiri atas untuk membuka panel navigasi. Tersedia tombol silang (`X`) di sudut kanan drawer untuk menutup kembali.
* **Navigasi Keyboard Penuh**: Anda dapat bernavigasi tanpa mouse menggunakan tombol `Tab`, `Shift + Tab`, dan tombol panah `←` / `→` pada toggle pilihan jenis transaksi.
* **Deteksi Jaringan Otomatis (Offline Mode)**: Jika koneksi internet terputus di tengah pekerjaan, sistem secara otomatis memunculkan **Banner Peringatan Kuning Lembut** di bagian atas layar:
  > *"Koneksi terputus. Anda sedang berada dalam mode offline..."*  
  Tombol penyimpanan transaksi akan dikunci sementara secara otomatis untuk mencegah kegagalan pengiriman data. Begitu koneksi internet kembali normal, banner akan otomatis menghilang dan tombol kembali aktif.

---

## 4. Modul Dashboard Utama (`/dashboard`)

Halaman utama yang menyajikan ringkasan performa finansial toko florist secara *real-time*:

1. **Kartu Indikator Finansial Utama (KPI)**:
   * **Saldo Usaha Kas**: Total saldo kas kumulatif saat ini.
   * **Pemasukan Bulan Ini**: Akumulasi penjualan papan bunga dan uang muka (DP).
   * **Pengeluaran Bulan Ini**: Total belanja bahan baku, operasional, dan logistik.
   * **Laba Bersih**: Selisih bersih antara pemasukan dan pengeluaran bulan berjalan.
2. **Grafik Arus Kas Mingguan & Bulanan**: Visualisasi interaktif menggunakan Chart.js untuk memantau perbandingan pemasukan dan pengeluaran harian.
3. **Proporsi Pengeluaran (Donut Chart)**:
   * Menampilkan persentase pengeluaran berdasarkan kelompok:
     * 🌸 **Bahan Bunga**: Mawar segar, aster, krisan (~45%).
     * 🪵 **Bahan Papan**: Rangka kayu, styrofoam, busa gabus (~30%).
     * 🚚 **Biaya Operasional**: Ongkos kirim armada, bensin kurir (~15%).
     * 📦 **Lainnya**: Jarum pentul, lem tembak, isolasi (~10%).
4. **Tabel Transaksi Terkini**: Menampilkan 5 transaksi terakhir dengan status dan metode pembayaran yang jelas.

---

## 5. Modul Pencatatan Transaksi (`/transactions/create`)

Gunakan modul ini setiap kali terjadi penjualan karangan bunga atau pengeluaran belanja bahan:

### Langkah-langkah Pencatatan:
1. **Pilih Jenis Transaksi**:
   * Klik tombol toggle **Pemasukan** (Warna Hijau Botani) atau **Pengeluaran** (Warna Merah Bata).
2. **Pilih Tanggal Transaksi**:
   * Tanggal otomatis terisi tanggal hari ini, namun dapat diubah sesuai tanggal nota/kuitansi.
3. **Pilih Kategori Transaksi**:
   * Kategori akan terfilter otomatis sesuai jenis transaksi yang dipilih:
     * *Pemasukan*: Penjualan Papan Bunga, Uang Muka Pesanan (DP).
     * *Pengeluaran*: Pembelian Bunga Segar, Bahan Papan & Styrofoam, Biaya Transportasi & Pengiriman, dll.
4. **Masukkan Nominal Transaksi**:
   * Ketik angka nominal (contoh: ketik `450000`). Sistem otomatis memformat angka menjadi tampilan Rupiah rapi (`Rp 450.000`).
5. **Keterangan Transaksi**:
   * Tulis rincian pesanan, contoh: *"Pesanan Papan Bunga Pernikahan 2 Unit - Gedung Graha Medika"*.
6. **Metode Pembayaran**:
   * Pilih metode yang digunakan pembeli/toko:
     * **Tunai (Cash)**
     * **Transfer Bank**
     * **QRIS** (Mendukung transaksi non-tunai barcode QRIS florist)
7. **Simpan Transaksi**:
   * Klik tombol **"Simpan Transaksi"**.
   * Transaksi langsung tercatat ke dalam pembukuan dan saldo usaha akan terbarui seketika.

---

## 6. Modul Riwayat Transaksi (`/transactions`)

Halaman penelusuran seluruh catatan keuangan dengan filter multi-kriteria:

* **Pencarian Kata Kunci**: Cari transaksi berdasarkan nama pembeli, keterangan, atau nomor invoice.
* **Filter Rentang Tanggal (Date Range)**:
  * Masukkan Tanggal Mulai (*Start Date*) dan Tanggal Akhir (*End Date*).
  * **Validasi Negatif Otomatis**: Jika Tanggal Mulai diisi lebih besar dari Tanggal Akhir, sistem secara cerdas mencegah eksekusi pencarian dan memunculkan notifikasi peringatan:
    > *"Tanggal mulai tidak boleh lebih besar dari tanggal akhir."*
* **Filter Kategori & Metode Pembayaran**: Saring riwayat khusus QRIS, transfer bank, atau tunai.
* **Aksi Edit & Hapus (Khusus Pemilik & Admin)**:
  * Klik ikon **Pensil** untuk memperbarui data transaksi yang salah input.
  * Klik ikon **Tempat Sampah** untuk menghapus transaksi. Sistem akan memunculkan jendela dialog konfirmasi (*Modal Confirmation*) untuk mencegah terhapusnya data secara tidak sengaja.

---

## 7. Modul Laporan Keuangan Komprehensif (`/reports/financial`)

Modul laporan terperinci untuk evaluasi kesehatan finansial dan pembagian dividen/laba:

1. **Pilihan Periode Laporan**:
   * **Bulan Ini** (1 bulan berjalan)
   * **3 Bulan Terakhir** (Kuartal)
   * **6 Bulan Terakhir** (Semester)
   * **Tahun Ini** (Akumulasi 1 tahun penuh)
2. **Analisis Rasio Finansial**:
   * **Profit Margin (%)**: Persentase margin laba bersih dari total omset.
   * **Efisiensi HPP (%)**: Rasio belanja modal bahan terhadap total penjualan.
   * **Rata-rata Nilai Pesanan (*Average Ticket Size*)**: Rata-rata nominal per satu pesanan papan bunga.
3. **Ekspor Berkas Resmi**:
   * **Unduh Dokumen PDF Resmi (`.pdf`)**: Menghasilkan dokumen laporan berformat A4 dengan tata letak elegan, kop usaha FLOWID, tanda tangan pengesahan, dan rincian transaksi yang siap dicetak.
   * **Unduh Spreadsheet Excel (`.xlsx`)**: Menghasilkan lembar kerja Excel dengan kolom terformat, warna tematik, serta formula kalkulasi otomatis (`=SUM(...)`) untuk pembukuan akuntansi.

---

## 8. Modul Rekap Bulanan & Evaluasi Tahunan (`/reports/monthly`)

Fitur unggulan untuk menganalisis tren performa bisnis florist dari bulan ke bulan:

1. **Kartu Analisis Unggulan (*Key Insights*)**:
   * 🏆 **Bulan Terbaik**: Menampilkan bulan dengan pendapatan omset tertinggi beserta totalnya (contoh: **Mei 2026 - Rp 9.000.000**).
   * 📉 **Pengeluaran Terbesar**: Menampilkan bulan dengan belanja operasional tertinggi beserta komponen biaya paling dominan (contoh: **Mei 2026 (Biaya Bunga)**).
   * 💰 **Saldo Akhir Berjalan**: Menampilkan saldo kas akhir per posisi bulan aktif saat ini.
2. **Grafik Batang Komparasi 12 Bulan**:
   * Batang Hijau: Total Pemasukan per bulan.
   * Batang Merah: Total Pengeluaran per bulan.
3. **Filter Kuartal & Semester**:
   * Tombol filter instan: **Semua Bulan**, **Semester 1 (Jan - Jun)**, **Semester 2 (Jul - Des)**, **Q1**, **Q2**, **Q3**, **Q4**.
4. **Tabel Neraca Kas 12 Bulan**:
   * Menampilkan rincian tabel per bulan: Total Pemasukan, Total Pengeluaran, dan Selisih Laba/Rugi Bersih (*Net Profit*).

---

## 9. Modul Pengaturan Pengguna (`/users`)
*(Hanya dapat diakses oleh akun role **Pemilik Usaha**)*

Modul pengelolaan karyawan toko bunga FLOWID:

1. **Menambah Karyawan Baru**:
   * Klik tombol **"+ Tambah Pengguna"**.
   * Isi Nama Lengkap, Alamat Email (format `@flowid.id`), Kata Sandi Awal, dan Peran (*Admin* atau *Kasir*).
   * Klik **"Simpan Pengguna"**.
2. **Memperbarui Data & Mengubah Kata Sandi**:
   * Klik tombol **Edit** pada baris pengguna untuk memperbarui nama, email, atau mereset kata sandi karyawan.
3. **Status Akun Aktif / Nonaktif**:
   * Karyawan yang sedang cuti atau berhenti dapat dinonaktifkan tanpa menghapus riwayat transaksi lama yang pernah dicatat oleh karyawan tersebut.
