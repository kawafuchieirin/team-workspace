import { api } from "./api";
import type {
  StudyRecord,
  StudyRecordCreate,
  StudyRecordUpdate,
  StudyStatsSummary,
  CalendarDay,
} from "@/types/study";

const BASE = "/records";

export const studyService = {
  list(params?: { date_from?: string; date_to?: string; subject?: string }) {
    const query = new URLSearchParams();
    if (params?.date_from) query.set("date_from", params.date_from);
    if (params?.date_to) query.set("date_to", params.date_to);
    if (params?.subject) query.set("subject", params.subject);
    const qs = query.toString();
    return api.get<StudyRecord[]>(`${BASE}/${qs ? `?${qs}` : ""}`);
  },

  get(recordId: string) {
    return api.get<StudyRecord>(`${BASE}/${recordId}`);
  },

  create(data: StudyRecordCreate) {
    return api.post<StudyRecord>(`${BASE}/`, data);
  },

  update(recordId: string, data: StudyRecordUpdate) {
    return api.put<StudyRecord>(`${BASE}/${recordId}`, data);
  },

  delete(recordId: string) {
    return api.delete(`${BASE}/${recordId}`);
  },

  getStatsSummary(dateFrom: string, dateTo: string) {
    return api.get<StudyStatsSummary>(
      `${BASE}/stats/summary?date_from=${dateFrom}&date_to=${dateTo}`
    );
  },

  getCalendarData(year: number, month: number) {
    return api.get<CalendarDay[]>(
      `${BASE}/stats/calendar?year=${year}&month=${month}`
    );
  },
};
