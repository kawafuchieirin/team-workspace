import { useState, useEffect, useCallback } from "react";
import { goalService } from "@/services/goalService";
import type { Goal, GoalCreate, GoalUpdate } from "@/types/goal";

export function useGoals(status?: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goalService.list(status);
      setGoals(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (data: GoalCreate) => {
    const goal = await goalService.create(data);
    setGoals((prev) => [goal, ...prev]);
    return goal;
  };

  const update = async (goalId: string, data: GoalUpdate) => {
    const goal = await goalService.update(goalId, data);
    setGoals((prev) => prev.map((g) => (g.goal_id === goalId ? goal : g)));
    return goal;
  };

  const remove = async (goalId: string) => {
    await goalService.delete(goalId);
    setGoals((prev) => prev.filter((g) => g.goal_id !== goalId));
  };

  return { goals, loading, error, refetch: fetch, create, update, remove };
}
