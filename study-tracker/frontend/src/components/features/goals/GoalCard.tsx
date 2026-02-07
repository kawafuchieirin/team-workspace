import { Link } from "react-router-dom";
import ProgressBar from "@/components/common/ProgressBar";
import Button from "@/components/common/Button";
import { formatHours } from "@/utils/format";
import type { Goal } from "@/types/goal";

interface Props {
  goal: Goal;
  onDelete?: (goalId: string) => void;
  onStatusChange?: (goalId: string, status: Goal["status"]) => void;
}

const statusLabels: Record<Goal["status"], string> = {
  active: "進行中",
  completed: "完了",
  paused: "一時停止",
  abandoned: "中止",
};

const statusColors: Record<Goal["status"], string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  paused: "bg-yellow-100 text-yellow-800",
  abandoned: "bg-gray-100 text-gray-800",
};

export default function GoalCard({ goal, onDelete, onStatusChange }: Props) {
  const progress = goal.target_hours > 0
    ? Math.min(Math.round((goal.current_hours / goal.target_hours) * 100), 100)
    : 0;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Link
            to={`/goals/${goal.goal_id}`}
            className="text-base font-semibold text-gray-900 hover:text-indigo-600"
          >
            {goal.title}
          </Link>
          {goal.subject && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {goal.subject}
            </span>
          )}
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[goal.status]}`}>
          {statusLabels[goal.status]}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{formatHours(goal.current_hours)} / {formatHours(goal.target_hours)}</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
        <ProgressBar percent={progress} />
      </div>

      {goal.target_date && (
        <p className="text-xs text-gray-500 mb-3">期日: {goal.target_date}</p>
      )}

      <div className="flex gap-2 mt-3">
        {goal.status === "active" && onStatusChange && (
          <>
            <Button size="sm" variant="secondary" onClick={() => onStatusChange(goal.goal_id, "completed")}>
              完了
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onStatusChange(goal.goal_id, "paused")}>
              一時停止
            </Button>
          </>
        )}
        {goal.status === "paused" && onStatusChange && (
          <Button size="sm" variant="secondary" onClick={() => onStatusChange(goal.goal_id, "active")}>
            再開
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="danger" onClick={() => onDelete(goal.goal_id)}>
            削除
          </Button>
        )}
      </div>
    </div>
  );
}
