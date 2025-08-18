import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import PlaceNameCard from '../../components/home/PlaceNameCard';
import TaskCard from '../../components/home/TaskCard';
import ProgressBar from '../../components/home/CircularProgressBar';
import BottomBar from '../../components/BottomBar';
import CategoryChip from '../../components/home/CategoryChip';
import UpLoadPopUp from '../../components/PopUp/UpLoadPopUp';

import mail from '../../assets/home/mail.svg';
import mailDefault from '../../assets/home/mailDefault.svg';
import toggle from '../../assets/home/toggleIcon.svg';

// 카테고리 아이콘
import BUILDING_IMG from '../../assets/placeIcon/buildingImg.svg';
import CINEMA_IMG from '../../assets/placeIcon/cinemaImg.svg';
import DORMITORY_IMG from '../../assets/placeIcon/dormitoryImg.svg';
import GYM_IMG from '../../assets/placeIcon/gymImg.svg';
import OFFICE_IMG from '../../assets/placeIcon/officeImg.svg';
import RESTAURANT_IMG from '../../assets/placeIcon/restaurantImg.svg';
import SCHOOL_IMG from '../../assets/placeIcon/schoolImg.svg';
import CAFE_IMG from '../../assets/placeIcon/cafeSmallImg.svg';
import HOME_IMG from '../../assets/placeIcon/homeImg.svg';

// 당번 아이콘
import CLEANER_PINK from '../../assets/cleanIcon/cleanerImg.svg';
import BUCKET_PINK from '../../assets/cleanIcon/cupWashingImg.svg';
import BRUSH_PINK from '../../assets/cleanIcon/moppingImg_3.svg';
import DISH_BLUE from '../../assets/cleanIcon/polishImg.svg';
import SPRAY_BLUE from '../../assets/cleanIcon/sprayerImg.svg';
import FLOOR_BLUE from '../../assets/cleanIcon/sweepImg_2.svg';
import TOILET_PINK from '../../assets/cleanIcon/toiletImg.svg';
import TRASH_BLUE from '../../assets/cleanIcon/trashImg_2.svg';

import useDutyApi from '../../hooks/useDutyApi';
import { useMemberApi } from '../../hooks/useMemberApi';
import { useChecklistApi } from '../../hooks/useChecklistApi';
import useCalendarApi from '../../hooks/useCalendarApi';
import useNotificationApi from '../../hooks/useNotificationApi';

/* ============================
 * 상수/타입
 * ============================ */
const CATEGORY_ICON_SRC: Record<string, string> = {
  CAFE: CAFE_IMG,
  RESTAURANT: RESTAURANT_IMG,
  THEATER: CINEMA_IMG,
  DORMITORY: DORMITORY_IMG,
  BUILDING: BUILDING_IMG,
  OFFICE: OFFICE_IMG,
  SCHOOL: SCHOOL_IMG,
  GYM: GYM_IMG,
  ETC: HOME_IMG,
};

const DUTY_ICON_SRC: Record<string, string> = {
  FLOOR_BLUE,
  CLEANER_PINK,
  BUCKET_PINK,
  TOILET_PINK,
  TRASH_BLUE,
  DISH_BLUE,
  BRUSH_PINK,
  SPRAY_BLUE,
};

type DutyIconKey =
  | 'FLOOR_BLUE'
  | 'CLEANER_PINK'
  | 'BUCKET_PINK'
  | 'TOILET_PINK'
  | 'TRASH_BLUE'
  | 'DISH_BLUE'
  | 'BRUSH_PINK'
  | 'SPRAY_BLUE';

const VALID_DUTY_KEYS: DutyIconKey[] = [
  'FLOOR_BLUE',
  'CLEANER_PINK',
  'BUCKET_PINK',
  'TOILET_PINK',
  'TRASH_BLUE',
  'DISH_BLUE',
  'BRUSH_PINK',
  'SPRAY_BLUE',
];

const ICON_ALIASES: Record<string, DutyIconKey> = {
  FLOOR: 'FLOOR_BLUE',
  SWEEP: 'FLOOR_BLUE',
  CLEANER: 'CLEANER_PINK',
  BUCKET: 'BUCKET_PINK',
  TOILET: 'TOILET_PINK',
  TRASH: 'TRASH_BLUE',
  DISH: 'DISH_BLUE',
  BRUSH: 'BRUSH_PINK',
  SPRAY: 'SPRAY_BLUE',
};

// API 응답 데이터가 배열이 아닐 경우 배열로 변환
const toArray = (x: unknown): unknown[] => {
  if (Array.isArray(x)) return x;
  
  const xObj = x as Record<string, unknown>;
  if (Array.isArray(xObj?.data?.data?.duties)) {
    return (xObj.data?.data?.duties as unknown[]) || [];
  }
  if (Array.isArray(xObj?.data?.duties)) {
    return (xObj.data?.duties as unknown[]) || [];
  }
  if (Array.isArray(xObj?.data?.data?.tasks)) {
    return (xObj.data?.data?.tasks as unknown[]) || [];
  }
  if (Array.isArray(xObj?.data?.tasks)) {
    return (xObj.data?.tasks as unknown[]) || [];
  }
  if (Array.isArray(xObj?.data?.data)) {
    return (xObj.data?.data as unknown[]) || [];
  }
  if (Array.isArray(xObj?.data)) {
    return (xObj.data as unknown[]) || [];
  }
  return [];
};

// ====== TaskUI에 cleaningId/checklistId 분리 ======
type TaskUI = {
  cleaningId: number;          // UI용(목록/키)
  checklistId: number | null;  // 서버 액션/업로드용
  title: string;
  dueTime: string | null;
  members: string[];
  memberCount: number;
  isCamera: boolean;
  isChecked: boolean;
  completedAt?: string | null;
  completedBy?: string | null;
  dutyId: number;
  mine: boolean;               // 멤버홈 전용: 내가 담당자인지 여부
};

type DutyUI = {
  id: number;
  name: string;
  iconKey: DutyIconKey;
  tasks: TaskUI[];
};

/* ============================
 * 컴포넌트
 * ============================ */
const MemberHome: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: {
      placeId?: number;
      placeName?: string;
      placeIcon?: string;
      role?: string;
    };
  };

  const pid = Number(state?.placeId ?? localStorage.getItem('placeId') ?? 0);
  const placeName = state?.placeName ?? localStorage.getItem('placeName') ?? '플레이스';
  const placeIconKey = state?.placeIcon ?? localStorage.getItem('placeIcon');

  useEffect(() => {
    if (pid) localStorage.setItem('placeId', String(pid));
    if (placeName) localStorage.setItem('placeName', placeName);
    if (placeIconKey) localStorage.setItem('placeIcon', placeIconKey);
  }, [pid, placeName, placeIconKey]);

  // 화면 상태
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [duties, setDuties] = useState<DutyUI[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ing' | 'done'>('all');

  // 업로드 타겟 상태에 checklistId 포함
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [uploadTaskId, setUploadTaskId] = useState<{
    dutyId: number;
    cleaningId: number;
    checklistId: number | null;
  } | null>(null);

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  /* ---------- 데이터 로드 및 처리 로직 ---------- */
  useEffect(() => {
    let mounted = true;

    const fetchTaskData = async () => {
      if (!pid) return [];
      
      // 1) 내 정보 먼저 가져오기
      const meResponse = await useMemberApi.me(pid);
      const me = meResponse?.data?.data ?? meResponse?.data ?? meResponse ?? {};
      const myName = String(me.name ?? me.memberName ?? me.userName ?? me.nickname ?? '');
      setUserName(myName);
      
      const dutyRes = await useDutyApi.list(pid);
      const dutyList = toArray(dutyRes);

      const dutyPromises = dutyList.map(async (d: unknown) => {
        const dutyId = Number((d as Record<string, unknown>)?.dutyId ?? (d as Record<string, unknown>)?.id);
        if (!Number.isFinite(dutyId)) return null;

        // 각 당번별로 청소 정보 조회
        const infoRes = await useDutyApi.getCleaningInfo(pid, dutyId);
        const taskList = toArray(infoRes);

        // 두 ID 모두 매핑 + 멤버홈 전용 mine 필드 추가
        const tasksPromises = taskList.map(async (t: unknown) => {
          const cleaningId = Number((t as Record<string, unknown>)?.cleaningId ?? (t as Record<string, unknown>)?.id ?? (t as Record<string, unknown>)?.checklistId);
          const rawChecklist = Number((t as Record<string, unknown>)?.checklistId);
          const checklistId = Number.isFinite(rawChecklist) ? rawChecklist : null;

          // 멤버 목록 파싱
          const names: string[] = Array.isArray((t as Record<string, unknown>)?.members ?? (t as Record<string, unknown>)?.assignees)
            ? ((t as Record<string, unknown>)?.members ?? (t as Record<string, unknown>)?.assignees as unknown[]).map((m: unknown) => 
                (m as Record<string, unknown>)?.name ?? (m as unknown as string)
              ).filter(Boolean)
            : typeof (t as Record<string, unknown>)?.membersName === 'string'
              ? String((t as Record<string, unknown>).membersName)
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];

          // 멤버홈 전용: 내가 담당자인지 확인
          const mine = !!myName && (names.includes(myName) || names.includes('멤버 전체'));

          return {
            cleaningId,
            checklistId,
            title: String((t as Record<string, unknown>)?.cleaningName ?? (t as Record<string, unknown>)?.dutyName ?? (t as Record<string, unknown>)?.name ?? ''),
            dueTime: (t as Record<string, unknown>)?.endTime ?? null,
            members: names,
            memberCount: names.length,
            isCamera: !!((t as Record<string, unknown>)?.needPhoto),
            isChecked: !!((t as Record<string, unknown>)?.completed ?? (t as Record<string, unknown>)?.isChecked),
            completedAt: (t as Record<string, unknown>)?.completedAt ?? null,
            completedBy: (t as Record<string, unknown>)?.completedBy ?? null,
            dutyId,
            mine,
          } as TaskUI;
        });

        const tasks = await Promise.all(tasksPromises);

        const iconRaw = String((d as Record<string, unknown>)?.icon ?? '').toUpperCase();
        const normalized = (ICON_ALIASES[iconRaw] ?? iconRaw) as string;
        const iconKey: DutyIconKey = VALID_DUTY_KEYS.includes(normalized as DutyIconKey)
          ? (normalized as DutyIconKey)
          : 'FLOOR_BLUE';

        return {
          id: dutyId,
          name: (d as Record<string, unknown>)?.name ?? (d as Record<string, unknown>)?.dutyName ?? '',
          iconKey,
          tasks,
        };
      });

      return (await Promise.all(dutyPromises)).filter(Boolean) as DutyUI[];
    };

    const loadData = async () => {
      setLoading(true);
      try {
        const resolvedDuties = await fetchTaskData();
        if (mounted) setDuties(resolvedDuties);
      } catch (e) {
        console.error('Data loading failed:', e);
        if (mounted) setDuties([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [pid]);

  // 알림 확인 로직
  useEffect(() => {
    if (!pid) return;
    const checkUnreadNotifications = async () => {
      try {
        const res = await useNotificationApi.listReceived(pid, { page: 0, size: 20 });
        const notifications = res?.data?.data || [];
        const hasUnread = notifications.some((n: any) => !n.isRead);
        setHasUnreadNotifications(hasUnread);
      } catch {
        setHasUnreadNotifications(true);
      }
    };
    checkUnreadNotifications();
    const handleFocus = () => checkUnreadNotifications();
    window.addEventListener('focus', handleFocus);
    return () => { window.removeEventListener('focus', handleFocus); };
  }, [pid]);

  /* ---------- 파생 상태 및 이벤트 핸들러 ---------- */
  const allTasks = useMemo(() => duties.flatMap((d) => d.tasks), [duties]);
  const myTasks = useMemo(() => allTasks.filter((t) => t.mine), [allTasks]);

  // 멤버홈 전용: 내가 담당자인 task가 있는 당번만 필터링
  const myDuties = useMemo(() => {
    return duties.filter((duty) => duty.tasks.some((task) => task.mine));
  }, [duties]);

  // 멤버홈 전용: 첫 페이지는 내 작업 전체, 나머지는 내가 담당자인 당번별
  const page = useMemo(() => {
    const base = activePage === 0 ? myTasks : myDuties[activePage - 1]?.tasks ?? [];
    const total = base.length;
    const done = base.filter((t) => t.isChecked).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const name = activePage === 0 ? '내 체크리스트' : myDuties[activePage - 1]?.name ?? '';
    const iconKeyForProgressBar = activePage === 0 ? placeIconKey : (myDuties[activePage - 1]?.iconKey as string);
    const icon = activePage === 0 ? CATEGORY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG : DUTY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG;
    return { name, percent, tasks: base, icon };
  }, [activePage, myTasks, myDuties, placeIconKey]);

  // 멤버홈 전용: 내가 담당자인 당번 수 + 1 (첫 페이지 포함)
  const totalPages = myDuties.length + 1;

  const visibleTasks = useMemo(() => {
    const base = page.tasks;
    if (filter === 'ing') return base.filter((t) => !t.isChecked);
    if (filter === 'done') return base.filter((t) => t.isChecked);
    return base;
  }, [page.tasks, filter]);

  const notificationImage = hasUnreadNotifications ? mailDefault : mail;
  const backgroundImage = useMemo(() => {
    if (page.percent <= 0) return '/bg/bg0.svg';
    if (page.percent >= 100) return '/bg/bg100.svg';
    return '/bg/bgMiddle.svg';
  }, [page.percent]);

  // 토글 시 checklistId 사용, 로컬 패치 기준은 cleaningId
  const toggleTask = async (dutyId: number, cleaningId: number) => {
    const t = page.tasks.find((x) => x.cleaningId === cleaningId && x.dutyId === dutyId) as TaskUI | undefined;
    if (!t || !t.mine) return; // 멤버홈 전용: 내가 담당자가 아니면 토글 불가

    if (!t.checklistId) {
      alert('체크리스트 ID가 없어 상태를 변경할 수 없습니다.');
      return;
    }

    try {
      if (t.isChecked) {
        await useChecklistApi.incompleteChecklist(pid, t.checklistId);
        patchLocal(dutyId, cleaningId, { isChecked: false, completedAt: null, completedBy: null });
      } else {
        await useCalendarApi.completeChecklist(pid, t.checklistId);
        const now = new Date().toTimeString().slice(0, 5);
        patchLocal(dutyId, cleaningId, { isChecked: true, completedAt: now, completedBy: userName });
      }
    } catch (e) {
      console.error('체크 전환 실패:', e);
      alert('체크 상태 변경 실패');
    }
  };

  // cleaningId 기준으로 로컬 패치
  const patchLocal = useCallback(
    (dutyId: number, cleaningId: number, patch: Partial<TaskUI>) => {
      setDuties((prev) =>
        prev.map((d) =>
          d.id !== dutyId
            ? d
            : {
                ...d,
                tasks: d.tasks.map((t) => (t.cleaningId === cleaningId ? { ...t, ...patch } : t)),
              }
        )
      );
    },
    []
  );

  // 업로드용 open/close에 checklistId 포함
  const openUploadFor = useCallback((dutyId: number, cleaningId: number, checklistId: number | null) => {
    setUploadTaskId({ dutyId, cleaningId, checklistId });
    setUploadOpen(true);
  }, []);

  const closeUpload = useCallback(() => {
    setUploadOpen(false);
    setUploadTaskId(null);
  }, []);

  // 사진 업로드 시 checklistId 사용
  const confirmUpload = async (file: File) => {
    if (!uploadTaskId) return;
    const { dutyId, cleaningId, checklistId } = uploadTaskId;

    if (!checklistId) {
      alert('체크리스트 ID가 없어 사진 업로드를 진행할 수 없습니다.');
      closeUpload();
      return;
    }

    try {
      const { data: presign } = await useChecklistApi.createPhotoUploadUrl(pid, checklistId, {
        originalFileName: file.name,
        contentType: file.type,
      });

      const put = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!put.ok) throw new Error('S3 업로드 실패');

      await useChecklistApi.completePhotoUpload(pid, checklistId, { s3Key: presign.s3Key });

      const now = new Date().toTimeString().slice(0, 5);
      patchLocal(dutyId, cleaningId, { isChecked: true, completedAt: now, completedBy: userName });
    } catch (e) {
      console.error('사진 업로드 실패:', e);
      alert('사진 업로드 실패');
    } finally {
      closeUpload();
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActivePage((p) => Math.min(p + 1, totalPages - 1)),
    onSwipedRight: () => setActivePage((p) => Math.max(p - 1, 0)),
    trackMouse: true,
  });

  const handleFilterSelect = useCallback((selectedFilter: 'all' | 'ing' | 'done') => {
    setFilter(selectedFilter);
    setMemberPopUp(false);
  }, []);

  const goToNotification = useCallback(() => {
    if (pid) navigate(`/${pid}/alarm`);
  }, [navigate, pid]);
  
  /* ---------- 렌더링 ---------- */
  if (loading) return <div className="p-6">로딩중…</div>;
  const hasChecklist = visibleTasks.length > 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 배경 */}
      <div
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '626px',
          backgroundPosition: 'center -200px',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* 상단 */}
      <div {...swipeHandlers} className="relative z-10 px-5 pt-4 flex-shrink-0 ">
        <div className="flex flex-col items-center h-[420px]">
          <div className="flex items-center relative">
            <span className="font-passion-one font-bold text-[24px] text-white absolute left-1/2 -translate-x-1/2">
              당번
            </span>
            <div className="flex items-center gap-[210px]">
              <PlaceNameCard
                place={placeName}
                type={page.percent >= 100 ? 'complete' : 'default'}
                onClick={() => navigate('/myplace')}
              />
              <img
                src={notificationImage}
                alt="알림"
                className="w-[36px] cursor-pointer"
                onClick={goToNotification}
              />
            </div>
          </div>

          <div className="mt-[66px] mb-[18px]">
            <ProgressBar
              percentage={page.percent}
              iconSrc={page.icon}
              title={page.name}
              // 멤버홈 전용: 프로그레스바 클릭 불가 (onCenterClick 제거)
              dotCount={totalPages}
              dotIndex={activePage}
              onDotSelect={setActivePage}
            />
          </div>
        </div>
      </div>

      {/* 목록 */}
      <main className="relative z-10 px-5 flex flex-col flex-grow min-h-0">
        {/* 필터 섹션 - 항상 표시 */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex items-center">
            <h2 className="text-[14px] pl-1 text-[#4D83FD] font-semibold">
              {filter === 'all'
                ? '전체 청소'
                : filter === 'ing'
                ? '달성 미완료'
                : '달성 완료'}
            </h2>
            <img
              src={toggle}
              alt="정렬"
              onClick={() => setMemberPopUp(!memberPopUp)}
              className="w-5 h-5 cursor-pointer"
            />
            {memberPopUp && (
              <div className="absolute ml-5 top-[calc(100%+10px)] z-50">
                <CategoryChip onSelect={handleFilterSelect} />
              </div>
            )}
          </div>
        </div>

        {/* 체크리스트 카드 섹션 */}
        {hasChecklist ? (
          <div className="flex flex-col gap-3 overflow-y-auto pb-24 no-scrollbar">
            {visibleTasks.map((t) => (
              <TaskCard
                key={`${t.dutyId}:${t.cleaningId}`}
                title={t.title}
                dueTime={t.dueTime ?? ''}
                members={t.members}
                memberCount={t.memberCount}
                isCamera={t.isCamera}
                isChecked={t.isChecked}
                completedAt={t.completedAt ?? undefined}
                completedBy={t.completedBy ?? undefined}
                // 멤버홈 전용: 내가 담당자가 아니면 disabled
                disabled={!t.mine}
                onToggle={() => t.mine ? toggleTask(t.dutyId, t.cleaningId) : undefined}
                onCameraClick={() =>
                  t.mine && !t.isChecked && t.isCamera && openUploadFor(t.dutyId, t.cleaningId, t.checklistId)
                }
              />
            ))}
          </div>
        ) : (
          <section className="w-full mt-6 flex flex-col items-center text-center">
            <p className="text-[13px] text-[#99A2AE]">표시할 체크리스트가 없습니다.</p>
          </section>
        )}
      </main>

      <div className="flex-shrink-0 z-10">
        <BottomBar />
      </div>
      <UpLoadPopUp
        isOpen={isUploadOpen}
        onRequestClose={closeUpload}
        onConfirm={confirmUpload}
      />
    </div>
  );
};

export default MemberHome;
