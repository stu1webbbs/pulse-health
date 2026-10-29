import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { AnimatedNumber } from '../components/AnimatedNumber';

export const DashboardView: React.FC = () => {
  const {
    vitals,
    hydration,
    addWater,
    medications,
    takeMedication,
    snoozeMedication,
    activity,
    sleep,
    trajectory,
    selectedDayShort,
    setSelectedDayShort,
    setActiveTab,
    secondsSinceSync,
    triggerLivePulse,
    isLiveStreaming,
    setIsLiveStreaming,
  } = useHealth();

  const [medCardHidden, setMedCardHidden] = useState(false);
  const activeMed = medications[0];

  // Dynamic calculations for hydration ring
  const currentWater = hydration.currentMl;
  const maxWater = hydration.targetMl;
  const hydrationPct = Math.min(100, Math.round((currentWater / maxWater) * 100));

  // Selected trajectory item
  const selectedDayData = trajectory.find((t) => t.dayShort === selectedDayShort) || trajectory[trajectory.length - 1];

  // Dynamic blood pressure status
  const sys = vitals.systolic;
  const dia = vitals.diastolic;
  const isBPOptimal = sys < 120 && dia < 80;

  return (
    <div className="flex flex-col w-full px-4 pb-24 space-y-4 pt-1">
      {/* Greeting & Live Telemetry Sync Pill */}
      <div className="flex flex-col pt-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-['Inter'] text-[11px] text-[#00e5c9] tracking-wider uppercase font-semibold">
                Live Vitality Feed
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-[#00e5c9]/10 text-[#00e5c9] border border-[#00e5c9]/30 font-mono">
                AUTONOMOUS
              </span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold tracking-tight">
              Good morning, Alex
            </h1>
          </div>

          {/* Interactive Live Sync Pill */}
          <button
            onClick={() => {
              if (!isLiveStreaming) setIsLiveStreaming(true);
              triggerLivePulse();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12171e] border border-[#242e3a] hover:border-[#00e5c9]/60 shadow-lg shadow-black/40 transition-all active:scale-95 group"
            title="Tap to trigger live sensor calibration"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5c9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5c9]"></span>
            </span>
            <span className="font-['Inter'] text-xs text-[#94a3b8] font-medium group-hover:text-[#f1f5f9]">
              {secondsSinceSync === 0 ? 'Synced just now' : `Synced ${secondsSinceSync}s ago`}
            </span>
          </button>
        </div>

        {/* Sensor Connectivity Sub-banner */}
        <div className="flex items-center justify-between text-[#94a3b8]">
          <div className="flex items-center gap-2 text-xs">
            <span
              className="material-symbols-outlined text-[16px] text-[#00e5c9]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              watch
            </span>
            <span className="font-['Inter']">
              Apple Watch Ultra &amp; Health Connect Active
            </span>
          </div>

          <span className="text-[10px] font-mono text-[#00e5c9]/90 bg-[#00e5c9]/10 px-2 py-0.5 rounded-full border border-[#00e5c9]/20">
            Telemetry Stream Active
          </span>
        </div>
      </div>

      {/* Smart Medication Banner */}
      {!medCardHidden && activeMed && activeMed.status !== 'taken' && (
        <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] shadow-lg p-4 transition-all duration-300 border border-[#1e293b]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-[#00e5c9] flex-shrink-0 shadow-inner">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                prescriptions
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-['Plus_Jakarta_Sans'] text-sm text-[#f1f5f9] font-semibold truncate">
                  Medication Due
                </span>
                <span className="font-['Inter'] text-[11px] font-semibold text-[#00e5c9] bg-[#00e5c9]/10 border border-[#00e5c9]/30 px-2 py-0.5 rounded-full">
                  {activeMed.dueTime}
                </span>
              </div>
              <p className="font-['Inter'] text-xs text-[#94a3b8] mt-0.5 line-clamp-1">
                {activeMed.name}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => {
                    takeMedication(activeMed.id);
                    setTimeout(() => setMedCardHidden(true), 800);
                  }}
                  className="h-9 px-4 rounded-full bg-[#00e5c9] hover:bg-[#38ef7d] text-[#07090c] font-['Inter'] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#00e5c9]/20 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Take Dose</span>
                </button>
                <button
                  onClick={() => {
                    snoozeMedication(activeMed.id);
                    setMedCardHidden(true);
                  }}
                  className="h-9 px-3 rounded-full bg-[#1e293b] text-[#94a3b8] font-['Inter'] text-xs font-medium hover:bg-[#334155] hover:text-[#f1f5f9] transition-colors border border-[#334155]"
                >
                  Snooze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Vitals Telemetry Grid (2x2) */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-['Plus_Jakarta_Sans'] text-base text-[#f1f5f9] font-semibold">
            Core Biometrics
          </span>
          <button
            onClick={() => setActiveTab('track-and-log')}
            className="font-['Inter'] text-xs text-[#00e5c9] font-semibold flex items-center gap-0.5 hover:underline"
          >
            All Sensors
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Heart Rate (Dynamic changing BPM) */}
          <div
            onClick={() => {
              triggerLivePulse();
            }}
            className="bg-[#0e1319] rounded-2xl p-4 shadow-md flex flex-col justify-between cursor-pointer hover:border-[#00e5c9]/50 border border-[#1f2834] transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-full bg-[#ff4d4f]/15 border border-[#ff4d4f]/30 flex items-center justify-center text-[#ff4d4f]">
                  <span
                    className="material-symbols-outlined text-[18px] animate-heartbeat"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
                <span className="font-['Inter'] text-[10px] uppercase font-bold tracking-wider text-[#10b981] bg-[#10b981]/15 border border-[#10b981]/30 px-2 py-0.5 rounded-full">
                  Optimal
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#94a3b8] block font-medium">Resting Pulse</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold font-mono">
                  <AnimatedNumber value={vitals.restingHeartRate} />
                </span>
                <span className="font-['Inter'] text-xs text-[#64748b]">bpm</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5c9] animate-ping ml-1" />
              </div>
            </div>
            <div className="mt-2 pt-2">
              {/* Dynamic Sparkline Wave SVG with glowing stroke */}
              <svg className="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="hrGradDark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00e5c9" stopOpacity="0.35"></stop>
                    <stop offset="100%" stopColor="#00e5c9" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M 0 15 Q 12 14, 20 15 L 30 15 L 34 8 L 38 24 L 42 3 L 46 20 L 50 15 L 65 15 Q 75 16, 85 14 L 100 15"
                  stroke="#00e5c9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
                <path
                  d="M 0 15 Q 12 14, 20 15 L 30 15 L 34 8 L 38 24 L 42 3 L 46 20 L 50 15 L 65 15 Q 75 16, 85 14 L 100 15 L 100 30 L 0 30 Z"
                  fill="url(#hrGradDark)"
                ></path>
                <circle cx="42" cy="3" fill="#00e5c9" r="3" stroke="#07090c" strokeWidth="1.5"></circle>
              </svg>
              <span className="font-['Inter'] text-[10px] text-[#64748b] mt-1 block truncate">
                Normal Zone (60–80)
              </span>
            </div>
          </div>

          {/* Card 2: Blood Pressure (Dynamic changing SYS/DIA) */}
          <div
            onClick={() => setActiveTab('track-and-log')}
            className="bg-[#0e1319] rounded-2xl p-4 shadow-md flex flex-col justify-between cursor-pointer hover:border-[#00e5c9]/50 border border-[#1f2834] transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-full bg-[#00e5c9]/15 border border-[#00e5c9]/30 flex items-center justify-center text-[#00e5c9]">
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                </div>
                <span className="font-['Inter'] text-[10px] uppercase font-bold tracking-wider text-[#10b981] bg-[#10b981]/15 border border-[#10b981]/30 px-2 py-0.5 rounded-full">
                  Target
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#94a3b8] block font-medium">Blood Pressure</span>
              <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold tracking-tight">
                  <AnimatedNumber value={vitals.systolic} />/<AnimatedNumber value={vitals.diastolic} />
                </span>
                <span className="font-['Inter'] text-xs text-[#64748b]">mmHg</span>
              </div>
            </div>
            <div className="mt-2 pt-2">
              {/* Dial Gauge Visual Track */}
              <div className="w-full bg-[#1c242e] rounded-full h-2 relative overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isBPOptimal ? 'bg-[#00e5c9] shadow-[0_0_8px_#00e5c9]' : 'bg-[#eab308]'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((vitals.systolic / 180) * 100))}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#64748b] font-['Inter']">
                <span>Sys &lt;120</span>
                <span className={`font-semibold ${isBPOptimal ? 'text-[#00e5c9]' : 'text-[#eab308]'}`}>
                  Stage: {isBPOptimal ? 'Optimal' : 'Elevated'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Sleep Recovery */}
          <div
            onClick={() => setActiveTab('ai-advisor')}
            className="bg-[#0e1319] rounded-2xl p-4 shadow-md flex flex-col justify-between cursor-pointer hover:border-[#00e5c9]/50 border border-[#1f2834] transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bedtime
                  </span>
                </div>
                <span className="font-['Inter'] text-[10px] uppercase font-bold tracking-wider text-[#60a5fa] bg-[#3b82f6]/15 border border-[#3b82f6]/30 px-2 py-0.5 rounded-full">
                  Score {sleep.score}
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#94a3b8] block font-medium">Rest Restoration</span>
              <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold">
                  {sleep.hours}
                  <span className="text-base font-semibold text-[#64748b]">h </span>
                  {sleep.minutes}
                  <span className="text-base font-semibold text-[#64748b]">m</span>
                </span>
              </div>
            </div>
            <div className="mt-2 pt-1 flex flex-col gap-1">
              {/* Sleep Segment Bar */}
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#1c242e]">
                <div className="bg-[#008378]" style={{ width: '20%' }} title="Deep 20%"></div>
                <div className="bg-[#00e5c9]" style={{ width: '55%' }} title="Core 55%"></div>
                <div className="bg-[#6ee7b7]" style={{ width: '25%' }} title="REM 25%"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-['Inter'] text-[#64748b] mt-0.5">
                <span>Deep {sleep.deepHours}h</span>
                <span>REM {sleep.remHours}h</span>
              </div>
            </div>
          </div>

          {/* Card 4: Daily Hydration (Dynamic changing numbers) */}
          <div className="bg-[#0e1319] rounded-2xl p-4 shadow-md flex flex-col justify-between border border-[#1f2834]">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-full bg-[#00e5c9]/15 border border-[#00e5c9]/30 flex items-center justify-center text-[#00e5c9]">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    water_drop
                  </span>
                </div>
                <span className="font-['Inter'] text-[10px] font-bold text-[#00e5c9] bg-[#00e5c9]/10 border border-[#00e5c9]/30 px-2 py-0.5 rounded-full font-mono">
                  <AnimatedNumber value={hydrationPct} />%
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#94a3b8] block font-medium">Daily Hydration</span>
              <div className="flex items-baseline gap-1 mt-0.5 font-mono">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold">
                  <AnimatedNumber value={currentWater} />
                </span>
                <span className="font-['Inter'] text-xs text-[#64748b]"> / 2.5L</span>
              </div>
            </div>
            <div className="mt-2 pt-1 flex items-center justify-between">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#1c242e]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></path>
                  <path
                    className="text-[#00e5c9] transition-all duration-300 drop-shadow-[0_0_4px_#00e5c9]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${hydrationPct}, 100`}
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></path>
                </svg>
              </div>
              <button
                onClick={() => addWater(250)}
                className="h-7 px-2.5 rounded-full bg-[#171e27] hover:bg-[#00e5c9] hover:text-[#07090c] text-[#00e5c9] border border-[#242e3a] hover:border-[#00e5c9] font-['Inter'] text-[11px] font-bold flex items-center gap-0.5 transition-all active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                250ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Rings & Daily Move Target (Changing Steps & Calories) */}
      <div className="bg-[#0e1319] rounded-2xl p-4 shadow-md border border-[#1f2834]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00e5c9] text-[20px]">donut_large</span>
            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
              Activity Progress
            </span>
          </div>
          <span className="font-['Inter'] text-xs font-semibold text-[#10b981] bg-[#10b981]/15 border border-[#10b981]/30 px-2.5 py-0.5 rounded-full">
            On Track
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Concentric Rings Mini SVG */}
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Steps Outer Ring (r=40) */}
              <circle cx="50" cy="50" fill="none" r="40" stroke="#1c242e" strokeWidth="8"></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="#00e5c9"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - activity.overallPercentage / 100)}
                strokeLinecap="round"
                strokeWidth="8"
                className="transition-all duration-500 drop-shadow-[0_0_6px_#00e5c9]"
              ></circle>
              {/* Active Cal Middle Ring (r=28) */}
              <circle cx="50" cy="50" fill="none" r="28" stroke="#1c242e" strokeWidth="8"></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="28"
                stroke="#008378"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 * (1 - activity.activeCalories / activity.caloriesGoal)}
                strokeLinecap="round"
                strokeWidth="8"
                className="transition-all duration-500"
              ></circle>
              {/* Stand Inner Ring (r=16) */}
              <circle cx="50" cy="50" fill="none" r="16" stroke="#1c242e" strokeWidth="8"></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="16"
                stroke="#38ef7d"
                strokeDasharray="100.5"
                strokeDashoffset={100.5 * (1 - activity.standHours / activity.standGoal)}
                strokeLinecap="round"
                strokeWidth="8"
                className="transition-all duration-500"
              ></circle>
            </svg>
            <span className="absolute font-['Plus_Jakarta_Sans'] text-base text-[#00e5c9] font-bold font-mono">
              <AnimatedNumber value={activity.overallPercentage} />%
            </span>
          </div>

          {/* Activity Metrics Breakdown (Changing in real-time) */}
          <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
            {/* Steps */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#00e5c9] shadow-[0_0_6px_#00e5c9] flex-shrink-0"></span>
                <span className="font-['Inter'] text-xs text-[#94a3b8] truncate">Steps</span>
              </div>
              <div className="font-['Inter'] text-xs text-[#f1f5f9] font-bold font-mono">
                <AnimatedNumber value={activity.steps} />{' '}
                <span className="text-[#64748b] font-normal">/ 10k</span>
              </div>
            </div>
            {/* Calories */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#008378] flex-shrink-0"></span>
                <span className="font-['Inter'] text-xs text-[#94a3b8] truncate">Active Burn</span>
              </div>
              <div className="font-['Inter'] text-xs text-[#f1f5f9] font-bold font-mono">
                <AnimatedNumber value={activity.activeCalories} />{' '}
                <span className="text-[#64748b] font-normal">/ 600 kcal</span>
              </div>
            </div>
            {/* Stand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#38ef7d] flex-shrink-0"></span>
                <span className="font-['Inter'] text-xs text-[#94a3b8] truncate">Stand Hours</span>
              </div>
              <div className="font-['Inter'] text-xs text-[#f1f5f9] font-bold font-mono">
                {activity.standHours}{' '}
                <span className="text-[#64748b] font-normal">/ 12 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Trend Telemetry & Wellness Graph */}
      <div className="bg-[#0e1319] rounded-2xl p-4 shadow-md border border-[#1f2834]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
              Wellness Trajectory
            </h2>
            <p className="font-['Inter'] text-xs text-[#94a3b8]">7-day continuous bio-readings</p>
          </div>
          <div className="flex items-center gap-1 bg-[#12171e] border border-[#242e3a] px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[#00e5c9] text-[16px]">trending_up</span>
            <span className="font-['Inter'] text-xs font-semibold text-[#00e5c9]">+6.4%</span>
          </div>
        </div>

        {/* 7-Day Day Selector Bar */}
        <div className="flex items-center justify-between py-2 border-b-0">
          {trajectory.map((t) => {
            const isSelected = t.dayShort === selectedDayShort;
            return (
              <button
                key={t.dayShort}
                onClick={() => setSelectedDayShort(t.dayShort)}
                className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-[#00e5c9] text-[#07090c] font-bold shadow-[0_0_12px_rgba(0,229,201,0.4)]'
                    : 'text-[#94a3b8] hover:bg-[#161d26]'
                }`}
              >
                <span className={`font-['Inter'] text-[10px] font-medium ${isSelected ? 'text-[#07090c]' : ''}`}>
                  {t.dayShort}
                </span>
                <span className="font-['Inter'] text-xs font-bold mt-0.5 font-mono">{t.score}</span>
              </button>
            );
          })}
        </div>

        {/* Chart Visual Canvas */}
        <div className="relative w-full h-36 mt-2 pt-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 120">
            <defs>
              <linearGradient id="trendGradientDark" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#00e5c9" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#00e5c9" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>
            {/* Horizontal Guide lines */}
            <line stroke="#1c242e" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1="30" y2="30"></line>
            <line stroke="#1c242e" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1="75" y2="75"></line>
            {/* Smooth Wellness Area & Curve */}
            <path
              d="M 10 78 C 50 72, 70 82, 105 70 C 145 58, 170 42, 215 36 C 255 30, 280 20, 310 14 L 310 115 L 10 115 Z"
              fill="url(#trendGradientDark)"
            ></path>
            <path
              d="M 10 78 C 50 72, 70 82, 105 70 C 145 58, 170 42, 215 36 C 255 30, 280 20, 310 14"
              fill="none"
              stroke="#00e5c9"
              strokeLinecap="round"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_8px_rgba(0,229,201,0.6)]"
            ></path>
            {/* Highlighted Nodes */}
            <circle cx="10" cy="78" fill="#00e5c9" r="3.5" stroke="#07090c" strokeWidth="1.5"></circle>
            <circle cx="105" cy="70" fill="#00e5c9" r="3.5" stroke="#07090c" strokeWidth="1.5"></circle>
            <circle cx="215" cy="36" fill="#00e5c9" r="3.5" stroke="#07090c" strokeWidth="1.5"></circle>
            <circle cx="310" cy="14" fill="#00e5c9" r="5" stroke="#07090c" strokeWidth="2"></circle>
          </svg>
          <div className="absolute right-0 top-0 translate-y-1 bg-[#12171e] border border-[#00e5c9]/40 px-2.5 py-0.5 rounded-full text-[10px] font-['Inter'] font-bold text-[#00e5c9] shadow-md font-mono">
            {selectedDayData.label || `${selectedDayData.dayFull}: ${selectedDayData.score} pts`}
          </div>
        </div>
      </div>

      {/* Reassurance / Security Telemetry Badge */}
      <div className="flex items-center justify-center gap-2 py-2 text-[#94a3b8]">
        <div className="w-6 h-6 rounded-full bg-[#12171e] border border-[#242e3a] flex items-center justify-center text-[#00e5c9]">
          <span className="material-symbols-outlined text-[15px]">verified_user</span>
        </div>
        <span className="font-['Inter'] text-[11px] text-[#94a3b8] font-medium text-center">
          End-to-End Encrypted Telemetry • HIPAA &amp; GDPR Verified
        </span>
      </div>
    </div>
  );
};
