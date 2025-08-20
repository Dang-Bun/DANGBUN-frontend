// src/hooks/useCleaningApi.ts
import api from '../apis/axios';

type Id = number;

// (백엔드 스키마에 맞춰 필드명만 맞추면 됩니다. needPhto -> needPhoto 로 교정)
export type CreateCleaningPayload = {
  cleaningName: string;
  dutyName: string; // 어떤 당번에 속하는 청소인지
  dutyId: number;
  members: string[]; // 참여 멤버 id 배열 (필요 시)
  needPhoto: boolean; // 사진 필요 여부
  repeatType: 'NONE' | 'WEEKLY' | 'MONTHLY' | string;
  repeatDays?: string[]; // 반복 요일 등
  detailDates?: string[]; // 특정 일자
};

export type UpdateCleaningPayload = Partial<CreateCleaningPayload>;

export const useCleaningApi = {
  /** 선택 멤버가 참여 중인 청소의 '당번' 목록 조회 */
  getCleaningsDuties: (placeId: number, memberIds: number[]) =>
    api.get(`/places/${placeId}/cleanings/duties`, {
      params: {
        // 👉  [8,9]  ->  "8,9"
        memberIds: memberIds.join(','),
      },
    }),

  /** 미지정(어느 당번에도 속하지 않은) 청소 목록 조회 */
  getUnassignedCleanings: (placeId: Id) =>
    api.get(`/places/${placeId}/cleanings/unassigned`),

  /** 특정 당번에서, 선택 멤버들이 참여 중인 청소 목록 조회 */
  filterCleaningsByMembers: (
    placeId: number,
    dutyId: number,
    memberIds: number[]
  ) => {
    return api.get(
      `/places/${placeId}/duties/${dutyId}/cleanings/filter-by-members`,
      {
        params: {
          memberIds: memberIds.join(','), // 👉 "12,7"
        },
      }
    );
  },

  /** 당번별 청소 생성 */
  createCleaning: (placeId: Id, data: UpdateCleaningPayload) =>
    api.post(`/places/${placeId}/cleanings`, data),

  /** 당번별 청소 수정 */
  updateCleaning: (placeId: Id, cleaningId: Id, data: UpdateCleaningPayload) =>
    api.put(`/places/${placeId}/cleanings/${cleaningId}`, data),

  /** 청소 삭제 */
  deleteCleaning: (placeId: Id, cleaningId: Id) =>
    api.delete(`/places/${placeId}/cleanings/${cleaningId}`),
};

export default useCleaningApi;
