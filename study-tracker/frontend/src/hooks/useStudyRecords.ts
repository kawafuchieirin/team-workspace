import { useState, useEffect, useCallback } from "react";
import { studyService } from "@/services/studyService";
import type { StudyRecord, StudyRecordCreate, StudyRecordUpdate } from "@/types/study";

export function useStudyRecords(params?: {
  date_from?: string;
  date_to?: string;
  subject?: string;
}) {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studyService.list(params);
      setRecords(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [params?.date_from, params?.date_to, params?.subject]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (data: StudyRecordCreate) => {
    const record = await studyService.create(data);
    setRecords((prev) => [record, ...prev]);
    return record;
  };

  const update = async (recordId: string, data: StudyRecordUpdate) => {
    const record = await studyService.update(recordId, data);
    setRecords((prev) => prev.map((r) => (r.record_id === recordId ? record : r)));
    return record;
  };

  const remove = async (recordId: string) => {
    await studyService.delete(recordId);
    setRecords((prev) => prev.filter((r) => r.record_id !== recordId));
  };

  return { records, loading, error, refetch: fetch, create, update, remove };
}
