import api from '../apis/axios';


/** 1) 업로드 URL 발급 - 요청 바디 */
export interface CreateUploadUrlRequest {
  originalFileName: string;
  contentType: string;
}

/** 1) 업로드 URL 발급 - 응답 바디 */
export interface CreateUploadUrlResponse {
  uploadUrl: string; // presigned PUT URL
  s3Key: string;     // 2) complete 호출에 사용
}

/** 2) 업로드 완료 콜백 - 요청 바디 */
export interface CompletePhotoUploadRequest {
  s3Key: string;
}

/** 공통 응답 래핑 */
export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

/** 3) 체크리스트 완료 응답 data */
export interface CompleteChecklistData {
  checkListId: number;
  membersName: string; // "[홍길동, 김철수]"
  endTime: string;     // "11:30"
}

/** 4) 체크리스트 해제 응답 data */
export interface IncompleteChecklistData {
  memberName: string;  // "홍길동"
  endTime: string;     // "11:30"
}

/** 5) 사진 접근 URL 조회 응답 data */
export interface PhotoAccessData {
  accessUrl: string;
}

/** ----- API Wrappers ----- */
export const useChecklistApi = {
  /** 1) 사진 업로드용 presigned URL 생성 */
  createPhotoUploadUrl: (
    placeId: number,
    checklistId: number,
    body: CreateUploadUrlRequest
  ) =>
    api.post<CreateUploadUrlResponse>(
      `/places/${placeId}/checkLists/${checklistId}/photos/upload-url`,
      body
    ),

  /** 2) 업로드 완료 콜백 */
  completePhotoUpload: (
    placeId: number,
    checklistId: number,
    body: CompletePhotoUploadRequest
  ) =>
    api.post<ApiEnvelope<null>>(
      `/places/${placeId}/checkLists/${checklistId}/photos/complete`,
      body
    ),

  /** 3) 체크리스트 완료 */
  completeChecklist: (placeId: number, checklistId: number) =>
    api.post<ApiEnvelope<CompleteChecklistData>>(
      `/places/${placeId}/checkLists/${checklistId}/actions/complete`
    ),

  /** 4) 체크리스트 해제 */
  incompleteChecklist: (placeId: number, checklistId: number) =>
    api.post<ApiEnvelope<IncompleteChecklistData>>(
      `/places/${placeId}/checkLists/${checklistId}/actions/incomplete`
    ),

  /** 5) 사진 접근 URL 조회 */
  getPhotoAccessUrl: (placeId: number, checklistId: number) =>
    api.get<ApiEnvelope<PhotoAccessData>>(
      `/places/${placeId}/checkLists/${checklistId}/photos`
    ),
};

export default useChecklistApi;
