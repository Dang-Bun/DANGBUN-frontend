// src/hooks/useCalendarApi.ts
import api from '../apis/axios';

export const useCalendarApi = {
  // 체크리스트 완료 (매니저)
  completeChecklist: (placeId: number, checklistId: number) =>
    api.patch(`/places/${placeId}/calendar/${checklistId}/complete`),

  // 프로그레스바 조회 (이전 달, 다음 달 포함)
  getProgress: (placeId: number, params?: { year?: number; month?: number }) =>
    api.get(`/places/${placeId}/calendar`, { params }),

  // 사진 확인
  getPhotos: (placeId: number, checklistId: number) =>
    api.get(`/places/${placeId}/calendar/${checklistId}/photos`),

  // 청소 정보 확인
  getCleanings: (placeId: number, checklistId: number) =>
    api.get(`/places/${placeId}/calendar/${checklistId}/cleanings`),

  // 날짜별 체크리스트 조회
  getChecklistsByDate: (placeId: number, date: string) =>
    api.get(`/places/${placeId}/calendar/checklists`, { params: { date } }),

  // 청소 삭제 (매니저 전용)
  deleteChecklist: (placeId: number, checklistId: number) =>
    api.delete(`/places/${placeId}/calendar/${checklistId}`),
};

export default useCalendarApi;
