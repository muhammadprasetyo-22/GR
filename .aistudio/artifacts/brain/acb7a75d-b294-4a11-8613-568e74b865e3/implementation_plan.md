# Identifikasi & Kategorisasi Alamat KK Warga (Guyub Rukun)

Sistem otomatisasi identifikasi dan kategorisasi alamat domisili asal dari seluruh dokumen Kartu Keluarga (KK) yang telah diunggah oleh warga RT ke dalam 3 kategori utama: **Kabupaten Tangerang**, **Kota Tangerang**, dan **Luar Kota Tangerang**, didukung oleh pencocokan cerdas tingkat Kecamatan & Kelurahan, verifikasi manual, panel rekapitulasi, dan filter terintegrasi.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi pertanyaan klarifikasi:
> - **Penempatan UI**: Keduanya ditampilkan — badge kategori langsung pada kartu warga di daftar warga & dokumen, serta panel rekapitulasi ringkasan statistik.
> - **Mekanisme Pemindaian**: Tombol "Scan & Identifikasi Semua KK" otomatis dengan opsi penyesuaian/koreksi manual oleh Ketua RT / Sekretaris.
> - **Aturan Pemilahan Teks "TANGERANG"**: Sistem mencocokkan nama Kecamatan dan Desa/Kelurahan (seperti *Pasar Kemis* / *Kutabumi* = **Kabupaten Tangerang**, sedangkan *Karawaci* / *Cipondoh* = **Kota Tangerang**), dengan validasi silang kode awal Nomor KK (3603 = Kab, 3671 = Kota).

---

## 1. Overview & Core Concept

- **Fungsi Utama**: Mengidentifikasi teks alamat pada Kartu Keluarga (KK) yang diunggah warga, mendeteksi baris `Desa/Kelurahan`, `Kecamatan`, dan `Kabupaten/Kota`, kemudian mengelompokkan ke dalam kategori:
  1. **Kabupaten Tangerang** (Kecamatan Pasar Kemis, Kutabumi, Rajeg, Cikupa, Curug, Kelapa Dua, Balaraja, dsb.)
  2. **Kota Tangerang** (Kecamatan Tangerang, Karawaci, Cipondoh, Batuceper, Ciledug, Pinang, Periuk, dsb.)
  3. **Luar Kota Tangerang** (Kota Tangerang Selatan, DKI Jakarta, Bogor, Bekasi, Serang, atau provinsi lainnya di luar Tangerang).
- **Target Pengguna**: Ketua RT, Sekretaris, dan Pengurus Lingkungan RT untuk sensus kependudukan, pemetaan asal domisili KK warga, dan ketertiban administrasi surat pengantar.
- **Nilai Tambah**: Memecahkan ambiguitas dokumen KK lama yang hanya mencantumkan "Kabupaten/Kota: TANGERANG" dengan mendeteksi Kecamatan & Kelurahan secara akurat dan otomatis.

---

## 2. User Experience & Visual Design

- **Panel Rekapitulasi Kategori KK (Summary Strip)**:
  - Ditempatkan di bagian atas tab Dokumen Warga / Data Warga untuk pengurus.
  - Menampilkan 4 kartu ringkasan bersih: Total KK Terupload, Kabupaten Tangerang, Kota Tangerang, dan Luar Kota Tangerang.
  - Setiap kartu dilengkapi jumlah warga dan persentase dari total KK terupload, menggunakan angka tabular (`font-mono tabular-nums`).
- **Kontrol Filter Segmented**:
  - Filter cepat untuk menyaring daftar warga: `Semua KK`, `Kabupaten Tangerang`, `Kota Tangerang`, `Luar Tangerang`, dan `Belum Diidentifikasi`.
- **Badge Kategori pada Daftar Warga**:
  - Ditempatkan di bawah nama/alamat warga dengan label unboxed dan penanda warna semantik tenang:
    - *Kab. Tangerang*: Aksen Emerald halus (`bg-emerald-50 text-emerald-800 border-emerald-200`)
    - *Kota Tangerang*: Aksen Biru profesional (`bg-blue-50 text-blue-800 border-blue-200`)
    - *Luar Tangerang*: Aksen Amber hangat (`bg-amber-50 text-amber-800 border-amber-200`)
    - Dilengkapi keterangan ringkas: `Kec. Pasar Kemis · Kel. Kutabumi`.
- **Aksi Batch Scan & Modal Edit Manual**:
  - Tombol aksi utama: `Scan & Identifikasi Semua KK` dengan dialog progress pemindaian realtime.
  - Tombol `Ubah Kategori / Alamat` pada setiap kartu warga untuk koreksi manual jika dokumen buram atau memiliki kasus khusus.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Hierarki Deteksi Kecamatan & Kelurahan**
  - *Pendekatan*: Menggunakan kamus wilayah resmi 29 Kecamatan Kabupaten Tangerang dan 13 Kecamatan Kota Tangerang, didukung daftar Kelurahan/Desa populer (termasuk Kutabumi, Pasar Kemis, Curug Kulon, Poris, dll.) serta verifikasi 4-digit awal NIK/No KK (3603 vs 3671).
  - *Alasan*: Menjawab masalah pada gambar lampiran pengguna di mana header KK hanya menulis "Kabupaten/Kota: TANGERANG", namun Kecamatan tertulis "PASAR KEMIS" dan Desa "KUTABUMI", yang secara de jure dan de facto adalah Kabupaten Tangerang.
- **Decision 2: Penyimpanan Permanen di Skema User**
  - *Pendekatan*: Menyimpan atribut `kkCategory`, `kkKecamatan`, `kkKelurahan`, `kkKabupatenKota`, dan `kkProvinsi` langsung pada dokumen User di MongoDB.
  - *Alasan*: Menghindari ekstraksi berulang yang membebani server/browser saat membuka daftar warga, mempercepat respon filter, dan memungkinkan ekspor data secara instan.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend UI Layer                         │
│  - MobileDokumen.tsx / MobileDataWarga.tsx                      │
│    ├─ Panel Rekapitulasi KK (Total, Kab, Kota, Luar)            │
│    ├─ Filter Segmented Tab (Kab Tangerang | Kota | Luar)        │
│    ├─ Tombol "Scan & Identifikasi Semua KK"                     │
│    └─ Modal Edit Manual Kategori & Wilayah KK                   │
└────────────────┬────────────────────────────────────────────────┘
                 │ HTTP API
┌────────────────▼────────────────────────────────────────────────┐
│                   Express & MongoDB Backend                     │
│  - POST /api/warga/identifikasi-semua-kk (Batch Scanner)        │
│  - PUT /api/warga/:id/kategori-kk (Manual Edit Override)        │
│  - GET /api/warga/rekapitulasi-kk (Summary Statistics)          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Engine Pengenal Wilayah (Tangerang Geo Resolver):         │  │
│  │ 1. Regex parser baris Desa/Kelurahan & Kecamatan          │  │
│  │ 2. Pencocokan Kamus 29 Kec. Kab Tangerang & 13 Kec. Kota   │  │
│  │ 3. Fallback Cross-Check Kode Wilayah KK (3603 / 3671)     │  │
│  │ 4. AI Vision OCR fallback jika berupa gambar/foto         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Rencana File yang Dikerjakan:
1. `server.ts`:
   - Implementasi kamus wilayah (Daftar Kecamatan Kabupaten Tangerang, Kota Tangerang, Tangerang Selatan).
   - Fungsi `resolveKkAddressCategory(text, noKk)` untuk mengekstrak Desa, Kecamatan, Kab/Kota, dan menentukan kategori.
   - Endpoint `/api/warga/identifikasi-semua-kk` (batch scan seluruh warga berdokumen KK).
   - Endpoint `/api/warga/:id/kategori-kk` (update manual kategori & alamat KK).
   - Penyesuaian skema `UserModel` untuk menyimpan `kkCategory`, `kkKecamatan`, `kkKelurahan`, `kkKabupatenKota`.
2. `src/types/index.ts`:
   - Penambahan tipe data `KkCategory` dan detail alamat KK pada interface `User`.
3. `src/MobileDokumen.tsx`:
   - Komponen Panel Rekapitulasi Kategori KK (Kabupaten Tangerang, Kota Tangerang, Luar Kota Tangerang).
   - Filter tab kategori KK pada daftar dokumen warga.
   - Badge status kategori dan rincian kecamatan pada setiap item warga.
   - Modal trigger pemindaian batch & modal koreksi manual kategori.
4. `src/MobileDataWarga.tsx`:
   - Integrasi badge kategori KK dan filter kategori alamat KK pada daftar seluruh warga RT.
