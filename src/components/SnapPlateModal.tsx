import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';

interface SnapPlateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_MEALS = [
  {
    title: 'Avocado Toast & Poached Organic Eggs',
    calories: 480,
    protein: 42,
    carbs: 58,
    fat: 14,
    split: 'On Target',
  },
  {
    title: 'Wild Salmon Bowl with Quinoa & Greens',
    calories: 560,
    protein: 48,
    carbs: 46,
    fat: 18,
    split: 'Optimal Cardio Split',
  },
  {
    title: 'Greek Yogurt Parfait with Chia & Blueberries',
    calories: 340,
    protein: 28,
    carbs: 38,
    fat: 8,
    split: 'Lean Recovery',
  },
];

export const SnapPlateModal: React.FC<SnapPlateModalProps> = ({ isOpen, onClose }) => {
  const { updateMealLog } = useHealth();
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCalories, setCustomCalories] = useState('480');

  if (!isOpen) return null;

  const handleApply = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const chosen = PRESET_MEALS[selectedMealIndex];
      updateMealLog({
        title: customTitle.trim() || chosen.title,
        calories: parseInt(customCalories, 10) || chosen.calories,
        proteinGrams: chosen.protein,
        carbsGrams: chosen.carbs,
        fatGrams: chosen.fat,
        targetSplit: chosen.split,
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1319] border border-[#1f2834] w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 text-[#f1f5f9]">
        {/* Header */}
        <div className="p-4 border-b border-[#1f2834] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00e5c9]/15 border border-[#00e5c9]/30 text-[#00e5c9] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#f1f5f9]">
                AI Plate Vision Scanner
              </h3>
              <p className="text-[11px] text-[#94a3b8]">
                Computer-vision caloric &amp; macronutrient estimation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#1a222c] flex items-center justify-center text-[#94a3b8]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Camera Simulation Viewport */}
        <div className="relative h-44 bg-[#07090c] flex flex-col items-center justify-center text-white overflow-hidden border-b border-[#1f2834]">
          <div className="absolute inset-4 border-2 border-dashed border-[#00e5c9]/70 rounded-xl flex items-center justify-center pointer-events-none">
            {isScanning ? (
              <div className="w-full h-0.5 bg-[#00e5c9] shadow-[0_0_16px_#00e5c9] animate-pulse"></div>
            ) : (
              <span className="text-[11px] text-[#00e5c9] bg-black/70 border border-[#00e5c9]/40 px-3 py-1 rounded-full font-mono">
                Center plate within framing grid
              </span>
            )}
          </div>
          <span className="material-symbols-outlined text-[44px] text-[#00e5c9] opacity-80">
            restaurant
          </span>
          <span className="text-xs text-[#94a3b8] mt-1 font-medium font-mono">
            {isScanning ? 'Analyzing spectral food density...' : 'Ready to capture'}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto no-scrollbar">
          <div>
            <label className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block mb-1.5 font-mono">
              Detected Recipe / Meal Preset
            </label>
            <div className="space-y-2">
              {PRESET_MEALS.map((meal, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedMealIndex(idx);
                    setCustomTitle(meal.title);
                    setCustomCalories(meal.calories.toString());
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    selectedMealIndex === idx
                      ? 'border-[#00e5c9] bg-[#00e5c9]/10 text-[#00e5c9] font-semibold shadow-[0_0_12px_rgba(0,229,201,0.2)]'
                      : 'border-[#1f2834] bg-[#12171e] text-[#f1f5f9] hover:bg-[#1a222c]'
                  }`}
                >
                  <div>
                    <p className="font-medium text-[#f1f5f9]">{meal.title}</p>
                    <span className="text-[11px] text-[#94a3b8] font-mono">
                      {meal.calories} kcal • {meal.protein}g Protein • {meal.carbs}g Carbs
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-semibold">
                    {meal.split}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[11px] text-[#94a3b8] font-medium block mb-1">
                Custom Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Avocado Toast"
                className="w-full text-xs h-9 px-3 bg-[#12171e] border border-[#1f2834] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#00e5c9]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#94a3b8] font-medium block mb-1 font-mono">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                className="w-full text-xs h-9 px-3 bg-[#12171e] border border-[#1f2834] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#00e5c9] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2834] bg-[#07090c] flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[#242e3a] text-[#94a3b8] font-semibold text-xs hover:bg-[#161d26]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isScanning}
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-full bg-[#00e5c9] hover:bg-[#38ef7d] text-[#07090c] font-bold text-xs shadow-md shadow-[#00e5c9]/30 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{isScanning ? 'Calculating...' : 'Save & Auto-Log'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
