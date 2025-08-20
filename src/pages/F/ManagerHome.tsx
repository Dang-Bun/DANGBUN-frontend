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

// ====== 여기부터 변경: TaskUI에 cleaningId/checklistId 분리 ======
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
};
// ====== 변경 끝 ======

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

  const pid = Number(state?.placeId ?? 0);
  
  // 플레이스 정보 상태 추가
  const [placeInfo, setPlaceInfo] = useState<{
    placeName: string;
    placeIconKey: string;
  }>({
    placeName: '플레이스',
    placeIconKey: 'CAFE'
  });

  // 화면 상태
  const [loading, setLoading] = useState(true);
  const [duties, setDuties] = useState<DutyUI[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ing' | 'done'>('all');

  // ====== 변경: 업로드 타겟 상태에 checklistId 포함 ======
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [uploadTaskId, setUploadTaskId] = useState<{
    dutyId: number;
    cleaningId: number;
    checklistId: number | null;
  } | null>(null);
  // ====== 변경 끝 ======

  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  /* ---------- 데이터 로드 및 처리 로직 ---------- */
  useEffect(() => {
    let mounted = true;

    const fetchTaskData = async () => {
      if (!pid) return [];
      
      // 플레이스 조회 API 사용
      const placeRes = await usePlaceApi.placeSearch(pid);
      console.log('🔍 매니저 홈 플레이스 조회 API 응답:', placeRes?.data);
      
      const placeData = placeRes?.data?.data || placeRes?.data || {};
      
      // 플레이스 정보 설정
      if (mounted) {
        setPlaceInfo({
          placeName: placeData.placeName || '플레이스',
          placeIconKey: placeData.category || 'CAFE'
        });
      }
      
      const duties = placeData.duties || [];
      console.log('🔍 매니저 홈 duties:', duties);

             // duty 중복 제거를 위해 Map 사용 (더 안전한 방법)
       const uniqueDuties = new Map();
       
       duties.forEach((d: any, index: number) => {
         // dutyId를 우선적으로 사용하고, 없으면 index 사용
         const dutyId = Number(d.dutyId || d.id || index);
         
         if (Number.isFinite(dutyId)) {
           // 같은 dutyId가 있으면 덮어쓰기 (마지막 것이 우선)
           uniqueDuties.set(dutyId, d);
         } else {
           // dutyId가 없으면 index를 사용
           uniqueDuties.set(index, d);
         }
       });
       
       const dutyPromises = Array.from(uniqueDuties.values()).map(async (d: any, index: number) => {
         const dutyId = Number(d.dutyId || d.id || index);
         if (!Number.isFinite(dutyId)) return null;

        // 홈화면 API 구조에 맞게 처리
        const checkLists = d.checkLists || [];
        console.log(`🔍 Duty ${dutyId} checkLists:`, checkLists);

        // ====== 변경: 실제 API 응답 구조에 맞게 수정 ======
        const tasksPromises = checkLists.map(async (t: any) => {
          // API 응답 구조에 맞게 필드명 수정 (예시 응답 기준)
          const cleaningId = Number(t.checkListId || t.cleaningId || t.id); // UI 키로 checkListId 사용
          const checklistId = Number.isFinite(Number(t.checkListId)) ? Number(t.checkListId) : null;

                     // 멤버 목록 파싱 - members 배열에서 멤버 이름 추출 (중복 제거)
           let names: string[] = [];
           const members = t.members || [];

           if (Array.isArray(members)) {
             const allNames = members
               .map((m: any) => {
                 if (typeof m === 'string') return m;
                 if (typeof m === 'object' && m && 'memberName' in m) {
                   return String(m.memberName || '');
                 }
                 if (typeof m === 'object' && m && 'name' in m) {
                   return String(m.name || '');
                 }
                 return '';
               })
               .filter(Boolean);
             
             // 중복 제거
             names = [...new Set(allNames)];
           }

          // 완료 상태 확인 - completeTime이 있으면 완료된 것으로 간주
          const isCompleted = !!(t.completeTime || t.completedAt || t.completed);

          // 디버깅용 로그 추가
          console.log('🔍 [ManagerHome] Task 데이터:', {
            cleaningId,
            checklistId,
            title: t.cleaningName,
            members: t.members,
            parsedNames: names,
            completeTime: t.completeTime,
            isCompleted,
            needPhoto: t.needPhoto,
            endTime: t.endTime,
          });

          return {
            cleaningId,
            checklistId,
            title: String(t.cleaningName || ''),
            dueTime: t.endTime || t.dueTime || null,
            members: names,
            memberCount: names.length,
            isCamera: !!(t.needPhoto || t.isCamera || t.n), // n 필드도 확인
            isChecked: isCompleted,
            completedAt: t.completeTime || t.completedAt || null,
            completedBy: t.completedBy || null,
            dutyId,
          } as TaskUI;
        });
        // ====== 변경 끝 ======

        const tasks = await Promise.all(tasksPromises);

        const iconRaw = String(d.icon || '').toUpperCase();
        const normalized = (ICON_ALIASES[iconRaw] ?? iconRaw) as string;
        const iconKey: DutyIconKey = VALID_DUTY_KEYS.includes(normalized as DutyIconKey)
          ? (normalized as DutyIconKey)
          : 'FLOOR_BLUE';

        return {
          id: dutyId,
          name: d.dutyName || d.name || '', // dutyName을 우선적으로 사용
          iconKey,
          tasks,
        };
      });

      return (await Promise.all(dutyPromises)).filter(Boolean) as DutyUI[];
    };

         const loadData = async () => {
       setLoading(true);
       try {
         // 현재 사용자 정보 가져오기
         const meResponse = await useMemberApi.me(pid);
         const me = meResponse?.data?.data ?? meResponse?.data ?? meResponse ?? {};
         console.log('🔍 현재 사용자 정보:', me);
         
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

  const page = useMemo(() => {
    const base = activePage === 0 ? allTasks : duties[activePage - 1]?.tasks ?? [];
    const total = base.length;
    const done = base.filter((t) => t.isChecked).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const name = activePage === 0 ? '플레이스 전체' : duties[activePage - 1]?.name ?? '';
    const iconKeyForProgressBar = activePage === 0 ? placeInfo.placeIconKey : (duties[activePage - 1]?.iconKey as string);
    const icon = activePage === 0 ? CATEGORY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG : DUTY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG;
    return { name, percent, tasks: base, icon };
  }, [activePage, allTasks, duties, placeInfo.placeIconKey]);

  const totalPages = duties.length + 1;

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

     // ====== 변경: 토글 시 checklistId 사용 ======
   const toggleTask = async (dutyId: number, checklistId: number) => {
     const t = page.tasks.find((x) => x.checklistId === checklistId && x.dutyId === dutyId) as TaskUI | undefined;
     if (!t) return;

     if (!t.checklistId) {
       alert('체크리스트 ID가 없어 상태를 변경할 수 없습니다.');
       return;
     }

     console.log('🔍 체크리스트 토글 시도:', {
       taskTitle: t.title,
       checklistId: t.checklistId,
       dutyId: t.dutyId,
       isChecked: t.isChecked,
       members: t.members,
       placeId: pid
     });

     try {
       if (t.isChecked) {
         console.log('🔍 체크리스트 해제 시도...');
         await useChecklistApi.incompleteChecklist(pid, t.checklistId);
         patchLocal(dutyId, t.cleaningId, { isChecked: false, completedAt: null, completedBy: null });
         console.log('✅ 체크리스트 해제 성공');
       } else {
         console.log('🔍 체크리스트 완료 시도...');
         await useChecklistApi.completeChecklist(pid, t.checklistId);
         const now = new Date().toTimeString().slice(0, 5);
         patchLocal(dutyId, t.cleaningId, { isChecked: true, completedAt: now, completedBy: 'manager' });
         console.log('✅ 체크리스트 완료 성공');
       }
     } catch (e) {
       console.error('❌ 체크 전환 실패:', e);
       console.error('❌ 에러 상세:', {
         message: e.message,
         status: e.response?.status,
         data: e.response?.data
       });
       alert('체크 상태 변경 실패');
     }
   };
  // ====== 변경 끝 ======

  // ====== 변경: cleaningId 기준으로 로컬 패치 ======
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
  // ====== 변경 끝 ======

  // ====== 변경: 업로드용 open/close에 checklistId 포함 ======
  const openUploadFor = useCallback((dutyId: number, checklistId: number | null) => {
    const task = page.tasks.find((t) => t.checklistId === checklistId && t.dutyId === dutyId);
    if (task) {
      setUploadTaskId({ dutyId, cleaningId: task.cleaningId, checklistId });
      setUploadOpen(true);
    }
  }, [page.tasks]);

  const closeUpload = useCallback(() => {
    setUploadOpen(false);
    setUploadTaskId(null);
  }, []);
  // ====== 변경 끝 ======

  // ====== 변경: 사진 업로드 시 checklistId 사용 ======
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
      patchLocal(dutyId, cleaningId, { isChecked: true, completedAt: now, completedBy: 'manager' });
    } catch (e) {
      console.error('사진 업로드 실패:', e);
      alert('사진 업로드 실패');
    } finally {
      closeUpload();
    }
  };
  // ====== 변경 끝 ======

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
                 place={placeInfo.placeName}
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
                   placeName: placeInfo.placeName,
                   percent: Math.min(100, Math.max(0, page.percent)),
                   placeIconKey: placeInfo.placeIconKey,
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
                 key={`${t.dutyId}:${t.checklistId || t.cleaningId}`}
                 title={t.title}
                 dueTime={t.dueTime ?? ''}
                 members={t.members}
                 memberCount={t.memberCount}
                 isCamera={t.isCamera}
                 isChecked={t.isChecked}
                 completedAt={t.completedAt ?? undefined}
                 completedBy={t.completedBy ?? undefined}
                 onToggle={() => toggleTask(t.dutyId, t.checklistId || 0)}
                 onCameraClick={() =>
                   !t.isChecked && t.isCamera && openUploadFor(t.dutyId, t.checklistId)
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

export default ManagerHome;
