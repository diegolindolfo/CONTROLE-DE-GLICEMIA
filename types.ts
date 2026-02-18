export enum MealTime {
  FASTING = 'Jejum',
  PRE_MEAL = 'Pré-Refeição',
  POST_MEAL = 'Pós-Refeição',
  BEDTIME = 'Ao Dormir',
  OTHER = 'Outro'
}

export interface GlucoseLog {
  id: string;
  value: number; // mg/dL
  timestamp: number;
  mealTime: MealTime;
  notes?: string;
}

export type ViewState = 'dashboard' | 'add' | 'history';

export interface DailyStat {
  date: string;
  avg: number;
  min: number;
  max: number;
  count: number;
}