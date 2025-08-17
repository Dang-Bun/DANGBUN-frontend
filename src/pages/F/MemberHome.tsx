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
import sweepIcon from '../../assets/cleanIcon/sweepImg_1.svg';

import useDutyApi from '../../hooks/useDutyApi';
import {useMemberApi} from '../../hooks/useMemberApi';
import { useChecklistApi } from '../../hooks/useChecklistApi';

const arr = (x: any): any[] =>
  Array.isArray(x) ? x
  : Array.isArray(x?.data) ? x.data
  : Array.isArray(x?.data?.data) ? x.data.data
  : Array.isArray(x?.content) ? x.content
  : Array.isArray(x?.items) ? x.items
  : [];

const obj = (x: any): any => x?.data?.data ?? x?.data ?? x ?? {};

/* ---------------------- 화면 타입 ---------------------- */
type DutyIconKey =
  | 'FLOOR_BLUE' | 'CLEANER_PINK' | 'BUCKET_PINK' | 'TOILET_PINK'
  | 'TRASH_BLUE' | 'DISH_BLUE' | 'BRUSH_PINK' | 'SPRAY_BLUE';

type TaskUI = {
  id: number;
  title: string;
  dueTime: string | null;
  members: string[];
  isCamera: boolean;
  isChecked: boolean;
  completedAt?: string | null;
  completedBy?: string | null;
  date?: string | null;
  dutyId: number;
  mine: boolean;
};

type DutyUI = { id: number; name: string; iconKey: DutyIconKey; tasks: TaskUI[] };

/* ---------------------- 컴포넌트 ---------------------- */
const MemberHome: React.FC = () => {
  const navigate = useNavigate();
  const { placeId } = (useLocation().state || {}) as { placeId?: number };

  /* 컨텍스트 */
  const pid = Number(placeId ?? localStorage.getItem('placeId') ?? 0);
  useEffect(() => { if (placeId) localStorage.setItem('placeId', String(placeId)); }, [placeId]);

  /* 상태 */
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [duties, setDuties] = useState<DutyUI[]>([]);

  const [activePage, setActivePage] = useState(0);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ing' | 'done'>('all');

  // 업로드 팝업
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [uploadTaskId, setUploadTaskId] = useState<number | null>(null);

  /* ---------------------- 데이터 로드 ---------------------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (!pid) return;

        // 1) 내 정보
        const me = obj(await useMemberApi.me(pid));
        const myName = me.name ?? '';
        setUserName(myName);

        // 2) 당번 목록
        const dutyRes = await useDutyApi.list(pid);
        const dutyList = dutyRes?.data?.data?.duties ?? dutyRes?.data?.duties ?? dutyRes?.data ?? [];

        // 3) 당번별 태스크
        const result: DutyUI[] = [];
        for (const d of dutyList) {
        const dutyId = (typeof d?.dutyId === 'number' ? d.dutyId : d?.id) as number;
        if (!dutyId) continue;
        const info = await useDutyApi.getCleaningInfo(pid, dutyId);
        const raw: any[] = Array.isArray(info?.data?.tasks) ? info.data.tasks : arr(info?.data);

          const tasks: TaskUI[] = raw.map((t) => {
            const members = (t.members ?? t.assignees ?? []).map((m: any) => m?.name ?? m);
            const mine = !!myName && (members.includes(myName) || members.includes('멤버 전체'));
            return {
              id: t.id,
              title: t.name ?? t.title ?? '',
              dueTime: t.dueTime ?? null,
              members,
              isCamera: !!t.needPhoto,
              isChecked: !!t.completed,
              completedAt: t.completedAt ?? null,
              completedBy: t.completedBy ?? null,
              date: t.date ?? null,
              dutyId: dutyId,
              mine,
            };
          });

          const iconKey: DutyIconKey =
            (['FLOOR_BLUE','CLEANER_PINK','BUCKET_PINK','TOILET_PINK','TRASH_BLUE','DISH_BLUE','BRUSH_PINK','SPRAY_BLUE']
            .includes(d.iconKey ?? '') ? d.iconKey : 'SPRAY_BLUE') as DutyIconKey;

          result.push({ id: d.dutyId, name: d.dutyName, iconKey, tasks });
        }

        setDuties(result);
      } finally {
        setLoading(false);
      }
    })();
  }, [pid]);

  /* ---------------------- 파생 값 ---------------------- */
  const allTasks = useMemo(() => duties.flatMap(d => d.tasks), [duties]);

  // 페이지(0=내 작업 전체, 1..=당번별)
  const page = useMemo(() => {
    const base = activePage === 0
      ? allTasks.filter(t => t.mine)
      : (duties[activePage - 1]?.tasks ?? []);
    const total = base.length;
    const done = base.filter(t => t.isChecked).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const name = activePage === 0 ? '내 체크리스트' : (duties[activePage - 1]?.name ?? '');
    return { name, percent, tasks: base };
  }, [activePage, allTasks, duties]);

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

  /* ---------------------- 이벤트 핸들러 ---------------------- */
  const goToNotification = () => { if (pid) navigate(`/${pid}/alarm`); };

  // 서버-토글 + 로컬반영
  const patchLocal = useCallback((id: number, patch: Partial<TaskUI>) => {
    setDuties(prev => prev.map(d => ({ ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, ...patch } : t) })));
  }, []);

  const toggleTask = async (taskId: number) => {
    const t = page.tasks.find(x => x.id === taskId);
    if (!t || !t.mine) return;

    try {
      if (t.isChecked) {
        await useChecklistApi.incompleteChecklist(pid, taskId);
        patchLocal(taskId, { isChecked: false, completedAt: null, completedBy: null });
      } else {
        await useChecklistApi.completeChecklist(pid, taskId);
        const now = new Date().toTimeString().slice(0, 5);
        patchLocal(taskId, { isChecked: true, completedAt: now, completedBy: userName });
      }
    } catch (e) {
      console.error(e);
      alert('체크 상태 변경 실패');
    }
  };

  // 업로드
  const openUploadFor = (id: number) => { setUploadTaskId(id); setUploadOpen(true); };
  const closeUpload = () => { setUploadOpen(false); setUploadTaskId(null); };
  const confirmUpload = async (file: File) => {
    if (uploadTaskId == null) return;
    try {
      const { data: presign } = await useChecklistApi.createPhotoUploadUrl(pid, uploadTaskId, {
        originalFileName: file.name, contentType: file.type,
      });
      const put = await fetch(presign.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
      if (!put.ok) throw new Error('업로드 실패');
      await useChecklistApi.completePhotoUpload(pid, uploadTaskId, { s3Key: presign.s3Key });

      const now = new Date().toTimeString().slice(0, 5);
      patchLocal(uploadTaskId, { isChecked: true, completedAt: now, completedBy: userName });
    } catch (e) {
      console.error(e);
      alert('사진 업로드 실패');
    } finally {
      closeUpload();
    }
  };

  // 스와이프
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActivePage(p => Math.min(p + 1, totalPages - 1)),
    onSwipedRight: () => setActivePage(p => Math.max(p - 1, 0)),
    trackMouse: true,
  });

  /* ---------------------- 렌더 ---------------------- */
  if (loading) return <div className="p-6">로딩중…</div>;
  const hasChecklist = visibleTasks.length > 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 배경 */}
      <div className="fixed top-0 left-0 w-full h-full z-0"
           style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '626px', backgroundPosition: 'center -200px', backgroundRepeat: 'no-repeat' }} />
      {/* 상단 */}
      <div {...swipeHandlers} className="relative z-10 px-5 pt-4 flex-shrink-0">
        <div className="flex flex-col items-center h-[420px]">
          <div className="flex items-center relative">
            <span className="font-passion-one font-bold text-[24px] text-white absolute left-1/2 -translate-x-1/2">당번</span>
            <div className="flex items-center gap-[210px]">
              <PlaceNameCard place="플레이스" type={page.percent >= 100 ? 'complete' : 'default'} />
              <img src={notificationImage} alt="알림" className="w-[36px] cursor-pointer" onClick={goToNotification} />
            </div>
          </div>
          <div className="mt-[66px] mb-[18px]">
            <ProgressBar percentage={page.percent} iconSrc={sweepIcon} title={page.name}
                         dotCount={totalPages} dotIndex={activePage} onDotSelect={setActivePage} />
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
              {visibleTasks.map((t) => {
                const canUpload = t.mine && !t.isChecked && t.isCamera;
                return (
                  <TaskCard
                    key={t.id}
                    title={t.title}
                    dueTime={t.dueTime ?? ''}
                    members={t.members}
                    isCamera={t.isCamera}
                    isChecked={t.isChecked}
                    completedAt={t.completedAt ?? undefined}
                    completedBy={t.completedBy ?? undefined}
                    disabled={!t.mine}
                    onToggle={() => (t.mine ? toggleTask(t.id) : undefined)}
                    onCameraClick={() => canUpload && setUploadOpen(true) && setUploadTaskId(t.id)}
                  />
                );
              })}
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

export default MemberHome;
