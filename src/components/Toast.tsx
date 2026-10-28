import React from 'react';
import { useHealth } from '../context/HealthContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useHealth();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#191c1e] text-white shadow-xl border border-white/10">
        <div className="w-6 h-6 rounded-full bg-[#00855b] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-[15px]">check</span>
        </div>
        <p className="font-['Inter'] text-xs font-medium leading-snug flex-1">
          {toastMessage}
        </p>
      </div>
    </div>
  );
};
