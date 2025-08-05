import api from './axios.ts';

export interface place {
  placeId: number;
  name: string;
  totalCleaning: number;
  endCleaning: number;
  role: string;
  notifyNumber: number;
}

export interface createPlaceRequest {
  placeName: string;
  category: string;
  managerName: string;
  information: {
    이메일: string;
    전화번호: string;
  };
}

export interface defaultApiResponse {
  code: number;
  message: string;
  data: any;
}

export const placeApi = {
  getPlace: () => api.get('/places'),
  createPlace: (data: createPlaceRequest) =>
    api.post<defaultApiResponse>('/places', data),
};
