import React from 'react';
import { NavTab, useHealth } from '../context/HealthContext';

interface TabItem {
  id: NavTab;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ecg_heart' },
  { id: 'track-and-log', label: 'Track & Log', icon: 'add_circle' },
  { id: 'ai-advisor', label: 'AI Advisor', icon: 'psychology' },
  { id: 'profile-and-sync', label: 'Profile & Sync', icon: 'devices_wearables' },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHealth();

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#07090c]/92 backdrop-blur-xl border-t border-[#1c242e] shadow-[0_-8px_24px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all select-none relative ${
                isActive
                  ? 'text-[#00e5c9] font-semibold'
                  : 'text-[#64748b] hover:text-[#94a3b8]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-10 h-0.5 bg-[#00e5c9] shadow-[0_0_10px_#00e5c9] rounded-full" />
              )}
              <span
                className={`material-symbols-outlined text-[24px] transition-transform ${
                  isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,229,201,0.5)]' : ''
                }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-['Inter'] text-[11px] leading-tight tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
