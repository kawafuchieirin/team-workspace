import { api } from "./api";
import type { Goal, GoalCreate, GoalUpdate, GoalProgress } from "@/types/goal";

const BASE = "/goals";

export const goalService = {
  list(status?: string) {
    const qs = status ? `?status=${status}` : "";
    return api.get<Goal[]>(`${BASE}/${qs}`);
  },

  get(goalId: string) {
    return api.get<Goal>(`${BASE}/${goalId}`);
  },

  create(data: GoalCreate) {
    return api.post<Goal>(`${BASE}/`, data);
  },

  update(goalId: string, data: GoalUpdate) {
    return api.put<Goal>(`${BASE}/${goalId}`, data);
  },

  delete(goalId: string) {
    return api.delete(`${BASE}/${goalId}`);
  },

  getProgress(goalId: string) {
    return api.get<GoalProgress>(`${BASE}/${goalId}/progress`);
  },
};
