import api from '../apis/axios';

export const useDutyApi = {
  // 당번 수정
  update: (placeId: number, dutyId: number, data: any) =>
    api.put(`/places/${placeId}/duties/${dutyId}`, data),

  // 당번 삭제
  delete: (placeId: number, dutyId: number) =>
    api.delete(`/places/${placeId}/duties/${dutyId}`),

  //   당번 목록 조회
  list: (placeId: number) => api.get(`/places/${placeId}/duties`),

  // 당번 생성
  create: (placeId: number, data: any) =>
    api.post(`/places/${placeId}/duties`, data),

  // 당번 정보 - 멤버 이름 목록 조회
  getMembers: (placeId: number, dutyId: number) =>
    api.get(`/places/${placeId}/duties/${dutyId}/members`),

  // 당번 정보 - 멤버 추가
  addMember: (placeId: number, dutyId: number, data: any) =>
    api.put(`/places/${placeId}/duties/${dutyId}/members`, data),

  // 당번 정보 - 청소 이름 목록 조회
  getCleanings: (placeId: number, dutyId: number) =>
    api.get(`/places/${placeId}/duties/${dutyId}/cleanings`),

  // 당번 정보 - 미지정 청소 추가
  addCleaning: (placeId: number, dutyId: number, data: any) =>
    api.post(`/places/${placeId}/duties/${dutyId}/cleanings`, data),

  // 당번 역할 분담 (공통/랜덤/직접)
  assignCleaningMembers: (placeId: number, dutyId: number, data: any) =>
    api.patch(`/places/${placeId}/duties/${dutyId}/cleanings/members`, data),

  // 당번 역할 분담 - 청소 목록 조회 (상세 포함)
  getCleaningInfo: (placeId: number, dutyId: number) =>
    api.get(`/places/${placeId}/duties/${dutyId}/cleaning-info`),

  // 당번에서 청소 항목 제거
  removeCleaning: (placeId: number, dutyId: number, cleaningId: number) =>
    api.delete(`/places/${placeId}/duties/${dutyId}/cleanings/${cleaningId}`),
};

export default useDutyApi;
