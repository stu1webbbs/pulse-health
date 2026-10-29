import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { SnapPlateModal } from '../components/SnapPlateModal';
import { AnimatedNumber } from '../components/AnimatedNumber';

export const TrackAndLogView: React.FC = () => {
  const {
    vitals,
    adjustBP,
    setGlucose,
    setHeartRate,
    hydration,
    addWater,
    mealLog,
    wearables,
    syncWearable,
    showToast,
    secondsSinceSync,
    triggerLivePulse,
  } = useHealth();

  const [activeCategory, setActiveCategory] = useState<'vitals' | 'nutrition' | 'activity' | 'symptoms'>('vitals');
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logTimestamp, setLogTimestamp] = useState('Today, 09:41 AM');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [subjectiveNote, setSubjectiveNote] = useState('');
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [editGlucoseOpen, setEditGlucoseOpen] = useState(false);
  const [editHrOpen, setEditHrOpen] = useState(false);

  // Derive Blood Pressure status & bar width
  const sys = vitals.systolic;
  const dia = vitals.diastolic;
  let bpStatus = 'Optimal';
  let bpBadgeClass = 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30';
  let bpBarClass = 'bg-[#00e5c9] shadow-[0_0_8px_#00e5c9]';
  let bpBarWidth = '48%';

  if (sys < 120 && dia < 80) {
    bpStatus = 'Optimal';
    bpBadgeClass = 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30';
    bpBarClass = 'bg-[#00e5c9] shadow-[0_0_8px_#00e5c9]';
    bpBarWidth = '48%';
  } else if (sys <= 129 && dia < 80) {
    bpStatus = 'Elevated';
    bpBadgeClass = 'bg-[#eab308]/15 text-[#eab308] border border-[#eab308]/30';
    bpBarClass = 'bg-[#eab308] shadow-[0_0_8px_#eab308]';
    bpBarWidth = '65%';
  } else if (sys <= 139 || dia <= 89) {
    bpStatus = 'Stage 1 High';
    bpBadgeClass = 'bg-[#ff4d4f]/15 text-[#ff4d4f] border border-[#ff4d4f]/30';
    bpBarClass = 'bg-[#ff4d4f] shadow-[0_0_8px_#ff4d4f]';
    bpBarWidth = '82%';
  } else {
    bpStatus = 'Stage 2 Alert';
    bpBadgeClass = 'bg-[#ff4d4f]/20 text-[#ff4d4f] border border-[#ff4d4f]/40';
    bpBarClass = 'bg-[#ff4d4f] shadow-[0_0_8px_#ff4d4f]';
    bpBarWidth = '95%';
  }

  // Hydration calculations
  const hydrationPct = Math.min(100, Math.round((hydration.currentMl / hydration.targetMl) * 100));
  const remainingMl = Math.max(0, hydration.targetMl - hydration.currentMl);

  // Meal macro percentages
  const totalMacros = mealLog.proteinGrams + mealLog.carbsGrams + mealLog.fatGrams || 1;
  const proteinPct = Math.round((mealLog.proteinGrams / totalMacros) * 100);
  const carbsPct = Math.round((mealLog.carbsGrams / totalMacros) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  const handleCommit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Logged & telemetry encrypted securely!');
    }, 700);
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4 pt-1">
      {/* Top Ambient Delight Accent & Time selector */}
      <div className="px-4 pt-1">
        <div className="flex items-center justify-between bg-[#0e1319] border border-[#1f2834] px-4 py-3 rounded-2xl shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00e5c9]/15 border border-[#00e5c9]/30 flex items-center justify-center text-[#00e5c9]">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div className="flex flex-col relative">
              <span className="font-['Inter'] text-[11px] text-[#94a3b8] font-semibold">
                Timestamp of Log
              </span>
              <button
                className="flex items-center gap-1 font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#f1f5f9] text-left hover:text-[#00e5c9] transition-colors"
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <span>{logTimestamp}</span>
                <span className="material-symbols-outlined text-[18px] text-[#00e5c9]">
                  expand_more
                </span>
              </button>

              {showTimePicker && (
                <div className="absolute left-0 top-12 z-40 bg-[#12171e] border border-[#242e3a] rounded-xl shadow-xl p-2 text-xs w-52 animate-in fade-in zoom-in-95">
                  <p className="text-[10px] text-[#64748b] px-2 py-1 uppercase font-semibold">
                    Select Timestamp
                  </p>
                  {['Today, 09:41 AM', 'Today, 08:00 AM (Waking)', 'Today, 12:30 PM (Midday)', 'Yesterday, 10:00 PM'].map(
                    (time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setLogTimestamp(time);
                          setShowTimePicker(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#1a222c] transition-colors ${
                          logTimestamp === time ? 'text-[#00e5c9] font-bold bg-[#00e5c9]/10' : 'text-[#f1f5f9]'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={triggerLivePulse}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12171e] border border-[#242e3a] text-[#00e5c9] font-['Inter'] text-[11px] font-semibold hover:border-[#00e5c9] transition-all"
            title="Calibrate live telemetry"
          >
            <span className="w-2 h-2 rounded-full bg-[#00e5c9] animate-pulse"></span>
            <span>Live Sync</span>
          </button>
        </div>
      </div>

      {/* Segmented Categories Navigation */}
      <div className="px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 p-1.5 bg-[#0e1319] border border-[#1f2834] rounded-full min-w-max">
          <button
            onClick={() => setActiveCategory('vitals')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Inter'] text-xs font-semibold transition-all duration-200 ${
              activeCategory === 'vitals'
                ? 'bg-[#00e5c9] text-[#07090c] font-bold shadow-[0_0_12px_rgba(0,229,201,0.4)]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#161d26]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">vital_signs</span>
            <span>Vitals</span>
          </button>
          <button
            onClick={() => setActiveCategory('nutrition')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Inter'] text-xs font-semibold transition-all duration-200 ${
              activeCategory === 'nutrition'
                ? 'bg-[#00e5c9] text-[#07090c] font-bold shadow-[0_0_12px_rgba(0,229,201,0.4)]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#161d26]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">water_drop</span>
            <span>Hydration &amp; Meals</span>
          </button>
          <button
            onClick={() => setActiveCategory('activity')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Inter'] text-xs font-semibold transition-all duration-200 ${
              activeCategory === 'activity'
                ? 'bg-[#00e5c9] text-[#07090c] font-bold shadow-[0_0_12px_rgba(0,229,201,0.4)]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#161d26]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">directions_run</span>
            <span>Activity</span>
          </button>
          <button
            onClick={() => setActiveCategory('symptoms')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Inter'] text-xs font-semibold transition-all duration-200 ${
              activeCategory === 'symptoms'
                ? 'bg-[#00e5c9] text-[#07090c] font-bold shadow-[0_0_12px_rgba(0,229,201,0.4)]'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#161d26]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">mood</span>
            <span>Symptoms &amp; Mood</span>
          </button>
        </div>
      </div>

      {/* Content Stream Container */}
      <div className="px-4 flex flex-col gap-4">
        {/* Card 1: Clinical Telemetry - Blood Pressure (Changing Numbers) */}
        <div className="bg-[#0e1319] p-4 rounded-2xl shadow-md flex flex-col gap-3 relative overflow-hidden border border-[#1f2834]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00e5c9]/15 border border-[#00e5c9]/30 flex items-center justify-center text-[#00e5c9]">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cardiology
                </span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
                  Blood Pressure
                </h3>
                <p className="font-['Inter'] text-xs text-[#94a3b8]">
                  Arterial circulatory load
                </p>
              </div>
            </div>
            {/* Live Diagnostic Badge */}
            <div
              className={`px-3 py-1 rounded-full font-['Inter'] text-xs font-semibold flex items-center gap-1 transition-colors ${bpBadgeClass}`}
            >
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>{bpStatus}</span>
            </div>
          </div>

          {/* Numeric Stepper Matrix with Animated Numbers */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            {/* Systolic */}
            <div className="bg-[#12171e] border border-[#1f2834] p-3.5 rounded-xl flex flex-col items-center">
              <span className="font-['Inter'] text-[11px] text-[#94a3b8] uppercase tracking-wider font-semibold">
                Systolic (SYS)
              </span>
              <div className="flex items-center justify-between w-full mt-2">
                <button
                  className="w-9 h-9 rounded-full bg-[#1c242e] border border-[#2a3644] active:scale-95 text-[#f1f5f9] flex items-center justify-center transition-all hover:bg-[#253240] hover:text-[#00e5c9]"
                  onClick={() => adjustBP('sys', -1)}
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold tracking-tight">
                    <AnimatedNumber value={sys} />
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#64748b]">mmHg</span>
                </div>
                <button
                  className="w-9 h-9 rounded-full bg-[#1c242e] border border-[#2a3644] active:scale-95 text-[#f1f5f9] flex items-center justify-center transition-all hover:bg-[#253240] hover:text-[#00e5c9]"
                  onClick={() => adjustBP('sys', 1)}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            {/* Diastolic */}
            <div className="bg-[#12171e] border border-[#1f2834] p-3.5 rounded-xl flex flex-col items-center">
              <span className="font-['Inter'] text-[11px] text-[#94a3b8] uppercase tracking-wider font-semibold">
                Diastolic (DIA)
              </span>
              <div className="flex items-center justify-between w-full mt-2">
                <button
                  className="w-9 h-9 rounded-full bg-[#1c242e] border border-[#2a3644] active:scale-95 text-[#f1f5f9] flex items-center justify-center transition-all hover:bg-[#253240] hover:text-[#00e5c9]"
                  onClick={() => adjustBP('dia', -1)}
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold tracking-tight">
                    <AnimatedNumber value={dia} />
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#64748b]">mmHg</span>
                </div>
                <button
                  className="w-9 h-9 rounded-full bg-[#1c242e] border border-[#2a3644] active:scale-95 text-[#f1f5f9] flex items-center justify-center transition-all hover:bg-[#253240] hover:text-[#00e5c9]"
                  onClick={() => adjustBP('dia', 1)}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Micro Visual Range Slider */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="h-1.5 w-full bg-[#1c242e] rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-300 ${bpBarClass}`}
                style={{ width: bpBarWidth }}
              ></div>
            </div>
            <div className="flex justify-between font-['Inter'] text-[10px] text-[#94a3b8]">
              <span>Hypo (&lt;90)</span>
              <span className="text-[#00e5c9] font-semibold">Optimal (110-120)</span>
              <span>Pre-HTN (130+)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Biometric Tap Grid: Glucose & Resting Heart Rate (Live Changing) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Blood Glucose */}
          <div className="bg-[#0e1319] p-3.5 rounded-2xl shadow-md flex flex-col justify-between border border-[#1f2834]">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#60a5fa] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">bloodtype</span>
              </div>
              <span className="font-['Inter'] text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 rounded-full font-medium">
                {vitals.glucoseContext}
              </span>
            </div>
            <div className="my-2.5">
              <span className="font-['Inter'] text-xs text-[#94a3b8] block font-medium">Glucose</span>
              <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold tracking-tight">
                  <AnimatedNumber value={vitals.bloodGlucose} />
                </span>
                <span className="font-['Inter'] text-xs text-[#64748b]">mg/dL</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  const nextContext = vitals.glucoseContext === 'Fasting' ? 'Post-Meal' : 'Fasting';
                  setGlucose(nextContext === 'Post-Meal' ? 112 : 94, nextContext);
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#161d26] border border-[#242e3a] font-['Inter'] text-[11px] text-[#f1f5f9] active:bg-[#00e5c9] active:text-[#07090c] transition-colors text-center font-medium hover:border-[#00e5c9]/50"
              >
                {vitals.glucoseContext === 'Fasting' ? '+ Post-Meal' : 'Set Fasting'}
              </button>
              <button
                onClick={() => setEditGlucoseOpen(!editGlucoseOpen)}
                className="w-7 h-7 rounded-lg bg-[#161d26] border border-[#242e3a] flex items-center justify-center text-[#94a3b8] hover:text-[#00e5c9]"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
            {editGlucoseOpen && (
              <div className="mt-2 pt-2 border-t border-[#1c242e] flex items-center gap-1">
                <input
                  type="number"
                  value={vitals.bloodGlucose}
                  onChange={(e) => setGlucose(parseInt(e.target.value, 10) || 94)}
                  className="w-16 h-7 text-xs px-1.5 bg-[#12171e] text-[#f1f5f9] rounded border border-[#2a3644] text-center"
                />
                <button
                  onClick={() => setEditGlucoseOpen(false)}
                  className="text-[10px] bg-[#00e5c9] text-[#07090c] font-bold px-2 py-1 rounded"
                >
                  OK
                </button>
              </div>
            )}
          </div>

          {/* Pulse Rate (Live Changing) */}
          <div className="bg-[#0e1319] p-3.5 rounded-2xl shadow-md flex flex-col justify-between border border-[#1f2834]">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#00e5c9]/15 border border-[#00e5c9]/30 text-[#00e5c9] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] animate-heartbeat">ecg_heart</span>
              </div>
              <span className="font-['Inter'] text-[10px] bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 rounded-full font-medium">
                Resting
              </span>
            </div>
            <div className="my-2.5">
              <span className="font-['Inter'] text-xs text-[#94a3b8] block font-medium">Heart Rate</span>
              <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold tracking-tight">
                  <AnimatedNumber value={vitals.restingHeartRate} />
                </span>
                <span className="font-['Inter'] text-xs text-[#64748b]">BPM</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5c9] animate-ping ml-1" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  setHeartRate(Math.floor(62 + Math.random() * 5));
                  showToast('Optical PPG sensor read: calibrated to live pulse');
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#161d26] border border-[#242e3a] font-['Inter'] text-[11px] text-[#f1f5f9] active:bg-[#00e5c9] active:text-[#07090c] transition-colors text-center font-medium hover:border-[#00e5c9]/50"
              >
                Auto-Sense
              </button>
              <button
                onClick={() => setEditHrOpen(!editHrOpen)}
                className="w-7 h-7 rounded-lg bg-[#161d26] border border-[#242e3a] flex items-center justify-center text-[#94a3b8] hover:text-[#00e5c9]"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
            {editHrOpen && (
              <div className="mt-2 pt-2 border-t border-[#1c242e] flex items-center gap-1">
                <input
                  type="number"
                  value={vitals.restingHeartRate}
                  onChange={(e) => setHeartRate(parseInt(e.target.value, 10) || 68)}
                  className="w-16 h-7 text-xs px-1.5 bg-[#12171e] text-[#f1f5f9] rounded border border-[#2a3644] text-center"
                />
                <button
                  onClick={() => setEditHrOpen(false)}
                  className="text-[10px] bg-[#00e5c9] text-[#07090c] font-bold px-2 py-1 rounded"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Hydration Fast-Add Fluid Cylinder (Changing Numbers) */}
        <div className="bg-[#0e1319] p-4 rounded-2xl shadow-md flex flex-col gap-3 border border-[#1f2834]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00e5c9]/15 border border-[#00e5c9]/30 text-[#00e5c9] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">opacity</span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
                  Hydration Tracker
                </h3>
                <p className="font-['Inter'] text-xs text-[#94a3b8]">
                  Goal: {hydration.targetMl.toLocaleString()} ml daily
                </p>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="font-['Plus_Jakarta_Sans'] text-base text-[#00e5c9] font-bold">
                <AnimatedNumber value={hydration.currentMl} />
              </span>
              <span className="font-['Inter'] text-xs text-[#64748b]"> / {hydration.targetMl.toLocaleString()} ml</span>
            </div>
          </div>

          {/* Interactive Fluid Graphic Progress */}
          <div className="relative w-full h-11 bg-[#12171e] rounded-xl overflow-hidden p-1 flex items-center border border-[#1f2834]">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00bba7] via-[#00e5c9] to-[#38ef7d] transition-all duration-500 rounded-xl shadow-[0_0_12px_rgba(0,229,201,0.4)]"
              style={{ width: `${hydrationPct}%` }}
            ></div>
            <div className="relative z-10 w-full flex justify-between px-3 text-[#07090c] font-['Inter'] text-xs font-bold">
              <span className="drop-shadow-sm flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-[14px]">water_drop</span>
                <span><AnimatedNumber value={hydrationPct} />%</span> of daily goal
              </span>
              <span className="drop-shadow-sm opacity-90 text-[11px] font-mono">
                {remainingMl > 0 ? `${remainingMl.toLocaleString()} ml remaining` : 'Goal achieved!'}
              </span>
            </div>
          </div>

          {/* Quick Add Pills */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => addWater(250)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#12171e] hover:bg-[#1a222c] border border-[#1f2834] hover:border-[#00e5c9]/50 active:scale-95 transition-all group"
            >
              <span className="material-symbols-outlined text-[#00e5c9] text-[20px] group-hover:scale-110 transition-transform">
                local_cafe
              </span>
              <span className="font-['Inter'] text-xs text-[#f1f5f9] font-bold mt-0.5 font-mono">
                +250 ml
              </span>
              <span className="font-['Inter'] text-[10px] text-[#64748b]">Small Cup</span>
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#12171e] hover:bg-[#1a222c] border border-[#1f2834] hover:border-[#00e5c9]/50 active:scale-95 transition-all group"
            >
              <span className="material-symbols-outlined text-[#00e5c9] text-[20px] group-hover:scale-110 transition-transform">
                local_drink
              </span>
              <span className="font-['Inter'] text-xs text-[#f1f5f9] font-bold mt-0.5 font-mono">
                +500 ml
              </span>
              <span className="font-['Inter'] text-[10px] text-[#64748b]">Regular Glass</span>
            </button>
            <button
              onClick={() => addWater(750)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#12171e] hover:bg-[#1a222c] border border-[#1f2834] hover:border-[#00e5c9]/50 active:scale-95 transition-all group"
            >
              <span className="material-symbols-outlined text-[#00e5c9] text-[20px] group-hover:scale-110 transition-transform">
                sports_bar
              </span>
              <span className="font-['Inter'] text-xs text-[#f1f5f9] font-bold mt-0.5 font-mono">
                +750 ml
              </span>
              <span className="font-['Inter'] text-[10px] text-[#64748b]">Sports Bottle</span>
            </button>
          </div>
        </div>

        {/* Card 4: Meal & Macronutrients Fast Logger (Changing Numbers) */}
        <div className="bg-[#0e1319] p-4 rounded-2xl shadow-md flex flex-col gap-3 border border-[#1f2834]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">restaurant</span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
                  Meal &amp; Macronutrients
                </h3>
                <p className="font-['Inter'] text-xs text-[#94a3b8] font-mono">
                  {mealLog.title} • <AnimatedNumber value={mealLog.calories} /> kcal
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSnapModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-[#161d26] border border-[#242e3a] text-[#00e5c9] font-['Inter'] text-xs flex items-center gap-1 hover:border-[#00e5c9] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              <span>Scan</span>
            </button>
          </div>

          {/* Photo Intake Tap Target & Macro Breakdown */}
          <div className="grid grid-cols-3 gap-2.5 items-center">
            <button
              onClick={() => setIsSnapModalOpen(true)}
              className="flex flex-col items-center justify-center h-24 rounded-xl bg-[#12171e] hover:bg-[#1a222c] border border-[#1f2834] hover:border-[#00e5c9]/50 active:scale-95 transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-[#00e5c9]/15 border border-[#00e5c9]/30 text-[#00e5c9] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </div>
              <span className="font-['Inter'] text-[11px] text-[#f1f5f9] font-semibold">
                Snap Plate
              </span>
              <span className="font-['Inter'] text-[9px] text-[#64748b]">AI Auto-Calc</span>
            </button>

            {/* Nutrition Summary Bars with Animated Macro Counts */}
            <div className="col-span-2 flex flex-col justify-between h-24 bg-[#12171e] border border-[#1f2834] p-2.5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-xs text-[#f1f5f9] font-semibold">
                  Macronutrient Split
                </span>
                <span className="font-['Inter'] text-[11px] text-[#10b981] font-medium">
                  {mealLog.targetSplit}
                </span>
              </div>
              {/* Triple Macro Stack Bar */}
              <div className="w-full flex h-2 rounded-full overflow-hidden bg-[#1c242e] gap-0.5">
                <div
                  className="bg-[#00e5c9] h-full shadow-[0_0_6px_#00e5c9]"
                  style={{ width: `${proteinPct}%` }}
                  title={`Protein ${proteinPct}%`}
                ></div>
                <div
                  className="bg-[#60a5fa] h-full"
                  style={{ width: `${carbsPct}%` }}
                  title={`Carbs ${carbsPct}%`}
                ></div>
                <div
                  className="bg-[#38ef7d] h-full"
                  style={{ width: `${fatPct}%` }}
                  title={`Fats ${fatPct}%`}
                ></div>
              </div>
              {/* Micro labels */}
              <div className="grid grid-cols-3 text-center pt-0.5 font-mono">
                <div>
                  <span className="block font-['Inter'] text-[11px] text-[#f1f5f9] font-bold">
                    <AnimatedNumber value={mealLog.proteinGrams} />g
                  </span>
                  <span className="block font-['Inter'] text-[9px] text-[#64748b]">Protein</span>
                </div>
                <div>
                  <span className="block font-['Inter'] text-[11px] text-[#f1f5f9] font-bold">
                    <AnimatedNumber value={mealLog.carbsGrams} />g
                  </span>
                  <span className="block font-['Inter'] text-[9px] text-[#64748b]">Carbs</span>
                </div>
                <div>
                  <span className="block font-['Inter'] text-[11px] text-[#f1f5f9] font-bold">
                    <AnimatedNumber value={mealLog.fatGrams} />g
                  </span>
                  <span className="block font-['Inter'] text-[9px] text-[#64748b]">Fats</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Wearable & Health Vault Sync Hub */}
        <div className="bg-[#0e1319] p-4 rounded-2xl flex flex-col gap-3 border border-[#1f2834]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00e5c9] text-[20px]">sync</span>
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#f1f5f9]">
                Telemetry Vault
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#10b981] font-['Inter'] text-[11px] bg-[#10b981]/10 border border-[#10b981]/30 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[13px]">verified_user</span>
              <span>256-bit AES Active</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Apple Health item */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#12171e] border border-[#1f2834]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#ff4d4f]/15 border border-[#ff4d4f]/30 flex items-center justify-center text-[#ff4d4f]">
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter'] text-xs text-[#f1f5f9] font-semibold">
                    Apple HealthKit
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#64748b]">
                    Continuous feed • Synced {secondsSinceSync}s ago
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]"></div>
            </div>

            {/* Oura Ring */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#12171e] border border-[#1f2834]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#00e5c9]/15 border border-[#00e5c9]/30 flex items-center justify-center text-[#00e5c9]">
                  <span className="material-symbols-outlined text-[16px]">ring_volume</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter'] text-xs text-[#f1f5f9] font-semibold">
                    Oura Horizon Gen 3
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#64748b]">
                    Sleep &amp; Readiness standby
                  </span>
                </div>
              </div>
              <button
                onClick={() => syncWearable('oura-ring')}
                className="px-3 py-1 rounded-full bg-[#161d26] hover:bg-[#00e5c9] hover:text-[#07090c] border border-[#242e3a] hover:border-[#00e5c9] text-[#00e5c9] font-['Inter'] text-[11px] font-semibold transition-all flex items-center gap-1"
              >
                <span className={`material-symbols-outlined text-[13px] ${wearables.find(w => w.id === 'oura-ring')?.isSyncing ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>{wearables.find(w => w.id === 'oura-ring')?.isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notes & Symptoms Expandable Drawer Prompt */}
        <div className="p-3.5 rounded-2xl bg-[#0e1319] flex flex-col gap-2 border border-[#1f2834]">
          <div
            onClick={() => setIsNoteExpanded(!isNoteExpanded)}
            className="flex items-center justify-between cursor-pointer hover:bg-[#12171e] p-1 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#60a5fa] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">notes</span>
              </div>
              <span className="font-['Inter'] text-xs text-[#f1f5f9]">
                {subjectiveNote ? 'Note attached' : 'Add subjective note, energy or pain level...'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#94a3b8] text-[18px]">
              {isNoteExpanded ? 'expand_less' : 'add'}
            </span>
          </div>

          {isNoteExpanded && (
            <div className="mt-2 space-y-2 animate-in fade-in">
              <textarea
                value={subjectiveNote}
                onChange={(e) => setSubjectiveNote(e.target.value)}
                placeholder="Log energy levels (e.g. 8/10), symptoms, post-exercise fatigue or soreness..."
                className="w-full text-xs p-2.5 bg-[#12171e] border border-[#242e3a] rounded-xl text-[#f1f5f9] focus:outline-none focus:border-[#00e5c9] min-h-[60px]"
              />
              <div className="flex flex-wrap gap-2">
                {['High Energy', 'Mild Fatigue', 'Hydrated', 'Muscle Soreness'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSubjectiveNote((prev) => (prev ? `${prev}, ${tag}` : tag))}
                    className="text-[10px] px-2.5 py-1 bg-[#161d26] hover:bg-[#00e5c9] hover:text-[#07090c] text-[#f1f5f9] border border-[#242e3a] rounded-full font-medium transition-colors"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Main Commit Action Button */}
        <div className="sticky bottom-20 z-30 pt-2 pb-1">
          <button
            onClick={handleCommit}
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-[#00e5c9] hover:bg-[#38ef7d] active:scale-[0.98] text-[#07090c] font-['Inter'] text-sm font-bold shadow-lg shadow-[#00e5c9]/30 flex items-center justify-center gap-2 transition-all duration-150"
          >
            <span className={`material-symbols-outlined text-[20px] ${isSubmitting ? 'animate-spin' : ''}`}>
              {isSubmitting ? 'progress_activity' : 'insights'}
            </span>
            <span>{isSubmitting ? 'Securing Telemetry...' : 'Save & Analyze Entry'}</span>
          </button>
        </div>
      </div>

      <SnapPlateModal isOpen={isSnapModalOpen} onClose={() => setIsSnapModalOpen(false)} />
    </div>
  );
};
