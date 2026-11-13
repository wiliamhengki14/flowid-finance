# Product Requirements Document (PRD): FLOWID Finance

| Informasi Dokumen | Detail |
| :--- | :--- |
| **Nama Produk** | FLOWID Finance |
| **Arsitektur Sistem** | Monolith Full-Stack (Laravel, Inertia.js, React, Chart.js, MySQL/PostgreSQL) |
| **Tipe Deployment** | Single-Tenant (Khusus internal usaha FLOWID Florist) |
| **Versi Dokumen** | 2.0 (100% Sinkron dengan 6 Layar Desain Referensi UI) |
| **Target Selesai (DoD)** | Full CRUD aktif (Transaksi & Pengguna), integrasi grafik dinamis Chart.js, ekspor dokumen laporan (PDF/Excel), dan *database seeder* komprehensif 12 bulan. |

---

## 1. Problem Statement
**Siapa yang dirugikan:** Pemilik dan Admin operasional usaha papan bunga (**FLOWID Florist**).

**Kenapa:** Operasional bisnis florist memiliki arus kas harian yang dinamis—mulai dari penerimaan uang muka (DP), pelunasan pesanan papan bunga, hingga pengeluaran rutin dengan urgensi tinggi seperti pembelian bunga segar, bahan papan, dan biaya transportasi pengiriman. Pencatatan manual di buku kas atau *spreadsheet* yang tidak terstandarisasi menyebabkan:
1. **Kebocoran Kas Operasional:** Pengeluaran kecil namun sering (seperti ongkos kirim dan beli bahan baku dadakan) sering tidak tercatat, sehingga saldo riil tidak sesuai dengan catatan.
2. **Kebutaan Analitik Biaya:** Pemilik tidak mengetahui secara pasti proporsi pengeluaran terbesar (apakah tersedot di bahan bunga atau operasional) sehingga sulit melakukan efisiensi margin.
3. **Keterlambatan Rekapitulasi:** Pembuatan laporan laba-rugi bulanan memakan waktu berjam-jam karena harus menjumlahkan transaksi satu per satu, menghambat pengambilan keputusan bisnis di akhir bulan.

---

## 2. Target User & Persona

Target utama pengguna operasional web ini adalah **Admin**, dengan dukungan manajemen hak akses untuk struktur multi-role (**Pemilik**, **Admin**, **Kasir**).

### Persona 1: Rina / Siti – Pemilik Usaha (Business Owner)
* **Profil:** Pemilik bisnis florist yang fokus pada pengembangan usaha dan pemantauan kesehatan finansial toko.
* **Tujuan:** Memantau saldo usaha terkini, melihat tren pertumbuhan laba bersih, mengidentifikasi pos pengeluaran terbesar, serta mengunduh laporan keuangan resmi.
* **Frustrasi:** Tidak punya waktu mengecek nota fisik satu per satu dan butuh visualisasi data instan.

### Persona 2: Admin Operasional Toko
* **Profil:** Staf administrasi harian yang bertugas melayani pesanan pelanggan, menerima pembayaran, dan mencatat pengeluaran belanja toko.
* **Tujuan:** Mencatat setiap uang masuk dan keluar dengan cepat, mencari riwayat transaksi ketika ada konfirmasi pembayaran, serta mengelola akun staf.
* **Frustrasi:** Formulir pencatatan yang lambat atau rumit saat jam sibuk pesanan florist membludak.

---

## 3. Goals & Non-Goals

### Goals (Sasaran Utama)
* Menyediakan sistem pencatatan transaksi keuangan manual (pemasukan dan pengeluaran) yang terpusat, cepat, dan tervalidasi.
* Menyajikan visualisasi data keuangan secara *real-time* menggunakan **Chart.js** untuk memantau perbandingan arus kas, tren bulanan, dan distribusi kategori pengeluaran.
* Mengotomatisasi kalkulasi metrik finansial utama: Saldo Usaha, Total Pemasukan, Total Pengeluaran, Selisih/Laba Bersih, dan persentase perubahan bulanan (*Month-over-Month*).
* Memfasilitasi pencarian, penyaringan (*filtering*), dan pengunduhan (*export*) laporan keuangan (PDF & Excel) secara instan.
* Menyediakan *database seeder* komprehensif agar sistem langsung memiliki simulasi data historis minimal 12 bulan penuh (termasuk proyeksi tahun 2026 sesuai desain UI) saat diuji coba.

### Non-Goals (Di Luar Cakupan MVP)
* **Bukan aplikasi SaaS Multi-Tenant:** Sistem tidak menyediakan fitur registrasi toko lain; murni untuk satu entitas usaha FLOWID Florist (dropdown nama toko di header bersifat identitas visual statis).
* **Tidak ada integrasi *Payment Gateway* otomatis di MVP:** Pembayaran otomatis ditaruh pada rencana pengembangan versi V2.
* **Bukan Sistem POS Kasir Fisik:** Tidak melacak jumlah tangkai bunga per satuan stok atau mencetak struk belanja termal pelanggan secara langsung.

---

## 4. User Stories

1. **Dashboard Analitik Menyeluruh:** Sebagai **Admin**, saya ingin melihat ringkasan saldo, grafik keuangan 6 bulan terakhir, persentase kategori pengeluaran, daftar transaksi terbaru, serta widget ringkasan bulanan dalam satu layar supaya kondisi kesehatan keuangan toko terpantau instan.
2. **Input Transaksi Cepat:** Sebagai **Admin**, saya ingin mencatat transaksi pemasukan maupun pengeluaran beserta tanggal, kategori, nominal, keterangan, dan metode pembayarannya sambil melihat widget *Info Hari Ini (Saldo Usaha)* supaya seluruh mutasi kas tercatat rapi di database.
3. **Manajemen & Filter Riwayat:** Sebagai **Admin**, saya ingin mencari keterangan transaksi, memfilter data berdasarkan jenis, kategori, dan rentang tanggal, serta melakukan aksi Edit/Hapus supaya verifikasi dan koreksi data berjalan cepat.
4. **Laporan Keuangan & Ekspor:** Sebagai **Admin**, saya ingin melihat grafik garis tren pemasukan & pengeluaran, kartu ringkasan laporan berdasarkan periode waktu tertentu, dan mengunduhnya menjadi file dokumen (PDF/Excel) untuk arsip pembukuan.
5. **Evaluasi Rekap Bulanan:** Sebagai **Admin**, saya ingin melihat perbandingan performa antarbulan dalam satu tahun beserta indikator *Bulan Terbaik*, *Pengeluaran Terbesar*, dan *Saldo Akhir Bulan Ini* untuk evaluasi bisnis.
6. **Manajemen Pengguna (Full CRUD):** Sebagai **Admin**, saya ingin melihat daftar pengguna, menambah pengguna baru, serta mengubah atau menghapus akun dengan peran terstruktur (**Pemilik**, **Admin**, **Kasir**).

---

## 5. Daftar Fitur (Roadmap)

| Kategori Tahapan | Fitur & Modul |
| :--- | :--- |
| **MVP (Must-Have — 100% Sesuai Desain UI)** | 1. **Autentikasi & Layout Global:** Sidebar navigasi dengan *branding* khas FLOWID ("*Bersama FLOWID, Kelola Keuangan Lebih Mudah*"), tombol *Keluar*, serta Topbar berisi identitas `FLOWID Florist`, ikon notifikasi, dan profil pengguna.<br>2. **Dashboard Utama:** 4 KPI Card (dengan persentase MoM & status kesehatan keuangan), Bar Chart Grafik Keuangan (filter 6 Bulan Terakhir), Doughnut Chart Kategori Pengeluaran (dengan teks persentase utama di tengah), Tabel Transaksi Terbaru (dengan kolom Status centang hijau), & Widget Ringkasan Bulanan di kanan bawah.<br>3. **Pencatatan Transaksi:** Form input *toggle* Pemasukan/Pengeluaran, Widget *Info Hari Ini (Saldo Usaha)*, dan kartu visual banner motivasi toko.<br>4. **Riwayat Transaksi:** Tabel CRUD (Edit/Hapus), *Search Bar*, Multi-Filter (Semua Jenis, Semua Kategori, Rentang Tanggal), tombol *Filter*, informasi jumlah data, & Paginasi.<br>5. **Laporan Keuangan:** Filter periode dinamis (`Bulan Ini`, dll.), Tombol **Unduh Laporan (PDF/Excel)**, 3 KPI Card (Total Pemasukan, Total Pengeluaran, Laba Bersih), Line Chart Tren, & Kartu **Ringkasan Laporan**.<br>6. **Rekap Bulanan:** Filter tahun (`2026`), Bar Chart komparasi bulanan, & Kartu **Ringkasan Bulanan** (*Bulan Terbaik*, *Pengeluaran Terbesar*, dan *Saldo Akhir Bulan Ini*).<br>7. **Pengaturan Pengguna:** Tab navigasi (*Daftar Pengguna* / *Tambah Pengguna*), tombol **+ Tambah Pengguna**, serta Tabel Pengguna lengkap dengan badge Role, Status, dan tombol aksi **Edit & Hapus**. |
| **v2 (Next Iteration)** | 1. Integrasi *Payment Gateway* (Midtrans/Xendit) untuk pencatatan pemasukan otomatis.<br>2. Manajemen Kategori Dinamis via antarmuka UI.<br>3. Lampiran unggah foto nota/bukti transaksi fisik. |
| **Nanti (Future)** | 1. Manajemen Multi-Cabang.<br>2. Modul inventori stok bahan baku bunga dan papan secara terintegrasi. |

---

## 6. Functional Requirements (Detail MVP)

### 6.0. Layout Global & Navigasi
* **FR-GL-01 (Sidebar & Header):** Menampilkan logo **FLOWID (Flower Board & More)**, 6 menu navigasi utama dengan indikator *active state* berwarna hijau tua (`#2F6B4F`), slogan dekoratif di bagian bawah sidebar, tombol **Keluar** (Logout), serta header atas yang memuat label toko `FLOWID Florist`, lonceng notifikasi, dan sapaan `Halo, Admin`.

### 6.1. Modul Dashboard Utama (`/dashboard` — Referensi `4.jpeg`)
* **FR-DB-01 (4 KPI Cards Utama):**
  1. **Saldo Usaha:** Menampilkan total saldo kas saat ini beserta persentase perubahan dari bulan lalu (contoh: `↑ +12% dari bulan lalu`).
  2. **Total Pemasukan:** Menampilkan akumulasi pemasukan bulan berjalan beserta persentase perbandingan bulan lalu (contoh: `↑ +15% dari bulan lalu`).
  3. **Total Pengeluaran:** Menampilkan akumulasi pengeluaran bulan berjalan beserta persentase perbandingan bulan lalu (contoh: `↑ -8% dari bulan lalu`).
  4. **Selisih:** Menampilkan laba bersih/selisih bulan berjalan beserta teks indikator kesehatan otomatis (contoh: `"Keuangan dalam kondisi baik!"` jika bernilai positif).
* **FR-DB-02 (Grafik Keuangan):** Render **Bar Chart (Chart.js)** berdampingan yang membandingkan Pemasukan (hijau tua) dan Pengeluaran (merah muda/pink) per bulan, dilengkapi *dropdown* filter rentang waktu (`6 Bulan Terakhir`, `12 Bulan Terakhir`).
* **FR-DB-03 (Kategori Pengeluaran):** Render **Doughnut Chart (Chart.js)** dengan *center text label* yang menampilkan persentase dan nama kategori pengeluaran terbesar (contoh: `45% Bahan Bunga`), didampingi legenda persentase di sisi kanan (`Bahan Bunga`, `Bahan Papan`, `Operasional`, `Lainnya`).
* **FR-DB-04 (Tabel Transaksi Terbaru):** Menampilkan 4–5 transaksi terakhir terurut dari tanggal terbaru dengan kolom: *Tanggal*, *Keterangan*, *Kategori* (badge warna), *Jenis* (badge `Pemasukan`/`Pengeluaran`), *Nominal*, dan *Status* (ikon centang hijau $\checkmark$ sebagai tanda transaksi telah tercatat valid), serta tautan `Lihat Semua ->` menuju halaman Riwayat Transaksi.
* **FR-DB-05 (Widget Ringkasan Bulanan):** Berada di sebelah kanan tabel transaksi terbaru, dilengkapi *dropdown* pemilih bulan (contoh: `Oktober 2026`), menampilkan nominal *Pemasukan*, *Pengeluaran*, kartu *highlight* **Saldo Akhir Bulan** (dengan ikon piala), dan *insight* otomatis **Pengeluaran terbesar bulan ini** (contoh: `Bahan Bunga (45%)`).

### 6.2. Modul Pencatatan Transaksi (`/transactions/create` — Referensi `5.jpeg`)
* **FR-PT-01 (Toggle Jenis Transaksi):** Tombol *tab toggle* **Pemasukan** dan **Pengeluaran** di atas formulir yang secara dinamis memfilter pilihan pada *dropdown* Kategori.
* **FR-PT-02 (Form Input & Validasi):**
  * *Tanggal Transaksi:* Input *date picker* (format tampilan `DD/MM/YYYY`).
  * *Kategori:* Dropdown kategori sesuai jenis transaksi yang dipilih.
  * *Nominal:* Input angka dengan pemformatan otomatis prefix `Rp` dan pemisah ribuan titik (contoh: `Rp 750.000`).
  * *Keterangan:* Input teks dengan *placeholder* kontekstual (`Contoh: Pesanan papan bunga ulang tahun`).
  * *Metode Pembayaran:* Dropdown pilihan `Transfer` atau `Tunai`.
  * *Tombol Aksi:* Tombol lebar **Simpan Transaksi** dengan ikon simpan.
* **FR-PT-03 (Panel Kanan — Info Hari Ini & Banner):**
  * Menampilkan kartu **Info Hari ini** berisi angka **Saldo Usaha** terkini dan ilustrasi grafik tren naik yang otomatis diperbarui via Inertia.js sesaat setelah transaksi baru disimpan.
  * Menampilkan kartu visual gambar karangan papan bunga (*"Selamat & Sukses Untuk Kesuksesan Anda"*) di bawah kartu saldo untuk menjaga estetika sesuai referensi UI.

### 6.3. Modul Riwayat Transaksi (`/transactions` — Referensi `6.jpeg`)
* **FR-RT-01 (Bar Pencarian & Multi-Filter):**
  * Input pencarian berdasarkan kata kunci keterangan (`Cari keterangan transaksi...`).
  * Dropdown filter jenis (`Semua Jenis`, `Pemasukan`, `Pengeluaran`).
  * Dropdown filter kategori (`Semua Kategori` beserta daftar kategori).
  * Pemilih rentang tanggal (*Date Range Picker*, contoh: `05/10/2026 - 05/11/2026`) dan tombol eksekusi **Filter**.
* **FR-RT-02 (Tabel Data & CRUD):**
  * Kolom: *Tanggal*, *Keterangan*, *Kategori*, *Jenis* (badge hijau/merah), *Nominal* (diberi prefix `+Rp` berwarna hijau untuk pemasukan dan `-Rp` berwarna merah untuk pengeluaran), *Metode* (`Transfer`/`Tunai`), dan *Aksi*.
  * Kolom *Aksi* memuat tombol ikon **Edit** (membuka modal/form sunting transaksi) dan **Hapus** (konfirmasi hapus transaksi).
  * Bagian bawah tabel menampilkan teks informasi paginasi (`Menampilkan 1–5 dari 25 data`) dan deretan tombol nomor halaman (`< 1 2 3 4 5 >`).

### 6.4. Modul Laporan Keuangan (`/reports/financial` — Referensi `1.jpeg`)
* **FR-LK-01 (Filter Periode & 3 KPI Cards):**
  * Dilengkapi *dropdown* filter periode di kanan atas (`Bulan Ini`, `3 Bulan Terakhir`, `6 Bulan Terakhir`, `Tahun Ini`).
  * Menampilkan 3 KPI Card utama untuk periode terpilih: **Total Pemasukan** (kartu hijau muda), **Total Pengeluaran** (kartu merah muda), dan **Laba Bersih** (kartu hijau mint).
* **FR-LK-02 (Grafik Garis & Kartu Ringkasan Laporan):**
  * Sisi kiri bawah menampilkan **Grafik Pemasukan & Pengeluaran** berupa *Smooth Line Chart (Chart.js)* dengan titik *node* yang jelas untuk membandingkan tren pemasukan dan pengeluaran antarbulan.
  * Sisi kanan bawah menampilkan kartu **Ringkasan Laporan** yang menyusun rekapitulasi angka *Pemasukan*, *Pengeluaran*, dan *Laba Bersih* secara vertikal.
* **FR-LK-03 (Unduh Laporan):** Tombol dropdown **Unduh Laporan** di pojok kanan atas untuk mengekspor data laporan periode terpilih ke dalam format dokumen **PDF** atau **Excel (.xlsx)**.

### 6.5. Modul Rekap Bulanan (`/reports/monthly` — Referensi `2.jpeg`)
* **FR-RB-01 (Filter Tahun & Grafik Perbandingan):**
  * Dilengkapi *dropdown* pemilih tahun di kanan atas (contoh: `2026`).
  * Sisi kiri menampilkan **Perbandingan Pemasukan dan Pengeluaran** menggunakan *Bar Chart (Chart.js)* untuk membandingkan performa bulan demi bulan (Jan s/d Jun / Des).
* **FR-RB-02 (Kartu Ringkasan Bulanan & Insight):**
  * Sisi kanan menampilkan panel **Ringkasan Bulanan** yang memuat 3 sub-kartu otomatis berdasarkan tahun yang dipilih:
    1. **Bulan Terbaik:** Menampilkan nama bulan dengan pemasukan tertinggi beserta nominalnya (contoh: `Mei 2026 (dengan pemasukan Rp 9.000.000)`).
    2. **Pengeluaran Terbesar:** Menampilkan bulan dan nama kategori pengeluaran tertinggi (contoh: `Mei 2026 (Biaya Bunga)`).
    3. **Saldo Akhir Bulan Ini:** Kartu berlatar hijau muda dengan ikon kantong uang yang menampilkan saldo akhir bulan berjalan (contoh: `Rp 5.500.000`).

### 6.6. Modul Pengaturan Pengguna (`/users` — Referensi `3.jpeg`)
* **FR-PP-01 (Navigasi Tab & Tambah Pengguna):**
  * Menyediakan *tab toggle* **Daftar Pengguna** dan **Tambah Pengguna**, serta tombol aksi cepat **+ Tambah Pengguna** di pojok kanan atas untuk membuka formulir pembuatan akun baru.
* **FR-PP-02 (Tabel Daftar Pengguna & Aksi CRUD):**
  * Menampilkan tabel pengguna dengan kolom: *Nama*, *Email*, *Role*, *Status*, dan *Aksi*.
  * *Badge Role* memiliki skema warna spesifik: **Pemilik** (hijau), **Admin** (merah muda/pink), dan **Kasir** (kuning/oranye).
  * *Badge Status* menampilkan indikator `Aktif` (hijau) atau `Nonaktif` (abu-abu).
  * Kolom *Aksi* menyediakan tombol ikon **Edit** (untuk mengubah data profil, role, atau status aktif pengguna) dan tombol ikon **Hapus** (dengan proteksi agar akun yang sedang login tidak dapat menghapus dirinya sendiri).

---

## 7. Sketsa Data Model & Standarisasi Seeder

### 7.1. Entitas `users`
* `id` (BIGINT, PK, Auto Increment)
* `name` (VARCHAR 100) — Contoh Seeder: `'Admin'`, `'Siti Aisyah'`, `'Rina'`
* `email` (VARCHAR 150, Unique) — Contoh Seeder: `'admin@flowid.id'`, `'siti@flowid.id'`, `'rina@flowid.id'`
* `password` (VARCHAR 255)
* `role` (ENUM: `'pemilik'`, `'admin'`, `'kasir'`)
* `is_active` (BOOLEAN, Default: `true`)
* `created_at` & `updated_at` (TIMESTAMP)

### 7.2. Entitas `categories`
Untuk menyatukan tampilan pada grafik *Doughnut Chart* di Dashboard dan label pada tabel transaksi, atribut kategori dilengkapi `group_name` (untuk pengelompokan grafik) dan `name` (untuk pilihan detail di form & tabel):
* `id` (BIGINT, PK, Auto Increment)
* `name` (VARCHAR 100) — Nama kategori di form & tabel transaksi
* `group_name` (VARCHAR 50) — Pengelompokan untuk *Doughnut Chart* & *Badge* ringkas di Dashboard
* `type` (ENUM: `'pemasukan'`, `'pengeluaran'`)
* `color_hex` (VARCHAR 7) — Kode warna untuk grafik dan badge UI
* `created_at` & `updated_at` (TIMESTAMP)

**Standar Data Seeder `categories`:**

| `name` (Detail Transaksi) | `group_name` (Grafik/Dashboard) | `type` | `color_hex` |
| :--- | :--- | :--- | :--- |
| Penjualan Papan Bunga | Penjualan | `pemasukan` | `#2F6B4F` |
| Uang Muka Pesanan (DP) | Penjualan | `pemasukan` | `#4A9B73` |
| Pembelian Bunga Segar | Bahan Bunga | `pengeluaran` | `#F299A9` |
| Pembelian Bahan Papan & Styrofoam | Bahan Papan | `pengeluaran` | `#93B899` |
| Biaya Transportasi & Pengiriman | Operasional | `pengeluaran` | `#F7CB73` |
| Pengeluaran Lain-lain | Lainnya | `pengeluaran` | `#C7B2DE` |

### 7.3. Entitas `transactions`
* `id` (BIGINT, PK, Auto Increment)
* `user_id` (BIGINT, FK -> `users.id`)
* `category_id` (BIGINT, FK -> `categories.id`)
* `transaction_date` (DATE, Indexed)
* `type` (ENUM: `'pemasukan'`, `'pengeluaran'`, Indexed)
* `amount` (BIGINT) — Menyimpan nominal dalam satuan Rupiah penuh
* `description` (VARCHAR 255)
* `payment_method` (ENUM: `'transfer'`, `'tunai'`)
* `is_verified` (BOOLEAN, Default: `true` — Direpresentasikan sebagai ikon centang hijau $\checkmark$ pada kolom *Status* di tabel Transaksi Terbaru Dashboard)
* `created_at` & `updated_at` (TIMESTAMP)

---

## 8. Rumus Kalkulasi Finansial Standar
Agar angka di antara database, UI, dan file laporan PDF/Excel 100% konsisten, sistem menggunakan rumus baku berikut:
1. **Total Pemasukan Periode ($P_t$):**
   $$P_t = \sum \text{amount}_{\text{pemasukan pada periode } t}$$
2. **Total Pengeluaran Periode ($E_t$):**
   $$E_t = \sum \text{amount}_{\text{pengeluaran pada periode } t}$$
3. **Laba Bersih / Selisih Periode ($L_t$):**
   $$L_t = P_t - E_t$$
4. **Persentase Perubahan Bulanan (*Month-over-Month* / $\text{MoM}$):**
   $$\text{MoM (\%)} = \left( \frac{X_{\text{bulan ini}} - X_{\text{bulan lalu}}}{X_{\text{bulan lalu}}} \right) \times 100\%$$
   *(Catatan: Jika $X_{\text{bulan lalu}} = 0$, maka persentase ditampilkan sebagai `0%` atau `+100%` tanpa memicu error pembagian nol).*

---

## 9. Edge Cases & Failure States
1. **Zero Data / Bulan Kosong:** Grafik Chart.js dan kartu persentase menangani nilai $0$ dengan aman, menampilkan pesan *Empty State* yang ramah pengguna tanpa merusak tata letak *grid*.
2. **Double-Submit Form:** Tombol *Simpan Transaksi* dan *Simpan Pengguna* dinonaktifkan otomatis (`disabled`) selama *request* Inertia.js masih berlangsung.
3. **Validasi Rentang Tanggal Terbalik:** Filter tanggal awal yang lebih besar dari tanggal akhir pada halaman Riwayat Transaksi dicegah di sisi *frontend* dan divalidasi ketat pada *backend* Laravel.
4. **Proteksi Hapus Akun Sendiri & Kategori Terpakai:** Pengguna yang sedang aktif login tidak dapat menghapus akunnya sendiri di menu Pengaturan Pengguna.

---

## 10. Success Metrics
* **Kesesuaian Visual & Fungsional 100%:** Seluruh 6 halaman modul memiliki komponen, kartu *insight*, tabel, dan grafik yang identik dengan gambar referensi desain.
* **Akurasi Finansial 100%:** Konsistensi penuh antara perhitungan query database, tampilan kartu KPI, grafik Chart.js, dan hasil ekspor laporan PDF/Excel.
* **Performa Cepat ($< 1.5\text{ detik}$):** Navigasi antarhalaman via Inertia.js dan *rendering* grafik berjalan mulus di bawah $1.5\text{ detik}$.
* **Kesiapan Seeder:** Satu perintah `php artisan migrate:fresh --seed` langsung menyajikan akun pengguna (`admin@flowid.id`, `siti@flowid.id`, `rina@flowid.id`), kategori berstandar warna, dan simulasi transaksi realistis selama 12 bulan penuh di tahun 2026.