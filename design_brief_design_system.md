# Design Brief & Design System Specification: FLOWID Finance

| Informasi Dokumen | Detail |
| :--- | :--- |
| **Nama Produk** | FLOWID Finance |
| **Tech Stack Target** | Laravel, Inertia.js, React, Tailwind CSS, Chart.js |
| **Pendekatan Komponen** | Atomic Design Pattern (`atoms`, `molecules`, `organisms`, `templates`) |
| **Arah Visual** | *Refined Botanical Ledger* (Hangat secara estetika, tajam secara finansial) |
| **Standar Aksesibilitas** | WCAG 2.1 Level AA (Minimum Contrast $4.5:1$, Full Keyboard Navigation) |

---

## 1. Design Principles (3 Aturan Wajib UI)

1. **Zero-Friction Bookkeeping (Kecepatan Input di Atas Segala-galanya)**
   Admin toko bunga bekerja di tengah kesibukan pesanan papan bunga yang masuk bersamaan. Setiap transaksi harus bisa dicatat dalam waktu **kurang dari 10 detik** dengan maksimal 4 kali interaksi (*klik/tab*). Tidak boleh ada *modal* berlapis untuk input utama, *dropdown* harus mendukung pencarian/navigasi *keyboard*, dan perpindahan tab Pemasukan/Pengeluaran wajib memfilter kategori secara instan di sisi klien tanpa *loading* halaman.
2. **Botanical Warmth, Financial Precision (Hangat Secara Estetika, Tajam Secara Data)**
   Identitas toko bunga (*florist*) yang organik dan ramah pada gambar referensi tetap dipertahankan melalui nuansa *sage green*, *blush rose*, dan *warm alabaster*, namun seluruh angka nominal Rupiah, persentase, dan grafik wajib menggunakan kontras tinggi serta perataan angka (*tabular numerals*) agar mudah dipindai (*scannable*) dalam satu detik tanpa salah baca digit.
3. **Contextual Clarity Without Clutter (Satu Layar, Satu Fokus Keputusan)**
   Ornamen dekoratif (seperti ilustrasi daun pada sudut kartu dan foto papan bunga pada referensi visual) hanya boleh bertindak sebagai aksen latar dengan opasitas rendah ($10\%$–$15\%$) atau ditempatkan pada kolom sekunder yang tidak menghalangi area baca data utama. Setiap layar wajib memiliki satu *Primary Action* yang paling menonjol secara visual.

---

## 2. Visual Direction

* **Mood & Karakter:** *Refined Botanical Ledger* — Perpaduan antara ketenangan butik tanaman/bunga modern dengan ketegasan *dashboard fintech* eksekutif. Terasa bersih, teduh di mata saat dipakai berjam-jam oleh Admin, namun tegas dalam membedakan arus uang masuk (hijau hutan/botani) dan uang keluar (merah *terracotta/rose*).
* **Referensi Kualitas Visual:**
  * **Mercury / Wise Dashboard:** Untuk tata letak tabel transaksi yang bersih, *badge* status yang proporsional, dan keterbacaan nominal uang.
  * **Linear / Stripe Dashboard:** Untuk kehalusan *border* (`1px solid`), *micro-interactions*, dan hierarki kartu KPI.
* **Apa yang Wajib Dihindari (Anti-Patterns):**
  * **Hindari warna primer neon/default Tailwind** (seperti `green-500` atau `red-500` mentah). Warna di gambar referensi adalah hijau *sage/forest* dan merah *blush/coral* yang lembut namun kontras; warna neon akan merusak kesan elegan toko bunga.
  * **Hindari teks putih di atas latar *pink* muda atau hijau pastel.** Pada gambar referensi, seluruh *badge* memiliki teks gelap di atas latar pastel — aturan ini wajib dipertahankan agar rasio kontras lolos standar aksesibilitas WCAG AA.
  * **Hindari *drop shadow* hitam pekat.** Gunakan bayangan tipis berwarna hangat (*tinted warm shadow*) agar menyatu dengan latar belakang *cream/warm white*.
  * **Hindari ornamen bunga yang menabrak teks atau tabel.** Ilustrasi daun hanya diizinkan sebagai *watermark* sudut kartu (`pointer-events: none`).

---

## 3. Design Tokens

### 3.1. Palet Warna (Refined Botanical Palette)
Warna diekstrak dari ke-6 gambar referensi desain, kemudian dikalibrasi ulang tingkat saturasi dan *lightness*-nya (HSL) agar lebih mantap, profesional, dan memenuhi standar kontras keterbacaan:

| Token Name | Hex Code | Peran & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Background & Surface** | | |
| `bg-canvas` | `#FAF7F5` | Latar belakang utama halaman (*Warm Alabaster*). Mengurangi kelelahan mata dibanding putih mutlak `#FFFFFF` dan memberi nuansa hangat khas *florist*. |
| `bg-sidebar` | `#F2EFE9` | Latar *sidebar* navigasi (*Soft Oat/Sage Tint*). Memisahkan area navigasi dari konten utama tanpa perlu garis batas yang kaku. |
| `bg-surface` | `#FFFFFF` | Permukaan utama untuk Kartu KPI, Tabel, dan Container Grafik agar data tampil bersih dan tajam. |
| `bg-surface-muted` | `#F6F8F6` | Latar baris tabel saat *hover* atau kartu sekunder (seperti *Ringkasan Laporan* & *Info Hari Ini*). |
| **Brand & Primary (Botanical Forest)** | | |
| `brand-primary` | `#23533B` | Warna utama tombol aktif, menu *sidebar* aktif, dan fokus utama (*Deep Forest Green*). Memberikan wibawa finansial sekaligus identitas daun botani. |
| `brand-primary-hover` | `#1A3F2C` | State *hover* untuk tombol utama dan item navigasi aktif. |
| `brand-secondary` | `#3B7A57` | Warna batang/garis grafik **Pemasukan** (*Botanical Emerald*). Lebih hidup dari `brand-primary` agar grafik tampak segar namun tetap seirama. |
| `brand-subtle` | `#E6F2EC` | Latar belakang kartu Pemasukan, *badge* Pemasukan, dan *highlight* baris Laba Bersih. |
| **Semantic Financial & Accent (Blush & Rose)** | | |
| `finance-expense` | `#D96B7B` | Warna batang/garis grafik **Pengeluaran** (*Muted Rose Coral*). Menggantikan merah darurat yang agresif dengan warna kelopak bunga mawar yang tetap jelas menandakan kas keluar. |
| `finance-expense-text` | `#A83244` | Warna teks nominal pengeluaran (`-Rp300.000`) dan teks *badge* Pengeluaran/Admin agar tajam dibaca. |
| `finance-expense-subtle`| `#FCECEE` | Latar kartu Total Pengeluaran, *badge* Pengeluaran, dan kartu *insight* Pengeluaran Terbesar. |
| `accent-gold` | `#D99B26` | Warna ikon piala *Bulan Terbaik* dan kategori Operasional pada Doughnut Chart. |
| `accent-gold-subtle` | `#FEF6E6` | Latar *badge* Role `Kasir` dan latar ikon piala. |
| `accent-gold-text` | `#8C5E0A` | Teks untuk *badge* Role `Kasir` agar kontras di atas latar kuning pastel. |
| `accent-lavender` | `#A78BFA` | Warna kategori `Lainnya` ($10\%$) pada Doughnut Chart. |
| `accent-sage-chart` | `#74A88E` | Warna kategori `Bahan Papan` ($30\%$) pada Doughnut Chart. |
| **Typography & Borders** | | |
| `text-primary` | `#18221D` | Teks utama, judul halaman, dan angka KPI (*Charcoal Pine*). Lebih lembut dan menyatu dibanding hitam `#000000` murni. |
| `text-secondary` | `#526058` | Sub-judul, label *form*, dan header kolom tabel. |
| `text-muted` | `#84928A` | *Placeholder* input, label sumbu X/Y grafik, dan keterangan waktu. |
| `border-subtle` | `#E6E2DD` | Garis pemisah baris tabel dan *border* kartu (`1px solid`). |
| `border-focus` | `#23533B` | *Outline* input saat aktif (`ring-2 ring-[#23533B]/20`). |

### 3.2. Skala Tipografi
* **Heading & Brand Logo:** **`Playfair Display`** (khusus teks logo `FLOWID` di *sidebar* sesuai gambar referensi) dan **`Plus Jakarta Sans`** (untuk seluruh judul halaman, kartu, dan antarmuka). *Alasan:* `Plus Jakarta Sans` memiliki geometri modern yang sangat bersih untuk UI bisnis dan mendukung keterbacaan huruf Bahasa Indonesia dengan sangat baik.
* **Angka Finansial & Nominal Tabel:** **`Plus Jakarta Sans`** dengan properti CSS wajib `font-variant-numeric: tabular-nums`. *Alasan:* Memastikan lebar setiap angka ($0$–$9$) identik sehingga deretan nominal Rupiah pada tabel dan kartu ringkasan sejajar vertikal secara presisi.

| Token | Ukuran (`rem` / `px`) | Line Height | Font Weight | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| `display-kpi` | `1.75rem` ($28\text{px}$) | `2.25rem` ($36\text{px}$) | `700` (Bold) | Angka utama pada KPI Card (`Rp 7.500.000`). |
| `heading-1` | `1.5rem` ($24\text{px}$) | `2rem` ($32\text{px}$) | `700` (Bold) | Judul Halaman (`Selamat datang di FLOWID Finance!`, `Laporan Keuangan`). |
| `heading-2` | `1.125rem` ($18\text{px}$) | `1.625rem` ($26\text{px}$) | `600` (SemiBold) | Judul Section/Card (`Grafik Keuangan`, `Transaksi Terbaru`). |
| `body-base` | `0.875rem` ($14\text{px}$) | `1.25rem` ($20\text{px}$) | `400` / `500` | Teks isi tabel, *input field*, menu *sidebar*, dan tombol. |
| `caption-sm` | `0.75rem` ($12\text{px}$) | `1rem` ($16\text{px}$) | `500` (Medium) | Teks *badge* (`Pemasukan`), tren MoM (`+12% dari bulan lalu`), dan label grafik. |

### 3.3. Skala Spacing, Radius & Shadow
* **Spacing Scale (Basis $4\text{px}/8\text{px}$):**
  * `space-1` ($4\text{px}$): Jarak ikon ke teks di dalam *badge*.
  * `space-2` ($8\text{px}$): Jarak antar-tombol aksi tabel (Edit & Hapus).
  * `space-3` ($12\text{px}$): *Padding* vertikal baris tabel dan *input field*.
  * `space-4` ($16\text{px}$): Jarak antar-elemen di dalam kartu dan *gap* antar KPI Card.
  * `space-6` ($24\text{px}$): *Padding* internal utama kartu (`p-6`) dan jarak antar-section vertikal.
  * `space-8` ($32\text{px}$): *Padding* kontainer halaman utama pada layar desktop.
* **Border Radius (Lembut & Organik sesuai Referensi):**
  * `radius-sm` ($8\text{px}$ / `rounded-lg`): Tombol aksi tabel (Edit/Hapus), *input*, *select*, dan tombol paginasi.
  * `radius-md` ($12\text{px}$ / `rounded-xl`): Item navigasi *sidebar*, tombol utama (`+ Tambah Pengguna`, `Simpan Transaksi`).
  * `radius-lg` ($16\text{px}$ / `rounded-2xl`): Seluruh Kartu KPI, Kontainer Grafik, dan Kontainer Tabel.
  * `radius-full` ($9999\text{px}$ / `rounded-full`): *Badge* status/role (`Pemasukan`, `Pemilik`, `Aktif`) dan *pill toggle* tab.
* **Box Shadow:**
  * `shadow-card`: `0 2px 10px -2px rgba(24, 34, 29, 0.05), 0 1px 3px -1px rgba(24, 34, 29, 0.03)` — Bayangan lembut yang menjaga kartu putih tetap terangkat dari latar `#FAF7F5`.
  * `shadow-dropdown`: `0 10px 25px -5px rgba(24, 34, 29, 0.10), 0 4px 10px -2px rgba(24, 34, 29, 0.05)`.

---

## 4. Screen Inventory

| No | Nama Screen | Route URL | Tujuan Utama Screen | Pengguna Utama |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Login Autentikasi** | `/login` | Memvalidasi kredensial pengguna internal sebelum masuk ke sistem manajemen kas. | Pemilik, Admin, Kasir |
| 2 | **Dashboard Utama** | `/dashboard` | Menyajikan komando eksekutif $360^\circ$ atas kesehatan arus kas, tren 6 bulan, proporsi biaya, dan ringkasan bulanan secara instan. | Pemilik, Admin |
| 3 | **Pencatatan Transaksi** | `/transactions/create` | Menyediakan formulir cepat bebas distraksi untuk menginput uang masuk/keluar sekaligus melihat dampaknya pada saldo hari ini. | Admin, Kasir |
| 4 | **Riwayat Transaksi** | `/transactions` | Memfasilitasi audit, pencarian kata kunci, penyaringan multi-parameter, serta koreksi (Edit/Hapus) atas seluruh mutasi kas. | Admin |
| 5 | **Laporan Keuangan** | `/reports/financial` | Menghasilkan laporan laba-rugi berdasarkan periode pilihan beserta grafik kurva tren dan fitur unduh dokumen resmi (PDF/Excel). | Pemilik, Admin |
| 6 | **Rekap Bulanan** | `/reports/monthly` | Mengevaluasi performa antar-bulan dalam satu tahun fiskal dan menyoroti *Bulan Terbaik* serta *Pengeluaran Terbesar*. | Pemilik, Admin |
| 7 | **Pengaturan Pengguna** | `/users` | Mengelola daftar akun staf internal, penugasan *role* (`Pemilik`, `Admin`, `Kasir`), dan status aktif akses sistem. | Pemilik, Admin |

---

## 5. User Flow (Journey Utama Langkah demi Langkah)

### Flow 1: Mencatat Transaksi Baru (Oleh Admin di Jam Sibuk)
1. **Trigger:** Pelanggan mentransfer DP pesanan papan bunga atau kurir meminta uang bensin pengiriman.
2. **Navigasi:** Admin menekan menu **Pencatatan Transaksi** di *sidebar* kiri (`/transactions/create`).
3. **Pemilihan Jenis:** Secara *default*, *pill toggle* berada pada posisi **Pemasukan** (warna `#23533B`). Jika ingin mencatat pengeluaran, Admin menekan *toggle* **Pengeluaran** — daftar opsi pada *dropdown* Kategori otomatis berubah tanpa *reload* menjadi kategori pengeluaran (`Bahan Bunga`, `Bahan Papan`, `Operasional`, `Lainnya`).
4. **Pengisian Data:**
   * *Tanggal Transaksi:* Otomatis terisi tanggal hari ini (`05/11/2026`), dapat diubah lewat *datepicker*.
   * *Kategori:* Memilih dari *dropdown* (misal: `Penjualan Papan Bunga`).
   * *Nominal:* Mengetik angka (`750000`), sistem otomatis memformat tampilan menjadi `Rp 750.000` saat diketik (*auto-masking*).
   * *Keterangan:* Mengetik detail singkat (misal: `Pesanan papan bunga ulang tahun`).
   * *Metode Pembayaran:* Memilih `Transfer` atau `Tunai`.
5. **Eksekusi & Umpan Balik:** Admin menekan tombol **Simpan Transaksi**. Tombol masuk ke *state loading* (`Menyimpan...`, nonaktif untuk cegah *double-submit*).
6. **Penyelesaian:** Data tersimpan via Inertia `POST`, muncul *toast notification* sukses, *form* di-reset bersih, dan angka pada kartu **Info Hari Ini -> Saldo Usaha** di sebelah kanan langsung bertambah secara reaktif.

### Flow 2: Audit, Filter & Koreksi Transaksi Masa Lalu
1. **Trigger:** Pemilik atau pelanggan menanyakan konfirmasi pembayaran DP papan bunga minggu lalu.
2. **Navigasi:** Admin membuka menu **Riwayat Transaksi** (`/transactions`).
3. **Penyaringan Data:**
   * Admin mengetik kata kunci `"DP pesanan"` di *Search Bar*.
   * Memilih *Jenis* (`Pemasukan`), *Kategori* (`Uang Muka Pesanan`), dan *Rentang Tanggal* (`05/10/2026 - 05/11/2026`), lalu menekan tombol **Filter**.
4. **Verifikasi & Koreksi:** Tabel memperbarui daftar baris via Inertia *partial reload*. Jika ditemukan kesalahan input nominal, Admin menekan tombol ikon **Edit (Pensil Hijau)** pada kolom Aksi, memperbarui data melalui *Modal Edit Transaksi*, dan menyimpan perubahan.

### Flow 3: Evaluasi Laba Bersih & Ekspor Laporan Bulanan (Oleh Pemilik/Admin)
1. **Trigger:** Tutup buku akhir bulan untuk mengetahui laba bersih dan mengarsipkan pembukuan.
2. **Navigasi:** Membuka menu **Laporan Keuangan** (`/reports/financial`).
3. **Pemilihan Periode:** Memilih periode dari *dropdown* kanan atas (`Bulan Ini`, `3 Bulan Terakhir`, `6 Bulan Terakhir`, atau `Tahun Ini`).
4. **Analisis Visual:** Memeriksa 3 KPI Card (*Total Pemasukan*, *Total Pengeluaran*, *Laba Bersih*), tren kurva *Line Chart*, dan tabel vertikal *Ringkasan Laporan* di sisi kanan.
5. **Ekspor Dokumen:** Menekan *dropdown button* **Unduh Laporan** di kanan atas, lalu memilih **Unduh PDF (.pdf)** atau **Unduh Excel (.xlsx)**. Browser langsung mengunduh dokumen terformat rapi sesuai filter periode yang sedang aktif.

---

## 6. Layout per Screen

Seluruh halaman (kecuali Login) menggunakan **Master AppShell Layout**:
* **Left Sidebar (`width: 260px`, *fixed* di desktop):** Logo `FLOWID Finance / Flower Board & More` di atas, 6 menu navigasi vertikal dengan indikator aktif hijau penuh (`#23533B`), kartu kutipan dekoratif *"Bersama FLOWID, Kelola Keuangan Lebih Mudah ♡"* di kiri bawah, dan tombol **Keluar**.
* **Top Utility Header (`height: 64px`):** Kiri menampilkan *Store Badge Selector* (`FLOWID Florist` — statis/single-tenant); kanan menampilkan tombol ikon lonceng notifikasi dan menu profil (`Halo, Admin`).

### 6.1. Dashboard Utama (`/dashboard`)
* **Hierarki & Section:**
  1. *Welcome Banner:* Judul sapaan & sub-teks deskriptif.
  2. *Row 1 — 4 KPI Summary Grid (`grid-cols-4`, gap `16px`):* Kartu `Saldo Usaha`, `Total Pemasukan`, `Total Pengeluaran`, dan `Selisih` (dilengkapi tren `% dari bulan lalu` atau status `Keuangan dalam kondisi baik!`).
  3. *Row 2 — Analytics Section (`grid-cols-12`, gap `24px`):* Kiri (`col-span-7`) **Grafik Keuangan** (Grouped Bar Chart + filter periode `6 Bulan Terakhir`); Kanan (`col-span-5`) **Kategori Pengeluaran** (Doughnut Chart dengan *center label* `45% Bahan Bunga` + daftar legenda persentase di kanan).
  4. *Row 3 — Activity & Monthly Digest (`grid-cols-12`, gap `24px`):* Kiri (`col-span-8`) tabel **Transaksi Terbaru** (5 baris terakhir + tautan `Lihat Semua ->`); Kanan (`col-span-4`) widget **Ringkasan Bulanan** (pemilih bulan `Oktober 2026`, angka Pemasukan/Pengeluaran, kartu *highlight* `Saldo Akhir Bulan`, dan *insight* `Pengeluaran terbesar bulan ini: Bahan Bunga (45%)`).
* **Primary Action:** Navigasi cepat ke rincian transaksi via `Lihat Semua ->` dan filter periode grafik.

### 6.2. Pencatatan Transaksi (`/transactions/create`)
* **Hierarki & Section (`grid-cols-12`, gap `24px`):**
  1. *Header Halaman:* Ikon + judul `Pencatatan Transaksi` + sub-judul.
  2. *Kolom Kiri — Form Card (`col-span-7`):* *Segmented Pill Toggle* (`Pemasukan` | `Pengeluaran`) di bagian atas, diikuti susunan *form* 2 kolom sejajar (*label* di kiri `col-span-4`, *input control* di kanan `col-span-8`) untuk Tanggal Transaksi, Kategori, Nominal, Keterangan, dan Metode Pembayaran, ditutup dengan tombol lebar penuh **Simpan Transaksi**.
  3. *Kolom Kanan — Contextual Sidebar (`col-span-5`):* Atas: Kartu **Info Hari Ini** menampilkan `Saldo Usaha` terkini (`Rp 7.500.000`) beserta ikon grafik naik dan aksen daun; Bawah: Kartu visual foto karangan bunga papan *"Selamat & Sukses Untuk Kesuksesan Anda"* sebagai penguat identitas produk.
* **Primary Action:** Tombol **Simpan Transaksi** (`w-full`, `#23533B`).

### 6.3. Riwayat Transaksi (`/transactions`)
* **Hierarki & Section:**
  1. *Header Halaman:* Judul `Riwayat Transaksi` + sub-judul.
  2. *Filter & Search Bar Toolbar:* Satu baris kontrol berisi *Search Input* (`Cari keterangan transaksi...`), *Select Jenis* (`Semua Jenis`), *Select Kategori* (`Semua Kategori`), *Date Range Picker* (`05/10/2026 - 05/11/2026`), dan tombol **Filter**.
  3. *Data Table Card:* Tabel 7 kolom (`Tanggal`, `Keterangan`, `Kategori`, `Jenis`, `Nominal`, `Metode`, `Aksi`) dengan format nominal bertanda `+Rp` (hijau) dan `-Rp` (merah).
  4. *Table Footer:* Informasi jumlah baris (`Menampilkan 1–5 dari 25 data`) di kiri dan tombol **Paginasi** (`< 1 2 3 4 5 >`) di kanan.
* **Primary Action:** Tombol **Filter** dan aksi **Edit/Hapus** per baris transaksi.

### 6.4. Laporan Keuangan (`/reports/financial`)
* **Hierarki & Section:**
  1. *Header & Action Bar:* Kiri judul `Laporan Keuangan`; Kanan *Select Periode* (`Bulan Ini`) dan *Dropdown Button* **Unduh Laporan**.
  2. *Row 1 — 3 Financial KPI Cards (`grid-cols-3`, gap `20px`):* `Total Pemasukan` (latar hijau lembut), `Total Pengeluaran` (latar merah muda lembut), dan `Laba Bersih` (latar hijau mint lembut).
  3. *Row 2 — Trend & Summary (`grid-cols-12`, gap `24px`):* Kiri (`col-span-8`) **Grafik Pemasukan & Pengeluaran** (*Smooth Line Chart* 6 bulan `Okt`–`Mar`); Kanan (`col-span-4`) kartu **Ringkasan Laporan** berisi tabel rekap vertikal Pemasukan, Pengeluaran, dan baris *highlight* Laba Bersih.
* **Primary Action:** Tombol **Unduh Laporan** (PDF / Excel).

### 6.5. Rekap Bulanan (`/reports/monthly`)
* **Hierarki & Section:**
  1. *Header & Year Selector:* Kiri judul `Rekap Bulanan`; Kanan *Select Tahun* (`2026`).
  2. *Main Content (`grid-cols-12`, gap `24px`):* Kiri (`col-span-8`) **Perbandingan Pemasukan dan Pengeluaran** (*Grouped Bar Chart* `Jan`–`Jun`); Kanan (`col-span-4`) panel **Ringkasan Bulanan** yang memuat 3 sub-kartu vertikal:
     * Kartu *Bulan Terbaik* (Ikon Piala Emas, `Mei 2026`, `(dengan pemasukan Rp 9.000.000)`).
     * Kartu *Pengeluaran Terbesar* (Ikon Segitiga Peringatan Merah, `Mei 2026`, `(Biaya Bunga)`).
     * Kartu *Saldo Akhir Bulan Ini* (Ikon Kantong Uang, `Rp 5.500.000` dengan latar hijau lembut).
* **Primary Action:** Pemilihan filter tahun (`2026`) untuk membandingkan histori performa bulanan.

### 6.6. Pengaturan Pengguna (`/users`)
* **Hierarki & Section:**
  1. *Header Halaman:* Judul `Pengaturan Pengguna` + sub-judul.
  2. *Toolbar Navigasi & Aksi:* Kiri *Segmented Pill Tabs* (`Daftar Pengguna` | `Tambah Pengguna`); Kanan tombol **+ Tambah Pengguna**.
  3. *User Table Card:* Tabel 5 kolom (`Nama`, `Email`, `Role`, `Status`, `Aksi`) dengan *badge* warna berbeda untuk `Pemilik` (hijau), `Admin` (merah muda), dan `Kasir` (kuning), *badge* status `Aktif`, serta tombol ikon Edit dan Hapus.
* **Primary Action:** Tombol **+ Tambah Pengguna**.

---

## 7. Component Library (Arsitektur Atomic Design di React)

Seluruh komponen UI diatur menggunakan struktur direktori **Atomic Design** (`resources/js/Components/`):

```text
resources/js/Components/
├── atoms/          # Elemen dasar tak terpisahkan (Button, Input, Select, Badge, Icon, CurrencyText)
├── molecules/      # Gabungan atom dengan satu fungsi (FormRow, SegmentedToggle, KPICard, InsightCard, Pagination)
├── organisms/      # Bagian UI mandiri (Sidebar, Topbar, DataTable, ChartContainer, TransactionForm, FilterToolbar)
└── templates/      # Kerangka halaman (AuthenticatedLayout, AuthLayout)
```

### 7.1. Level 1: Atoms (`Components/atoms/`)

| Nama Komponen | Props Utama | Variants | States |
| :--- | :--- | :--- | :--- |
| **`Button`** | `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`, `disabled`, `type` | `primary` (`#23533B` teks putih)<br>`secondary` (putih, border `#E6E2DD`, teks `#18221D`)<br>`tonal-green` (latar `#E6F2EC`, teks `#23533B` untuk tombol Edit)<br>`tonal-danger` (latar `#FCECEE`, teks `#A83244` untuk tombol Hapus)<br>`ghost` (tanpa latar, untuk `Lihat Semua ->`) | `default`, `hover`, `focus-visible` (ring hijau), `active` (`scale-[0.99]`), `loading` (spinner + teks nonaktif), `disabled` (`opacity-50 cursor-not-allowed`) |
| **`Input`** | `type`, `value`, `onChange`, `placeholder`, `error`, `prefix`, `suffix` | `default` (teks biasa)<br>`currency` (dengan *prefix* `Rp` dan auto-format ribuan)<br>`search` (dengan ikon kaca pembesar di kiri)<br>`date` (dengan ikon kalender hijau di kanan) | `default` (border `#E6E2DD`), `hover` (border `#84928A`), `focus` (border `#23533B` + ring), `error` (border `#A83244` + pesan error di bawah), `disabled` |
| **`Select`** | `options`, `value`, `onChange`, `placeholder`, `error` | `form-select` (lebar penuh untuk form input)<br>`filter-select` (ukuran kompak untuk toolbar filter seperti `Bulan Ini`, `2026`, `Semua Kategori`) | `closed`, `open` (daftar opsi muncul dengan `shadow-dropdown`), `focus`, `error`, `disabled` |
| **`Badge`** | `variant`, `size`, `children` | `income` / `role-owner` / `status-active` (latar `#E6F2EC`, teks `#23533B`)<br>`expense` / `role-admin` (latar `#FCECEE`, teks `#A83244`)<br>`warning` / `role-cashier` (latar `#FEF6E6`, teks `#8C5E0A`)<br>`neutral` (latar `#F2EFE9`, teks `#526058`) | Statis (non-interaktif) |
| **`CurrencyText`** | `amount`, `showSign`, `size`, `colored` | `neutral` (teks `#18221D`)<br>`signed-income` (`+Rp750.000` warna `#23533B`)<br>`signed-expense` (`-Rp300.000` warna `#A83244`) | Otomatis memformat `BIGINT` menjadi format lokal `id-ID` dengan `tabular-nums`. |

### 7.2. Level 2: Molecules (`Components/molecules/`)

| Nama Komponen | Komposisi Atom | Variants & Perilaku |
| :--- | :--- | :--- |
| **`SegmentedToggle`** | Container `rounded-full` + 2 `Button` *pill* | Digunakan pada saklar `Pemasukan` / `Pengeluaran` di Pencatatan Transaksi dan tab `Daftar Pengguna` / `Tambah Pengguna` di Pengaturan Pengguna. Tab aktif berwarna `#23533B` dengan teks putih; tab non-aktif berlatar putih/abu lembut. |
| **`FormRow`** | `Label` + (`Input` / `Select`) + `ErrorMessage` | Mendukung tata letak `horizontal` (label di kiri, input di kanan seperti pada Pencatatan Transaksi) dan `vertical` (pada layar mobile atau modal). |
| **`KPICard`** | `IconBox` + `Label` + `CurrencyText` + `TrendIndicator` + `BotanicalWatermark` | 4 varian tema warna latar: `mint` (Saldo/Laba Bersih), `blush` (Pemasukan/Selisih di Dashboard atau Pengeluaran di Laporan), dan `surface-white`. |
| **`InsightCard`** | `IconBadge` + `Title` + `MainValue` + `Subtext` | Digunakan pada panel kanan Rekap Bulanan (`Bulan Terbaik` dengan ikon piala dan `Pengeluaran Terbesar` dengan ikon peringatan). |
| **`Pagination`** | Info Teks + deretan `Button` halaman (`< 1 2 3 4 5 >`) | Halaman aktif menggunakan latar `#23533B` teks putih; tombol panah kiri/kanan otomatis `disabled` saat berada di halaman pertama atau terakhir. |

### 7.3. Level 3: Organisms (`Components/organisms/`)
* **`FilterToolbar`:** Menggabungkan `Input` (Search), 2 `Select` (Jenis & Kategori), `DateRangePicker`, dan `Button` Filter dalam satu baris responsif.
* **`TransactionTable` & `UserTable`:** Komponen tabel lengkap dengan header, *row hover state*, perataan kolom nominal secara konsisten, grup tombol aksi (`Edit` & `Delete`), serta *Empty State* terintegrasi.
* **`ChartContainer`:** Pembungkus kanvas *Chart.js* (Bar, Line, Doughnut) yang dilengkapi *Header Judul*, *Custom HTML Legend* (titik hijau `Pemasukan` & titik merah muda `Pengeluaran`), serta *Select Filter Periode* di pojok kanan atas.
* **`ExportDropdown`:** Tombol hijau `Unduh Laporan` di halaman Laporan Keuangan yang membuka menu pilihan ekspor `PDF (.pdf)` dan `Excel (.xlsx)`.

---

## 8. States per Screen Kunci

| State | Perilaku Visual & UX pada Layar Kunci |
| :--- | :--- |
| **1. Empty State (Data Kosong / Bulan Baru)** | **Dashboard & Laporan:** Grafik *Chart.js* tetap menampilkan kerangka garis sumbu X/Y dengan nilai $0$ dan ilustrasi garis tipis di tengah kanvas bertuliskan *"Belum ada transaksi pada periode ini"* beserta tombol pintas `+ Catat Transaksi Pertama`. Kartu persentase MoM menampilkan strip `- (0%)` agar tidak terjadi *error division by zero*.<br>**Riwayat Transaksi:** Jika hasil pencarian/filter tidak ditemukan, tampilkan ilustrasi kaca pembesar botani di tengah tabel dengan pesan *"Tidak ada transaksi yang cocok dengan filter Anda"* dan tombol sekunder `Reset Filter`. |
| **2. Loading State** | **Navigasi Halaman & Filter Tabel:** Menampilkan *Top Progress Bar* Inertia berwarna `#23533B` di bagian paling atas layar. Baris tabel dan kartu KPI menampilkan *Skeleton Shimmer* berwarna hangat (`#F2EFE9` ke `#FAF7F5`) selama data diambil.<br>**Submit Form & Ekspor:** Tombol `Simpan Transaksi` berubah menjadi `[Spinner] Menyimpan...` dan tombol `Unduh Laporan` berubah menjadi `[Spinner] Menyiapkan Dokumen...` dalam kondisi *disabled*. |
| **3. Error State** | **Validasi Input Form:** Jika nominal kosong/kurang dari $\text{Rp } 1$, tanggal tidak valid, atau rentang tanggal filter terbalik (*Tanggal Mulai > Tanggal Akhir*), *border* input berubah menjadi merah `#A83244` dengan teks penjelasan spesifik tepat di bawah *field* terkait (misal: *"Nominal transaksi wajib diisi angka lebih dari 0"*).<br>**Server/DB Failure (500):** Menampilkan *Toast Alert* merah di kanan atas dengan tombol `Coba Lagi` tanpa menghapus teks yang sudah diketik Admin di dalam formulir. |
| **4. Success State** | **Input / Edit / Hapus Transaksi & Pengguna:** Menampilkan *Floating Toast Notification* berlatar `#23533B` dengan ikon centang di pojok kanan atas selama 3 detik (misal: *"Transaksi pemasukan Rp 750.000 berhasil disimpan"*). Pada halaman Pencatatan Transaksi, angka pada kartu **Saldo Usaha** melakukan animasi *highlight pulse* lembut saat nilainya bertambah/berkurang. |
| **5. Offline State** | Jika koneksi internet terputus saat aplikasi terbuka (dideteksi via event `window.onoffline`), tampilkan *Sticky Banner* kuning (`#FEF6E6`, teks `#8C5E0A`) di bagian atas layar: *"Koneksi terputus. Anda sedang dalam mode luar jaringan — tombol simpan dinonaktifkan sementara hingga koneksi kembali stabil."* Tombol `Simpan Transaksi` otomatis dikunci agar Admin tidak kehilangan input akibat kegagalan request. |

---

## 9. Responsive Behavior (Mobile, Tablet, Desktop)

| Breakpoint | Perilaku Layout, Navigasi, Tabel, dan Grafik |
| :--- | :--- |
| **Desktop ($\ge 1024\text{px}$ / `lg` & `xl`)** | **Navigasi:** *Sidebar* kiri ($260\text{px}$) tampil permanen.<br>**Grid:** Dashboard menampilkan 4 KPI Card sejajar (`grid-cols-4`), Grafik Bar + Doughnut berdampingan ($7:5$), dan Tabel + Ringkasan Bulanan berdampingan ($8:4$).<br>**Form Pencatatan:** Label dan input berjajar horizontal (`grid-cols-12`) berdampingan dengan panel *Info Hari Ini* di sebelah kanan. |
| **Tablet ($768\text{px}$ – $1023\text{px}$ / `md`)** | **Navigasi:** *Sidebar* kiri menyusut menjadi *Collapsible Drawer* (terbuka lewat tombol *Hamburger* di kiri atas Topbar) agar area kerja konten tetap lega.<br>**Grid:** 4 KPI Card menjadi $2\times 2$ (`grid-cols-2`). Grafik Keuangan dan Kategori Pengeluaran ditumpuk vertikal (`grid-cols-1`) dengan lebar penuh. Form Pencatatan tetap di atas, sedangkan kartu *Info Hari Ini* berpindah ke bagian atas formulir sebagai *compact banner*. |
| **Mobile ($< 768\text{px}$ / `sm`)** | **Navigasi:** *Sidebar Drawer* untuk menu lengkap + *Bottom Navigation Bar* cepat untuk 4 menu paling sering diakses (`Dashboard`, `Catat (+)`, `Riwayat`, `Laporan`).<br>**Grid & Form:** Seluruh KPI Card ditumpuk 1 kolom. Pada halaman Pencatatan Transaksi, posisi *Label* berubah berada di atas *Input* (`flex-col`), dan gambar dekoratif papan bunga disembunyikan agar Admin fokus mengetik.<br>**Tabel Data:** Dibungkus dalam kontainer `overflow-x-auto` dengan kolom `Tanggal` dan `Nominal` tetap terlihat jelas, sementara *Filter Toolbar* pada Riwayat Transaksi dilipat ke dalam *Accordion/Bottom Sheet Filter*. |

---

## 10. Accessibility (Standar WCAG 2.1 Level AA)

1. **Rasio Kontras Warna (Minimum $4.5:1$ untuk Teks Normal, $3:1$ untuk Teks Besar/UI):**
   * Teks utama `#18221D` di atas latar `#FAF7F5` menghasilkan rasio kontras **$14.8 : 1$** (AAA).
   * Teks putih `#FFFFFF` di atas tombol hijau utama `#23533B` menghasilkan rasio kontras **$8.9 : 1$** (AAA).
   * Teks *badge* Pemasukan `#23533B` di atas latar `#E6F2EC` menghasilkan rasio kontras **$7.4 : 1$** (AAA).
   * Teks *badge* Pengeluaran `#A83244` di atas latar `#FCECEE` menghasilkan rasio kontras **$5.8 : 1$** (AA).
   * **Indikator Non-Warna:** Perbedaan Pemasukan dan Pengeluaran tidak hanya mengandalkan warna hijau dan merah (aman bagi penderita buta warna *deuteranopia/protanopia*), tetapi wajib selalu disertai **simbol tanda tambah/kurang** (`+Rp750.000` vs `-Rp300.000`) serta **ikon arah panah** (`↑` Pemasukan vs `↓` Pengeluaran).
2. **Focus Order & Navigasi Keyboard:**
   * Urutan fokus tombol `Tab` mengikuti alur baca huruf Z: **Sidebar Navigation -> Topbar Profile -> Header Action/Filter -> Konten Utama (Form/Tabel) -> Paginasi**.
   * Pada halaman **Pencatatan Transaksi**, urutan `Tab` dirancang khusus untuk input cepat: `Toggle Pemasukan/Pengeluaran` (dapat digeser dengan tombol `Panah Kiri/Kanan`) $\rightarrow$ `Tanggal` $\rightarrow$ `Kategori` $\rightarrow$ `Nominal` $\rightarrow$ `Keterangan` $\rightarrow$ `Metode Pembayaran` $\rightarrow$ `Enter` pada tombol `Simpan Transaksi`.
   * Seluruh elemen interaktif wajib memiliki gaya `:focus-visible` yang tegas (`outline: 2px solid #23533B; outline-offset: 2px`).
3. **Kebutuhan Atribut ARIA & Semantik HTML:**
   * **Icon-Only Buttons:** Tombol aksi di dalam tabel (pensil & tempat sampah) serta lonceng notifikasi wajib memiliki `aria-label` eksplisit, contoh: `aria-label="Edit transaksi Penjualan Papan Bunga"` dan `aria-label="Hapus pengguna Siti Aisyah"`.
   * **Segmented Toggle:** Menggunakan `role="tablist"` pada kontainer dan `role="tab"` + `aria-selected="true/false"` pada tombol `Pemasukan` dan `Pengeluaran`.
   * **Live Regions untuk Saldo & Notifikasi:** Angka `Saldo Usaha` pada widget *Info Hari Ini* dan komponen *Toast Notification* menggunakan `aria-live="polite"` agar pembaca layar (*screen reader*) otomatis mengumumkan perubahan saldo setelah transaksi disimpan.
   * **Aksesibilitas Grafik Chart.js:** Setiap elemen `<canvas>` wajib memiliki atribut `role="img"` dan `aria-label` dinamis yang merangkum isi grafik (misal: `aria-label="Grafik perbandingan pemasukan dan pengeluaran 6 bulan terakhir, pemasukan tertinggi pada bulan Oktober sebesar Rp 10.000.000"`).