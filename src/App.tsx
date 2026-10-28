/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { DashboardView } from './views/DashboardView';
import { TrackAndLogView } from './views/TrackAndLogView';
import { AiAdvisorView } from './views/AiAdvisorView';
import { ProfileCarePlanView } from './views/ProfileCarePlanView';

const MainScreen: React.FC = () => {
  const { activeTab } = useHealth();

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-['Inter']">
      <Header />
      <Toast />
      <main className="flex-1 w-full max-w-lg mx-auto pt-16 flex flex-col relative min-h-screen">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'track-and-log' && <TrackAndLogView />}
        {activeTab === 'ai-advisor' && <AiAdvisorView />}
        {activeTab === 'profile-and-sync' && <ProfileCarePlanView />}
      </main>
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <MainScreen />
    </HealthProvider>
  );
}
