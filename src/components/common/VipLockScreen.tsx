import React, { useState } from 'react';
import { Crown, Sparkles, ArrowLeft } from 'lucide-react';
import { VipComparisonModal } from './VipComparisonModal';

export interface VipLockScreenProps {
  featureName: string;
  onBack?: () => void;
  description?: string;
}

export const VipLockScreen: React.FC<VipLockScreenProps> = ({
  featureName,
  onBack,
  description
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-[420px] w-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-amber-50/60 via-amber-50/30 to-white rounded-3xl border border-amber-200/80 shadow-sm my-4">
      <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/25 mb-4 animate-bounce">
        <Crown className="w-8 h-8" />
      </div>
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-200 px-3.5 py-1 rounded-full mb-3">
        Fitur Khusus RT VIP
      </span>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
        {featureName} Terkunci
      </h2>
      <p className="text-xs md:text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
        {description || (
          <>
            Fitur <span className="font-semibold text-gray-900">{featureName}</span> hanya tersedia untuk lingkungan RT yang berstatus <span className="font-bold text-amber-600">Lisensi VIP</span>. Hubungi Ketua RT / Pengurus untuk melakukan aktivasi lisensi VIP RT.
          </>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        )}
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Pelajari Manfaat VIP
        </button>
      </div>

      <VipComparisonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isVip={false}
      />
    </div>
  );
};
