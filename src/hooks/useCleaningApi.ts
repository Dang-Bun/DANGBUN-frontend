import api from '../apis/axios';

export const useCleaningApi = {
  searchDuty: () => api.get('/cleanings/duties'),

  editCleaning: (id: number) => api.put(`/cleanings/${id}`),
  deleteCleaning: (id: number) => api.delete(`/cleanings/${id}`),
  makeCleaning: (data: {
    placeId: number;
    cleaningName: string;
    dutyName: string;
    members: string[];
    needPhto: boolean;
    repeatType: string;
    repeatDays: string[];
    detailDates: string[];
  }) => api.post('/cleanings', data),
  duty_filter_members: (dutyId: number, memberIds: number[]) =>
    api.get(`/duties/${dutyId}/cleanings/filter-by-members`, {
      params: {
        memberIds: memberIds,
      },
    }),
  cleaningUnAssigned: (placeId: number) =>
    api.get('/cleanings/unassigned', {
      params: {
        placeId: placeId,
      },
    }),
  cleaningsDuty: (memberIds: number[]) =>
    api.get('cleanings/duties', {
      params: {
        memberIds: memberIds,
      },
    }),
};

export default useCleaningApi;
