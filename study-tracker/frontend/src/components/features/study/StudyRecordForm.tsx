import { useState } from "react";
import Button from "@/components/common/Button";
import type { StudyRecordCreate } from "@/types/study";
import type { Goal } from "@/types/goal";

interface Props {
  onSubmit: (data: StudyRecordCreate) => Promise<void>;
  goals?: Goal[];
}

export default function StudyRecordForm({ onSubmit, goals = [] }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [studyDate, setStudyDate] = useState(today);
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [memo, setMemo] = useState("");
  const [goalId, setGoalId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const durationMinutes = hours * 60 + minutes;
    if (!subject.trim() || durationMinutes <= 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        study_date: studyDate,
        subject: subject.trim(),
        duration_minutes: durationMinutes,
        memo,
        goal_id: goalId || undefined,
      });
      setSubject("");
      setHours(0);
      setMinutes(30);
      setMemo("");
      setGoalId("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
          <input
            type="date"
            value={studyDate}
            onChange={(e) => setStudyDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">科目</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="例: Python, 数学"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">学習時間</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={23}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-500">時間</span>
          <input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-500">分</span>
        </div>
      </div>

      {goals.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">紐づける目標</label>
          <select
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">なし</option>
            {goals.map((g) => (
              <option key={g.goal_id} value={g.goal_id}>{g.title}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="学習内容や振り返りなど"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <Button type="submit" disabled={submitting || !subject.trim()}>
        {submitting ? "記録中..." : "記録する"}
      </Button>
    </form>
  );
}
