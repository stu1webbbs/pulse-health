import React from 'react';
import { ClinicalArticle } from '../types/health';

interface ArticleModalProps {
  article: ClinicalArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="relative h-48 w-full bg-[#f2f4f6]">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#00685f] uppercase tracking-wider">
            {article.source} • {article.readTime}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#191c1e] leading-snug">
            {article.title}
          </h2>

          <p className="text-sm text-[#3d4947] leading-relaxed whitespace-pre-line">
            {article.fullContent}
          </p>

          {/* Key Takeaways */}
          <div className="p-4 rounded-xl bg-[#f2f4f6] space-y-2">
            <div className="flex items-center gap-2 text-[#00685f] font-semibold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Clinical Takeaways</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#191c1e]">
              {article.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00855b] mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Citations */}
          <div className="border-t border-[#eceef0] pt-3">
            <p className="text-[11px] font-semibold text-[#565e74] uppercase tracking-wider mb-1.5">
              Peer-Reviewed Literature Citations
            </p>
            <ul className="space-y-1">
              {article.citations.map((cite, idx) => (
                <li key={idx} className="text-[11px] text-[#6d7a77] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[12px] text-[#00685f]">link</span>
                  <span>{cite}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eceef0] bg-[#f7f9fb] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#00685f] text-white font-semibold text-sm hover:bg-[#008378] transition-colors"
          >
            Finished Reading
          </button>
        </div>
      </div>
    </div>
  );
};
