import api from '../apis/axios';
import type { createPlaceRequest, defaultApiResponse } from '../apis/types';

export const usePlaceApi = {
  createPlace: (data: createPlaceRequest) =>
    api.post<defaultApiResponse>('/places', data),
};
