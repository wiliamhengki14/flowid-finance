# PANDUAN SETUP DAN INSTALASI SISTEM
## FLOWID Finance - Flower Board & More Management System

Dokumen ini ditujukan sebagai panduan teknis resmi bagi klien, dosen penguji, maupun tim pengembang untuk memindahkan, mengonfigurasi, dan menjalankan aplikasi **FLOWID Finance** pada komputer lokal (*local device*) berbasis **Laragon**, **XAMPP**, atau web server PHP lokal lainnya.

---

## 1. Daftar Berkas Pengiriman Proyek (*Delivery Checklist*)

Saat menyerahkan berkas proyek kepada klien atau penguji, pastikan hanya menyertakan berkas inti (*source code*) dan **tidak menyertakan** folder dependensi berukuran besar yang otomatis dibuat oleh sistem.

### ✅ Berkas & Folder yang WAJIB Dikirimkan:
| Folder / Berkas | Keterangan |
| :--- | :--- |
| `app/` | Controller, Model, Service, dan Middleware aplikasi |
| `bootstrap/` | Konfigurasi bootstrap framework Laravel |
| `config/` | Berkas konfigurasi sistem (Database, Session, App, dll.) |
| `database/` | Berkas migrasi skema tabel, factory, dan seeder data awal |
| `public/` | Asset publik, gambar logo, dan folder `public/build/` (hasil build frontend) |
| `resources/` | Komponen React (Inertia.js), halaman antarmuka, CSS Tailwind, dan Blade view |
| `routes/` | Rute aplikasi (`web.php`, `auth.php`, `console.php`) |
| `conf/` | Konfigurasi Docker, Nginx, dan Supervisor |
| `Dockerfile` | Konfigurasi kontainer produksi |
| `artisan` | CLI eksekutor Laravel |
| `composer.json` & `composer.lock` | Daftar pustaka backend PHP |
| `package.json` & `package-lock.json` | Daftar pustaka frontend Node.js / React |
| `vite.config.ts` | Konfigurasi bundler Vite |
| `tailwind.config.js` | Konfigurasi tema dan warna palet FLOWID |
| `tsconfig.json` | Konfigurasi TypeScript |
| `.env.example` | Template variabel lingkungan |
| `.gitignore` | Aturan pengabaian berkas Git |

### ❌ Berkas & Folder yang TIDAK BOLEH Disertakan:
* `vendor/` *(Dihasilkan otomatis melalui perintah `composer install`)*
* `node_modules/` *(Dihasilkan otomatis melalui perintah `npm install`)*
* `.env` *(Berisi data kredensial rahasia; gunakan `.env.example` sebagai gantinya)*
* `.git/` *(Folder riwayat version control, opsional untuk dihapus jika dikirim via zip)*
* `storage/logs/*.log` *(Berkas riwayat catatan log server lokal)*

> [!TIP]
> **Cara Mengemas Berkas (Packaging):**
> Hapus folder `vendor` dan `node_modules` sebelum melakukan *compress* ke format `.zip`. Folder `public/build` **sudah kami sertakan**, sehingga klien dapat langsung menjalankan aplikasi tanpa wajib menginstal Node.js jika hanya ingin menguji fitur.

---

## 2. Kebutuhan Sistem (*System Requirements*)

Pastikan perangkat komputer klien/penguji telah memenuhi prasyarat lingkungan perangkat lunak berikut:

* **Sistem Operasi**: Windows 10/11, macOS, atau Linux (Ubuntu/Debian)
* **Web Server & Database Stack**: **Laragon** (Sangat disarankan untuk Windows) atau XAMPP
* **PHP Engine**: Versi **PHP 8.2 atau lebih tinggi** (Disarankan PHP 8.3 / 8.4)
  * Ekstensi PHP wajib aktif: `pdo_mysql`, `pdo_pgsql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`, `gd`, `intl`, `zip`.
* **Database Management System (DBMS)**: MySQL versi 8.0+ atau MariaDB 10.4+ (Default Laragon)
* **Composer**: Composer 2.x
* **Node.js & NPM**: Node.js v18.x atau v20.x LTS *(Opsional jika ingin mengubah kode frontend/CSS)*

---

## 3. Langkah Instalasi di Device Klien (Menggunakan Laragon)

Berikut adalah panduan instalasi paling praktis dan cepat menggunakan **Laragon**:

### Langkah 1: Ekstraksi Berkas Proyek
1. Buka folder instalasi Laragon di komputer Anda (biasanya berada di `C:\laragon\www\` atau `D:\laragon\www\`).
2. Buat folder baru atau ekstrak zip berkas proyek ke dalam folder tersebut, misalnya:
   ```text
   C:\laragon\www\flowid-finance
   ```

### Langkah 2: Nyalakan Layanan Laragon
1. Buka aplikasi **Laragon**.
2. Klik tombol **"Start All"** untuk menjalankan layanan **Apache/Nginx** dan **MySQL**.

### Langkah 3: Buat Database MySQL Baru
1. Buka database manager bawaan Laragon dengan mengklik tombol **"Database"** (HeidiSQL) atau buka phpMyAdmin di browser (`http://localhost/phpmyadmin`).
2. Buat database baru bernama:
   ```sql
   CREATE DATABASE flowid_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Langkah 4: Buka Terminal Laragon
Di aplikasi Laragon, klik tombol **"Terminal"**. Terminal akan langsung membuka direktori kerja yang sudah terintegrasi dengan PHP dan Composer yang tepat.
Arahkan ke folder proyek jika belum berada di dalamnya:
```bash
cd flowid-finance
```

### Langkah 5: Salin & Konfigurasi Berkas `.env`
Salin template berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
*(Di Windows Command Prompt bisa gunakan: `copy .env.example .env`)*

Buka berkas `.env` menggunakan teks editor (VS Code, Notepad++, dsb.), lalu sesuaikan konfigurasi koneksi database:
```env
APP_NAME="FLOWID Finance"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flowid_finance
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```
> [!NOTE]
> Jika menggunakan Laragon standar, password default user `root` adalah kosong (`DB_PASSWORD=`).

### Langkah 6: Pasang Dependensi Backend (Composer)
Jalankan perintah berikut di terminal untuk memasang seluruh pustaka backend PHP:
```bash
composer install
```

### Langkah 7: Generate Kunci Keamanan Aplikasi (*Application Key*)
Jalankan perintah generate key untuk mengenkripsi session dan data sensitif:
```bash
php artisan key:generate
```

### Langkah 8: Jalankan Migrasi dan Seeder Data
Buat seluruh struktur tabel database beserta data pengguna awal dan transaksi historis:
```bash
php artisan migrate:fresh --seed
```
Perintah ini akan secara otomatis membuat tabel dan mengisikan:
1. Akun Pemilik (`admin@flowid.id`), Admin (`siti@flowid.id`), dan Kasir (`rina@flowid.id`).
2. Kategori pengeluaran & pemasukan toko bunga standar PRD.
3. Rekam transaksi realistis tahun 2026 untuk menguji grafik dan laporan.

### Langkah 9: Buat Symlink Penyimpanan Berkas (*Storage Link*)
Pastikan folder storage publik terhubung dengan baik:
```bash
php artisan storage:link
```

### Langkah 10: Pengaturan Aset Frontend (Opsional)
*Karena folder `public/build/` sudah kami sertakan dalam paket pengiriman*, aplikasi **bisa langsung dijalankan tanpa perlu build ulang**.
Namun jika klien atau penguji ingin mengompilasi ulang atau melakukan modifikasi kode React/Tailwind:
```bash
npm install
npm run build
```
Untuk mode pengembangan aktif dengan auto-reload (*hot module replacement*):
```bash
npm run dev
```

---

## 4. Menjalankan Aplikasi

Anda dapat menjalankan aplikasi menggunakan salah satu dari dua cara berikut:

### Opsi A: Menggunakan Virtual Host Otomatis Laragon (Praktis)
Jika fitur Pretty URL / Auto Virtual Host di Laragon aktif:
1. Klik kanan pada aplikasi Laragon -> pilih **Quick Settings** -> pastikan **Auto Virtual Hosts** tercentang.
2. Buka browser dan ketik alamat:
   👉 **`http://flowid-finance.test`**

### Opsi B: Menggunakan Perintah Artisan Serve (Universal)
Jalankan perintah berikut di terminal:
```bash
php artisan serve
```
Buka browser dan akses alamat lokal:
👉 **`http://localhost:8000`**

---

## 5. Kredensial Akun untuk Pengujian (*Test Accounts*)

Sistem telah dilengkapi dengan 3 role akun bawaan yang siap langsung digunakan login:

| Peran (Role) | Email Pengguna | Kata Sandi | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Pemilik Usaha** | `admin@flowid.id` | `password123` | Akses penuh seluruh sistem, Laporan, Evaluasi, & Manajemen Pengguna |
| **Admin Toko** | `siti@flowid.id` | `password123` | Pencatatan transaksi, riwayat, evaluasi rekap, & laporan keuangan |
| **Kasir** | `rina@flowid.id` | `password123` | Input penjualan/pengeluaran kas harian & melihat riwayat transaksi |

---

## 6. Penanganan Kendala Umum (*Troubleshooting*)

### 1. Pesan Error "Access denied for user 'root'@'localhost'"
* **Penyebab**: Password MySQL di file `.env` berbeda dengan password MySQL lokal Anda.
* **Solusi**: Buka file `.env`, pastikan `DB_PASSWORD` sesuai dengan konfigurasi server MySQL lokal Anda (di Laragon defaultnya dikosongkan).

### 2. Pesan Error "Unable to locate file in Vite manifest"
* **Penyebab**: Folder aset frontend `public/build` belum terbentuk atau terhapus.
* **Solusi**: Jalankan perintah `npm install && npm run build` di terminal untuk membangun ulang berkas frontend.

### 3. Tampilan Halaman Kosong atau Ikon Gagal Termuat
* **Penyebab**: Cache browser lama tersimpan atau cache konfigurasi framework.
* **Solusi**: Bersihkan cache aplikasi dengan perintah:
  ```bash
  php artisan optimize:clear
  ```
  Kemudian lakukan *Hard Refresh* di browser dengan menekan tombol `Ctrl + F5` (Windows) atau `Cmd + Shift + R` (Mac).

### 4. Ekstensi PHP Belum Aktif
* **Penyebab**: Ekstensi `gd` (untuk export Excel) atau `intl` belum aktif di PHP.
* **Solusi**: Di Laragon, klik menu **PHP** -> **Extensions** -> centang `gd`, `intl`, `pdo_mysql`, dan `zip`, lalu restart layanan Laragon.
