import { useState } from "react";
import Button from "@/components/common/Button";
import type { GoalCreate } from "@/types/goal";

interface Props {
  onSubmit: (data: GoalCreate) => Promise<void>;
}

export default function GoalForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [targetHours, setTargetHours] = useState(10);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetHours <= 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        target_hours: targetHours,
        subject: subject.trim(),
        description,
        target_date: targetDate || undefined,
      });
      setTitle("");
      setTargetHours(10);
      setSubject("");
      setDescription("");
      setTargetDate("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">目標タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: Python基礎を習得する"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">目標時間</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <span className="text-sm text-gray-500">時間</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">科目</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="例: Python"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">目標期日</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="目標の詳細"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <Button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? "作成中..." : "目標を作成"}
      </Button>
    </form>
  );
}
