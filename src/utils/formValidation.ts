import { z } from 'zod';

export const wargaFormSchema = z.object({
  nama: z.string().trim().min(2, { message: 'Nama lengkap minimal 2 karakter' }),
  username: z.string().trim().min(3, { message: 'Username minimal 3 karakter' }).regex(/^[a-z0-9_.-]+$/i, { message: 'Username hanya boleh huruf, angka, titik, strip, atau underscore' }),
  nik: z.string().optional().refine(val => !val || /^\d{16}$/.test(val.trim()), { message: 'NIK harus terdiri dari 16 digit angka' }),
  noHp: z.string().optional().refine(val => !val || /^[0-9+ -]{9,16}$/.test(val.trim()), { message: 'Nomor telepon tidak valid' }),
  alamat: z.string().trim().min(3, { message: 'Alamat minimal 3 karakter' }),
  rtId: z.string().default('rt01')
});

export const kasFormSchema = z.object({
  type: z.enum(['Masuk', 'Keluar'], { message: 'Jenis transaksi harus Masuk atau Keluar' }),
  amount: z.number().gt(0, { message: 'Nominal transaksi harus lebih dari Rp 0' }),
  category: z.string().trim().min(1, { message: 'Pos / Kategori kas harus dipilih' }),
  message: z.string().trim().min(3, { message: 'Keterangan transaksi minimal 3 karakter' }),
  name: z.string().optional()
});

export const transferKasSchema = z.object({
  transferFrom: z.string().min(1, { message: 'Asal pos dana harus dipilih' }),
  transferTo: z.string().min(1, { message: 'Tujuan pos dana harus dipilih' }),
  transferAmount: z.number().gt(0, { message: 'Nominal pemindahan harus lebih dari Rp 0' }),
  transferNote: z.string().optional()
}).refine(data => data.transferFrom !== data.transferTo, {
  message: 'Asal dan tujuan pos dana tidak boleh sama',
  path: ['transferTo']
});

export const suratFormSchema = z.object({
  jenis: z.string().trim().min(1, { message: 'Jenis surat pengantar harus dipilih' }),
  keperluan: z.string().trim().min(5, { message: 'Keperluan/alasan surat minimal 5 karakter' }),
  nama: z.string().trim().min(2, { message: 'Nama pemohon tidak boleh kosong' }),
  noKtpKk: z.string().optional().refine(val => !val || /^\d{16}$/.test(val.trim()), { message: 'No. NIK/KK harus 16 digit angka' }),
  noHp: z.string().optional()
});

export const iuranFormSchema = z.object({
  nama: z.string().trim().min(2, { message: 'Nama pembayar tidak boleh kosong' }),
  nominal: z.number().gt(0, { message: 'Nominal iuran harus lebih besar dari Rp 0' }),
  jenis: z.string().trim().min(1, { message: 'Jenis iuran harus dipilih' }),
  bulan: z.string().optional()
});

export type ValidationResult<T> =
  | { success: true; data: T; error?: undefined }
  | { success: false; error: string; data?: undefined };

export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstIssue = result.error.issues[0];
  return { success: false, error: firstIssue ? firstIssue.message : 'Input data tidak valid' };
}
