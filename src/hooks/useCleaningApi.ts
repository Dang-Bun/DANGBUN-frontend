import api from '../apis/axios';

export const useCleaningApi = {
  searchDuty: () => api.get('/cleanings/duties'),
  //   createPlace: (data: createPlaceRequest) =>
  //     api.post<defaultApiResponse>('/places', data),
};

export default useCleaningApi;
