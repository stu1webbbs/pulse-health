import {
  ActivityState,
  ClinicalArticle,
  DayTrajectory,
  HydrationState,
  MealLog,
  Medication,
  ProfileBaseline,
  SleepState,
  VitalsState,
  WearableDevice,
  ChatMessage
} from '../types/health';

export const initialVitals: VitalsState = {
  systolic: 118,
  diastolic: 76,
  restingHeartRate: 68,
  bloodGlucose: 94,
  glucoseContext: 'Fasting',
  spo2: 99,
  respiratoryRate: 14,
  hrv: 58,
};

export const initialHydration: HydrationState = {
  currentMl: 1800,
  targetMl: 2500,
};

export const initialMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Vitamin D3 (2000 IU) & Omega-3 Softgel',
    dosage: '1 capsule with breakfast',
    dueTime: 'in 30 mins',
    status: 'pending',
  },
];

export const initialActivity: ActivityState = {
  steps: 8432,
  stepsGoal: 10000,
  activeCalories: 480,
  caloriesGoal: 600,
  standHours: 10,
  standGoal: 12,
  overallPercentage: 84,
};

export const initialSleep: SleepState = {
  hours: 8,
  minutes: 12,
  score: 88,
  deepHours: 1.8,
  coreHours: 4.5,
  remHours: 2.1,
};

export const weeklyTrajectory: DayTrajectory[] = [
  { dayShort: 'M', dayFull: 'Monday', score: 82, dateStr: 'Oct 20', restingHeartRate: 70, sleepHours: 7.5, steps: 8120 },
  { dayShort: 'T', dayFull: 'Tuesday', score: 84, dateStr: 'Oct 21', restingHeartRate: 69, sleepHours: 7.8, steps: 9400 },
  { dayShort: 'W', dayFull: 'Wednesday', score: 79, dateStr: 'Oct 22', restingHeartRate: 72, sleepHours: 6.9, steps: 7850 },
  { dayShort: 'T', dayFull: 'Thursday', score: 88, dateStr: 'Oct 23', restingHeartRate: 67, sleepHours: 8.0, steps: 10250 },
  { dayShort: 'F', dayFull: 'Friday', score: 91, dateStr: 'Oct 24', restingHeartRate: 66, sleepHours: 8.2, steps: 9800 },
  { dayShort: 'S', dayFull: 'Saturday', score: 86, dateStr: 'Oct 25', restingHeartRate: 68, sleepHours: 8.0, steps: 8700 },
  { dayShort: 'Sun', dayFull: 'Sunday', score: 94, label: 'Peak: 94 pts', dateStr: 'Oct 26', restingHeartRate: 64, sleepHours: 8.2, steps: 8432 },
];

export const initialMealLog: MealLog = {
  title: 'Breakfast',
  calories: 480,
  proteinGrams: 42,
  carbsGrams: 58,
  fatGrams: 14,
  targetSplit: 'On Target',
};

export const initialWearables: WearableDevice[] = [
  {
    id: 'apple-watch',
    name: 'Apple HealthKit',
    type: 'apple',
    status: 'Continuous feed',
    lastSync: 'Synced 2m ago',
    active: true,
  },
  {
    id: 'oura-ring',
    name: 'Oura Horizon Gen 3',
    type: 'oura',
    status: 'Sleep & Readiness standby',
    lastSync: 'Ready to sync',
    active: true,
  },
  {
    id: 'dexcom-g7',
    name: 'Dexcom Continuous Glucose',
    type: 'dexcom',
    status: 'Interstitial fluid sensor',
    lastSync: 'Live streaming',
    active: false,
  },
];

export const initialProfile: ProfileBaseline = {
  name: 'Alex Jordan',
  sex: 'female',
  age: 32,
  heightCm: 174,
  heightUnit: 'cm',
  weightKg: 68.0,
  weightUnit: 'kg',
  healthFocus: ['Better Sleep', 'Cardio Fitness', 'Stress Reduction'],
  wearableTelemetryActive: true,
  vaultEncryptionActive: true,
};

export const clinicalArticles: ClinicalArticle[] = [
  {
    id: 'circadian-rhythm',
    title: 'Understanding Circadian Rhythm & Sleep Latency',
    source: 'Mayo Clinic / NIH Ref',
    readTime: '3 min read',
    summary: 'How sleep windows influence autonomic recovery and parasympathetic heart rates.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKVHJwvikpzKQm_1TtPOJZDwr6wnivlEJumkTYJJSEoMlxaabu9TXPrSr7qbJWCDLTpMfK5ZbrZpcxAq46sJ1Q1oOsbzP2NtGwm1dprYTZka1jQSx80eHxQBXuwwJBQHdHde8S5gWak8TPDcb9aATCzWgugyWuQ415qXTaOjg4SbajLmTrRQD2g9ROiqnMrwXYkceLHGn0DL9WDhR_N3QjWDsoHpXAORkuR4RDP80hrZ7bL-xG6lpcfg',
    fullContent: `Circadian rhythms are biological 24-hour oscillations regulated by the suprachiasmatic nucleus (SCN) in the hypothalamus. When sleep onset latency is kept under 20 minutes through consistent sleep-wake scheduling, the autonomic nervous system shifts effectively into vagal dominance during slow-wave sleep (N3 stage).\n\nKey physiological markers tracked by PulseHealth demonstrate that every 30-minute delay in your regular bedtime leads to an average 4-6 bpm elevation in nocturnal resting pulse. Maintaining consistency stabilizes nocturnal melatonin secretion and accelerates cellular muscular recovery.`,
    keyTakeaways: [
      'Maintain a consistent bed and wake window within ±30 minutes even on weekends.',
      'Dim ambient blue light exposure 90 minutes before sleep to trigger endogenous melatonin.',
      'Deep sleep (N3) correlates directly with systemic growth hormone release and cardiac restoration.',
    ],
    citations: [
      'National Center for Biotechnology Information (NCBI) PMC6751071',
      'Mayo Clinic Proceedings on Circadian Biology & Cardiovascular Health',
      'American Academy of Sleep Medicine (AASM) Clinical Practice Guidelines',
    ],
  },
  {
    id: 'electrolytes-hydration',
    title: 'Electrolytes vs Pure Water in Hydration',
    source: 'Biochemical Wellness',
    readTime: '2 min read',
    summary: 'Sodium-potassium ratio impact on cellular plasma volume and cardiac strain.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD44poFvi6F8nZbMd7isxrZglWY45KGiLiBJKyNjoGyM8azon0spxW7-9xFULu7pq5G5EMbeDBmngudsobrmFzBf0yJYxzqwZhU3qkLTHtahOZu8YKn8ro81Vmi4BnbWMF6qWmB-py0tU-Bk5-IPnb1VWDq9eIwVFB27_YUCqRph8eoX4Fhsx7LgGn04yULShq3U7qzkR5_Xp21_RbZNjJx785pnVCWjl4EH02wErhHfx_KRf78RCSHQg',
    fullContent: `Overhydration with plain demineralized water can dilute serum sodium, causing exercise-associated hyponatremia and osmotic shifts. Osmolality balance is governed by the sodium-potassium ATPase pump in vascular walls.\n\nAdding micro-traces of sea salt (sodium chloride), magnesium glycinate, and potassium citrate maintains intravascular volume without raising systemic vascular resistance. This optimizes stroke volume, allowing the heart to circulate oxygenated blood at a lower resting pulse.`,
    keyTakeaways: [
      'Pair every 1,000 ml of plain water with 250-350mg elemental sodium during active periods.',
      'Potassium and magnesium act as natural vasodilators supporting healthy arterial compliance.',
      'Monitor urine specific gravity: pale straw color indicates cellular equilibrium.',
    ],
    citations: [
      'Journal of the American College of Cardiology (JACC) Fluid & Electrolyte Dynamics',
      'European Society of Cardiology (ESC) Guidelines on Hydration & Hemodynamics',
    ],
  },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    text: "Hello Alex. I've correlated your continuous biometric telemetry with this week's activity logs. How can I assist your health and recovery journey today?",
    timestamp: '09:15 AM',
  },
  {
    id: 'msg-2',
    role: 'user',
    text: 'My resting heart rate averaged 64 bpm this week, down from 71 last month. Is this a good sign?',
    timestamp: '09:17 AM',
  },
  {
    id: 'msg-3',
    role: 'assistant',
    text: 'That is a positive indicator! A lowering resting heart rate generally reflects improved cardiovascular efficiency and cardiovascular endurance, especially paired with your consistent 8,500 daily steps. Your HRV has also remained stable at 58ms.',
    timestamp: '09:18 AM',
    telemetryCard: {
      title: 'Resting Heart Rate',
      currentValue: '64',
      unit: 'BPM',
      deltaText: '-7 bpm',
      statusBadge: 'Optimal',
      svgSparklineType: 'heartRate',
    },
  },
];
