import React from 'react';
import { useHealth } from '../context/HealthContext';
import { AnimatedNumber } from '../components/AnimatedNumber';

const FOCUS_OPTIONS = [
  'Better Sleep',
  'Cardio Fitness',
  'Hypertension',
  'Pre-diabetes',
  'Stress Reduction',
  'Weight Management',
  'Joint Mobility',
  'Lipid Panel Care',
];

export const ProfileCarePlanView: React.FC = () => {
  const {
    profile,
    updateProfile,
    toggleHealthFocus,
    calculatedBmi,
    bmiCategory,
    showToast,
    setActiveTab,
  } = useHealth();

  const handleHeightUnitToggle = (unit: 'cm' | 'ft') => {
    if (profile.heightUnit === unit) return;
    if (unit === 'ft') {
      const ftVal = parseFloat((profile.heightCm / 30.48).toFixed(1));
      updateProfile({ heightUnit: 'ft', heightCm: ftVal });
    } else {
      const cmVal = Math.round(profile.heightCm * 30.48);
      updateProfile({ heightUnit: 'cm', heightCm: cmVal });
    }
  };

  const handleWeightUnitToggle = (unit: 'kg' | 'lbs') => {
    if (profile.weightUnit === unit) return;
    if (unit === 'lbs') {
      const lbsVal = Math.round(profile.weightKg * 2.20462);
      updateProfile({ weightUnit: 'lbs', weightKg: lbsVal });
    } else {
      const kgVal = parseFloat((profile.weightKg * 0.453592).toFixed(1));
      updateProfile({ weightUnit: 'kg', weightKg: kgVal });
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pb-24 space-y-4 pt-1">
      {/* Header & Progress Tracker */}
      <div className="flex flex-col space-y-2 pt-1">
        <div className="flex items-center justify-between text-[#94a3b8]">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[#00e5c9] text-base">
              verified_user
            </span>
            <span className="font-['Inter'] text-xs uppercase tracking-wider text-[#00e5c9] font-semibold">
              PulseHealth Shield
            </span>
          </div>
          <span className="font-['Inter'] text-xs font-medium text-[#94a3b8]">Step 2 of 4</span>
        </div>

        {/* Segmented Stepper Bar */}
        <div className="w-full grid grid-cols-4 gap-2 pt-1">
          <div className="h-1.5 rounded-full bg-[#00e5c9] shadow-[0_0_8px_#00e5c9]"></div>
          <div className="h-1.5 rounded-full bg-[#00e5c9] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#f1f5f9] animate-pulse opacity-60"></div>
          </div>
          <div className="h-1.5 rounded-full bg-[#1c242e]"></div>
          <div className="h-1.5 rounded-full bg-[#1c242e]"></div>
        </div>

        {/* Title Block */}
        <div className="pt-2">
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#f1f5f9] font-bold tracking-tight">
            Personalize Your Care Plan
          </h1>
          <p className="font-['Inter'] text-xs text-[#94a3b8] pt-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#00e5c9]">lock</span>
            <span>Your data is encrypted locally and compliant with HIPAA &amp; GDPR standards.</span>
          </p>
        </div>
      </div>

      {/* Trust Assurance Pill Card */}
      <div className="bg-[#0e1319] border border-[#1f2834] rounded-2xl p-4 shadow-md">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#12171e] border border-[#242e3a] flex items-center justify-center shrink-0 shadow-md text-[#00e5c9]">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-['Inter'] text-xs font-semibold text-[#f1f5f9]">
              Private Baseline Profiling
            </p>
            <p className="font-['Inter'] text-xs text-[#94a3b8] mt-0.5 leading-relaxed">
              Biometric calibrations run directly on your chip. We never sell your biological telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Demographics & Physical Baseline Form */}
      <section className="bg-[#0e1319] border border-[#1f2834] rounded-2xl p-4 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00e5c9] text-xl">monitor_weight</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
              Physical Baseline
            </h2>
          </div>
          <span className="font-['Inter'] text-[11px] px-2.5 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] border border-[#334155] font-medium">
            Clinical Standard
          </span>
        </div>

        {/* Biological Sex Selection */}
        <div className="space-y-1.5">
          <label className="font-['Inter'] text-xs text-[#94a3b8] font-medium">
            Biological Sex (for metabolic rate modeling)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['female', 'male', 'other'] as const).map((gender) => {
              const isSelected = profile.sex === gender;
              return (
                <button
                  key={gender}
                  type="button"
                  onClick={() => updateProfile({ sex: gender })}
                  className={`py-2.5 px-3 rounded-full font-['Inter'] text-xs text-center transition-all capitalize font-medium ${
                    isSelected
                      ? 'bg-[#00e5c9] text-[#07090c] font-bold shadow-[0_0_12px_rgba(0,229,201,0.4)]'
                      : 'bg-[#12171e] text-[#94a3b8] border border-[#1f2834] hover:bg-[#1a222c] hover:text-[#f1f5f9]'
                  }`}
                >
                  {gender}
                </button>
              );
            })}
          </div>
        </div>

        {/* Age & Height Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Age */}
          <div className="space-y-1.5">
            <label className="font-['Inter'] text-xs text-[#94a3b8] font-medium" htmlFor="ageInput">
              Age
            </label>
            <div className="relative flex items-center">
              <input
                id="ageInput"
                type="number"
                min="16"
                max="110"
                value={profile.age}
                onChange={(e) => updateProfile({ age: parseInt(e.target.value, 10) || 32 })}
                className="w-full h-12 bg-[#12171e] border border-[#1f2834] rounded-xl px-3.5 pr-11 text-[#f1f5f9] font-['Plus_Jakarta_Sans'] font-semibold text-base focus:outline-none focus:border-[#00e5c9] font-mono"
              />
              <span className="absolute right-3 font-['Inter'] text-xs text-[#64748b] pointer-events-none">
                yrs
              </span>
            </div>
          </div>

          {/* Height with Unit Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-['Inter'] text-xs text-[#94a3b8] font-medium">Height</label>
              <div className="flex items-center space-x-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleHeightUnitToggle('cm')}
                  className={`font-semibold ${
                    profile.heightUnit === 'cm' ? 'text-[#00e5c9]' : 'text-[#64748b]'
                  }`}
                >
                  cm
                </button>
                <span className="text-[#334155]">•</span>
                <button
                  type="button"
                  onClick={() => handleHeightUnitToggle('ft')}
                  className={`font-semibold ${
                    profile.heightUnit === 'ft' ? 'text-[#00e5c9]' : 'text-[#64748b]'
                  }`}
                >
                  ft
                </button>
              </div>
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.1"
                value={profile.heightCm}
                onChange={(e) =>
                  updateProfile({ heightCm: parseFloat(e.target.value) || 174 })
                }
                className="w-full h-12 bg-[#12171e] border border-[#1f2834] rounded-xl px-3.5 pr-11 text-[#f1f5f9] font-['Plus_Jakarta_Sans'] font-semibold text-base focus:outline-none focus:border-[#00e5c9] font-mono"
              />
              <span className="absolute right-3 font-['Inter'] text-xs text-[#64748b] pointer-events-none">
                {profile.heightUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Weight & Instant Dynamic BMI Calculation (Live Changing) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-['Inter'] text-xs text-[#94a3b8] font-medium">
              Current Weight
            </label>
            <div className="flex items-center space-x-1 text-xs">
              <button
                type="button"
                onClick={() => handleWeightUnitToggle('kg')}
                className={`font-semibold ${
                  profile.weightUnit === 'kg' ? 'text-[#00e5c9]' : 'text-[#64748b]'
                }`}
              >
                kg
              </button>
              <span className="text-[#334155]">•</span>
              <button
                type="button"
                onClick={() => handleWeightUnitToggle('lbs')}
                className={`font-semibold ${
                  profile.weightUnit === 'lbs' ? 'text-[#00e5c9]' : 'text-[#64748b]'
                }`}
              >
                lbs
              </button>
            </div>
          </div>
          <div className="relative flex items-center">
            <input
              type="number"
              step="0.5"
              value={profile.weightKg}
              onChange={(e) =>
                updateProfile({ weightKg: parseFloat(e.target.value) || 68.0 })
              }
              className="w-full h-12 bg-[#12171e] border border-[#1f2834] rounded-xl px-3.5 pr-11 text-[#f1f5f9] font-['Plus_Jakarta_Sans'] font-semibold text-base focus:outline-none focus:border-[#00e5c9] font-mono"
            />
            <span className="absolute right-3 font-['Inter'] text-xs text-[#64748b] pointer-events-none">
              {profile.weightUnit}
            </span>
          </div>

          {/* Realtime Biometric Feedback Chip with Animated BMI Number */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#12171e] border border-[#1f2834] transition-colors duration-200">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#00e5c9] text-lg animate-heartbeat">ecg_heart</span>
              <div className="flex items-baseline space-x-1 font-mono">
                <span className="font-['Inter'] text-xs text-[#94a3b8]">Est. BMI:</span>
                <span className="font-['Plus_Jakarta_Sans'] text-base text-[#f1f5f9] font-bold">
                  <AnimatedNumber value={calculatedBmi} format={(n) => n.toFixed(1)} />
                </span>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-['Inter'] text-xs font-semibold tracking-wide flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              <span>{bmiCategory}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Health Focus & Clinical Conditions Multi-Select */}
      <section className="bg-[#0e1319] border border-[#1f2834] rounded-2xl p-4 shadow-md space-y-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00e5c9] text-xl">vital_signs</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
              Health Focus &amp; Markers
            </h2>
          </div>
          <p className="font-['Inter'] text-xs text-[#94a3b8]">
            Select all areas you want your daily care intelligence to prioritize:
          </p>
        </div>

        {/* Focus Tag Matrix */}
        <div className="flex flex-wrap gap-2">
          {FOCUS_OPTIONS.map((focus) => {
            const isSelected = profile.healthFocus.includes(focus);
            return (
              <button
                key={focus}
                type="button"
                onClick={() => toggleHealthFocus(focus)}
                className={`px-3.5 py-2 rounded-full font-['Inter'] text-xs transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#00e5c9] text-[#07090c] font-bold shadow-[0_0_10px_rgba(0,229,201,0.4)]'
                    : 'bg-[#12171e] text-[#94a3b8] border border-[#1f2834] hover:bg-[#1a222c] hover:text-[#f1f5f9]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isSelected ? 'check' : 'add'}
                </span>
                <span>{focus}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Connected Wearables & Continuous Telemetry */}
      <section className="bg-[#0e1319] border border-[#1f2834] rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#00e5c9] text-xl">watch</span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#f1f5f9]">
                Wearable Telemetry
              </h2>
            </div>
            <p className="font-['Inter'] text-xs text-[#94a3b8]">
              Automate resting heart rate, sleep &amp; steps
            </p>
          </div>

          {/* Native Switch Toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={profile.wearableTelemetryActive}
              onChange={(e) =>
                updateProfile({ wearableTelemetryActive: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-12 h-7 bg-[#1c242e] rounded-full peer peer-checked:bg-[#00e5c9] peer-focus:outline-none transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
          </label>
        </div>

        {/* Active Sensor Stream Micro-Panel */}
        {profile.wearableTelemetryActive && (
          <div className="rounded-xl p-3 bg-[#12171e] border border-[#1f2834] space-y-3 transition-opacity duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5c9] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5c9]"></span>
                </span>
                <span className="font-['Inter'] text-xs font-semibold text-[#f1f5f9]">
                  Apple Health &amp; Connect Ready
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#00e5c9] font-medium font-mono">Read-Only</span>
            </div>

            {/* Permission Data Types Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#161d26] border border-[#242e3a] text-center shadow-sm">
                <span className="material-symbols-outlined text-[#ff4d4f] text-lg">favorite</span>
                <span className="font-['Inter'] text-xs font-semibold text-[#f1f5f9] mt-1">
                  Heart Rate
                </span>
                <span className="font-['Inter'] text-[11px] text-[#64748b]">Real-time</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#161d26] border border-[#242e3a] text-center shadow-sm">
                <span className="material-symbols-outlined text-[#60a5fa] text-lg">bedtime</span>
                <span className="font-['Inter'] text-xs font-semibold text-[#f1f5f9] mt-1">
                  Sleep Stages
                </span>
                <span className="font-['Inter'] text-[11px] text-[#64748b]">Deep/REM</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#161d26] border border-[#242e3a] text-center shadow-sm">
                <span className="material-symbols-outlined text-[#00e5c9] text-lg">
                  directions_run
                </span>
                <span className="font-['Inter'] text-xs font-semibold text-[#f1f5f9] mt-1">
                  Activity
                </span>
                <span className="font-['Inter'] text-[11px] text-[#64748b]">Cadence</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section 4: Clinical Security & Privacy Architecture */}
      <div className="bg-[#0e1319] border border-[#1f2834] rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-[#f1f5f9]">
          <span className="material-symbols-outlined text-[#00e5c9] text-xl">
            enhanced_encryption
          </span>
          <h3 className="font-['Inter'] text-xs font-semibold">PulseHealth Vault Architecture</h3>
        </div>
        <div className="space-y-2 font-['Inter'] text-xs text-[#94a3b8]">
          <div className="flex items-start space-x-2">
            <span className="material-symbols-outlined text-base text-[#10b981] shrink-0 mt-0.5">
              check_circle
            </span>
            <span>
              <strong>HIPAA &amp; GDPR Compliant:</strong> Hardware-level AES-256 local encrypted sandbox.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="material-symbols-outlined text-base text-[#10b981] shrink-0 mt-0.5">
              check_circle
            </span>
            <span>
              <strong>Zero-Selling Pledge:</strong> Your biometrics will never be shared with insurers or brokers.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="material-symbols-outlined text-base text-[#10b981] shrink-0 mt-0.5">
              check_circle
            </span>
            <span>
              <strong>Biometric Protection:</strong> Requires FaceID / Fingerprint authorization before every export.
            </span>
          </div>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="pt-2 flex flex-col space-y-3">
        <button
          onClick={() => {
            showToast('Care Plan updated & calibrated successfully!');
            setActiveTab('dashboard');
          }}
          className="w-full h-12 rounded-full bg-[#00e5c9] hover:bg-[#38ef7d] text-[#07090c] font-['Inter'] text-sm font-bold tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-[#00e5c9]/30 transition-all active:scale-[0.99]"
          type="button"
        >
          <span>Continue to Habits Setup</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="w-full py-2.5 text-center font-['Inter'] text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
          type="button"
        >
          I will complete this later
        </button>
      </div>
    </div>
  );
};
