import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "@/components/common/Card";
import ProgressBar from "@/components/common/ProgressBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import StudyRecordList from "@/components/features/study/StudyRecordList";
import { goalService } from "@/services/goalService";
import { studyService } from "@/services/studyService";
import { formatHours } from "@/utils/format";
import type { GoalProgress } from "@/types/goal";
import type { StudyRecord } from "@/types/study";

export default function GoalDetailPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const [progress, setProgress] = useState<GoalProgress | null>(null);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!goalId) return;

    Promise.all([
      goalService.getProgress(goalId),
      studyService.list(),
    ]).then(([prog, allRecords]) => {
      setProgress(prog);
      setRecords(allRecords.filter((r) => r.goal_id === goalId));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [goalId]);

  if (loading) return <LoadingSpinner />;
  if (!progress) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">目標が見つかりません。</p>
        <Link to="/goals" className="text-indigo-600 hover:underline mt-2 inline-block">
          目標一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/goals" className="text-indigo-600 hover:underline text-sm">
          &larr; 目標一覧
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{progress.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500">進捗率</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{progress.progress_percent}%</p>
          <ProgressBar percent={progress.progress_percent} className="mt-2" />
        </Card>
        <Card>
          <p className="text-sm text-gray-500">学習時間</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatHours(progress.current_hours)} / {formatHours(progress.target_hours)}
          </p>
          <p className="text-sm text-gray-500 mt-1">残り {formatHours(progress.remaining_hours)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">学習記録数</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{progress.records_count}件</p>
        </Card>
      </div>

      <Card title="関連する学習記録">
        <StudyRecordList records={records} loading={false} />
      </Card>
    </div>
  );
}
