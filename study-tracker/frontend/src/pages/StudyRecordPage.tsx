import { useState, useEffect } from "react";
import Card from "@/components/common/Card";
import StudyRecordForm from "@/components/features/study/StudyRecordForm";
import StudyRecordList from "@/components/features/study/StudyRecordList";
import { useStudyRecords } from "@/hooks/useStudyRecords";
import { goalService } from "@/services/goalService";
import type { Goal } from "@/types/goal";

export default function StudyRecordPage() {
  const { records, loading, create, remove } = useStudyRecords();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    goalService.list("active").then(setGoals).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">学習記録</h1>

      <Card title="新しい記録を追加">
        <StudyRecordForm
          onSubmit={async (data) => { await create(data); }}
          goals={goals}
        />
      </Card>

      <Card title="記録一覧">
        <StudyRecordList records={records} loading={loading} onDelete={remove} />
      </Card>
    </div>
  );
}
