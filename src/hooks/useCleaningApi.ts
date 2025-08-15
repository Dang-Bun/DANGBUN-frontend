import api from '../apis/axios';

export const useCleaningApi = {
  editCleaning: (cleaningId: number, placeId: number) =>
    api.put(`/places/${placeId}/cleanings/${cleaningId}`),
  deleteCleaning: (cleaningId: number, placeId: number) =>
    api.delete(`/places/${placeId}/cleanings/${cleaningId}`),
  makeCleaning: (
    placeId: number,
    data: {
      cleaningName: string;
      dutyName: string;
      members: string[];
      needPhoto: boolean;
      repeatType: string;
      repeatDays: string[];
      detailDates: string[];
    }
  ) => api.post(`/places/${placeId}/cleanings`, data),
  duty_filter_members: (placeId: number, dutyId: number, memberIds: number[]) =>
    api.get(`/places/${placeId}/duties/${dutyId}/cleanings/filter-by-members`, {
      params: {
        memberIds: memberIds,
      },
    }),
  cleaningUnAssigned: (placeId: number) =>
    api.get(`/places/${placeId}/cleanings/unassigned`),
  usersDangbunList: (placeId: number, membersIds) => {
    api.get(`places/${placeId}/cleanings/duties`, {
      params: {
        memberIds: membersIds,
      },
    });
  },
};

export default useCleaningApi;
