export interface VitalsState {
  systolic: number;
  diastolic: number;
  restingHeartRate: number;
  bloodGlucose: number;
  glucoseContext: 'Fasting' | 'Post-Meal';
  spo2: number;
  respiratoryRate: number;
  hrv: number;
}

export interface HydrationState {
  currentMl: number;
  targetMl: number;
  lastAddedTimestamp?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  dueTime: string;
  status: 'pending' | 'taken' | 'snoozed';
}

export interface ActivityState {
  steps: number;
  stepsGoal: number;
  activeCalories: number;
  caloriesGoal: number;
  standHours: number;
  standGoal: number;
  overallPercentage: number;
}

export interface SleepState {
  hours: number;
  minutes: number;
  score: number;
  deepHours: number;
  coreHours: number;
  remHours: number;
}

export interface DayTrajectory {
  dayShort: string;
  dayFull: string;
  score: number;
  label?: string;
  dateStr: string;
  restingHeartRate: number;
  sleepHours: number;
  steps: number;
}

export interface MealLog {
  title: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  targetSplit: string;
  photoUrl?: string;
}

export interface WearableDevice {
  id: string;
  name: string;
  type: 'apple' | 'oura' | 'garmin' | 'whoop' | 'dexcom';
  status: string;
  lastSync: string;
  active: boolean;
  isSyncing?: boolean;
}

export interface ProfileBaseline {
  name: string;
  sex: 'female' | 'male' | 'other';
  age: number;
  heightCm: number;
  heightUnit: 'cm' | 'ft';
  weightKg: number;
  weightUnit: 'kg' | 'lbs';
  healthFocus: string[];
  wearableTelemetryActive: boolean;
  vaultEncryptionActive: boolean;
}

export interface ClinicalArticle {
  id: string;
  title: string;
  source: string;
  readTime: string;
  summary: string;
  imageUrl: string;
  fullContent: string;
  keyTakeaways: string[];
  citations: string[];
}

export interface ChatTelemetryCard {
  title: string;
  currentValue: string;
  unit: string;
  deltaText: string;
  statusBadge: string;
  svgSparklineType: 'heartRate' | 'bloodPressure' | 'recovery';
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
  telemetryCard?: ChatTelemetryCard;
}
