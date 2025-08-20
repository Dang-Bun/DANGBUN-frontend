import api from '../apis/axios';

const useNotificationApi = {
  // 받은 알림(수신함)
  listReceived: (placeId: number, params?: any) =>
    api.get(`/places/${placeId}/notifications/received`, { params }),

  // 보낸 알림(전송함)
  listSent: (placeId: number, params?: any) =>
    api.get(`/places/${placeId}/notifications/sent`, { params }),

  // 알림 상세
  detail: (placeId: number, notificationId: number | string) =>
    api.get(`/places/${placeId}/notifications/${notificationId}`),

  // 알림 작성
  create: (placeId: number, body: any) =>
    api.post(`/places/${placeId}/notifications`, body),

  // 수신인 검색
  searchRecipients: (placeId: number, params?: any) =>
    api.get(`/places/${placeId}/notifications/recipients/search`, { params }),

  // 최근 검색어
  recentRecipientSearches: (placeId: number, params?: any) =>
    api.get(`/places/${placeId}/notifications/recipients/recent-searches`, {
      params,
    }),
  // 알림 읽음 처리
  markAsRead: (placeId: number, notificationId: number) =>
    api.patch(`/places/${placeId}/notifications/${notificationId}/read`),
};

export default useNotificationApi;
