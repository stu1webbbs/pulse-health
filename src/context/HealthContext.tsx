import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  ActivityState,
  ChatMessage,
  DayTrajectory,
  HydrationState,
  MealLog,
  Medication,
  ProfileBaseline,
  SleepState,
  VitalsState,
  WearableDevice,
} from '../types/health';
import {
  initialActivity,
  initialChatMessages,
  initialHydration,
  initialMealLog,
  initialMedications,
  initialProfile,
  initialSleep,
  initialVitals,
  initialWearables,
  weeklyTrajectory,
} from '../data/mockData';

export type NavTab = 'dashboard' | 'track-and-log' | 'ai-advisor' | 'profile-and-sync';

interface HealthContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  vitals: VitalsState;
  adjustBP: (metric: 'sys' | 'dia', delta: number) => void;
  setGlucose: (val: number, context?: 'Fasting' | 'Post-Meal') => void;
  setHeartRate: (val: number) => void;
  hydration: HydrationState;
  addWater: (amountMl: number) => void;
  medications: Medication[];
  takeMedication: (id: string) => void;
  snoozeMedication: (id: string) => void;
  activity: ActivityState;
  sleep: SleepState;
  trajectory: DayTrajectory[];
  selectedDayId: string;
  setSelectedDayId: (id: string) => void;
  selectedDayShort: string;
  setSelectedDayShort: (day: string) => void;
  mealLog: MealLog;
  updateMealLog: (meal: Partial<MealLog>) => void;
  wearables: WearableDevice[];
  syncWearable: (id: string) => Promise<void>;
  profile: ProfileBaseline;
  updateProfile: (updates: Partial<ProfileBaseline>) => void;
  toggleHealthFocus: (focus: string) => void;
  calculatedBmi: number;
  bmiCategory: string;
  chatMessages: ChatMessage[];
  isAiTyping: boolean;
  sendChatMessage: (content: string) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
  markNotificationsAsRead: () => void;
  isLiveStreaming: boolean;
  setIsLiveStreaming: (live: boolean) => void;
  secondsSinceSync: number;
  triggerLivePulse: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [vitals, setVitals] = useState<VitalsState>(initialVitals);
  const [hydration, setHydration] = useState<HydrationState>(initialHydration);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [activity, setActivity] = useState<ActivityState>(initialActivity);
  const [sleep] = useState<SleepState>(initialSleep);
  const [trajectory] = useState<DayTrajectory[]>(weeklyTrajectory);
  const [selectedDayId, setSelectedDayId] = useState<string>('day-sun');
  const [selectedDayShort, setSelectedDayShort] = useState<string>('Sun');
  const [mealLog, setMealLog] = useState<MealLog>(initialMealLog);
  const [wearables, setWearables] = useState<WearableDevice[]>(initialWearables);
  const [profile, setProfile] = useState<ProfileBaseline>(initialProfile);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [secondsSinceSync, setSecondsSinceSync] = useState<number>(2);

  // Live Continuous Telemetry Simulation (dynamic changing biometric numbers)
  React.useEffect(() => {
    if (!isLiveStreaming) return;

    // Second-by-second sync timer
    const timerInterval = setInterval(() => {
      setSecondsSinceSync((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 1000);

    // Dynamic biometric fluctuation ticker (simulating real PPG sensor feed)
    const telemetryInterval = setInterval(() => {
      // 1. Subtle resting pulse variation (natural sinus rhythm: 63 - 67 bpm)
      const hrFluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
      setVitals((prev) => {
        const nextHr = Math.max(58, Math.min(84, 65 + hrFluctuation));
        // Subtle micro-variance in arterial pressure
        const sysVariance = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const diaVariance = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return {
          ...prev,
          restingHeartRate: nextHr,
          systolic: Math.max(105, Math.min(130, 118 + sysVariance)),
          diastolic: Math.max(68, Math.min(84, 76 + diaVariance)),
        };
      });

      // 2. Incremental steps cadence
      if (Math.random() > 0.3) {
        setActivity((prev) => {
          const addedSteps = Math.floor(Math.random() * 3) + 1; // 1-3 steps
          const newSteps = prev.steps + addedSteps;
          const newCals = newSteps % 18 === 0 ? prev.activeCalories + 1 : prev.activeCalories;
          return {
            ...prev,
            steps: newSteps,
            activeCalories: newCals,
            overallPercentage: Math.min(100, Math.round((newSteps / prev.stepsGoal) * 100)),
          };
        });
      }

      setSecondsSinceSync(0);
    }, 3200);

    return () => {
      clearInterval(timerInterval);
      clearInterval(telemetryInterval);
    };
  }, [isLiveStreaming]);

  const triggerLivePulse = () => {
    const pulseDelta = Math.floor(Math.random() * 6) + 62;
    setVitals((prev) => ({
      ...prev,
      restingHeartRate: pulseDelta,
    }));
    setActivity((prev) => ({
      ...prev,
      steps: prev.steps + 5,
      activeCalories: prev.activeCalories + 1,
    }));
    setSecondsSinceSync(0);
    showToast(`Live sensor synced: Resting Pulse calibrated to ${pulseDelta} BPM`);
  };

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Medication due: Vitamin D3 & Omega-3 Softgel', time: '10m ago', read: false },
    { id: '2', title: 'Hydration goal is 72% completed for today', time: '25m ago', read: false },
    { id: '3', title: 'Resting pulse reached optimum 64 BPM', time: '1h ago', read: true },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const adjustBP = (metric: 'sys' | 'dia', delta: number) => {
    setVitals((prev) => {
      if (metric === 'sys') {
        const nextSys = Math.max(70, Math.min(220, prev.systolic + delta));
        return { ...prev, systolic: nextSys };
      } else {
        const nextDia = Math.max(40, Math.min(140, prev.diastolic + delta));
        return { ...prev, diastolic: nextDia };
      }
    });
  };

  const setGlucose = (val: number, context?: 'Fasting' | 'Post-Meal') => {
    setVitals((prev) => ({
      ...prev,
      bloodGlucose: val,
      glucoseContext: context || prev.glucoseContext,
    }));
  };

  const setHeartRate = (val: number) => {
    setVitals((prev) => ({ ...prev, restingHeartRate: val }));
  };

  const addWater = (amountMl: number) => {
    setHydration((prev) => {
      const nextVal = Math.min(4500, prev.currentMl + amountMl);
      return {
        ...prev,
        currentMl: nextVal,
        lastAddedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    });
    showToast(`Added +${amountMl} ml to hydration log`);
  };

  const takeMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'taken' as const } : m))
    );
    showToast('Medication logged as taken');
  };

  const snoozeMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'snoozed' as const, dueTime: 'in 15 mins' } : m))
    );
    showToast('Medication snoozed for 15 minutes');
  };

  const updateMealLog = (meal: Partial<MealLog>) => {
    setMealLog((prev) => ({ ...prev, ...meal }));
    showToast('Nutrition logged successfully');
  };

  const syncWearable = async (id: string) => {
    setWearables((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isSyncing: true } : d))
    );

    await new Promise((res) => setTimeout(res, 900));

    setWearables((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              isSyncing: false,
              lastSync: 'Synced just now',
              status: 'Continuous feed active',
            }
          : d
      )
    );
    showToast('Wearable biometric telemetry synced!');
  };

  const updateProfile = (updates: Partial<ProfileBaseline>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleHealthFocus = (focus: string) => {
    setProfile((prev) => {
      const exists = prev.healthFocus.includes(focus);
      const updated = exists
        ? prev.healthFocus.filter((f) => f !== focus)
        : [...prev.healthFocus, focus];
      return { ...prev, healthFocus: updated };
    });
  };

  // Dynamic BMI Calculation
  const hMeters =
    profile.heightUnit === 'cm'
      ? profile.heightCm / 100
      : profile.heightCm * 0.3048;
  const wKg =
    profile.weightUnit === 'kg'
      ? profile.weightKg
      : profile.weightKg * 0.453592;
  const calculatedBmi =
    hMeters > 0.5 && wKg > 20
      ? parseFloat((wKg / (hMeters * hMeters)).toFixed(1))
      : 22.5;

  let bmiCategory = 'Healthy range';
  if (calculatedBmi < 18.5) bmiCategory = 'Underweight range';
  else if (calculatedBmi <= 24.9) bmiCategory = 'Healthy range';
  else if (calculatedBmi <= 29.9) bmiCategory = 'Overweight range';
  else bmiCategory = 'Clinical review';

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sendChatMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      // Send to server-side endpoint if available
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          vitals,
          hydration,
          activity,
          sleep,
          profile,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.text || 'I have analyzed your biometric metrics against standard clinical guidelines.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          telemetryCard: data.telemetryCard,
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Fallback to local intelligence');
      }
    } catch {
      // Local clinical clinical reasoning engine based on actual telemetry
      await new Promise((res) => setTimeout(res, 600));

      const lower = content.toLowerCase();
      let replyText = '';
      let card: ChatMessage['telemetryCard'] = undefined;

      if (lower.includes('heart rate') || lower.includes('resting') || lower.includes('bpm')) {
        replyText = `Your current resting pulse is ${vitals.restingHeartRate} BPM, which falls well within the AHA optimal bradycardic/healthy athletic threshold (60-80 BPM). Your 7-day average exhibits an upward stability trend of +6.4% in autonomic efficiency.`;
        card = {
          title: 'Resting Heart Rate',
          currentValue: `${vitals.restingHeartRate}`,
          unit: 'BPM',
          deltaText: '-7 bpm',
          statusBadge: 'Optimal',
          svgSparklineType: 'heartRate',
        };
      } else if (lower.includes('blood pressure') || lower.includes('pressure') || lower.includes('hypertension')) {
        const isOptimal = vitals.systolic < 120 && vitals.diastolic < 80;
        replyText = `Your recorded blood pressure is ${vitals.systolic}/${vitals.diastolic} mmHg. According to ACC/AHA guidelines, this is classified as ${
          isOptimal ? 'Optimal Normal' : vitals.systolic <= 129 ? 'Elevated' : 'Stage 1 Hypertension'
        }. Arterial circulatory load is within recommended limits.`;
        card = {
          title: 'Blood Pressure',
          currentValue: `${vitals.systolic}/${vitals.diastolic}`,
          unit: 'mmHg',
          deltaText: isOptimal ? 'Optimal' : 'Monitored',
          statusBadge: isOptimal ? 'Optimal' : 'Elevated',
          svgSparklineType: 'bloodPressure',
        };
      } else if (lower.includes('water') || lower.includes('hydration') || lower.includes('drink')) {
        const pct = Math.round((hydration.currentMl / hydration.targetMl) * 100);
        replyText = `You have logged ${hydration.currentMl} ml of water out of your ${hydration.targetMl} ml goal (${pct}%). Reaching your target supports plasma volume preservation and lowers cardiac workload during evening recovery.`;
      } else if (lower.includes('sleep') || lower.includes('deep sleep') || lower.includes('rem')) {
        replyText = `Last night you logged ${sleep.hours}h ${sleep.minutes}m with a Sleep Score of ${sleep.score}/100. Your deep restorative sleep was ${sleep.deepHours}h (approx 20%), which aligns with target slow-wave sleep requirements for autonomic renewal.`;
      } else if (lower.includes('sodium') || lower.includes('diet') || lower.includes('meal') || lower.includes('dinner')) {
        replyText = `For cardiovascular health and maintaining arterial flexibility, consider wild salmon or steamed cod with lemon-dill, paired with steamed asparagus and roasted sweet potato. Herbs like garlic, rosemary, and oregano provide rich flavor without excess sodium.`;
      } else {
        replyText = `I have correlated your continuous telemetry with your ${activity.steps.toLocaleString()} daily steps and current resting pulse of ${vitals.restingHeartRate} BPM. Your physiological markers demonstrate balanced autonomic regulation and cellular recovery. Remember to log your evening hydration.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        telemetryCard: card,
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <HealthContext.Provider
      value={{
        activeTab,
        setActiveTab,
        vitals,
        adjustBP,
        setGlucose,
        setHeartRate,
        hydration,
        addWater,
        medications,
        takeMedication,
        snoozeMedication,
        activity,
        sleep,
        trajectory,
        selectedDayId,
        setSelectedDayId,
        selectedDayShort,
        setSelectedDayShort,
        mealLog,
        updateMealLog,
        wearables,
        syncWearable,
        profile,
        updateProfile,
        toggleHealthFocus,
        calculatedBmi,
        bmiCategory,
        chatMessages,
        isAiTyping,
        sendChatMessage,
        toastMessage,
        showToast,
        notificationsOpen,
        setNotificationsOpen,
        notifications,
        markNotificationsAsRead,
        isLiveStreaming,
        setIsLiveStreaming,
        secondsSinceSync,
        triggerLivePulse,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
