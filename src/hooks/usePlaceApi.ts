import api from '../apis/axios';

export const usePlaceApi = {
  placeList: () => api.get('/users'),
  placeMake: (data: {
    placeName: string;
    category: string;
    managerName: string;
    information: Record<string, string>;
  }) => api.post('/places', data),
  makeInviteCode: (placeId: number) =>
    api.post(`/places/${placeId}/invite-code`),
  joinRequest: (data: {
    inviteCode: string;
    name: string;
    information: Record<string, string>;
  }) => api.post('/places/join-requests', data),
  inviteCodeCheck: (data: { inviteCode: string }) =>
    api.post('/places/invite-code', data),
  // 체크리스트 시간 설정
  updatePlaceTime: (
    placeId: number,
    body: { startTime: string; endTime: string; isToday: boolean }
  ) => api.patch(`/places/${placeId}/settings/time`, body),

  placeSearch: (placeId: number) => api.get(`/places/${placeId}`),
  // 플레이스 삭제
  placeDelete: (placeId: number, placeName: string) =>
    api.delete(`/places/${placeId}`, { data: { placeName } }),
  placeJoinCancel: (placeId: number) =>
    api.delete(`/places/${placeId}/join-requests`),
};
