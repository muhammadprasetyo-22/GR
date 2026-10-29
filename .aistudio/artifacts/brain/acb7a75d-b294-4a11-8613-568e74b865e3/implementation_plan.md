# Rencana Arsitektur & Migrasi Multi-Tenant Guyub Rukun (MongoDB & Vercel Serverless)

## 1. Ringkasan & Tujuan
Membangun dan mengintegrasikan fondasi arsitektur **Multi-Tenant SaaS RT/RW** pada aplikasi **Guyub Rukun** dengan database **MongoDB (Mongoose)**, siap dideploy di **Vercel Serverless Functions**:
- **Connection Caching**: Mencegah kebocoran koneksi (*connection exhaustion*) & overhead cold-start di lingkungan stateless Vercel Serverless.
- **Multi-Tenant Schemas**: Menjamin isolasi data ketat berbasis `rtId` di seluruh koleksi dokumen (`Tenant`, `User`, `Kas`, `Iuran`, `Surat`, `Umkm`, dsb.).
- **NIK Per-Tenant Compound Index**: NIK unik per-tenant (`{ rtId: 1, nik: 1 }`), mendukung `username` / `nik` fleksibel.
- **Tenant Subscription & Active Period Guard**: Model `Tenant` (`packageTier`, `statusLangganan`, `expiredAt`) beserta middleware untuk memeriksa masa aktif RT/RW.
- **Sistem Autentikasi & JWT Multi-Tenant**: Endpoint `/api/auth/register` & `/api/auth/login` (dengan backward-compatibility ke `/api/register` & `/api/login`), mengembalikan token JWT berisi payload `{ userId, rtId, role }`.
- **Vercel Serverless Deployment Structure**: Entry point Express yang diekspor untuk Vercel (`api/index.ts` dan konfigurasi `vercel.json`).

---

## 2. Rincian Komponen Arsitektur

### A. Modul Koneksi Database Vercel Serverless (`src/db/db.ts` / `db.js`)
- Menggunakan pola caching koneksi global (`cached.conn` & `cached.promise` pada objek `global`).
- Konfigurasi Mongoose connection pool yang optimal untuk serverless:
  - `maxPoolSize: 10`
  - `serverSelectionTimeoutMS: 5000`
  - `socketTimeoutMS: 45000`
  - `bufferCommands: false` (opsional atau terkontrol agar tidak menggantung request jika cold-start lambat).

### B. Skema Mongoose Multi-Tenant
1. **Tenant (RT / Lingkungan)**:
   - `rtId` (string slug unik, misal: `'rt01'`, `'rt02'`)
   - `namaRt` (string)
   - `alamat` (string)
   - `packageTier` (`'Free' | 'VIP'`)
   - `statusLangganan` (boolean, default: `true`)
   - `expiredAt` (Date)
2. **User (Warga / Pengurus)**:
   - `rtId` (string, required)
   - `nik` (string, diindeks compound: `{ rtId: 1, nik: 1 }` unik per RT)
   - `username` (string)
   - `password` (hashed dengan `bcryptjs`)
   - `nama` (string)
   - `role` (`'warga' | 'admin' | 'bendahara' | 'sekretaris' | 'pengurus' | 'developer'`)
   - `status` (`'aktif' | 'nonaktif'`)
3. **Koleksi Terisolasi**:
   - `Kas`, `Iuran`, `Surat`, `Umkm`, `Laporan`, `Dokumen`, `Inventaris`, `Acara` semuanya memiliki `rtId` wajib dengan compound index `{ rtId: 1, createdAt: -1 }`.

### C. Middleware Keamanan & Multi-Tenancy
1. **`verifyJwt`**: Memverifikasi Bearer token JWT dan menyematkan `req.user` (`userId`, `rtId`, `role`).
2. **`checkTenantIsolation`**: Memastikan request dari token cocok dengan data yang diakses (mencegah *cross-tenant data leakage*). Role `developer` memiliki izin lintas RT untuk keperluan operasional platform.
3. **`checkTenantSubscription`**: Memvalidasi apakah tenant terkait memiliki `statusLangganan: true` dan tanggal `expiredAt` belum kedaluwarsa.

### D. Endpoint Autentikasi
- `POST /api/auth/register` & alias `POST /api/register`: Validasi pendaftaran warga baru dengan pengecekan NIK unik di dalam `rtId` terkait, hash password dengan `bcryptjs`, dan pembuatan data warga.
- `POST /api/auth/login` & alias `POST /api/login`: Validasi login berbasis NIK / username dan password, mengembalikan token JWT dengan payload `{ userId, rtId, role }` serta informasi tenant dan masa aktif langganan.

### E. Integrasi & Konfigurasi Vercel
- Menyediakan modul konfigurasi `db.js` / `src/db/db.ts` yang bersih dan modular.
- Memastikan `server.ts` mengimpor `connectDB` dari modul tersebut.
- Menyinkronkan `api/index.ts` dan `vercel.json` agar siap pakai di production Vercel.

---

## 3. Langkah Pelaksanaan
1. Buat file `src/db/db.ts` yang mengimplementasikan caching koneksi Mongoose serverless berstandar industri.
2. Tambahkan/perbarui skema Mongoose di `server.ts`:
   - Daftarkan `TenantModel` lengkap dengan field `packageTier`, `statusLangganan`, `expiredAt`.
   - Perbarui `UserSchema` dengan field `nik` dan compound index `{ rtId: 1, nik: 1 }`.
   - Tambahkan middleware `checkTenantSubscription`.
3. Buat rute `POST /api/auth/register` dan `POST /api/auth/login` yang kompatibel dengan alur multi-tenant dan tetap mempertahankan kompatibilitas aplikasi frontend yang ada (`/api/register` & `/api/login`).
4. Uji kompilasi (`compile_applet`), lakukan linting (`lint_applet`), dan restart dev server untuk memverifikasi fungsionalitas.
