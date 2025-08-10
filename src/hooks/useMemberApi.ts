import api from '../apis/axios';

export const useMemberApi = {
  memberList: (placeId: number) => api.get(`/places/${placeId}/members`),

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
  settingsTime: (
    placeId: number,
    data: {
      startTime: string;
      endTime: string;
      isToday: boolean;
    }
  ) => api.patch(`/places/${placeId}/settings/time`, data),
  placeSearch: (placeId: number) => api.get(`/places/${placeId}`),
  placeDelete: (placeId: number) => api.delete(`/places/${placeId}`),
  placeJoinCancel: (placeId: number) =>
    api.delete(`/places/${placeId}/join-requests`),
};

export default useMemberApi;
