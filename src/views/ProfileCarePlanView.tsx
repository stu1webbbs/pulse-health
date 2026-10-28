import React from 'react';
import { useHealth } from '../context/HealthContext';

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
        <div className="flex items-center justify-between text-[#565e74]">
          <div className="flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-[#00685f] text-base">
              verified_user
            </span>
            <span className="font-['Inter'] text-xs uppercase tracking-wider text-[#00685f] font-semibold">
              PulseHealth Shield
            </span>
          </div>
          <span className="font-['Inter'] text-xs font-medium text-[#565e74]">Step 2 of 4</span>
        </div>

        {/* Segmented Stepper Bar */}
        <div className="w-full grid grid-cols-4 gap-2 pt-1">
          <div className="h-1.5 rounded-full bg-[#00685f]"></div>
          <div className="h-1.5 rounded-full bg-[#00685f] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#89f5e7] animate-pulse opacity-60"></div>
          </div>
          <div className="h-1.5 rounded-full bg-[#e6e8ea]"></div>
          <div className="h-1.5 rounded-full bg-[#e6e8ea]"></div>
        </div>

        {/* Title Block */}
        <div className="pt-2">
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl text-[#191c1e] font-semibold tracking-tight">
            Personalize Your Care Plan
          </h1>
          <p className="font-['Inter'] text-xs text-[#3d4947] pt-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#006947]">lock</span>
            <span>Your data is encrypted locally and compliant with HIPAA &amp; GDPR standards.</span>
          </p>
        </div>
      </div>

      {/* Trust Assurance Pill Card */}
      <div className="bg-[#f2f4f6] rounded-xl p-4 shadow-xs border border-[#eceef0]/60">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs text-[#00685f]">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-['Inter'] text-xs font-semibold text-[#191c1e]">
              Private Baseline Profiling
            </p>
            <p className="font-['Inter'] text-xs text-[#3d4947] mt-0.5 leading-relaxed">
              Biometric calibrations run directly on your chip. We never sell your biological telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Demographics & Physical Baseline Form */}
      <section className="bg-white rounded-xl p-4 shadow-xs space-y-4 border border-[#eceef0]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00685f] text-xl">monitor_weight</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#191c1e]">
              Physical Baseline
            </h2>
          </div>
          <span className="font-['Inter'] text-[11px] px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#3f465c] font-medium">
            Clinical Standard
          </span>
        </div>

        {/* Biological Sex Selection */}
        <div className="space-y-1.5">
          <label className="font-['Inter'] text-xs text-[#565e74] font-medium">
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
                      ? 'bg-[#00685f] text-white'
                      : 'bg-[#eceef0] text-[#3d4947] hover:bg-[#e0e3e5]'
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
            <label className="font-['Inter'] text-xs text-[#565e74] font-medium" htmlFor="ageInput">
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
                className="w-full h-12 bg-[#f2f4f6] rounded-lg px-3.5 pr-11 text-[#191c1e] font-['Plus_Jakarta_Sans'] font-semibold text-base focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00685f]"
              />
              <span className="absolute right-3 font-['Inter'] text-xs text-[#565e74] pointer-events-none">
                yrs
              </span>
            </div>
          </div>

          {/* Height with Unit Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-['Inter'] text-xs text-[#565e74] font-medium">Height</label>
              <div className="flex items-center space-x-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleHeightUnitToggle('cm')}
                  className={`font-semibold ${
                    profile.heightUnit === 'cm' ? 'text-[#00685f]' : 'text-[#565e74]'
                  }`}
                >
                  cm
                </button>
                <span className="text-[#bcc9c6]">•</span>
                <button
                  type="button"
                  onClick={() => handleHeightUnitToggle('ft')}
                  className={`font-semibold ${
                    profile.heightUnit === 'ft' ? 'text-[#00685f]' : 'text-[#565e74]'
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
                className="w-full h-12 bg-[#f2f4f6] rounded-lg px-3.5 pr-11 text-[#191c1e] font-['Plus_Jakarta_Sans'] font-semibold text-base focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00685f]"
              />
              <span className="absolute right-3 font-['Inter'] text-xs text-[#565e74] pointer-events-none">
                {profile.heightUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Weight & Instant Dynamic BMI Calculation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-['Inter'] text-xs text-[#565e74] font-medium">
              Current Weight
            </label>
            <div className="flex items-center space-x-1 text-xs">
              <button
                type="button"
                onClick={() => handleWeightUnitToggle('kg')}
                className={`font-semibold ${
                  profile.weightUnit === 'kg' ? 'text-[#00685f]' : 'text-[#565e74]'
                }`}
              >
                kg
              </button>
              <span className="text-[#bcc9c6]">•</span>
              <button
                type="button"
                onClick={() => handleWeightUnitToggle('lbs')}
                className={`font-semibold ${
                  profile.weightUnit === 'lbs' ? 'text-[#00685f]' : 'text-[#565e74]'
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
              className="w-full h-12 bg-[#f2f4f6] rounded-lg px-3.5 pr-11 text-[#191c1e] font-['Plus_Jakarta_Sans'] font-semibold text-base focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00685f]"
            />
            <span className="absolute right-3 font-['Inter'] text-xs text-[#565e74] pointer-events-none">
              {profile.weightUnit}
            </span>
          </div>

          {/* Realtime Biometric Feedback Chip */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f4f6] transition-colors duration-200">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#006947] text-lg">ecg_heart</span>
              <div className="flex items-baseline space-x-1">
                <span className="font-['Inter'] text-xs text-[#565e74]">Est. BMI:</span>
                <span className="font-['Plus_Jakarta_Sans'] text-base text-[#191c1e] font-bold">
                  {calculatedBmi}
                </span>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-[#00855b]/15 text-[#006947] font-['Inter'] text-xs font-semibold tracking-wide flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00855b] animate-pulse"></span>
              <span>{bmiCategory}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Health Focus & Clinical Conditions Multi-Select */}
      <section className="bg-white rounded-xl p-4 shadow-xs space-y-3 border border-[#eceef0]/60">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00685f] text-xl">vital_signs</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#191c1e]">
              Health Focus &amp; Markers
            </h2>
          </div>
          <p className="font-['Inter'] text-xs text-[#3d4947]">
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
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'bg-[#eceef0] text-[#3d4947] hover:bg-[#e0e3e5]'
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
      <section className="bg-white rounded-xl p-4 shadow-xs space-y-3 border border-[#eceef0]/60">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#00685f] text-xl">watch</span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#191c1e]">
                Wearable Telemetry
              </h2>
            </div>
            <p className="font-['Inter'] text-xs text-[#3d4947]">
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
            <div className="w-12 h-7 bg-[#eceef0] rounded-full peer peer-checked:bg-[#00685f] peer-focus:outline-none transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
          </label>
        </div>

        {/* Active Sensor Stream Micro-Panel */}
        {profile.wearableTelemetryActive && (
          <div className="rounded-xl p-3 bg-[#f2f4f6] space-y-3 transition-opacity duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006947] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006947]"></span>
                </span>
                <span className="font-['Inter'] text-xs font-semibold text-[#191c1e]">
                  Apple Health &amp; Connect Ready
                </span>
              </div>
              <span className="font-['Inter'] text-xs text-[#006947] font-medium">Read-Only</span>
            </div>

            {/* Permission Data Types Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white text-center shadow-2xs">
                <span className="material-symbols-outlined text-[#00685f] text-lg">favorite</span>
                <span className="font-['Inter'] text-xs font-semibold text-[#191c1e] mt-1">
                  Heart Rate
                </span>
                <span className="font-['Inter'] text-[11px] text-[#565e74]">Real-time</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white text-center shadow-2xs">
                <span className="material-symbols-outlined text-[#00685f] text-lg">bedtime</span>
                <span className="font-['Inter'] text-xs font-semibold text-[#191c1e] mt-1">
                  Sleep Stages
                </span>
                <span className="font-['Inter'] text-[11px] text-[#565e74]">Deep/REM</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white text-center shadow-2xs">
                <span className="material-symbols-outlined text-[#00685f] text-lg">
                  directions_run
                </span>
                <span className="font-['Inter'] text-xs font-semibold text-[#191c1e] mt-1">
                  Activity
                </span>
                <span className="font-['Inter'] text-[11px] text-[#565e74]">Cadence</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section 4: Clinical Security & Privacy Architecture */}
      <div className="bg-[#f2f4f6] rounded-xl p-4 space-y-3 border border-[#eceef0]/60">
        <div className="flex items-center space-x-2 text-[#191c1e]">
          <span className="material-symbols-outlined text-[#00685f] text-xl">
            enhanced_encryption
          </span>
          <h3 className="font-['Inter'] text-xs font-semibold">PulseHealth Vault Architecture</h3>
        </div>
        <div className="space-y-2 font-['Inter'] text-xs text-[#3d4947]">
          <div className="flex items-start space-x-2">
            <span className="material-symbols-outlined text-base text-[#006947] shrink-0 mt-0.5">
              check_circle
            </span>
            <span>
              <strong>HIPAA &amp; GDPR Compliant:</strong> Hardware-level AES-256 local encrypted sandbox.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="material-symbols-outlined text-base text-[#006947] shrink-0 mt-0.5">
              check_circle
            </span>
            <span>
              <strong>Zero-Selling Pledge:</strong> Your biometrics will never be shared with insurers or brokers.
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="material-symbols-outlined text-base text-[#006947] shrink-0 mt-0.5">
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
          className="w-full h-12 rounded-full bg-[#00685f] hover:bg-[#008378] text-white font-['Inter'] text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.99]"
          type="button"
        >
          <span>Continue to Habits Setup</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="w-full py-2.5 text-center font-['Inter'] text-xs text-[#565e74] hover:text-[#191c1e] transition-colors"
          type="button"
        >
          I will complete this later
        </button>
      </div>
    </div>
  );
};
