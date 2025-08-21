import { useChecklistApi } from '../../hooks/useChecklistApi';
import type {
  ApiEnvelope,
  PhotoAccessData,
  CreateUploadUrlResponse,
} from '../../hooks/useChecklistApi';

/** 체크박스 토글 (완료/해제) */
export async function toggleChecklistRemote(
  placeId: number,
  checklistId: number,
  isChecked: boolean
) {
  if (isChecked) {
    const { data } = await useChecklistApi.incompleteChecklist(
      placeId,
      checklistId
    );
    return data?.data ?? data; // { memberName, endTime }
  } else {
    const { data } = await useChecklistApi.completeChecklist(
      placeId,
      checklistId
    );
    return data?.data ?? data; // { checkListId, membersName, endTime }
  }
}

/** 사진 업로드 (presigned → PUT → complete → (선택)get) */
export async function uploadChecklistPhotoRemote(
  placeId: number,
  checklistId: number,
  file: File
) {
  // 1) presign
  const {
    data: { data: presign },
  }: { data: ApiEnvelope<CreateUploadUrlResponse> } =
    await useChecklistApi.createPhotoUploadUrl(placeId, checklistId, {
      originalFileName: file.name,
      contentType: file.type || 'application/octet-stream',
    });

  // 2) S3 PUT
  const url = new URL(presign.uploadUrl);
  const signed = decodeURIComponent(
    url.searchParams.get('X-Amz-SignedHeaders') ?? ''
  ).toLowerCase();
  const headers: Record<string, string> = {};
  if (signed.includes('content-type'))
    headers['Content-Type'] = file.type || 'application/octet-stream';

  const put = await fetch(presign.uploadUrl, {
    method: 'PUT',
    headers,
    body: file,
    mode: 'cors',
    credentials: 'omit',
  });
  if (!put.ok)
    throw new Error(
      `파일 업로드 실패 ${put.status}: ${await put.text().catch(() => '')}`
    );

  // 3) 완료 콜백
  await useChecklistApi.completePhotoUpload(placeId, checklistId, {
    s3Key: presign.s3Key,
  });

  // 4) 접근 URL (여기가 포인트)
  const {
    data: { data: photo },
  }: { data: ApiEnvelope<PhotoAccessData> } =
    await useChecklistApi.getPhotoAccessUrl(placeId, checklistId);

  return photo.accessUrl; // ✅ 타입 확정
}
