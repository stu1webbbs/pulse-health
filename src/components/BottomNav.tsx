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
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#f7f9fb]/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(15,23,42,0.05)] border-t border-[#eceef0]/60">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-colors select-none ${
                isActive
                  ? 'text-[#00685f] font-semibold'
                  : 'text-[#565e74] hover:text-[#00685f]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-['Inter'] text-[11px] leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
