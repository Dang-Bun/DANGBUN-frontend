export interface createPlaceRequest {
  placeName: string;
  category: string;
  managerName: string;
  information: Record<string, string>;
}

export interface defaultApiResponse {
  code: number;
  message: string;
  data?: any;
}
