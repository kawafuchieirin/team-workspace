import GoalCard from "./GoalCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { Goal } from "@/types/goal";

interface Props {
  goals: Goal[];
  loading: boolean;
  onDelete?: (goalId: string) => void;
  onStatusChange?: (goalId: string, status: Goal["status"]) => void;
}

export default function GoalList({ goals, loading, onDelete, onStatusChange }: Props) {
  if (loading) return <LoadingSpinner />;

  if (goals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        目標がありません。新しい目標を設定しましょう！
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {goals.map((goal) => (
        <GoalCard
          key={goal.goal_id}
          goal={goal}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
