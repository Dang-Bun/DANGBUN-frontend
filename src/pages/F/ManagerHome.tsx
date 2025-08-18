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

// 당번 아이콘 키와 실제 이미지 매핑
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

// 백엔드에서 아이콘을 "BUCKET_PINK" 혹은 "BUCKET" 등으로 보낼 가능성 대응
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

const toArray = (x: any): any[] =>
  Array.isArray(x)
    ? x
    : Array.isArray(x?.data?.data?.duties)
    ? x.data.data.duties
    : Array.isArray(x?.data?.duties)
    ? x.data.duties
    : Array.isArray(x?.data?.data?.tasks)
    ? x.data.data.tasks
    : Array.isArray(x?.data?.tasks)
    ? x.data.tasks
    : Array.isArray(x?.data?.data)
    ? x.data.data
    : Array.isArray(x?.data)
    ? x.data
    : [];

// membersName: "이름1, 이름2" 형태를 string[]로 변환
const splitMemberNames = (membersName: any): string[] =>
  typeof membersName === 'string'
    ? membersName
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

type TaskUI = {
  id: number; // cleaningId
  title: string; // cleaningName
  dueTime: string | null; // 스펙상 없음 -> endTime으로 변경
  members: string[]; // membersName split 결과
  memberCount: number; // 백엔드 제공 값 사용
  isCamera: boolean;
  isChecked: boolean;
  completedAt?: string | null;
  completedBy?: string | null;
  dutyId: number; // 소속 당번 식별
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
const ManagerHome: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: {
      placeId?: number;
      placeName?: string;
      placeIcon?: string;
      role?: string;
    };
  };

  // 컨텍스트: state 우선, 없으면 localStorage
  const pid = Number(state?.placeId ?? localStorage.getItem('placeId') ?? 0);
  const placeName =
    state?.placeName ?? localStorage.getItem('placeName') ?? '플레이스';
  const placeIconKey =
    state?.placeIcon ?? localStorage.getItem('placeIcon') ?? 'ETC';

  useEffect(() => {
    if (pid) localStorage.setItem('placeId', String(pid));
    if (placeName) localStorage.setItem('placeName', placeName);
    if (placeIconKey) localStorage.setItem('placeIcon', placeIconKey);
  }, [pid, placeName, placeIconKey]);

  // 화면 상태
  const [loading, setLoading] = useState(true);
  const [duties, setDuties] = useState<DutyUI[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ing' | 'done'>('all');

  // 업로드 팝업
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [uploadTaskId, setUploadTaskId] = useState<{
    dutyId: number;
    id: number;
  } | null>(null);

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  /* ---------- 데이터 로드 ---------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        if (!pid) return;

        try {
          await useMemberApi.me(pid);
        } catch {
          /* ignore */
        }

        // 1) 당번 목록
        const dutyRes = await useDutyApi.list(pid);
        const dutyList = toArray(dutyRes);

        const result: DutyUI[] = [];

        for (const d of dutyList) {
          const dutyId = Number(d?.dutyId ?? d?.id);
          const dutyName = d?.name ?? d?.dutyName ?? '';
          const iconRaw = String(d?.icon ?? '').toUpperCase();

          if (!Number.isFinite(dutyId)) continue;

          // 2) 당번별 청소 목록
          const infoRes = await useDutyApi.getCleaningInfo(pid, dutyId);
          const taskList = toArray(infoRes);

          const tasks: TaskUI[] = taskList.map((t) => {
            const names = splitMemberNames(t.membersName ?? ''); // membersName이 없을 때를 대비한 기본값
            return {
              id: Number(t.cleaningId),
              title: String(t.cleaningName ?? t.dutyName ?? ''),
              dueTime: t.endTime ?? null, // endTime이 있는 경우 사용
              members: names,
              memberCount: Number(t.memberCount ?? 0),
              isCamera: !!t.needPhoto,
              isChecked: !!(t.completed ?? t.isChecked),
              completedAt: t.completedAt ?? null,
              completedBy: t.completedBy ?? null,
              dutyId,
            };
          });

          // 아이콘 키 정규화
          const normalized = (ICON_ALIASES[iconRaw] ?? iconRaw) as string;
          const iconKey: DutyIconKey = VALID_DUTY_KEYS.includes(
            normalized as DutyIconKey
          )
            ? (normalized as DutyIconKey)
            : 'FLOOR_BLUE';

          result.push({ id: dutyId, name: dutyName, iconKey, tasks });
        }

        if (mounted) setDuties(result);
      } catch (e) {
        console.error('ManagerHome 데이터 로드 실패:', e);
        if (mounted) setDuties([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [pid]);

  // 받은 알림 읽음 여부 확인
  useEffect(() => {
    if (!pid) return;

    const checkUnreadNotifications = async () => {
      try {
        const res = await useNotificationApi.listReceived(pid, {
          page: 0,
          size: 20,
        });
        const notifications = res?.data?.data || [];
        const hasUnread =
          notifications.length > 0 && notifications.some((n: any) => !n.isRead);
        setHasUnreadNotifications(hasUnread);
      } catch {
        setHasUnreadNotifications(true);
      }
    };

    checkUnreadNotifications();
    const handleFocus = () => {
      checkUnreadNotifications();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [pid]);

  /* ---------- 파생 ---------- */
  const allTasks = useMemo(() => duties.flatMap((d) => d.tasks), [duties]);

  const page = useMemo(() => {
    const base =
      activePage === 0 ? allTasks : duties[activePage - 1]?.tasks ?? [];
    const total = base.length;
    const done = base.filter((t) => t.isChecked).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const name = activePage === 0 ? '플레이스 전체' : duties[activePage - 1]?.name ?? '';

    const iconKeyForProgressBar =
      activePage === 0 ? placeIconKey : (duties[activePage - 1]?.iconKey as string);

    const icon =
      activePage === 0
        ? CATEGORY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG
        : DUTY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG;

    return { name, percent, tasks: base, icon };
  }, [activePage, allTasks, duties, placeIconKey]);

  const totalPages = duties.length + 1;

  const visibleTasks = useMemo(() => {
    const base = page.tasks;
    if (filter === 'ing') return base.filter((t) => !t.isChecked);
    if (filter === 'done') return base.filter((t) => t.isChecked);
    return base;
  }, [page.tasks, filter]);

  const notificationImage = hasUnreadNotifications ? mail : mailDefault;

  const backgroundImage = useMemo(() => {
    if (page.percent <= 0) return '/bg/bg0.svg';
    if (page.percent >= 100) return '/bg/bg100.svg';
    return '/bg/bgMiddle.svg';
  }, [page.percent]);

  /* ---------- 이벤트 ---------- */
  const goToNotification = () => {
    if (pid) navigate(`/${pid}/alarm`);
  };

  const patchLocal = useCallback(
    (dutyId: number, id: number, patch: Partial<TaskUI>) => {
      setDuties((prev) =>
        prev.map((d) =>
          d.id !== dutyId
            ? d
            : {
                ...d,
                tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
              }
        )
      );
    },
    []
  );

  const toggleTask = async (dutyId: number, taskId: number) => {
    const t = page.tasks.find((x) => x.id === taskId && x.dutyId === dutyId);
    if (!t) return;
    try {
      if (t.isChecked) {
        await useChecklistApi.incompleteChecklist(pid, taskId);
        patchLocal(dutyId, taskId, {
          isChecked: false,
          completedAt: null,
          completedBy: null,
        });
      } else {
        await useChecklistApi.completeChecklist(pid, taskId);
        const now = new Date().toTimeString().slice(0, 5);
        patchLocal(dutyId, taskId, {
          isChecked: true,
          completedAt: now,
          completedBy: 'manager',
        });
      }
    } catch (e) {
      console.error('체크 전환 실패:', e);
      alert('체크 상태 변경 실패');
    }
  };

  const openUploadFor = (dutyId: number, id: number) => {
    setUploadTaskId({ dutyId, id });
    setUploadOpen(true);
  };
  const closeUpload = () => {
    setUploadOpen(false);
    setUploadTaskId(null);
  };

  const confirmUpload = async (file: File) => {
    if (!uploadTaskId) return;
    const { dutyId, id } = uploadTaskId;
    try {
      const { data: presign } = await useChecklistApi.createPhotoUploadUrl(
        pid,
        id,
        {
          originalFileName: file.name,
          contentType: file.type,
        }
      );

      const put = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!put.ok) throw new Error('S3 업로드 실패');

      await useChecklistApi.completePhotoUpload(pid, id, { s3Key: presign.s3Key });

      const now = new Date().toTimeString().slice(0, 5);
      patchLocal(dutyId, id, {
        isChecked: true,
        completedAt: now,
        completedBy: 'manager',
      });
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

  const handleFilterSelect = (selectedFilter: string) => {
    switch (selectedFilter) {
      case '전체':
        setFilter('all');
        break;
      case '달성 미완료':
        setFilter('ing');
        break;
      case '달성 완료':
        setFilter('done');
        break;
      default:
        setFilter('all');
    }
    setMemberPopUp(false);
  };

  /* ---------- 렌더 ---------- */
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
              onCenterClick={() => {
                const payload = {
                  placeId: pid,
                  placeName,
                  percent: Math.min(100, Math.max(0, page.percent)),
                  placeIconKey,
                  duties: duties.map((d) => {
                    const total = d.tasks.length;
                    const done = d.tasks.filter((t) => t.isChecked).length;
                    return {
                      id: d.id,
                      name: d.name,
                      percent: total ? Math.round((done / total) * 100) : 0,
                      iconKey: d.iconKey,
                    };
                  }),
                };
                sessionStorage.setItem('overviewPayload', JSON.stringify(payload));
                navigate('/home/manager/overview', { state: payload });
              }}
              dotCount={totalPages}
              dotIndex={activePage}
              onDotSelect={setActivePage}
            />
          </div>
        </div>
      </div>

      {/* 목록 */}
      <main className="relative z-10 px-5 flex flex-col flex-grow min-h-0">
        {hasChecklist ? (
          <>
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

            <div className="flex flex-col gap-3 overflow-y-auto pb-24 no-scrollbar">
              {visibleTasks.map((t) => (
                <TaskCard
                  key={`${t.dutyId}:${t.id}`}
                  title={t.title}
                  dueTime={t.dueTime ?? ''}
                  members={t.members}
                  memberCount={t.memberCount}
                  isCamera={t.isCamera}
                  isChecked={t.isChecked}
                  completedAt={t.completedAt ?? undefined}
                  completedBy={t.completedBy ?? undefined}
                  onToggle={() => toggleTask(t.dutyId, t.id)}
                  onCameraClick={() =>
                    !t.isChecked && t.isCamera && openUploadFor(t.dutyId, t.id)
                  }
                />
              ))}
            </div>
          </>
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

export default ManagerHome;