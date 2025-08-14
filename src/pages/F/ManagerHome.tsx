import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import PlaceNameCard from '../../components/home/PlaceNameCard';
import TaskCard from '../../components/home/TaskCard';
import ProgressBar from '../../components/home/CircularProgressBar';
import BottomBar from '../../components/BottomBar';
import CategoryChip from '../../components/home/CategoryChip';
import mail from '../../assets/home/mail.svg';
import mailDefault from '../../assets/home/mailDefault.svg';
import toggle from '../../assets/home/toggleIcon.svg';
import sweepIcon from '../../assets/cleanIcon/sweepImg_1.svg';
import { usePagePRogress, type Duty } from '../../hooks/F/usePageProgress';
import { useDutyStore } from '../../stores/useDutyStore';

type DutyIconKey =
  | 'FLOOR_BLUE'
  | 'CLEANER_PINK'
  | 'BUCKET_PINK'
  | 'TOILET_PINK'
  | 'TRASH_BLUE'
  | 'DISH_BLUE'
  | 'BRUSH_PINK'
  | 'SPRAY_BLUE';

type DutyWithIcon = Duty & { iconKey: DutyIconKey };

const initialDuties: DutyWithIcon[] = [
  {
    id: 101,
    name: '로비 청소',
    iconKey: 'DISH_BLUE',
    tasks: [
      { id: 1, title: '창문 닦기', dueTime: '20:20', members: ['김효정', '박한나', '이민준', '최유리'], isCamera: false, isChecked: false },
      { id: 2, title: '바닥 닦기', dueTime: '20:20', members: ['박한나'], isCamera: true, isChecked: false },
      { id: 3, title: '거미줄 제거', dueTime: '21:00', members: ['김효정'], isCamera: false, isChecked: false },
      { id: 4, title: '소파 청소', dueTime: '21:00', members: ['이민준', '최유리'], isCamera: true, isChecked: false },
    ],
  },
  {
    id: 102,
    name: '탕비실 청소',
    iconKey: 'BUCKET_PINK',
    tasks: [
      { id: 5, title: '싱크대 청소', dueTime: '20:20', members: ['멤버 전체'], isCamera: false, isChecked: false },
      { id: 6, title: '냉장고 정리', dueTime: '20:20', members: ['박한나', '김효정'], isCamera: false, isChecked: false },
      { id: 7, title: '전자레인지 닦기', dueTime: '20:20', members: ['이민준'], isCamera: false, isChecked: false },
      { id: 8, title: '바닥 쓸기', dueTime: '20:20', members: ['최유리'], isCamera: false, isChecked: false },
    ],
  },
  {
    id: 103,
    name: '창고 정리',
    iconKey: 'BRUSH_PINK',
    tasks: [
      { id: 9, title: '상품 박스 정리', dueTime: '20:20', members: ['멤버 전체'], isCamera: false, isChecked: false },
      { id: 10, title: '재고 라벨링', dueTime: '20:20', members: ['멤버 전체'], isCamera: false, isChecked: false },
      { id: 11, title: '바닥 쓸기', dueTime: '20:20', members: ['이민준'], isCamera: false, isChecked: false },
      { id: 12, title: '폐기물 분리', dueTime: '20:20', members: ['최유리'], isCamera: false, isChecked: false },
    ],
  },
];

const ManagerHome: React.FC = () => {
  const navigate = useNavigate();
  const { role, placeId } = (useLocation().state || {}) as { role?: string; placeId?: number };

  const [duties, setDuties] = useState<DutyWithIcon[]>(initialDuties);
  const [activePage, setActivePage] = useState(0);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ing' | 'done'>('all');

  useEffect(() => {
    if (role) localStorage.setItem('role', role);
    if (placeId) localStorage.setItem('placeId', String(placeId));
  }, [role, placeId]);

  const currentUser = localStorage.getItem('userName') || 'userName';
  const placeIconKey = useDutyStore((s) => s.placeIconKey) ?? 'CINEMA';

  const formatNowHHmm = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const goToNotification = () => navigate('/alarm');

  const { visibleTasks, page, totalPages, placeAllTasks, canToggle } =
    usePagePRogress(activePage, duties, { mode: 'manager' });

  const placePercent = useMemo(() => {
    const total = placeAllTasks.length;
    const done = placeAllTasks.filter((t) => t.isChecked).length;
    return total ? Math.round((done / total) * 100) : 0;
  }, [placeAllTasks]);

  const dutyPercent = (d: Duty) => {
    const total = d.tasks.length;
    const done = d.tasks.filter((t) => t.isChecked).length;
    return total ? Math.round((done / total) * 100) : 0;
  };

  const dutiesForOverview = useMemo(
    () =>
      duties.map((d) => ({
        id: d.id,
        name: d.name,
        percent: dutyPercent(d),
        iconKey: d.iconKey,
      })),
    [duties]
  );

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return visibleTasks;
    if (filter === 'ing') return visibleTasks.filter((t) => t.isChecked);
    return visibleTasks.filter((t) => !t.isChecked);
  }, [filter, visibleTasks]);

  const hasUnreadNotifications = useMemo(() => placeAllTasks.some((t) => !t.isChecked), [placeAllTasks]);
  const notificationImage = hasUnreadNotifications ? mailDefault : mail;

  const backgroundImage = useMemo(() => {
    if (page.status === 'before') return '/bg/bg0.svg';
    if (page.status === 'done') return '/bg/bg100.svg';
    return '/bg/bgMiddle.svg';
  }, [page.status]);

  const handleToggleTask = (taskId: number) => {
    setDuties((prev) =>
      prev.map((d) => ({
        ...d,
        tasks: d.tasks.map((task) => {
          if (task.id !== taskId) return task;
          if (!canToggle(task)) return task;
          const next = !task.isChecked;
          return { ...task, isChecked: next, completedAt: next ? formatNowHHmm() : undefined, completedBy: next ? currentUser : undefined };
        }),
      }))
    );
  };

  const hasChecklist = visibleTasks.length > 0;
  const nextChecklistEta = ' ';

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActivePage((p) => Math.min(p + 1, totalPages - 1)),
    onSwipedRight: () => setActivePage((p) => Math.max(p - 1, 0)),
    trackMouse: true,
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      <div
        className="fixed top-0 left-0 w-full h-full z-0"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '626px', backgroundPosition: 'center -200px', backgroundRepeat: 'no-repeat' }}
      />
      <div {...swipeHandlers} className="relative z-10 px-5 pt-4 flex-shrink-0 ">
        <div className="flex flex-col items-center h-[420px]">
          <div className="flex items-center relative">
            <span className="font-passion-one font-bold text-[24px] text-white absolute left-1/2 transform -translate-x-1/2">당번</span>
            <div className="flex items-center gap-[210px]">
              <PlaceNameCard place="플레이스 이름" type={page.status === 'before' ? 'default' : 'complete'} />
              <img src={notificationImage} alt="알림 아이콘" className="w-[36px] cursor-pointer" onClick={goToNotification} />
            </div>
          </div>
          <div className="mt-[66px] mb-[18px]">
            <ProgressBar
              percentage={page.percent}
              iconSrc={sweepIcon}
              title={page.name}
              onCenterClick={() => {
                const payload = {
                  placeId,
                  placeName: '메가박스',
                  percent: placePercent,
                  placeIconKey,
                  duties: dutiesForOverview,
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
      <main className="relative z-10 px-5 flex flex-col flex-grow min-h-0">
        {hasChecklist ? (
          <>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <div className="relative flex justify-start items-center">
                <h2 className="text-[14px] pl-1 text-[#4D83FD] font-semibold">
                  {filter === 'all' ? '전체 청소' : filter === 'ing' ? '달성 완료' : '달성 미완료'}
                </h2>
                <img src={toggle} alt="달성 여부 정렬" onClick={() => setMemberPopUp(!memberPopUp)} className="w-[20px] h-[20px] cursor-pointer" />
                {memberPopUp && (
                  <div className="absolute ml-[20px] top-[calc(100%+10px)] z-50">
                    <CategoryChip onSelect={(type) => { setFilter(type); setMemberPopUp(false); }} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto pb-24 no-scrollbar">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  dueTime={task.dueTime}
                  members={task.members}
                  isCamera={task.isCamera}
                  isChecked={task.isChecked}
                  completedAt={task.completedAt}
                  completedBy={task.completedBy}
                  onToggle={() => handleToggleTask(task.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <section className="w-full mt-6 flex flex-col items-center text-center flex-shrink-0">
            <p className="text-[13px] text-[#99A2AE]">다음 체크리스트가 활성화되지 않았습니다.</p>
            <p className="text-[13px] text-[#99A2AE] mt-1">다음 체크리스트까지 {nextChecklistEta}</p>
          </section>
        )}
      </main>
      <div className="flex-shrink-0 z-10">
        <BottomBar />
      </div>
    </div>
  );
};

export default ManagerHome;
