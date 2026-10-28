// Cache TTL policies based on data volatility and transactional requirements
export interface CachePolicy {
  pattern: RegExp;
  ttlMs: number;
  strategy?: 'network-first' | 'cache-first';
}

export const CACHE_TTL_POLICIES: CachePolicy[] = [
  // Transaksional: Kas & Iuran & Surat - Network-First Strategy (ttlMs: 0)
  // Memastikan data keuangan dan persetujuan surat selalu mengambil data paling mutakhir saat online
  { pattern: /\/api\/data\/kas|\/api\/kas|\/api\/sedekah/i, ttlMs: 0, strategy: 'network-first' },
  { pattern: /\/api\/data\/iuran|\/api\/iuran/i, ttlMs: 0, strategy: 'network-first' },
  { pattern: /\/api\/data\/surat|\/api\/surat/i, ttlMs: 0, strategy: 'network-first' },
  
  // Dashboard & Quick Metrics (5 - 10 seconds for smooth navigation)
  { pattern: /\/api\/dashboard|\/api\/developer\/stats/i, ttlMs: 5 * 1000, strategy: 'network-first' },
  
  // Notifikasi (5 seconds)
  { pattern: /\/api\/notifications/i, ttlMs: 5 * 1000, strategy: 'network-first' },
  
  // Voting (10 seconds)
  { pattern: /\/api\/voting|\/api\/data\/voting/i, ttlMs: 10 * 1000 },

  // Profile (2 minutes)
  { pattern: /\/api\/profile|\/api\/warga\/[^\/]+(?!\/dokumen)/i, ttlMs: 2 * 60 * 1000 },
  
  // Master data & Static permissions (10 minutes)
  { pattern: /\/api\/menu-permissions|\/api\/public\/rt-list|\/api\/tangerang-logo-proxy/i, ttlMs: 10 * 60 * 1000 },

  // Warga list & General resource list (15 seconds)
  { pattern: /\/api\/warga|\/api\/data\/umkm|\/api\/data\/acara|\/api\/data\/laporan|\/api\/data\/media|\/api\/data\/dokumen|\/api\/data\/inventaris|\/api\/data\/tamu|\/api\/data\/notulen/i, ttlMs: 15 * 1000 },
  
  // Audit logs (10 seconds)
  { pattern: /\/api\/audit-logs/i, ttlMs: 10 * 1000 },
];

export const DEFAULT_CACHE_TTL = 15 * 1000;

export function getTtlForUrl(url: string): number {
  for (const policy of CACHE_TTL_POLICIES) {
    if (policy.pattern.test(url)) {
      return policy.ttlMs;
    }
  }
  return DEFAULT_CACHE_TTL;
}

export function isTransactionalUrl(url: string): boolean {
  return /\/api\/data\/kas|\/api\/kas|\/api\/data\/iuran|\/api\/iuran|\/api\/data\/surat|\/api\/surat|\/api\/sedekah/i.test(url);
}
