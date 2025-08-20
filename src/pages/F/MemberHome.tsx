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

import { useMemberApi } from '../../hooks/useMemberApi';
import { useChecklistApi } from '../../hooks/useChecklistApi';
import useNotificationApi from '../../hooks/useNotificationApi';
import { usePlaceApi } from '../../hooks/usePlaceApi';
import { useDutyApi } from '../../hooks/useDutyApi';

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

  const xObj = x as Record<string, any>;
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
  cleaningId: number; // UI용(목록/키)
  checklistId: number | null; // 서버 액션/업로드용
  title: string;
  dueTime: string | null;
  members: string[];
  memberCount: number;
  isCamera: boolean;
  isChecked: boolean;
  completedAt?: string | null;
  completedBy?: string | null;
  dutyId: number;
  mine: boolean; // 멤버홈 전용: 내가 담당자인지 여부
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
  const placeName =
    state?.placeName ?? localStorage.getItem('placeName') ?? '플레이스';
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
  const [hasNotifications, setHasNotifications] = useState(false);

  /* ---------- 데이터 로드 및 처리 로직 ---------- */
  useEffect(() => {
    let mounted = true;

    const fetchTaskData = async () => {
      if (!pid) return [];

      // 1) 내 정보 먼저 가져오기
      const meResponse = await useMemberApi.me(pid);
      const me = meResponse?.data?.data ?? meResponse?.data ?? meResponse ?? {};
      const myName = String(
        me.name ?? me.memberName ?? me.userName ?? me.nickname ?? ''
      );
      setUserName(myName);

      // 플레이스 조회 API 사용 (체크리스트 정보 포함)
      const placeRes = await usePlaceApi.placeSearch(pid);
      console.log('🔍 멤버 홈 플레이스 조회 API 응답:', placeRes?.data);
      
      const placeData = placeRes?.data?.data || placeRes?.data || {};
      
      // duty 목록 조회 API 사용 (아이콘 정보 포함)
      const dutyRes = await useDutyApi.list(pid);
      console.log('🔍 멤버 홈 duty 목록 API 응답:', dutyRes?.data);
      
      const dutyList = dutyRes?.data?.data || dutyRes?.data || [];
      console.log('🔍 멤버 홈 duty 목록:', dutyList);
      
      // 플레이스 조회에서 체크리스트 정보 가져오기
      const placeDuties = placeData.duties || [];
      console.log('🔍 플레이스 조회의 duties (체크리스트 정보):', placeDuties);
      
      // dutyId로 체크리스트 정보를 매핑
      const checklistMap = new Map<number, unknown[]>();
      placeDuties.forEach((placeDuty: Record<string, unknown>) => {
        const dutyId = Number(placeDuty.dutyId);
        if (Number.isFinite(dutyId)) {
          const checkLists = (placeDuty.checkLists as unknown[]) || [];
          checklistMap.set(dutyId, checkLists);
          console.log(`🔍 Duty ${dutyId}의 체크리스트 개수:`, checkLists.length);
        }
      });
      
      // duty API에서 가져온 duty와 체크리스트 매칭
      const dutyPromises = dutyList.map(async (d: Record<string, unknown>) => {
        const dutyId = Number(d.dutyId || d.id);
        if (!Number.isFinite(dutyId)) return null;
        
        // 해당 dutyId의 체크리스트 가져오기
        const checkLists = checklistMap.get(dutyId) || [];
        console.log(`🔍 Duty ${dutyId} 매칭된 체크리스트:`, checkLists);
        
        // 체크리스트를 task로 변환
        const tasks = checkLists.map((t: unknown) => {
          const cleaningId = Number(
            (t as Record<string, unknown>)?.cleaningId ??
              (t as Record<string, unknown>)?.id ??
              (t as Record<string, unknown>)?.checkListId
          );
          const rawChecklist = Number(
            (t as Record<string, unknown>)?.checkListId
          );
          const checklistId = Number.isFinite(rawChecklist)
            ? rawChecklist
            : null;

          // 멤버 목록 파싱 (placeSearch API 응답에 맞게)
          let names: string[] = [];
          const members = (t as Record<string, unknown>)?.members;

          if (Array.isArray(members)) {
            names = members
              .map((m) => {
                if (typeof m === 'string') return m;
                if (typeof m === 'object' && m && 'memberName' in m) {
                  return String((m as { memberName?: unknown }).memberName ?? '');
                }
                if (typeof m === 'object' && m && 'name' in m) {
                  return String((m as { name?: unknown }).name ?? '');
                }
                return '';
              })
              .filter(Boolean);
          }

          // 디버깅용 로그 추가
          console.log('🔍 [MemberHome] Task 데이터 (placeSearch):', {
            cleaningId,
            checklistId,
            title: (t as Record<string, unknown>)?.cleaningName,
            members: (t as Record<string, unknown>)?.members,
            parsedNames: names,
            completeTime: (t as Record<string, unknown>)?.completeTime,
            needPhoto: (t as Record<string, unknown>)?.needPhoto,
          });

          // 멤버홈 전용: 내가 담당자인지 확인
          const mine =
            !!myName && (names.includes(myName) || names.includes('멤버 전체'));

          return {
            cleaningId,
            checklistId,
            title: String(
              (t as Record<string, unknown>)?.cleaningName ??
                (t as Record<string, unknown>)?.dutyName ??
                (t as Record<string, unknown>)?.name ??
                ''
            ),
            dueTime: (t as Record<string, unknown>)?.endTime ?? null,
            members: names,
            memberCount: names.length,
            isCamera: !!(t as Record<string, unknown>)?.needPhoto,
                         isChecked: !!(
               (t as Record<string, unknown>)?.completed ??
               (t as Record<string, unknown>)?.isChecked ??
               (t as Record<string, unknown>)?.completeTime
             ),
                         completedAt: (t as Record<string, unknown>)?.completeTime ?? null,
            completedBy: (t as Record<string, unknown>)?.completedBy ?? null,
            dutyId,
            mine,
          } as TaskUI;
        });

        // 아이콘 변환 로직 (duty API에서 가져온 정보 사용)
        const iconRaw = String(d.icon || '').toUpperCase();
        let iconKey: DutyIconKey = 'FLOOR_BLUE'; // 기본값
        
        if (VALID_DUTY_KEYS.includes(iconRaw as DutyIconKey)) {
          iconKey = iconRaw as DutyIconKey;
        } else if (ICON_ALIASES[iconRaw]) {
          iconKey = ICON_ALIASES[iconRaw];
        }
        
        console.log('🔍 아이콘:', d.icon, '→', iconKey);

        return {
          id: dutyId,
          name: d.dutyName || d.name || '',
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
    return () => {
      mounted = false;
    };
  }, [pid]);

  // 알림 확인 로직 - API 기반으로 변경
  useEffect(() => {
    if (!pid) return;

    const checkUnreadNotifications = async () => {
      try {
        const response = await useNotificationApi.listReceived(pid, { page: 0, size: 20 });
        const responseData = response?.data?.data || response?.data || {};
        const notifications = Array.isArray(responseData) 
          ? responseData 
          : responseData?.notifications || responseData?.data || [];
        const hasAnyNotifications = notifications.length > 0;
        const hasUnread = notifications.some((n: Record<string, unknown>) => !(n.isRead || n.read));
        setHasNotifications(hasAnyNotifications);
        setHasUnreadNotifications(hasUnread);
      } catch (error) {
        console.error('알림 확인 실패:', error);
        setHasNotifications(false);
        setHasUnreadNotifications(false);
      }
    };

    checkUnreadNotifications();

    // 페이지 포커스 시 확인
    const handleFocus = () => checkUnreadNotifications();
    window.addEventListener('focus', handleFocus);
    
    // 알림 읽음 이벤트 감지
    const handleNotificationRead = (event: CustomEvent) => {
      if (event.detail.placeId === pid) {
        // 알림이 읽혔으므로 읽지 않은 알림 상태를 false로 설정
        setHasUnreadNotifications(false);
      }
    };
    window.addEventListener('notificationRead', handleNotificationRead as EventListener);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('notificationRead', handleNotificationRead as EventListener);
    };
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
    const base =
      activePage === 0 ? myTasks : (myDuties[activePage - 1]?.tasks ?? []);
    const total = base.length;
    const done = base.filter((t) => t.isChecked).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const name =
      activePage === 0
        ? '내 체크리스트'
        : (myDuties[activePage - 1]?.name ?? '');
    const iconKeyForProgressBar =
      activePage === 0
        ? placeIconKey
        : (myDuties[activePage - 1]?.iconKey as string);
    const icon =
      activePage === 0
        ? (CATEGORY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG)
        : (DUTY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG);
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

  // 알림 이미지 로직: 알림이 있고 읽지 않은 알림이 있을 때만 mail 아이콘 표시
  const notificationImage = hasNotifications && hasUnreadNotifications ? mail : mailDefault;
  const backgroundImage = useMemo(() => {
    if (page.percent <= 0) return '/bg/bg0.svg';
    if (page.percent >= 100) return '/bg/bg100.svg';
    return '/bg/bgMiddle.svg';
  }, [page.percent]);

  // 토글 시 checklistId 사용, 로컬 패치 기준은 cleaningId
  const toggleTask = async (dutyId: number, cleaningId: number) => {
    console.log('🔍 [MemberHome] toggleTask 호출:', { dutyId, cleaningId });
    
    const t = page.tasks.find(
      (x) => x.cleaningId === cleaningId && x.dutyId === dutyId
    ) as TaskUI | undefined;
    
    console.log('🔍 [MemberHome] 찾은 task:', {
      found: !!t,
      task: t ? {
        title: t.title,
        mine: t.mine,
        checklistId: t.checklistId,
        isChecked: t.isChecked,
        members: t.members
      } : null
    });
    
    if (!t) {
      console.log('❌ [MemberHome] Task를 찾을 수 없음');
      return;
    }
    
    if (!t.mine) {
      console.log('❌ [MemberHome] 내가 담당자가 아님:', {
        myName: userName,
        taskMembers: t.members
      });
      return;
    }

         if (!t.checklistId) {
       console.log('❌ [MemberHome] checklistId가 없음');
       alert('체크리스트 ID가 없어 상태를 변경할 수 없습니다.');
       return;
     }

           // 이미 완료된 체크리스트는 해제할 수 있음 (매니저 홈과 동일)

         try {
       console.log('🔍 [MemberHome] API 호출 전 정보:', {
         placeId: pid,
         checklistId: t.checklistId,
         isChecked: t.isChecked,
         taskTitle: t.title,
         members: t.members,
         myName: userName
       });
       
       let response;
       if (t.isChecked) {
         response = await useChecklistApi.incompleteChecklist(pid, t.checklistId);
         console.log('✅ 체크리스트 해제 성공:', response.data);
         patchLocal(dutyId, cleaningId, {
           isChecked: false,
           completedAt: null,
           completedBy: null,
         });
       } else {
         response = await useChecklistApi.completeChecklist(pid, t.checklistId);
         console.log('✅ 체크리스트 완료 성공:', response.data);
        
        // API 응답에서 endTime과 memberName 추출
        const responseData = response.data?.data || response.data;
        console.log('📄 API 응답 데이터:', responseData);
        
        if (responseData) {
          console.log('📅 endTime:', responseData.endTime);
          console.log('👤 memberName:', responseData.memberName);
          
          patchLocal(dutyId, cleaningId, {
            isChecked: true,
            completedAt: responseData.endTime ? String(responseData.endTime) : new Date().toTimeString().slice(0, 5),
            completedBy: responseData.memberName || userName,
          });
        } else {
          // API 응답이 없는 경우 기본값 사용
          const now = new Date().toTimeString().slice(0, 5);
          patchLocal(dutyId, cleaningId, {
            isChecked: true,
            completedAt: now,
            completedBy: userName,
          });
        }
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
                tasks: d.tasks.map((t) =>
                  t.cleaningId === cleaningId ? { ...t, ...patch } : t
                ),
              }
        )
      );
    },
    []
  );

  // 업로드용 open/close에 checklistId 포함
  const openUploadFor = useCallback(
    (dutyId: number, cleaningId: number, checklistId: number | null) => {
      setUploadTaskId({ dutyId, cleaningId, checklistId });
      setUploadOpen(true);
    },
    []
  );

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
      const { data: presign } = await useChecklistApi.createPhotoUploadUrl(
        pid,
        checklistId,
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

      await useChecklistApi.completePhotoUpload(pid, checklistId, {
        s3Key: presign.s3Key,
      });
      console.log('✅ 사진 업로드 완료');
      
      // 사진 업로드는 기본값 사용 (API에서 endTime/memberName 반환하지 않음)
      const now = new Date().toTimeString().slice(0, 5);
      patchLocal(dutyId, cleaningId, {
        isChecked: true,
        completedAt: now,
        completedBy: userName,
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

  const handleFilterSelect = useCallback(
    (selectedFilter: 'all' | 'ing' | 'done') => {
      setFilter(selectedFilter);
      setMemberPopUp(false);
    },
    []
  );

  const goToNotification = useCallback(() => {
    if (pid) navigate(`/${pid}/alarm`);
  }, [navigate, pid]);

  /* ---------- 렌더링 ---------- */
  if (loading) return <div className='p-6'>로딩중…</div>;
  const hasChecklist = visibleTasks.length > 0;

  return (
    <div className='flex flex-col h-screen bg-white'>
      {/* 배경 */}
      <div
        className='fixed top-0 left-0 w-full h-full z-0'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '626px',
          backgroundPosition: 'center -200px',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* 상단 */}
      <div
        {...swipeHandlers}
        className='relative z-10 px-5 pt-4 flex-shrink-0 '
      >
        <div className='flex flex-col items-center h-[420px]'>
          <div className='flex items-center relative'>
            <span className='font-passion-one font-bold text-[24px] text-white absolute left-1/2 -translate-x-1/2'>
              당번
            </span>
            <div className='flex items-center gap-[210px]'>
              <PlaceNameCard
                place={placeName}
                type={page.percent >= 100 ? 'complete' : 'default'}
                onClick={() => navigate('/myplace')}
              />
              <img
                src={notificationImage}
                alt='알림'
                className='w-[36px] cursor-pointer'
                onClick={goToNotification}
              />
            </div>
          </div>

          <div className='mt-[66px] mb-[18px]'>
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
      <main className='relative z-10 px-5 flex flex-col flex-grow min-h-0'>
        {/* 필터 섹션 - 항상 표시 */}
        <div className='flex justify-between items-center mb-4'>
          <div className='relative flex items-center'>
            <h2 className='text-[14px] pl-1 text-[#4D83FD] font-semibold'>
              {filter === 'all'
                ? '전체 청소'
                : filter === 'ing'
                  ? '달성 미완료'
                  : '달성 완료'}
            </h2>
            <img
              src={toggle}
              alt='정렬'
              onClick={() => setMemberPopUp(!memberPopUp)}
              className='w-5 h-5 cursor-pointer'
            />
            {memberPopUp && (
              <div className='absolute ml-5 top-[calc(100%+10px)] z-50'>
                <CategoryChip onSelect={handleFilterSelect} />
              </div>
            )}
          </div>
        </div>

        {/* 체크리스트 카드 섹션 */}
        {hasChecklist ? (
          <div className='flex flex-col gap-3 overflow-y-auto pb-24 no-scrollbar'>
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
                onToggle={() =>
                  t.mine ? toggleTask(t.dutyId, t.cleaningId) : undefined
                }
                onCameraClick={() =>
                  t.mine &&
                  !t.isChecked &&
                  t.isCamera &&
                  openUploadFor(t.dutyId, t.cleaningId, t.checklistId)
                }
              />
            ))}
          </div>
        ) : (
          <section className='w-full mt-6 flex flex-col items-center text-center'>
            <p className='text-[13px] text-[#99A2AE]'>
              표시할 체크리스트가 없습니다.
            </p>
          </section>
        )}
      </main>

      <div className='flex-shrink-0 z-10'>
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
