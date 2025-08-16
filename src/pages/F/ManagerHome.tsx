import React, { useMemo, useState, useEffect } from 'react';
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
import { useDutyStore, usePlaceIconKey, usePlacePercent, useDuties } from '../../stores/useDutyStore';
import { initialDuties } from '../../stores/Test/initialDuties';
import { usePagePRogress } from '../../hooks/F/usePageProgress';

const ManagerHome: React.FC = () => {
  const navigate = useNavigate();
  const { role, placeId } = (useLocation().state || {}) as { role?: string; placeId?: number };

  const duties = useDuties();
  const seedIfEmpty = useDutyStore((s) => s.seedIfEmpty);

  const [activePage, setActivePage] = useState(0);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ing' | 'done'>('all');
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [uploadTaskId, setUploadTaskId] = useState<number | null>(null);

  useEffect(() => {
    seedIfEmpty(initialDuties);
  }, [seedIfEmpty]);

  useEffect(() => {
    if (role) localStorage.setItem('role', role);
    if (placeId) localStorage.setItem('placeId', String(placeId));
  }, [role, placeId]);

  const currentUser = localStorage.getItem('userName') || 'userName';
  const placeIconKey = usePlaceIconKey() ?? 'CINEMA';
  const placePercent = usePlacePercent();

const goToNotification = () => {
  if (!placeId) return;
  navigate(`/${placeId}/alarm`);
};
  const { visibleTasks, page, totalPages, placeAllTasks } =
    usePagePRogress(activePage, duties, { mode: 'manager' });

  const dutiesForOverview = useMemo(
    () =>
      duties.map((d) => {
        const total = d.tasks.length;
        const done = d.tasks.filter((t) => t.isChecked).length;
        const percent = total ? Math.round((done / total) * 100) : 0;
        return { id: d.id, name: d.name, percent, iconKey: d.iconKey };
      }),
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
    useDutyStore.getState().toggleTask(taskId, currentUser);
  };

  const openUploadFor = (taskId: number) => {
    setUploadTaskId(taskId);
    setUploadOpen(true);
  };
  const closeUpload = () => {
    setUploadOpen(false);
    setUploadTaskId(null);
  };
  const handleConfirmUpload = (file: File) => {
    if (uploadTaskId != null) {
      useDutyStore.getState().toggleTask(uploadTaskId, currentUser);
    }
    closeUpload();
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
                  onCameraClick={() => !task.isChecked && task.isCamera && openUploadFor(task.id)}
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
      <UpLoadPopUp isOpen={isUploadOpen} onRequestClose={closeUpload} onConfirm={handleConfirmUpload} />
    </div>
  );
};

export default ManagerHome;
