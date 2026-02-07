export interface StudyRecord {
  record_id: string;
  user_id: string;
  study_date: string;
  subject: string;
  duration_minutes: number;
  start_time?: string;
  end_time?: string;
  memo: string;
  goal_id?: string;
  created_at: string;
  updated_at: string;
}

export interface StudyRecordCreate {
  study_date: string;
  subject: string;
  duration_minutes: number;
  start_time?: string;
  end_time?: string;
  memo?: string;
  goal_id?: string;
}

export interface StudyRecordUpdate {
  study_date?: string;
  subject?: string;
  duration_minutes?: number;
  start_time?: string;
  end_time?: string;
  memo?: string;
  goal_id?: string;
}

export interface StudyStatsSummary {
  total_minutes: number;
  total_records: number;
  subjects: Record<string, number>;
  daily_average_minutes: number;
  study_days: number;
}

export interface CalendarDay {
  date: string;
  total_minutes: number;
  record_count: number;
  subjects: string[];
}
