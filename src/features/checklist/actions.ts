import { useChecklistApi } from '../../hooks/useChecklistApi';

/** 체크박스 토글 (완료/해제) */
export async function toggleChecklistRemote(
  placeId: number,
  checklistId: number,
  isChecked: boolean
) {
  if (isChecked) {
    // 이미 체크됨 → 해제
    const { data } = await useChecklistApi.incompleteChecklist(placeId, checklistId);
    return data.data; // { memberName, endTime }
  } else {
    // 미체크 → 완료
    const { data } = await useChecklistApi.completeChecklist(placeId, checklistId);
    return data.data; // { checkListId, membersName, endTime }
  }
}

/** 사진 업로드 (presigned → PUT → complete → (선택)get) */
export async function uploadChecklistPhotoRemote(
  placeId: number,
  checklistId: number,
  file: File
) {
  // 1) presigned URL 발급
  const { data: presign } = await useChecklistApi.createPhotoUploadUrl(placeId, checklistId, {
    originalFileName: file.name,
    contentType: file.type,
  });

  // 2) S3(혹은 저장소)로 직접 PUT (Authorization 붙이지 말 것!)
  const putResp = await fetch(presign.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!putResp.ok) throw new Error('파일 업로드 실패');

  // 3) 완료 콜백
  await useChecklistApi.completePhotoUpload(placeId, checklistId, { s3Key: presign.s3Key });

  // 4) (선택) 접근 URL 조회
  const { data: env } = await useChecklistApi.getPhotoAccessUrl(placeId, checklistId);
  return env.data.accessUrl; // 필요 없으면 반환값 무시 가능
}
