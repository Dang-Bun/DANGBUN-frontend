import { useChecklistApi } from '../../hooks/useChecklistApi';

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
  // 1) presigned URL 발급 (Envelope 대응)
  const {
    data: { data: presignRaw },
  } = await useChecklistApi.createPhotoUploadUrl(placeId, checklistId, {
    originalFileName: file.name,
    contentType: file.type || 'application/octet-stream',
  });
  const presign = presignRaw ?? {}; // { uploadUrl, s3Key }

  // 기본 검증
  if (!presign.uploadUrl) throw new Error('presign.uploadUrl가 비어 있습니다.');
  let presignUrl: URL;
  try {
    presignUrl = new URL(presign.uploadUrl);
  } catch {
    throw new Error(
      `presign.uploadUrl가 절대 URL이 아닙니다: ${presign.uploadUrl}`
    );
  }

  // 2) S3로 PUT
  // - presign의 SignedHeaders에 content-type이 포함되었는지에 따라 헤더 결정
  const signedHeadersParam =
    presignUrl.searchParams.get('X-Amz-SignedHeaders') ??
    presignUrl.searchParams.get('x-amz-signedheaders') ??
    '';
  const signedHeaders = decodeURIComponent(signedHeadersParam).toLowerCase();

  const contentType = file.type || 'application/octet-stream';
  const headers: Record<string, string> = {};
  if (signedHeaders.includes('content-type')) {
    headers['Content-Type'] = contentType; // 서명에 포함된 경우만 설정
  }

  const putResp = await fetch(presign.uploadUrl, {
    method: 'PUT',
    headers,
    body: file,
    mode: 'cors',
    credentials: 'omit',
  });

  if (!putResp.ok) {
    const body = await putResp.text().catch(() => '');
    throw new Error(`파일 업로드 실패 ${putResp.status}: ${body}`);
  }

  // 3) 완료 콜백
  await useChecklistApi.completePhotoUpload(placeId, checklistId, {
    s3Key: presign.s3Key,
  });

  // 4) (선택) 접근 URL 조회 (Envelope 대응)
  const { data: env } = await useChecklistApi.getPhotoAccessUrl(
    placeId,
    checklistId
  );
  const accessUrl = (env?.data ?? env)?.accessUrl;
  return accessUrl; // 필요 없으면 호출부에서 무시 가능
}
