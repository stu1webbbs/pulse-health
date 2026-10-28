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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#eceef0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00685f]/10 text-[#00685f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#191c1e]">
                AI Plate Vision Scanner
              </h3>
              <p className="text-[11px] text-[#565e74]">
                Computer-vision caloric &amp; macronutrient estimation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eceef0] flex items-center justify-center text-[#565e74]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Camera Simulation Viewport */}
        <div className="relative h-44 bg-[#191c1e] flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-4 border-2 border-dashed border-[#6bd8cb]/70 rounded-xl flex items-center justify-center pointer-events-none">
            {isScanning ? (
              <div className="w-full h-0.5 bg-[#4edea3] shadow-[0_0_12px_#4edea3] animate-pulse"></div>
            ) : (
              <span className="text-[11px] text-[#bcc9c6] bg-black/50 px-3 py-1 rounded-full">
                Center plate within framing grid
              </span>
            )}
          </div>
          <span className="material-symbols-outlined text-[44px] text-[#6bd8cb] opacity-80">
            restaurant
          </span>
          <span className="text-xs text-white/80 mt-1 font-medium">
            {isScanning ? 'Analyzing spectral food density...' : 'Ready to capture'}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 overflow-y-auto no-scrollbar">
          <div>
            <label className="text-[11px] font-semibold text-[#565e74] uppercase tracking-wider block mb-1.5">
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
                      ? 'border-[#00685f] bg-[#00685f]/5 text-[#00685f] font-semibold'
                      : 'border-[#eceef0] bg-white text-[#191c1e] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <div>
                    <p className="font-medium">{meal.title}</p>
                    <span className="text-[11px] opacity-75 font-normal">
                      {meal.calories} kcal • {meal.protein}g Protein • {meal.carbs}g Carbs
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00855b]/10 text-[#006947] font-semibold">
                    {meal.split}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[11px] text-[#565e74] font-medium block mb-1">
                Custom Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Avocado Toast"
                className="w-full text-xs h-9 px-3 bg-[#f2f4f6] rounded-lg text-[#191c1e] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#565e74] font-medium block mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                className="w-full text-xs h-9 px-3 bg-[#f2f4f6] rounded-lg text-[#191c1e] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eceef0] bg-[#f7f9fb] flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[#bcc9c6] text-[#565e74] font-semibold text-xs hover:bg-[#eceef0]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isScanning}
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-full bg-[#00685f] hover:bg-[#008378] text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{isScanning ? 'Calculating...' : 'Save & Auto-Log'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
