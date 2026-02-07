export interface Goal {
  goal_id: string;
  user_id: string;
  title: string;
  description: string;
  target_hours: number;
  current_hours: number;
  status: "active" | "completed" | "paused" | "abandoned";
  target_date?: string;
  subject: string;
  created_at: string;
  updated_at: string;
}

export interface GoalCreate {
  title: string;
  description?: string;
  target_hours: number;
  target_date?: string;
  subject?: string;
}

export interface GoalUpdate {
  title?: string;
  description?: string;
  target_hours?: number;
  status?: Goal["status"];
  target_date?: string;
  subject?: string;
}

export interface GoalProgress {
  goal_id: string;
  title: string;
  target_hours: number;
  current_hours: number;
  progress_percent: number;
  remaining_hours: number;
  status: string;
  records_count: number;
}
