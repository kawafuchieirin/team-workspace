import Card from "@/components/common/Card";
import GoalForm from "@/components/features/goals/GoalForm";
import GoalList from "@/components/features/goals/GoalList";
import { useGoals } from "@/hooks/useGoals";

export default function GoalsPage() {
  const { goals, loading, create, update, remove } = useGoals();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">目標管理</h1>

      <Card title="新しい目標を設定">
        <GoalForm onSubmit={async (data) => { await create(data); }} />
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">目標一覧</h2>
        <GoalList
          goals={goals}
          loading={loading}
          onDelete={remove}
          onStatusChange={(goalId, status) => update(goalId, { status })}
        />
      </div>
    </div>
  );
}
