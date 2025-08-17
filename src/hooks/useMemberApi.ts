import api from '../apis/axios';

export const useMemberApi = {
  // 멤버 수락
  accept: (placeId, memberId) =>
    api.post(`/places/${placeId}/members/${memberId}/accept`),

  // 멤버 목록 조회
  list: (placeId) => api.get(`/places/${placeId}/members`),

  // 멤버 정보 조회
  get: (placeId, memberId) => api.get(`/places/${placeId}/members/${memberId}`),

  // 멤버 추방
  expel: (placeId, memberId) =>
    api.delete(`/places/${placeId}/members/${memberId}`),

  // 대기 멤버 목록 조회
  listWaiting: (placeId) => api.get(`/places/${placeId}/members/waiting`),

  // 멤버 검색 (q 필수 가정)
  search: (placeId) => api.get(`/places/${placeId}/members/search`),

  // 내 멤버 정보 조회(멤버)
  me: (placeId) => api.get(`/places/${placeId}/members/me`),

  // 플레이스 나가기(내 멤버십 삭제)
  leave: (placeId: number, placeName: string) =>
    api.delete(`/places/${placeId}/members/me`, { data: { placeName } }),

  // 대기 멤버 거절
  rejectWaiting: (placeId, memberId) =>
    api.delete(`/places/${placeId}/members/waiting/${memberId}`),
};
