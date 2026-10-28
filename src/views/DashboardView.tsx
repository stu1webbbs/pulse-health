import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';

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
    <div className="flex flex-col w-full px-4 pb-20 space-y-4">
      {/* Greeting & Live Telemetry Sync Pill */}
      <div className="flex flex-col pt-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-['Inter'] text-xs text-[#565e74] uppercase font-semibold">
              Today's Vitality
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold tracking-tight">
              Good morning, Alex
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f2f4f6] shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006947]"></span>
            </span>
            <span className="font-['Inter'] text-xs text-[#3d4947] font-medium">Synced 2m ago</span>
          </div>
        </div>

        {/* Sensor Connectivity Sub-banner */}
        <div className="flex items-center gap-2 text-[#3d4947]">
          <span
            className="material-symbols-outlined text-[16px] text-[#00685f]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            watch
          </span>
          <span className="font-['Inter'] text-xs">
            Apple Watch Ultra &amp; Health Connect Active
          </span>
        </div>
      </div>

      {/* Smart Medication Banner */}
      {!medCardHidden && activeMed && activeMed.status !== 'taken' && (
        <div className="relative overflow-hidden rounded-xl bg-[#dae2fd]/60 shadow-xs p-4 transition-all duration-300 border border-[#dae2fd]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#00685f] flex-shrink-0 shadow-xs">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                prescriptions
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-['Plus_Jakarta_Sans'] text-sm text-[#131b2e] font-semibold truncate">
                  Medication Due
                </span>
                <span className="font-['Inter'] text-[11px] font-semibold text-[#00685f] bg-[#f4fffc] px-2 py-0.5 rounded-full">
                  {activeMed.dueTime}
                </span>
              </div>
              <p className="font-['Inter'] text-xs text-[#3f465c] mt-0.5 line-clamp-1">
                {activeMed.name}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => {
                    takeMedication(activeMed.id);
                    setTimeout(() => setMedCardHidden(true), 800);
                  }}
                  className="h-9 px-4 rounded-full bg-[#00685f] hover:bg-[#008378] text-white font-['Inter'] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Take Dose</span>
                </button>
                <button
                  onClick={() => {
                    snoozeMedication(activeMed.id);
                    setMedCardHidden(true);
                  }}
                  className="h-9 px-3 rounded-full bg-white/80 text-[#565e74] font-['Inter'] text-xs font-medium hover:bg-white transition-colors"
                >
                  Snooze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Vitals Telemetry Grid (2x2) */}
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-['Plus_Jakarta_Sans'] text-base text-[#191c1e] font-semibold">
            Core Biometrics
          </span>
          <button
            onClick={() => setActiveTab('track-and-log')}
            className="font-['Inter'] text-xs text-[#00685f] font-semibold flex items-center gap-0.5 hover:underline"
          >
            All Sensors
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Heart Rate */}
          <div
            onClick={() => setActiveTab('track-and-log')}
            className="bg-white rounded-xl p-4 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#00685f]/30 border border-[#eceef0]/60 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="w-8 h-8 rounded-full bg-[#ffdad6]/40 flex items-center justify-center text-[#ba1a1a]">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
                <span className="font-['Inter'] text-[10px] uppercase font-bold tracking-wider text-[#006947] bg-[#00855b]/15 px-2 py-0.5 rounded-full">
                  Optimal
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#565e74] block font-medium">Resting Pulse</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold">
                  {vitals.restingHeartRate}
                </span>
                <span className="font-['Inter'] text-xs text-[#565e74]">bpm</span>
              </div>
            </div>
            <div className="mt-2 pt-2">
              {/* Sparkline Wave SVG */}
              <svg className="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id="hrGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00685f" stopOpacity="0.25"></stop>
                    <stop offset="100%" stopColor="#00685f" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M 0 15 Q 12 14, 20 15 L 30 15 L 34 8 L 38 24 L 42 3 L 46 20 L 50 15 L 65 15 Q 75 16, 85 14 L 100 15"
                  stroke="#00685f"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
                <path
                  d="M 0 15 Q 12 14, 20 15 L 30 15 L 34 8 L 38 24 L 42 3 L 46 20 L 50 15 L 65 15 Q 75 16, 85 14 L 100 15 L 100 30 L 0 30 Z"
                  fill="url(#hrGrad)"
                ></path>
                <circle cx="42" cy="3" fill="#00685f" r="3" stroke="#ffffff" strokeWidth="1.5"></circle>
              </svg>
              <span className="font-['Inter'] text-[10px] text-[#565e74] mt-1 block truncate">
                Normal Zone (60–80)
              </span>
            </div>
          </div>

          {/* Card 2: Blood Pressure */}
          <div
            onClick={() => setActiveTab('track-and-log')}
            className="bg-white rounded-xl p-4 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#00685f]/30 border border-[#eceef0]/60 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="w-8 h-8 rounded-full bg-[#89f5e7]/40 flex items-center justify-center text-[#00685f]">
                  <span className="material-symbols-outlined text-[18px]">speed</span>
                </div>
                <span className="font-['Inter'] text-[10px] uppercase font-bold tracking-wider text-[#006947] bg-[#00855b]/15 px-2 py-0.5 rounded-full">
                  Target
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#565e74] block font-medium">Blood Pressure</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold tracking-tight">
                  {vitals.systolic}/{vitals.diastolic}
                </span>
                <span className="font-['Inter'] text-xs text-[#565e74]">mmHg</span>
              </div>
            </div>
            <div className="mt-2 pt-2">
              {/* Dial Gauge Visual Track */}
              <div className="w-full bg-[#eceef0] rounded-full h-2 relative overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isBPOptimal ? 'bg-[#006947]' : 'bg-[#565e74]'}`}
                  style={{ width: `${Math.min(100, Math.round((vitals.systolic / 180) * 100))}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#565e74] font-['Inter']">
                <span>Sys &lt;120</span>
                <span className={`font-semibold ${isBPOptimal ? 'text-[#006947]' : 'text-[#3f465c]'}`}>
                  Stage: {isBPOptimal ? 'Optimal' : 'Elevated'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Sleep Recovery */}
          <div
            onClick={() => setActiveTab('ai-advisor')}
            className="bg-white rounded-xl p-4 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#00685f]/30 border border-[#eceef0]/60 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="w-8 h-8 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#565e74]">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bedtime
                  </span>
                </div>
                <span className="font-['Inter'] text-[10px] uppercase font-bold tracking-wider text-[#00685f] bg-[#89f5e7]/40 px-2 py-0.5 rounded-full">
                  Score {sleep.score}
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#565e74] block font-medium">Rest Restoration</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold">
                  {sleep.hours}
                  <span className="text-base font-semibold text-[#565e74]">h </span>
                  {sleep.minutes}
                  <span className="text-base font-semibold text-[#565e74]">m</span>
                </span>
              </div>
            </div>
            <div className="mt-2 pt-1 flex flex-col gap-1">
              {/* Sleep Segment Bar */}
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#eceef0]">
                <div className="bg-[#00685f]/40" style={{ width: '20%' }} title="Deep 20%"></div>
                <div className="bg-[#00685f]" style={{ width: '55%' }} title="Core 55%"></div>
                <div className="bg-[#6bd8cb]" style={{ width: '25%' }} title="REM 25%"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-['Inter'] text-[#565e74] mt-0.5">
                <span>Deep {sleep.deepHours}h</span>
                <span>REM {sleep.remHours}h</span>
              </div>
            </div>
          </div>

          {/* Card 4: Hydration Tracker */}
          <div className="bg-white rounded-xl p-4 shadow-xs flex flex-col justify-between border border-[#eceef0]/60">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="w-8 h-8 rounded-full bg-[#dae2fd]/50 flex items-center justify-center text-[#00685f]">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    water_drop
                  </span>
                </div>
                <span className="font-['Inter'] text-[10px] font-bold text-[#5c647a] bg-[#dae2fd] px-2 py-0.5 rounded-full">
                  {hydrationPct}%
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#565e74] block font-medium">Daily Hydration</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-bold">
                  {currentWater.toLocaleString()}
                </span>
                <span className="font-['Inter'] text-xs text-[#565e74]"> / 2.5L</span>
              </div>
            </div>
            <div className="mt-2 pt-1 flex items-center justify-between">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#eceef0]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></path>
                  <path
                    className="text-[#00685f] transition-all duration-300"
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
                className="h-7 px-2.5 rounded-full bg-[#eceef0] hover:bg-[#dae2fd] active:bg-[#00685f] active:text-white text-[#00685f] font-['Inter'] text-[11px] font-semibold flex items-center gap-0.5 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                250ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Rings & Daily Move Target */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eceef0]/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00685f] text-[20px]">donut_large</span>
            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#191c1e]">
              Activity Progress
            </span>
          </div>
          <span className="font-['Inter'] text-xs font-semibold text-[#006947] bg-[#00855b]/15 px-2.5 py-0.5 rounded-full">
            On Track
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Concentric Rings Mini SVG */}
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Steps Outer Ring (r=40) */}
              <circle cx="50" cy="50" fill="none" r="40" stroke="#f2f4f6" strokeWidth="8"></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="#00685f"
                strokeDasharray="251.2"
                strokeDashoffset="39.6"
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
              {/* Active Cal Middle Ring (r=28) */}
              <circle cx="50" cy="50" fill="none" r="28" stroke="#f2f4f6" strokeWidth="8"></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="28"
                stroke="#008378"
                strokeDasharray="175.9"
                strokeDashoffset="40"
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
              {/* Stand Inner Ring (r=16) */}
              <circle cx="50" cy="50" fill="none" r="16" stroke="#f2f4f6" strokeWidth="8"></circle>
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="16"
                stroke="#4edea3"
                strokeDasharray="100.5"
                strokeDashoffset="16.7"
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
            </svg>
            <span className="absolute font-['Plus_Jakarta_Sans'] text-base text-[#00685f] font-bold">
              {activity.overallPercentage}%
            </span>
          </div>

          {/* Activity Metrics Breakdown */}
          <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
            {/* Steps */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#00685f] flex-shrink-0"></span>
                <span className="font-['Inter'] text-xs text-[#565e74] truncate">Steps</span>
              </div>
              <div className="font-['Inter'] text-xs text-[#191c1e] font-semibold">
                {activity.steps.toLocaleString()}{' '}
                <span className="text-[#565e74] font-normal">/ 10k</span>
              </div>
            </div>
            {/* Calories */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#008378] flex-shrink-0"></span>
                <span className="font-['Inter'] text-xs text-[#565e74] truncate">Active Burn</span>
              </div>
              <div className="font-['Inter'] text-xs text-[#191c1e] font-semibold">
                {activity.activeCalories}{' '}
                <span className="text-[#565e74] font-normal">/ 600 kcal</span>
              </div>
            </div>
            {/* Stand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] flex-shrink-0"></span>
                <span className="font-['Inter'] text-xs text-[#565e74] truncate">Stand Hours</span>
              </div>
              <div className="font-['Inter'] text-xs text-[#191c1e] font-semibold">
                {activity.standHours}{' '}
                <span className="text-[#565e74] font-normal">/ 12 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Trend Telemetry & Wellness Graph */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#eceef0]/60">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#191c1e]">
              Wellness Trajectory
            </h2>
            <p className="font-['Inter'] text-xs text-[#565e74]">7-day continuous bio-readings</p>
          </div>
          <div className="flex items-center gap-1 bg-[#f2f4f6] px-2 py-1 rounded-full">
            <span className="material-symbols-outlined text-[#006947] text-[16px]">trending_up</span>
            <span className="font-['Inter'] text-xs font-semibold text-[#006947]">+6.4%</span>
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
                className={`flex flex-col items-center py-1.5 px-2.5 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'text-[#565e74] hover:bg-[#eceef0]'
                }`}
              >
                <span className={`font-['Inter'] text-[10px] font-medium ${isSelected ? 'text-[#f4fffc]' : ''}`}>
                  {t.dayShort}
                </span>
                <span className="font-['Inter'] text-xs font-bold mt-0.5">{t.score}</span>
              </button>
            );
          })}
        </div>

        {/* Chart Visual Canvas */}
        <div className="relative w-full h-36 mt-2 pt-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 120">
            <defs>
              <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#00685f" stopOpacity="0.22"></stop>
                <stop offset="100%" stopColor="#00685f" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>
            {/* Horizontal Guide lines */}
            <line stroke="#eceef0" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1="30" y2="30"></line>
            <line stroke="#eceef0" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1="75" y2="75"></line>
            {/* Smooth Wellness Area & Curve */}
            <path
              d="M 10 78 C 50 72, 70 82, 105 70 C 145 58, 170 42, 215 36 C 255 30, 280 20, 310 14 L 310 115 L 10 115 Z"
              fill="url(#trendGradient)"
            ></path>
            <path
              d="M 10 78 C 50 72, 70 82, 105 70 C 145 58, 170 42, 215 36 C 255 30, 280 20, 310 14"
              fill="none"
              stroke="#00685f"
              strokeLinecap="round"
              strokeWidth="2.5"
            ></path>
            {/* Highlighted Nodes */}
            <circle cx="10" cy="78" fill="#00685f" r="3.5" stroke="#ffffff" strokeWidth="1.5"></circle>
            <circle cx="105" cy="70" fill="#00685f" r="3.5" stroke="#ffffff" strokeWidth="1.5"></circle>
            <circle cx="215" cy="36" fill="#00685f" r="3.5" stroke="#ffffff" strokeWidth="1.5"></circle>
            <circle cx="310" cy="14" fill="#00685f" r="5" stroke="#ffffff" strokeWidth="2"></circle>
          </svg>
          <div className="absolute right-0 top-0 translate-y-1 bg-[#e0e3e5] px-2 py-0.5 rounded-full text-[10px] font-['Inter'] font-bold text-[#191c1e]">
            {selectedDayData.label || `${selectedDayData.dayFull}: ${selectedDayData.score} pts`}
          </div>
        </div>
      </div>

      {/* Reassurance / Security Telemetry Badge */}
      <div className="flex items-center justify-center gap-2 py-2 text-[#565e74]">
        <div className="w-6 h-6 rounded-full bg-[#eceef0] flex items-center justify-center text-[#00685f]">
          <span className="material-symbols-outlined text-[15px]">verified_user</span>
        </div>
        <span className="font-['Inter'] text-[11px] text-[#3d4947] font-medium text-center">
          End-to-End Encrypted Telemetry • HIPAA &amp; GDPR Verified
        </span>
      </div>
    </div>
  );
};
