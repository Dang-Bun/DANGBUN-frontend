import api from '../apis/axios';

export const useDutyApi = {
  dutyEdit: (dutyId: number, data: { name: string; icon: string }) =>
    api.put(`/duties/${dutyId}`, data),
  deleteDuty: (dutyId: number) => api.delete(`/duties/${dutyId}`),
  dutyList: (placeId: number) => api.get(`/places/${placeId}/duties`),
  createDuty: (placeId: number, data: { name: string; icon: string }) =>
    api.post(`/places/${placeId}/duties`, data),
  addDutyMember: (dutyId: number, data: { memberIds: number[] }) =>
    api.post(`/duties/${dutyId}/members`, data),
  addUnAssignedClean: (dutyId: number, data: { cleaningIds: string[] }) =>
    api.post(`/duties/${dutyId}/cleanings`, data),

  seperateDuty: (
    dutyId: number,
    data: {
      assignType: string;
      cleaningId: number;
      memberIds: number[];
      assignCount: number;
    }
  ) => api.patch(`/duties/${dutyId}/cleanings/members`, data),

  getMembers: (dutyId: number) => api.get(`duties/${dutyId}/member-names`),
  getCleanings: (dutyId: number) => api.get(`duties/${dutyId}/cleaning-names`),
  getCleaningsSpec: (dutyId: number) =>
    api.get(`duties/${dutyId}/cleaning-info`),
  deleteCleaning: (dutyId: number, cleaningId: number) =>
    api.delete(`/duties/${dutyId}/cleanings/${cleaningId}`),
};

export default useDutyApi;
