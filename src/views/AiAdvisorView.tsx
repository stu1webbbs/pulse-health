import React, { useState, useRef, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { clinicalArticles } from '../data/mockData';
import { ClinicalArticle } from '../types/health';
import { ArticleModal } from '../components/ArticleModal';
import { AnimatedNumber } from '../components/AnimatedNumber';

export const AiAdvisorView: React.FC = () => {
  const { chatMessages, isAiTyping, sendChatMessage, showToast, setActiveTab, vitals } = useHealth();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ClinicalArticle | null>(null);
  const streamBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    streamBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const msg = inputText;
    setInputText('');
    sendChatMessage(msg);
  };

  const toggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      setInputText('How is my arterial compliance and hydration correlating?');
      showToast('Voice transcription active');
      setTimeout(() => {
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* AI Advisor Hero & Status Banner */}
      <div className="px-4 pt-1 pb-2">
        <div className="p-4 rounded-2xl bg-[#0e1319] border border-[#1f2834] shadow-md flex items-start gap-3 relative overflow-hidden">
          {/* Glow ambient accent */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#00e5c9]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-10 h-10 rounded-xl bg-[#008378] flex items-center justify-center text-[#f1f5f9] flex-shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[24px]">psychology</span>
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
                Pulse AI Clinical Assistant
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-['Inter'] text-[10px] uppercase font-semibold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span> Active
              </span>
            </div>
            <p className="font-['Inter'] text-xs text-[#94a3b8] mt-0.5 leading-snug">
              Available 24/7 • Trained on peer-reviewed clinical guidelines • Not emergency care
            </p>
          </div>
        </div>
      </div>

      {/* Smart Context Chips (Horizontally Scrollable) */}
      <div className="w-full overflow-x-auto no-scrollbar py-2.5 px-4">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => sendChatMessage('Analyze my resting heart rate trend')}
            className="group flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12171e] hover:bg-[#1a222c] border border-[#1f2834] hover:border-[#00e5c9]/50 transition-all text-[#f1f5f9] text-left shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00e5c9] group-hover:scale-110 transition-transform">
              insights
            </span>
            <span className="font-['Inter'] text-xs font-medium">
              Analyze my resting heart rate trend
            </span>
          </button>
          <button
            onClick={() => sendChatMessage('Suggest low-sodium dinner ideas')}
            className="group flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12171e] hover:bg-[#1a222c] border border-[#1f2834] hover:border-[#00e5c9]/50 transition-all text-[#f1f5f9] text-left shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00e5c9] group-hover:scale-110 transition-transform">
              restaurant
            </span>
            <span className="font-['Inter'] text-xs font-medium">
              Suggest low-sodium dinner ideas
            </span>
          </button>
          <button
            onClick={() => sendChatMessage('Why is my deep sleep low this week?')}
            className="group flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12171e] hover:bg-[#1a222c] border border-[#1f2834] hover:border-[#00e5c9]/50 transition-all text-[#f1f5f9] text-left shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00e5c9] group-hover:scale-110 transition-transform">
              bedtime
            </span>
            <span className="font-['Inter'] text-xs font-medium">
              Why is my deep sleep low this week?
            </span>
          </button>
        </div>
      </div>

      {/* Conversational Feed */}
      <div className="px-4 flex flex-col gap-4 pt-2 pb-4">
        {chatMessages.map((msg) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex items-start justify-end gap-2.5 max-w-[90%] self-end">
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-[#008378] text-[#f1f5f9] p-4 rounded-2xl rounded-tr-xs shadow-md font-['Inter'] text-sm leading-relaxed border border-[#00bba7]/30">
                    {msg.text}
                  </div>
                  <span className="font-['Inter'] text-[11px] text-[#64748b] pr-1">
                    {msg.timestamp}
                  </span>
                </div>
                <img
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1 shadow-2xs ring-1 ring-[#00e5c9]/40"
                  alt="Alex Jordan"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKoBQzheynDho2wFVy5Lmz-2HQt2WSMmtoyDGFn1WreUKLyX2cw_30s0qgQV-kd7stt_itlYDFcjHl_FMFZfvLcslfRL-ZZmY9ksnMwS_OCfRng2p4tHtv31oWnGbs3woz_hszjRjWp1HOS2zztDIhGp13FQ20Th4oioc-sHady-rCsvRyYO_LVLkXCu-b5x-cNYGJA2MSD2C4xHnmBpNweTFiZpfp6ZHSH5MJvfGhUjLG0_qSDLEQMw"
                />
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-2.5 max-w-[95%]">
              <div className="w-7 h-7 rounded-full bg-[#00e5c9]/20 border border-[#00e5c9]/40 flex items-center justify-center text-[#00e5c9] flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="bg-[#0e1319] p-4 rounded-2xl rounded-tl-xs shadow-md text-[#f1f5f9] flex flex-col gap-3 border border-[#1f2834]">
                  <p className="font-['Inter'] text-sm leading-relaxed whitespace-pre-line text-[#cbd5e1]">
                    {msg.text}
                  </p>

                  {/* Embedded Metric Telemetry Card with Animated Numbers */}
                  {msg.telemetryCard && (
                    <div className="rounded-xl bg-[#12171e] border border-[#1f2834] p-3.5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#161d26] border border-[#242e3a] flex items-center justify-center text-[#00e5c9]">
                            <span className="material-symbols-outlined text-[20px] animate-heartbeat">
                              monitor_heart
                            </span>
                          </div>
                          <div>
                            <div className="font-['Inter'] text-[11px] uppercase tracking-wider text-[#94a3b8]">
                              {msg.telemetryCard.title}
                            </div>
                            <div className="flex items-baseline gap-1 font-mono">
                              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#f1f5f9]">
                                <AnimatedNumber value={vitals.restingHeartRate} />
                              </span>
                              <span className="font-['Inter'] text-xs text-[#64748b]">
                                {msg.telemetryCard.unit}
                              </span>
                              <span className="ml-2 font-['Inter'] text-[11px] text-[#00e5c9] font-semibold flex items-center">
                                <span className="material-symbols-outlined text-[14px]">
                                  trending_down
                                </span>{' '}
                                {msg.telemetryCard.deltaText}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-['Inter'] text-[11px] font-semibold">
                          {msg.telemetryCard.statusBadge}
                        </span>
                      </div>

                      {/* Mini Sparkline inline SVG */}
                      <div className="w-full h-12 relative flex items-end">
                        <svg
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="none"
                          viewBox="0 0 280 48"
                        >
                          <defs>
                            <linearGradient id="rhrGradAdvisor" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#00e5c9" stopOpacity="0.35"></stop>
                              <stop offset="100%" stopColor="#00e5c9" stopOpacity="0.0"></stop>
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0,16 Q 40,12 70,22 T 140,24 T 210,36 T 280,44 L 280,48 L 0,48 Z"
                            fill="url(#rhrGradAdvisor)"
                          ></path>
                          <path
                            d="M 0,16 Q 40,12 70,22 T 140,24 T 210,36 T 280,44"
                            fill="none"
                            stroke="#00e5c9"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            className="drop-shadow-[0_0_6px_#00e5c9]"
                          ></path>
                          <circle cx="280" cy="44" fill="#00e5c9" r="3.5"></circle>
                        </svg>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setActiveTab('dashboard')}
                          className="flex-1 py-2 px-3 rounded-full bg-[#00e5c9] hover:bg-[#38ef7d] text-[#07090c] font-['Inter'] text-xs font-bold text-center transition-colors shadow-sm"
                        >
                          Review Full 30-Day Trend
                        </button>
                        <button
                          onClick={() => {
                            showToast('Target calibrated to 62 BPM');
                          }}
                          className="py-2 px-3.5 rounded-full bg-[#161d26] hover:bg-[#1f2834] text-[#f1f5f9] font-['Inter'] text-xs font-semibold transition-colors border border-[#242e3a]"
                        >
                          Set Target
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Medical guideline reassurance badge */}
                  <div className="flex items-center gap-1.5 text-[#94a3b8] font-['Inter'] text-[11px]">
                    <span className="material-symbols-outlined text-[15px] text-[#00e5c9]">
                      verified_user
                    </span>
                    <span>Corroborated with AHA &amp; ESC Clinical Fitness Indices</span>
                  </div>
                </div>
                <span className="font-['Inter'] text-[11px] text-[#64748b] pl-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isAiTyping && (
          <div className="flex items-center gap-2 text-xs text-[#00e5c9] p-2 font-mono">
            <span className="material-symbols-outlined text-[16px] animate-spin">
              progress_activity
            </span>
            <span>Pulse AI is analyzing physiological guidelines...</span>
          </div>
        )}

        <div ref={streamBottomRef} />
      </div>

      {/* Evidence-Based Micro-Education */}
      <div className="px-4 pt-2 pb-2 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00e5c9] text-[20px]">
              local_library
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
              Clinical Micro-Education
            </h3>
          </div>
          <button
            onClick={() => setSelectedArticle(clinicalArticles[0])}
            className="font-['Inter'] text-xs text-[#00e5c9] font-semibold hover:underline"
          >
            View Library
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {clinicalArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-3.5 rounded-2xl bg-[#0e1319] hover:bg-[#12171e] transition-colors shadow-md flex items-center gap-3.5 cursor-pointer border border-[#1f2834]"
            >
              <img
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm opacity-90"
                alt={art.title}
                src={art.imageUrl}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[#00e5c9] font-['Inter'] text-[10px] uppercase font-semibold">
                  <span>{art.source}</span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-sm leading-snug text-[#f1f5f9] font-semibold truncate mt-0.5">
                  {art.title}
                </h4>
                <p className="font-['Inter'] text-xs text-[#94a3b8] line-clamp-1 mt-0.5">
                  {art.summary}
                </p>
              </div>
              <button
                aria-label="Read Article"
                className="w-8 h-8 rounded-full bg-[#161d26] border border-[#242e3a] flex items-center justify-center text-[#94a3b8] flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Input Action Bar (Sticky within slot bottom) */}
      <div className="sticky bottom-16 w-full px-4 pt-2 pb-3 bg-[#07090c]/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0e1319] border border-[#1f2834] shadow-xl max-w-lg mx-auto">
          {/* Media Actions */}
          <button
            aria-label="Attach Photo or Vital Log"
            onClick={() => showToast('Biometric snapshot attached to prompt')}
            className="w-9 h-9 rounded-full bg-[#161d26] hover:bg-[#1f2834] text-[#94a3b8] hover:text-[#00e5c9] flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
          </button>

          {/* Text Input */}
          <input
            className="flex-1 min-w-0 bg-transparent text-[#f1f5f9] font-['Inter'] text-xs placeholder:text-[#64748b] focus:outline-none px-2"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask anything about your health..."
            type="text"
          />

          {/* Audio / Mic Action */}
          <button
            aria-label="Voice input"
            onClick={toggleMic}
            className={`w-9 h-9 rounded-full hover:bg-[#161d26] flex items-center justify-center flex-shrink-0 transition-colors ${
              isRecording ? 'text-[#ff4d4f] animate-pulse bg-red-950/40' : 'text-[#94a3b8]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>

          {/* Send Action */}
          <button
            aria-label="Send message"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-[#00e5c9] hover:bg-[#38ef7d] disabled:opacity-40 text-[#07090c] font-bold flex items-center justify-center flex-shrink-0 transition-all shadow-md shadow-[#00e5c9]/30"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
};
