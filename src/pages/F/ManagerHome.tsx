// src/pages/F/ManagerHome.tsx
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
import BUILDING_IMG from '../../assets/placeIcon/buildingImg.svg';
import CINEMA_IMG from '../../assets/placeIcon/cinemaImg.svg';
import DORMITORY_IMG from '../../assets/placeIcon/dormitoryImg.svg';
import GYM_IMG from '../../assets/placeIcon/gymImg.svg';
import OFFICE_IMG from '../../assets/placeIcon/officeImg.svg';
import RESTAURANT_IMG from '../../assets/placeIcon/restaurantImg.svg';
import SCHOOL_IMG from '../../assets/placeIcon/schoolImg.svg';
import CAFE_IMG from '../../assets/placeIcon/cafeSmallImg.svg';
import HOME_IMG from '../../assets/placeIcon/homeImg.svg';

// 당번 아이콘 이미지 import 경로 수정
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

// 당번 아이콘 맵
const DUTY_ICON_SRC: Record<string, string> = {
  FLOOR_BLUE: FLOOR_BLUE,
  CLEANER_PINK: CLEANER_PINK,
  BUCKET_PINK: BUCKET_PINK,
  TOILET_PINK: TOILET_PINK,
  TRASH_BLUE: TRASH_BLUE,
  DISH_BLUE: DISH_BLUE,
  BRUSH_PINK: BRUSH_PINK,
  SPRAY_BLUE: SPRAY_BLUE,
};

type DutyIconKey =
  | 'FLOOR_BLUE' | 'CLEANER_PINK' | 'BUCKET_PINK' | 'TOILET_PINK'
  | 'TRASH_BLUE' | 'DISH_BLUE' | 'BRUSH_PINK' | 'SPRAY_BLUE';

const toArray = (x: any): any[] =>
  Array.isArray(x) ? x
  : Array.isArray(x?.data?.data?.duties) ? x.data.data.duties
  : Array.isArray(x?.data?.duties) ? x.data.duties
  : Array.isArray(x?.data?.data?.tasks) ? x.data.data.tasks
  : Array.isArray(x?.data?.tasks) ? x.data.tasks
  : Array.isArray(x?.data?.data) ? x.data.data
  : Array.isArray(x?.data) ? x.data
  : [];


type TaskUI = {
  id: number;
  title: string;
  dueTime: string | null;
  members: string[];
  isCamera: boolean;
  isChecked: boolean;
  completedAt?: string | null;
  completedBy?: string | null;
  dutyId: number;
};

type DutyUI = {
  id: number;
  name: string;
  iconKey: DutyIconKey;
  tasks: TaskUI[];
};

const ManagerHome: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: { placeId?: number; placeName?: string; placeIcon?: string; role?: string };
  };
  // 컨텍스트: state 우선, 없으면 localStorage
  const pid = Number(state?.placeId);
  const placeName = state?.placeName;
  const placeIconKey = state?.placeIcon
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
  const [uploadTaskId, setUploadTaskId] = useState<number | null>(null);

  /* ---------- 데이터 로드 ---------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        if (!pid) return;

        // (선택) 내 멤버십 확인 - 실패해도 치명적 X
        console.log('📡 [member] GET /places/%s/members/me', pid);
        try {
          const me = await useMemberApi.me(pid);
          console.log('📥 [member] 응답:', me?.data);
        } catch (e) {
          console.warn('⚠️ [member] 조회 실패(무시):', e);
        }

        console.log('📡 [duties] GET /places/%s/duties', pid);
        const dutyRes = await useDutyApi.list(pid);
        console.log('📥 [duties] 원본 응답:', dutyRes?.data);
        const dutyList = toArray(dutyRes);
        console.log('✅ [duties] 개수:', dutyList.length);

        const result: DutyUI[] = [];

        for (const d of dutyList) {
          const dutyId = Number(d?.dutyId ?? d?.id);
          const dutyName = d?.dutyName ?? d?.name ?? '';
          const iconKeyRaw = d?.iconKey ?? '';

          if (!Number.isFinite(dutyId)) {
            console.warn('⛔️ dutyId 없음/비정상, 스킵:', d);
            continue;
          }

          console.log('📡 [cleaning-info] GET /places/%s/duties/%s/cleaning-info', pid, dutyId);
          const infoRes = await useDutyApi.getCleaningInfo(pid, dutyId);
          console.log('📥 [cleaning-info] 응답(%s):', dutyId, infoRes?.data);
          const taskList = toArray(infoRes);
          console.log('✅ [tasks] 개수(%s):', dutyId, taskList.length);

          const tasks: TaskUI[] = taskList.map((t) => ({
            id: t.id,
            title: t.name ?? t.title ?? '',
            dueTime: t.dueTime ?? null,
            members: (t.members ?? t.assignees ?? []).map((m) => m?.name ?? m),
            isCamera: !!t.needPhoto,
            isChecked: !!t.completed,
            completedAt: t.completedAt ?? null,
            completedBy: t.completedBy ?? null,
            dutyId,
          }));

          const valid = ['FLOOR_BLUE','CLEANER_PINK','BUCKET_PINK','TOILET_PINK','TRASH_BLUE','DISH_BLUE','BRUSH_PINK','SPRAY_BLUE'];
          const iconKey: DutyIconKey = (valid.includes(iconKeyRaw) ? iconKeyRaw : 'SPRAY_BLUE') as DutyIconKey;

          result.push({ id: dutyId, name: dutyName, iconKey, tasks });
        }

        if (mounted) setDuties(result);
        console.log('🎯 duties 세팅 완료:', result.length);
      } catch (e) {
        console.error('❌ ManagerHome 데이터 로드 실패:', e);
        if (mounted) setDuties([]);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('🏁 ManagerHome 로딩 종료');
        }
      }
    })();

    return () => { mounted = false; };
  }, [pid]);

  /* ---------- 파생 ---------- */
  const allTasks = useMemo(() => duties.flatMap(d => d.tasks), [duties]);

  const page = useMemo(() => {
    const base = activePage === 0 ? allTasks : (duties[activePage - 1]?.tasks ?? []);
    const total = base.length;
    const done = base.filter(t => t.isChecked).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const name = activePage === 0 ? '플레이스 전체' : (duties[activePage - 1]?.name ?? '');
    
    // 아이콘 로직
    const iconKeyForProgressBar = activePage === 0
        ? placeIconKey
        : (duties[activePage - 1]?.iconKey as string);
    const icon = activePage === 0
        ? (CATEGORY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG)
        : (DUTY_ICON_SRC[iconKeyForProgressBar] ?? HOME_IMG);

    return { name, percent, tasks: base, icon };
  }, [activePage, allTasks, duties, placeIconKey]);

  const totalPages = duties.length + 1;

  const visibleTasks = useMemo(() => {
    const base = page.tasks;
    if (filter === 'ing') return base.filter(t => t.isChecked);
    if (filter === 'done') return base.filter(t => !t.isChecked);
    return base;
  }, [page.tasks, filter]);

  const hasUnread = useMemo(() => allTasks.some(t => !t.isChecked), [allTasks]);
  const notificationImage = hasUnread ? mailDefault : mail;

  const backgroundImage = useMemo(() => {
    if (page.percent <= 0) return '/bg/bg0.svg';
    if (page.percent >= 100) return '/bg/bg100.svg';
    return '/bg/bgMiddle.svg';
  }, [page.percent]);

  /* ---------- 이벤트 ---------- */
  const goToNotification = () => { if (pid) navigate(`/${pid}/alarm`); };

  const patchLocal = useCallback((id: number, patch: Partial<TaskUI>) => {
    setDuties(prev =>
      prev.map(d => ({ ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, ...patch } : t) }))
    );
  }, []);

  const toggleTask = async (taskId: number) => {
    const t = page.tasks.find(x => x.id === taskId);
    if (!t) return;
    try {
      if (t.isChecked) {
        console.log('📡 incompleteChecklist(%s, %s)', pid, taskId);
        await useChecklistApi.incompleteChecklist(pid, taskId);
        patchLocal(taskId, { isChecked: false, completedAt: null, completedBy: null });
      } else {
        console.log('📡 completeChecklist(%s, %s)', pid, taskId);
        await useChecklistApi.completeChecklist(pid, taskId);
        const now = new Date().toTimeString().slice(0, 5);
        patchLocal(taskId, { isChecked: true, completedAt: now, completedBy: 'manager' });
      }
    } catch (e) {
      console.error('❌ 체크 전환 실패:', e);
      alert('체크 상태 변경 실패');
    }
  };

  const openUploadFor = (id: number) => { setUploadTaskId(id); setUploadOpen(true); };
  const closeUpload = () => { setUploadOpen(false); setUploadTaskId(null); };
  const confirmUpload = async (file: File) => {
    if (uploadTaskId == null) return;
    try {
      console.log('📡 presigned url 요청:', uploadTaskId, file.name, file.type);
      const { data: presign } = await useChecklistApi.createPhotoUploadUrl(pid, uploadTaskId, {
        originalFileName: file.name, contentType: file.type,
      });
      console.log('📥 presign 응답:', presign);

      const put = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!put.ok) throw new Error('S3 업로드 실패');

      console.log('📡 업로드 완료 콜백:', presign.s3Key);
      await useChecklistApi.completePhotoUpload(pid, uploadTaskId, { s3Key: presign.s3Key });

      const now = new Date().toTimeString().slice(0, 5);
      patchLocal(uploadTaskId, { isChecked: true, completedAt: now, completedBy: 'manager' });
    } catch (e) {
      console.error('❌ 사진 업로드 실패:', e);
      alert('사진 업로드 실패');
    } finally {
      closeUpload();
    }
  };

  // 스와이프
  const swipeHandlers = useSwipeable({
    onSwipedLeft:  () => setActivePage(p => Math.min(p + 1, totalPages - 1)),
    onSwipedRight: () => setActivePage(p => Math.max(p - 1, 0)),
    trackMouse: true,
  });

  /* ---------- 렌더 ---------- */
  if (loading) return <div className="p-6">로딩중…</div>;
  const hasChecklist = visibleTasks.length > 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 배경 */}
      <div
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '626px', backgroundPosition: 'center -200px', backgroundRepeat: 'no-repeat' }}
      />
      {/* 상단 */}
      <div {...swipeHandlers} className="relative z-10 px-5 pt-4 flex-shrink-0 ">
        <div className="flex flex-col items-center h-[420px]">
          <div className="flex items-center relative">
            <span className="font-passion-one font-bold text-[24px] text-white absolute left-1/2 -translate-x-1/2">당번</span>
            <div className="flex items-center gap-[210px]">
              <PlaceNameCard place={placeName} type={page.percent >= 100 ? 'complete' : 'default'} />
              <img src={notificationImage} alt="알림" className="w-[36px] cursor-pointer" onClick={goToNotification} />
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
                  duties: duties.map(d => {
                    const total = d.tasks.length;
                    const done = d.tasks.filter(t => t.isChecked).length;
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
                  {filter === 'all' ? '전체 청소' : filter === 'ing' ? '달성 완료' : '달성 미완료'}
                </h2>
                <img src={toggle} alt="정렬" onClick={() => setMemberPopUp(!memberPopUp)} className="w-5 h-5 cursor-pointer" />
                {memberPopUp && (
                  <div className="absolute ml-5 top-[calc(100%+10px)] z-50">
                    <CategoryChip onSelect={(v) => { setFilter(v); setMemberPopUp(false); }} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pb-24 no-scrollbar">
              {visibleTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  title={t.title}
                  dueTime={t.dueTime ?? ''}
                  members={t.members}
                  isCamera={t.isCamera}
                  isChecked={t.isChecked}
                  completedAt={t.completedAt ?? undefined}
                  completedBy={t.completedBy ?? undefined}
                  onToggle={() => toggleTask(t.id)}
                  onCameraClick={() => !t.isChecked && t.isCamera && openUploadFor(t.id)}
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

      <div className="flex-shrink-0 z-10"><BottomBar /></div>
      <UpLoadPopUp isOpen={isUploadOpen} onRequestClose={closeUpload} onConfirm={confirmUpload} />
    </div>
  );
};

export default ManagerHome;