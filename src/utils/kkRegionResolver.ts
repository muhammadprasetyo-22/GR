// Utilitas Pengenal & Kategorisasi Wilayah Alamat Kartu Keluarga (KK)
// Mendukung identifikasi cerdas: Kabupaten Tangerang, Kota Tangerang, dan Luar Kota Tangerang

// Daftar lengkap 29 Kecamatan di Kabupaten Tangerang
export const KECAMATAN_KAB_TANGERANG: string[] = [
  'BALARAJA', 'CIKUPA', 'CISAK', 'CISAUK', 'CISOKA', 'CURUG', 'GUNUNG KALER',
  'JAMBE', 'JAYANTI', 'KELAPA DUA', 'KEMIRI', 'KRESEK', 'KRONJO', 'LEGOK',
  'MAUK', 'MEKAR BARU', 'PAGEDANGAN', 'PAKUHAJI', 'PANONGAN', 'PASAR KEMIS',
  'PASARKEMIS', 'RAJEG', 'SEPATAN', 'SEPATAN TIMUR', 'SINDANG JAYA', 'SOLEAR',
  'SUKADIRI', 'SUKAMULYA', 'TELUKNAGA', 'TIGARAKSA', 'KOSAMBI'
];

// Kelurahan/Desa populer di Kabupaten Tangerang
export const KELURAHAN_KAB_TANGERANG: string[] = [
  'KUTABUMI', 'KUTA BUMI', 'KUTA BARU', 'KUTABARU', 'SUKAMANTRI', 'GELAM JAYA',
  'PASAR KEMIS', 'SUKA ASIH', 'PANGADEGAN', 'BITUNG JAYA', 'KADU', 'KADU JAYA',
  'BOJONG NANGKA', 'BENCONGAN', 'BENCONGAN INDAH', 'CURUG KULON', 'CURUG WETAN',
  'MEDANG', 'SAMPORA', 'SURADITA', 'CIBOGO', 'SITUGADUNG', 'SINDANG ASIH',
  'SINDANG PANON', 'SUKAHARJA', 'RANCA IYAH', 'PASIR GADUNG', 'TALAGA', 'TOBAT',
  'SUKATANI', 'KEDUNG DALEM', 'KOSAMBI TIMUR', 'SALEMBARAN', 'DADAP'
];

// Daftar lengkap 13 Kecamatan di Kota Tangerang
export const KECAMATAN_KOTA_TANGERANG: string[] = [
  'BATUCEPER', 'BENDA', 'CIBODAS', 'CILEDUG', 'CIPONDOH', 'JATIUWUNG',
  'KARANG TENGAH', 'KARANGTENGAH', 'KARAWACI', 'LARANGAN', 'NEGLASARI',
  'PERIUK', 'PINANG', 'TANGERANG'
];

// Kelurahan populer di Kota Tangerang
export const KELURAHAN_KOTA_TANGERANG: string[] = [
  'PORIS GAGA', 'PORIS PLAWAD', 'PORIS JAYA', 'SUDIMARA', 'PANINGGILAN',
  'GEBANG RAYA', 'PERIUK JAYA', 'UWUNG JAYA', 'GANDASARI', 'MANIS JAYA',
  'PASIR JAYA', 'CIMONE', 'CIMONE JAYA', 'PABUARAN', 'KOANG JAYA', 'NUSA JAYA',
  'BUGEL', 'GERENDENG', 'MARGASARI', 'SANGIANG JAYA', 'SUKAJADI', 'BELENDUNG',
  'JURUMUDI', 'PAJANG', 'KUNCIRAN', 'NEROGTOG', 'PAKUJAN', 'CIPETE', 'BABAKAN',
  'SUKASARI', 'TANAH TINGGI', 'BUARAN INDAH', 'CIKOKOL', 'PETIR', 'GONDRONG', 'KETAPANG'
];

// Kecamatan di Tangerang Selatan (Luar Kota Tangerang)
export const KECAMATAN_TANGSEL: string[] = [
  'CIPUTAT', 'CIPUTAT TIMUR', 'PAMULANG', 'PONDOK AREN', 'SERPONG', 'SERPONG UTARA', 'SETU'
];

export interface KkRegionInfo {
  category: 'Kabupaten Tangerang' | 'Kota Tangerang' | 'Luar Kota Tangerang';
  label: string;
  shortLabel: string;
  badgeColor: string;
  badgeBorder: string;
  badgeText: string;
  icon: string;
  alamat?: string;
  kecamatan?: string;
  kelurahan?: string;
  kabupatenKota?: string;
  provinsi?: string;
  isVerified?: boolean;
}

export function extractKkAddressFromText(text: string): {
  desaKelurahan?: string;
  kecamatan?: string;
  kabupatenKota?: string;
  provinsi?: string;
  alamatLengkap?: string;
} {
  const result: any = {};
  if (!text) return result;

  const clean = text.replace(/&amp;/g, '&').replace(/<[^>]+>/g, ' ');

  const desaMatch = clean.match(/(?:Desa\/Kelurahan|Kelurahan\/Desa|Desa|Kelurahan)\s*[:.]?\s*([A-Za-z0-9\s.'-]+?)(?=\s*(?:Kecamatan|RT\/RW|Kode Pos|Kabupaten|$|\n|\r))/i);
  if (desaMatch && desaMatch[1]) result.desaKelurahan = desaMatch[1].trim();

  const kecMatch = clean.match(/(?:Kecamatan|Kec\.)\s*[:.]?\s*([A-Za-z0-9\s.'-]+?)(?=\s*(?:Kabupaten|Kota|Provinsi|Kode Pos|$|\n|\r))/i);
  if (kecMatch && kecMatch[1]) result.kecamatan = kecMatch[1].trim();

  const kabKotaMatch = clean.match(/(?:Kabupaten\/Kota|Kabupaten|Kota|Kab\/Kota)\s*[:.]?\s*([A-Za-z0-9\s.'-]+?)(?=\s*(?:Provinsi|Kode Pos|Kodepos|$|\n|\r))/i);
  if (kabKotaMatch && kabKotaMatch[1]) result.kabupatenKota = kabKotaMatch[1].trim();

  const provMatch = clean.match(/Provinsi\s*[:.]?\s*([A-Za-z0-9\s.'-]+?)(?=\s*(?:Kode Pos|Kodepos|No\.?\s*KK|$|\n|\r))/i);
  if (provMatch && provMatch[1]) result.provinsi = provMatch[1].trim();

  const alamatMatch = clean.match(/Alamat\s*[:.]?\s*([A-Za-z0-9\s.,'/-]+?)(?=\s*(?:RT\/RW|Desa|Kelurahan|$|\n|\r))/i);
  if (alamatMatch && alamatMatch[1]) result.alamatLengkap = alamatMatch[1].trim();

  return result;
}

export function resolveWargaKkRegion(warga: any): KkRegionInfo {
  const isVerified = Boolean(warga?.kkVerifiedByAdmin);
  const explicitCategory = String(warga?.kkCategory || warga?.wilayahKk || '').trim();

  // 1. Jika sudah diverifikasi manual oleh pengurus
  if (isVerified && ['Kabupaten Tangerang', 'Kota Tangerang', 'Luar Kota Tangerang'].includes(explicitCategory)) {
    const isKab = explicitCategory === 'Kabupaten Tangerang';
    const isKota = explicitCategory === 'Kota Tangerang';
    return {
      category: explicitCategory as any,
      label: explicitCategory,
      shortLabel: isKab ? 'Kab. Tangerang' : explicitCategory,
      badgeColor: isKab ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : isKota ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-amber-50 text-amber-800 border-amber-300',
      badgeBorder: isKab ? 'border-emerald-300' : isKota ? 'border-blue-300' : 'border-amber-300',
      badgeText: isKab ? 'text-emerald-800' : isKota ? 'text-blue-800' : 'text-amber-800',
      icon: isKab ? '🏛️' : isKota ? '🏢' : '🌍',
      alamat: warga.alamatKk || explicitCategory,
      kecamatan: warga.kkKecamatan || '',
      kelurahan: warga.kkKelurahan || '',
      kabupatenKota: warga.kkKabupatenKota || explicitCategory,
      provinsi: warga.kkProvinsi || 'BANTEN',
      isVerified: true
    };
  }

  // 2. Ekstrak data teks dari dokumen KK jika tersedia (SVG / parsed)
  let parsed: any = {};
  const docKk = String(warga?.dokumenKk || '');
  if (docKk.startsWith('data:image/svg+xml') || docKk.includes('<svg')) {
    try {
      const base64Part = docKk.split(',')[1] || '';
      const svgText = docKk.includes(';base64,') ? atob(base64Part) : decodeURIComponent(base64Part);
      parsed = extractKkAddressFromText(svgText);
    } catch {}
  } else if (!docKk.startsWith('data:image/')) {
    parsed = extractKkAddressFromText(docKk);
  }

  const rawKec = (warga?.kkKecamatan || parsed.kecamatan || '').trim();
  const rawKel = (warga?.kkKelurahan || parsed.desaKelurahan || '').trim();
  const rawKabKota = (warga?.kkKabupatenKota || parsed.kabupatenKota || '').trim();
  const rawProv = (warga?.kkProvinsi || parsed.provinsi || '').trim();
  const rawAlamat = warga?.alamatKk || warga?.alamat || '';

  const upperKec = rawKec.toUpperCase();
  const upperKel = rawKel.toUpperCase();
  const upperKabKota = rawKabKota.toUpperCase();
  const textAggregate = `${upperKec} ${upperKel} ${upperKabKota} ${rawProv} ${rawAlamat}`.toUpperCase();

  const cleanNoKk = String(warga?.noKk || '').replace(/\D/g, '');
  const prefix4 = cleanNoKk.slice(0, 4);

  // 3. Pencocokan Cerdas Kecamatan Kabupaten Tangerang (29 Kecamatan)
  if (upperKec && KECAMATAN_KAB_TANGERANG.some(k => upperKec === k || upperKec.includes(k))) {
    const matchedKec = KECAMATAN_KAB_TANGERANG.find(k => upperKec === k || upperKec.includes(k)) || rawKec;
    return {
      category: 'Kabupaten Tangerang',
      label: 'Kabupaten Tangerang',
      shortLabel: 'Kab. Tangerang',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      badgeBorder: 'border-emerald-300',
      badgeText: 'text-emerald-800',
      icon: '🏛️',
      alamat: warga.alamatKk || `Kec. ${matchedKec}, Kab. Tangerang`,
      kecamatan: matchedKec,
      kelurahan: rawKel,
      kabupatenKota: 'Kabupaten Tangerang',
      provinsi: rawProv || 'BANTEN',
      isVerified
    };
  }

  // 4. Pencocokan Cerdas Kelurahan/Desa Kabupaten Tangerang (Kutabumi, Kuta Baru, Sukamantri, Gelam Jaya, dll.)
  if (upperKel && KELURAHAN_KAB_TANGERANG.some(k => upperKel === k || upperKel.includes(k))) {
    const matchedKel = KELURAHAN_KAB_TANGERANG.find(k => upperKel === k || upperKel.includes(k)) || rawKel;
    const inferredKec = matchedKel.includes('KUTA') ? 'Pasar Kemis' : rawKec || 'Pasar Kemis';
    return {
      category: 'Kabupaten Tangerang',
      label: 'Kabupaten Tangerang',
      shortLabel: 'Kab. Tangerang',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      badgeBorder: 'border-emerald-300',
      badgeText: 'text-emerald-800',
      icon: '🏛️',
      alamat: warga.alamatKk || `Desa/Kel. ${matchedKel}, Kec. ${inferredKec}, Kab. Tangerang`,
      kecamatan: inferredKec,
      kelurahan: matchedKel,
      kabupatenKota: 'Kabupaten Tangerang',
      provinsi: rawProv || 'BANTEN',
      isVerified
    };
  }

  // 5. Pencocokan Cerdas Kecamatan Kota Tangerang (13 Kecamatan)
  if (upperKec && KECAMATAN_KOTA_TANGERANG.some(k => upperKec === k || upperKec.includes(k))) {
    const matchedKec = KECAMATAN_KOTA_TANGERANG.find(k => upperKec === k || upperKec.includes(k)) || rawKec;
    return {
      category: 'Kota Tangerang',
      label: 'Kota Tangerang',
      shortLabel: 'Kota Tangerang',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
      badgeBorder: 'border-blue-300',
      badgeText: 'text-blue-800',
      icon: '🏢',
      alamat: warga.alamatKk || `Kec. ${matchedKec}, Kota Tangerang`,
      kecamatan: matchedKec,
      kelurahan: rawKel,
      kabupatenKota: 'Kota Tangerang',
      provinsi: rawProv || 'BANTEN',
      isVerified
    };
  }

  // 6. Pencocokan Cerdas Kelurahan Kota Tangerang
  if (upperKel && KELURAHAN_KOTA_TANGERANG.some(k => upperKel === k || upperKel.includes(k))) {
    const matchedKel = KELURAHAN_KOTA_TANGERANG.find(k => upperKel === k || upperKel.includes(k)) || rawKel;
    return {
      category: 'Kota Tangerang',
      label: 'Kota Tangerang',
      shortLabel: 'Kota Tangerang',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
      badgeBorder: 'border-blue-300',
      badgeText: 'text-blue-800',
      icon: '🏢',
      alamat: warga.alamatKk || `Kel. ${matchedKel}, Kota Tangerang`,
      kecamatan: rawKec || 'Kota Tangerang',
      kelurahan: matchedKel,
      kabupatenKota: 'Kota Tangerang',
      provinsi: rawProv || 'BANTEN',
      isVerified
    };
  }

  // 7. Cek Luar Kota Tangerang (Tangsel, DKI Jakarta, Jawa Barat, Jawa Tengah, dll.)
  if (
    (upperKec && KECAMATAN_TANGSEL.some(k => upperKec === k || upperKec.includes(k))) ||
    textAggregate.includes('TANGERANG SELATAN') ||
    textAggregate.includes('TANGSEL') ||
    textAggregate.includes('JAKARTA') ||
    textAggregate.includes('BEKASI') ||
    textAggregate.includes('BOGOR') ||
    textAggregate.includes('DEPOK') ||
    textAggregate.includes('BANDUNG') ||
    textAggregate.includes('SERANG') ||
    textAggregate.includes('LAMPUNG') ||
    textAggregate.includes('WONOGIRI') ||
    textAggregate.includes('JAWA')
  ) {
    return {
      category: 'Luar Kota Tangerang',
      label: 'Luar Kota Tangerang',
      shortLabel: 'Luar Kota Tangerang',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      badgeBorder: 'border-amber-300',
      badgeText: 'text-amber-800',
      icon: '🌍',
      alamat: warga.alamatKk || (rawKabKota ? `${rawKabKota}, ${rawProv || 'Indonesia'}` : 'Luar Kota Tangerang'),
      kecamatan: rawKec,
      kelurahan: rawKel,
      kabupatenKota: rawKabKota || 'Luar Kota Tangerang',
      provinsi: rawProv,
      isVerified
    };
  }

  // 8. Cek 4-Digit Awal Nomor KK (3603 = Kab Tangerang, 3671 = Kota Tangerang)
  if (prefix4.length === 4) {
    if (prefix4 === '3603') {
      return {
        category: 'Kabupaten Tangerang',
        label: 'Kabupaten Tangerang',
        shortLabel: 'Kab. Tangerang',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        badgeBorder: 'border-emerald-300',
        badgeText: 'text-emerald-800',
        icon: '🏛️',
        alamat: warga.alamatKk || 'Kabupaten Tangerang, Banten',
        kecamatan: rawKec || 'Pasar Kemis',
        kelurahan: rawKel || 'Kutabumi',
        kabupatenKota: 'Kabupaten Tangerang',
        provinsi: rawProv || 'BANTEN',
        isVerified
      };
    }
    if (prefix4 === '3671') {
      return {
        category: 'Kota Tangerang',
        label: 'Kota Tangerang',
        shortLabel: 'Kota Tangerang',
        badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
        badgeBorder: 'border-blue-300',
        badgeText: 'text-blue-800',
        icon: '🏢',
        alamat: warga.alamatKk || 'Kota Tangerang, Banten',
        kecamatan: rawKec,
        kelurahan: rawKel,
        kabupatenKota: 'Kota Tangerang',
        provinsi: rawProv || 'BANTEN',
        isVerified
      };
    }
    return {
      category: 'Luar Kota Tangerang',
      label: 'Luar Kota Tangerang',
      shortLabel: 'Luar Kota Tangerang',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      badgeBorder: 'border-amber-300',
      badgeText: 'text-amber-800',
      icon: '🌍',
      alamat: warga.alamatKk || `Luar Kota Tangerang (Kode: ${prefix4})`,
      kecamatan: rawKec,
      kelurahan: rawKel,
      kabupatenKota: rawKabKota || `Wilayah Kode ${prefix4}`,
      provinsi: rawProv,
      isVerified
    };
  }

  // 9. Cek Frasa Eksplisit di Teks
  if (textAggregate.includes('KABUPATEN') || textAggregate.includes('KAB. TANGERANG')) {
    return {
      category: 'Kabupaten Tangerang',
      label: 'Kabupaten Tangerang',
      shortLabel: 'Kab. Tangerang',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      badgeBorder: 'border-emerald-300',
      badgeText: 'text-emerald-800',
      icon: '🏛️',
      alamat: warga.alamatKk || 'Kabupaten Tangerang, Banten',
      kecamatan: rawKec || 'Pasar Kemis',
      kelurahan: rawKel,
      kabupatenKota: 'Kabupaten Tangerang',
      provinsi: rawProv || 'BANTEN',
      isVerified
    };
  }
  if (textAggregate.includes('KOTA TANGERANG') && !textAggregate.includes('SELATAN')) {
    return {
      category: 'Kota Tangerang',
      label: 'Kota Tangerang',
      shortLabel: 'Kota Tangerang',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
      badgeBorder: 'border-blue-300',
      badgeText: 'text-blue-800',
      icon: '🏢',
      alamat: warga.alamatKk || 'Kota Tangerang, Banten',
      kecamatan: rawKec,
      kelurahan: rawKel,
      kabupatenKota: 'Kota Tangerang',
      provinsi: rawProv || 'BANTEN',
      isVerified
    };
  }

  // 10. Default untuk lingkungan RT di Kutabumi / Pasar Kemis (Kabupaten Tangerang)
  return {
    category: 'Kabupaten Tangerang',
    label: 'Kabupaten Tangerang',
    shortLabel: 'Kab. Tangerang',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    badgeBorder: 'border-emerald-300',
    badgeText: 'text-emerald-800',
    icon: '🏛️',
    alamat: warga.alamatKk || 'Pasar Kemis, Kab. Tangerang',
    kecamatan: rawKec || 'Pasar Kemis',
    kelurahan: rawKel || 'Kutabumi',
    kabupatenKota: 'Kabupaten Tangerang',
    provinsi: rawProv || 'BANTEN',
    isVerified
  };
}
