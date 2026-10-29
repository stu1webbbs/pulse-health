import React from 'react';
import { ClinicalArticle } from '../types/health';

interface ArticleModalProps {
  article: ClinicalArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1319] border border-[#1f2834] w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 text-[#f1f5f9]">
        {/* Modal Header */}
        <div className="relative h-48 w-full bg-[#12171e]">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover opacity-85"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors border border-white/20"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="absolute bottom-3 left-4 bg-[#07090c]/90 border border-[#00e5c9]/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#00e5c9] uppercase tracking-wider font-mono">
            {article.source} • {article.readTime}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#f1f5f9] leading-snug">
            {article.title}
          </h2>

          <p className="text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line font-['Inter']">
            {article.fullContent}
          </p>

          {/* Key Takeaways */}
          <div className="p-4 rounded-xl bg-[#12171e] border border-[#1f2834] space-y-2">
            <div className="flex items-center gap-2 text-[#00e5c9] font-semibold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Clinical Takeaways</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#e2e8f0]">
              {article.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5c9] mt-1.5 shrink-0 shadow-[0_0_6px_#00e5c9]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Citations */}
          <div className="border-t border-[#1f2834] pt-3">
            <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5 font-mono">
              Peer-Reviewed Literature Citations
            </p>
            <ul className="space-y-1">
              {article.citations.map((cite, idx) => (
                <li key={idx} className="text-[11px] text-[#64748b] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[12px] text-[#00e5c9]">link</span>
                  <span>{cite}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2834] bg-[#07090c] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#00e5c9] text-[#07090c] font-bold text-sm hover:bg-[#38ef7d] transition-colors shadow-md shadow-[#00e5c9]/30"
          >
            Finished Reading
          </button>
        </div>
      </div>
    </div>
  );
};
