import React from 'react';
import { useHealth } from '../context/HealthContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useHealth();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0e1319] text-[#f1f5f9] shadow-2xl border border-[#00e5c9]/40 shadow-black/80">
        <div className="w-6 h-6 rounded-full bg-[#00e5c9] text-[#07090c] flex items-center justify-center shrink-0 shadow-[0_0_8px_#00e5c9]">
          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
        </div>
        <p className="font-['Inter'] text-xs font-medium leading-snug flex-1 text-[#f1f5f9]">
          {toastMessage}
        </p>
      </div>
    </div>
  );
};
