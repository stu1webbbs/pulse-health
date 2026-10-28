import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { SnapPlateModal } from '../components/SnapPlateModal';

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
    setActiveTab,
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
  let bpBadgeClass = 'bg-[#00855b]/15 text-[#006947]';
  let bpBarClass = 'bg-[#006947]';
  let bpBarWidth = '48%';

  if (sys < 120 && dia < 80) {
    bpStatus = 'Optimal';
    bpBadgeClass = 'bg-[#00855b]/15 text-[#006947]';
    bpBarClass = 'bg-[#006947]';
    bpBarWidth = '48%';
  } else if (sys <= 129 && dia < 80) {
    bpStatus = 'Elevated';
    bpBadgeClass = 'bg-[#dae2fd] text-[#3f465c]';
    bpBarClass = 'bg-[#565e74]';
    bpBarWidth = '65%';
  } else if (sys <= 139 || dia <= 89) {
    bpStatus = 'Stage 1 High';
    bpBadgeClass = 'bg-[#ffdad6] text-[#93000a]';
    bpBarClass = 'bg-[#ba1a1a]';
    bpBarWidth = '82%';
  } else {
    bpStatus = 'Stage 2 Alert';
    bpBadgeClass = 'bg-[#ffdad6] text-[#93000a]';
    bpBarClass = 'bg-[#ba1a1a]';
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
    <div className="flex flex-col w-full pb-10">
      {/* Top Ambient Delight Accent & Time selector */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between bg-[#f2f4f6] px-4 py-3 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00685f]/10 flex items-center justify-center text-[#00685f]">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div className="flex flex-col relative">
              <span className="font-['Inter'] text-[11px] text-[#3d4947] font-semibold">
                Timestamp of Log
              </span>
              <button
                className="flex items-center gap-1 font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#191c1e] text-left"
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <span>{logTimestamp}</span>
                <span className="material-symbols-outlined text-[18px] text-[#00685f]">
                  expand_more
                </span>
              </button>

              {showTimePicker && (
                <div className="absolute left-0 top-12 z-40 bg-white border border-[#e0e3e5] rounded-xl shadow-lg p-2 text-xs w-48 animate-in fade-in zoom-in-95">
                  <p className="text-[10px] text-[#6d7a77] px-2 py-1 uppercase font-semibold">
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
                        className={`w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f2f4f6] ${
                          logTimestamp === time ? 'text-[#00685f] font-semibold bg-[#00685f]/10' : 'text-[#191c1e]'
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
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00855b]/15 text-[#006947] font-['Inter'] text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00855b] animate-pulse"></span>
            <span>Auto-Sync</span>
          </div>
        </div>
      </div>

      {/* Segmented Categories Navigation */}
      <div className="px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 p-1 bg-[#eceef0] rounded-full min-w-max">
          <button
            onClick={() => setActiveCategory('vitals')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Inter'] text-xs font-semibold transition-all duration-200 ${
              activeCategory === 'vitals'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#191c1e] hover:bg-[#e6e8ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">vital_signs</span>
            <span>Vitals</span>
          </button>
          <button
            onClick={() => setActiveCategory('nutrition')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Inter'] text-xs font-semibold transition-all duration-200 ${
              activeCategory === 'nutrition'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#191c1e] hover:bg-[#e6e8ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">water_drop</span>
            <span>Hydration &amp; Meals</span>
          </button>
          <button
            onClick={() => setActiveCategory('activity')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Inter'] text-xs font-semibold transition-all duration-200 ${
              activeCategory === 'activity'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#191c1e] hover:bg-[#e6e8ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">directions_run</span>
            <span>Activity</span>
          </button>
          <button
            onClick={() => setActiveCategory('symptoms')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Inter'] text-xs font-semibold transition-all duration-200 ${
              activeCategory === 'symptoms'
                ? 'bg-[#00685f] text-white shadow-xs'
                : 'text-[#3d4947] hover:text-[#191c1e] hover:bg-[#e6e8ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">mood</span>
            <span>Symptoms &amp; Mood</span>
          </button>
        </div>
      </div>

      {/* Content Stream Container */}
      <div className="px-4 flex flex-col gap-4 mt-1">
        {/* Card 1: Clinical Telemetry - Blood Pressure */}
        <div className="bg-white p-4 rounded-2xl shadow-xs flex flex-col gap-3 relative overflow-hidden border border-[#eceef0]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00685f]/10 flex items-center justify-center text-[#00685f]">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cardiology
                </span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#191c1e]">
                  Blood Pressure
                </h3>
                <p className="font-['Inter'] text-xs text-[#3d4947]">
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

          {/* Numeric Stepper Matrix */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            {/* Systolic */}
            <div className="bg-[#f2f4f6] p-3.5 rounded-xl flex flex-col items-center">
              <span className="font-['Inter'] text-[11px] text-[#3d4947] uppercase tracking-wider font-semibold">
                Systolic (SYS)
              </span>
              <div className="flex items-center justify-between w-full mt-2">
                <button
                  className="w-9 h-9 rounded-full bg-[#e0e3e5] active:scale-95 text-[#191c1e] flex items-center justify-center transition-transform hover:bg-[#d8dadc]"
                  onClick={() => adjustBP('sys', -1)}
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="flex items-baseline gap-1">
                  <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold tracking-tight">
                    {sys}
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#3d4947]">mmHg</span>
                </div>
                <button
                  className="w-9 h-9 rounded-full bg-[#e0e3e5] active:scale-95 text-[#191c1e] flex items-center justify-center transition-transform hover:bg-[#d8dadc]"
                  onClick={() => adjustBP('sys', 1)}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            {/* Diastolic */}
            <div className="bg-[#f2f4f6] p-3.5 rounded-xl flex flex-col items-center">
              <span className="font-['Inter'] text-[11px] text-[#3d4947] uppercase tracking-wider font-semibold">
                Diastolic (DIA)
              </span>
              <div className="flex items-center justify-between w-full mt-2">
                <button
                  className="w-9 h-9 rounded-full bg-[#e0e3e5] active:scale-95 text-[#191c1e] flex items-center justify-center transition-transform hover:bg-[#d8dadc]"
                  onClick={() => adjustBP('dia', -1)}
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="flex items-baseline gap-1">
                  <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold tracking-tight">
                    {dia}
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#3d4947]">mmHg</span>
                </div>
                <button
                  className="w-9 h-9 rounded-full bg-[#e0e3e5] active:scale-95 text-[#191c1e] flex items-center justify-center transition-transform hover:bg-[#d8dadc]"
                  onClick={() => adjustBP('dia', 1)}
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Micro Visual Range Slider */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="h-1.5 w-full bg-[#eceef0] rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-300 ${bpBarClass}`}
                style={{ width: bpBarWidth }}
              ></div>
            </div>
            <div className="flex justify-between font-['Inter'] text-[10px] text-[#3d4947]">
              <span>Hypo (&lt;90)</span>
              <span className="text-[#006947] font-semibold">Optimal (110-120)</span>
              <span>Pre-HTN (130+)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Biometric Tap Grid: Glucose & Resting Heart Rate */}
        <div className="grid grid-cols-2 gap-3">
          {/* Blood Glucose */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs flex flex-col justify-between border border-[#eceef0]/60">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#dae2fd]/60 text-[#565e74] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">bloodtype</span>
              </div>
              <span className="font-['Inter'] text-[10px] bg-[#00855b]/10 text-[#006947] px-2 py-0.5 rounded-full font-medium">
                {vitals.glucoseContext}
              </span>
            </div>
            <div className="my-2.5">
              <span className="font-['Inter'] text-xs text-[#3d4947] block font-medium">Glucose</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold tracking-tight">
                  {vitals.bloodGlucose}
                </span>
                <span className="font-['Inter'] text-xs text-[#3d4947]">mg/dL</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  const nextContext = vitals.glucoseContext === 'Fasting' ? 'Post-Meal' : 'Fasting';
                  setGlucose(nextContext === 'Post-Meal' ? 112 : 94, nextContext);
                }}
                className="flex-1 py-1 px-2 rounded-lg bg-[#f2f4f6] font-['Inter'] text-[11px] text-[#191c1e] active:bg-[#008378] active:text-white transition-colors text-center font-medium hover:bg-[#e6e8ea]"
              >
                {vitals.glucoseContext === 'Fasting' ? '+ Post-Meal' : 'Set Fasting'}
              </button>
              <button
                onClick={() => setEditGlucoseOpen(!editGlucoseOpen)}
                className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#3d4947] hover:text-[#00685f]"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
            {editGlucoseOpen && (
              <div className="mt-2 pt-2 border-t border-[#eceef0] flex items-center gap-1">
                <input
                  type="number"
                  value={vitals.bloodGlucose}
                  onChange={(e) => setGlucose(parseInt(e.target.value, 10) || 94)}
                  className="w-16 h-7 text-xs px-1.5 bg-[#f2f4f6] rounded border text-center"
                />
                <button
                  onClick={() => setEditGlucoseOpen(false)}
                  className="text-[10px] bg-[#00685f] text-white px-2 py-1 rounded"
                >
                  OK
                </button>
              </div>
            )}
          </div>

          {/* Pulse Rate */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs flex flex-col justify-between border border-[#eceef0]/60">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#89f5e7]/30 text-[#00685f] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">ecg_heart</span>
              </div>
              <span className="font-['Inter'] text-[10px] bg-[#00855b]/10 text-[#006947] px-2 py-0.5 rounded-full font-medium">
                Resting
              </span>
            </div>
            <div className="my-2.5">
              <span className="font-['Inter'] text-xs text-[#3d4947] block font-medium">Heart Rate</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold tracking-tight">
                  {vitals.restingHeartRate}
                </span>
                <span className="font-['Inter'] text-xs text-[#3d4947]">BPM</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => {
                  setHeartRate(Math.floor(62 + Math.random() * 5));
                  showToast('Optical PPG sensor read: calibrated to live pulse');
                }}
                className="flex-1 py-1 px-2 rounded-lg bg-[#f2f4f6] font-['Inter'] text-[11px] text-[#191c1e] active:bg-[#008378] active:text-white transition-colors text-center font-medium hover:bg-[#e6e8ea]"
              >
                Auto-Sense
              </button>
              <button
                onClick={() => setEditHrOpen(!editHrOpen)}
                className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#3d4947] hover:text-[#00685f]"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
            {editHrOpen && (
              <div className="mt-2 pt-2 border-t border-[#eceef0] flex items-center gap-1">
                <input
                  type="number"
                  value={vitals.restingHeartRate}
                  onChange={(e) => setHeartRate(parseInt(e.target.value, 10) || 68)}
                  className="w-16 h-7 text-xs px-1.5 bg-[#f2f4f6] rounded border text-center"
                />
                <button
                  onClick={() => setEditHrOpen(false)}
                  className="text-[10px] bg-[#00685f] text-white px-2 py-1 rounded"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Hydration Fast-Add Fluid Cylinder */}
        <div className="bg-white p-4 rounded-2xl shadow-xs flex flex-col gap-3 border border-[#eceef0]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#dae2fd] text-[#565e74] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">opacity</span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#191c1e]">
                  Hydration Tracker
                </h3>
                <p className="font-['Inter'] text-xs text-[#3d4947]">
                  Goal: {hydration.targetMl.toLocaleString()} ml daily
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-['Plus_Jakarta_Sans'] text-base text-[#00685f] font-bold">
                {hydration.currentMl.toLocaleString()}
              </span>
              <span className="font-['Inter'] text-xs text-[#3d4947]"> / {hydration.targetMl.toLocaleString()} ml</span>
            </div>
          </div>

          {/* Interactive Fluid Graphic Progress */}
          <div className="relative w-full h-11 bg-[#f2f4f6] rounded-xl overflow-hidden p-1 flex items-center">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#6bd8cb] via-[#00685f] to-[#008378] transition-all duration-500 rounded-xl"
              style={{ width: `${hydrationPct}%` }}
            ></div>
            <div className="relative z-10 w-full flex justify-between px-3 text-[#f4fffc] font-['Inter'] text-xs font-semibold">
              <span className="drop-shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">water_drop</span>
                <span>{hydrationPct}%</span> of daily goal
              </span>
              <span className="drop-shadow-sm opacity-90 text-[11px]">
                {remainingMl > 0 ? `${remainingMl.toLocaleString()} ml remaining` : 'Goal achieved!'}
              </span>
            </div>
          </div>

          {/* Quick Add Pills */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => addWater(250)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#f2f4f6] hover:bg-[#dae2fd]/40 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[#565e74] text-[20px]">
                local_cafe
              </span>
              <span className="font-['Inter'] text-xs text-[#191c1e] font-semibold mt-0.5">
                +250 ml
              </span>
              <span className="font-['Inter'] text-[10px] text-[#3d4947]">Small Cup</span>
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#f2f4f6] hover:bg-[#dae2fd]/40 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[#565e74] text-[20px]">
                local_drink
              </span>
              <span className="font-['Inter'] text-xs text-[#191c1e] font-semibold mt-0.5">
                +500 ml
              </span>
              <span className="font-['Inter'] text-[10px] text-[#3d4947]">Regular Glass</span>
            </button>
            <button
              onClick={() => addWater(750)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#f2f4f6] hover:bg-[#dae2fd]/40 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[#565e74] text-[20px]">
                sports_bar
              </span>
              <span className="font-['Inter'] text-xs text-[#191c1e] font-semibold mt-0.5">
                +750 ml
              </span>
              <span className="font-['Inter'] text-[10px] text-[#3d4947]">Sports Bottle</span>
            </button>
          </div>
        </div>

        {/* Card 4: Meal & Nutrition Fast Logger */}
        <div className="bg-white p-4 rounded-2xl shadow-xs flex flex-col gap-3 border border-[#eceef0]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00855b]/15 text-[#006947] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">restaurant</span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#191c1e]">
                  Meal &amp; Macronutrients
                </h3>
                <p className="font-['Inter'] text-xs text-[#3d4947]">
                  {mealLog.title} • {mealLog.calories} kcal
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSnapModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-[#eceef0] text-[#3d4947] font-['Inter'] text-xs flex items-center gap-1 hover:text-[#00685f] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              <span>Scan</span>
            </button>
          </div>

          {/* Photo Intake Tap Target & Macro Breakdown */}
          <div className="grid grid-cols-3 gap-2.5 items-center">
            <button
              onClick={() => setIsSnapModalOpen(true)}
              className="flex flex-col items-center justify-center h-24 rounded-xl bg-[#f2f4f6] hover:bg-[#eceef0] active:scale-95 transition-all border-none"
            >
              <div className="w-9 h-9 rounded-full bg-[#00685f]/10 text-[#00685f] flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </div>
              <span className="font-['Inter'] text-[11px] text-[#191c1e] font-semibold">
                Snap Plate
              </span>
              <span className="font-['Inter'] text-[9px] text-[#3d4947]">AI Auto-Calc</span>
            </button>

            {/* Nutrition Summary Bars */}
            <div className="col-span-2 flex flex-col justify-between h-24 bg-[#f2f4f6] p-2.5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-xs text-[#191c1e] font-semibold">
                  Macronutrient Split
                </span>
                <span className="font-['Inter'] text-[11px] text-[#006947] font-medium">
                  {mealLog.targetSplit}
                </span>
              </div>
              {/* Triple Macro Stack Bar */}
              <div className="w-full flex h-2 rounded-full overflow-hidden bg-[#e6e8ea] gap-0.5">
                <div
                  className="bg-[#00685f] h-full"
                  style={{ width: `${proteinPct}%` }}
                  title={`Protein ${proteinPct}%`}
                ></div>
                <div
                  className="bg-[#565e74] h-full"
                  style={{ width: `${carbsPct}%` }}
                  title={`Carbs ${carbsPct}%`}
                ></div>
                <div
                  className="bg-[#4edea3] h-full"
                  style={{ width: `${fatPct}%` }}
                  title={`Fats ${fatPct}%`}
                ></div>
              </div>
              {/* Micro labels */}
              <div className="grid grid-cols-3 text-center pt-0.5">
                <div>
                  <span className="block font-['Inter'] text-[11px] text-[#191c1e] font-bold">
                    {mealLog.proteinGrams}g
                  </span>
                  <span className="block font-['Inter'] text-[9px] text-[#3d4947]">Protein</span>
                </div>
                <div>
                  <span className="block font-['Inter'] text-[11px] text-[#191c1e] font-bold">
                    {mealLog.carbsGrams}g
                  </span>
                  <span className="block font-['Inter'] text-[9px] text-[#3d4947]">Carbs</span>
                </div>
                <div>
                  <span className="block font-['Inter'] text-[11px] text-[#191c1e] font-bold">
                    {mealLog.fatGrams}g
                  </span>
                  <span className="block font-['Inter'] text-[9px] text-[#3d4947]">Fats</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Wearable & Health Vault Sync Hub */}
        <div className="bg-[#f2f4f6] p-4 rounded-2xl flex flex-col gap-3 border border-[#eceef0]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00685f] text-[20px]">sync</span>
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#191c1e]">
                Telemetry Vault
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#006947] font-['Inter'] text-[11px] bg-[#00855b]/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[13px]">verified_user</span>
              <span>256-bit AES Vault Active</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Apple Health item */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#191c1e]">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
                    favorite
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter'] text-xs text-[#191c1e] font-semibold">
                    Apple HealthKit
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#3d4947]">
                    Continuous feed • Synced 2m ago
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00855b]"></div>
            </div>

            {/* Oura Ring */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#191c1e]">
                  <span className="material-symbols-outlined text-[16px] text-[#00685f]">
                    ring_volume
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter'] text-xs text-[#191c1e] font-semibold">
                    Oura Horizon Gen 3
                  </span>
                  <span className="font-['Inter'] text-[11px] text-[#3d4947]">
                    Sleep &amp; Readiness standby
                  </span>
                </div>
              </div>
              <button
                onClick={() => syncWearable('oura-ring')}
                className="px-2.5 py-1 rounded-full bg-[#eceef0] hover:bg-[#008378] hover:text-white text-[#3d4947] font-['Inter'] text-[11px] font-medium transition-all flex items-center gap-1"
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
        <div className="p-3.5 rounded-2xl bg-white shadow-xs flex flex-col gap-2 border border-[#eceef0]/60">
          <div
            onClick={() => setIsNoteExpanded(!isNoteExpanded)}
            className="flex items-center justify-between cursor-pointer hover:bg-[#f2f4f6]/50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#dae2fd]/50 text-[#565e74] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">notes</span>
              </div>
              <span className="font-['Inter'] text-xs text-[#191c1e]">
                {subjectiveNote ? 'Note attached' : 'Add subjective note, energy or pain level...'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#3d4947] text-[18px]">
              {isNoteExpanded ? 'expand_less' : 'add'}
            </span>
          </div>

          {isNoteExpanded && (
            <div className="mt-2 space-y-2 animate-in fade-in">
              <textarea
                value={subjectiveNote}
                onChange={(e) => setSubjectiveNote(e.target.value)}
                placeholder="Log energy levels (e.g. 8/10), symptoms, post-exercise fatigue or soreness..."
                className="w-full text-xs p-2.5 bg-[#f2f4f6] rounded-xl text-[#191c1e] focus:outline-none min-h-[60px]"
              />
              <div className="flex gap-2">
                {['High Energy', 'Mild Fatigue', 'Hydrated', 'Muscle Soreness'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSubjectiveNote((prev) => (prev ? `${prev}, ${tag}` : tag))}
                    className="text-[10px] px-2 py-1 bg-[#eceef0] hover:bg-[#dae2fd] text-[#191c1e] rounded-full font-medium"
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
            className="w-full h-12 rounded-full bg-[#00685f] hover:bg-[#008378] active:scale-[0.98] text-white font-['Inter'] text-sm font-semibold shadow-lg shadow-[#00685f]/20 flex items-center justify-center gap-2 transition-all duration-150"
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
