import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceNameCard from '../../components/home/PlaceNameCard';
import TaskCard from '../../components/home/TaskCard';
import CircularProgressBar from '../../components/home/CircularProgressBar';
import mail from '../../assets/home/mail.svg';
import mailDefault from '../../assets/home/mailDefault.svg';
import sweepIcon from '../../assets/cleanIcon/sweepImg_1.svg';
import BottomBar from '../../components/BottomBar';
import page0 from '../../assets/home/page0.svg';
import page100 from '../../assets/home/page100.svg';
import pageMiddle from '../../assets/home/pageMiddle.svg';
import sort from '../../assets/home/sortIcon.svg';
import toggle from '../../assets/home/toggleIcon.svg';
import CategoryChip from '../../components/home/CategoryChip';

interface Task {
  id: number;
  title: string;
  dueTime: string;
  members: string[];
  isCamera: boolean;
  isChecked: boolean;
}

const initialTasks: Task[] = [
  { id: 1, title: '창문 닦기', dueTime: '20:20', members: ['김효정', '박한나', '이민준', '최유리'], isCamera: false, isChecked: true },
  { id: 2, title: '바닥 닦기', dueTime: '20:20', members: ['박한나'], isCamera: true, isChecked: false },
  { id: 3, title: '창문 닦기', dueTime: '20:20', members: ['멤버 전체'], isCamera: false, isChecked: false },
  { id: 4, title: '창문 닦기', dueTime: '20:20', members: [''], isCamera: false, isChecked: false },
];

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ing' | 'done'>('all');
  const navigate = useNavigate();
  
  const goToNotification = () => {
    navigate('/alarm'); 
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isChecked: !task.isChecked } : task
      )
    );
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    if (filter === 'ing') return tasks.filter(task => task.isChecked);
    return tasks.filter(task => !task.isChecked);
  }, [filter, tasks]);

  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.isChecked).length;
    return Math.round((completedTasks / tasks.length) * 100);
  }, [tasks]);

  const hasUnreadNotifications = useMemo(() => {
    return tasks.some(task => !task.isChecked);
  }, [tasks]);

  const notificationImage = hasUnreadNotifications ? mailDefault : mail;

  const backgroundImage = useMemo(() => {
    if (completionPercentage === 0) {
      return '/bg/bg0.svg';
    }
    if (completionPercentage === 100) {
      return '/bg/bg100.svg';
    }
    return '/bg/bgMiddle.svg';
  }, [completionPercentage]);

  const backgroundToggle = useMemo(() => {
    if (completionPercentage === 0) {
      return page0;
    }
    if (completionPercentage === 100) {
      return page100;
    }
    return pageMiddle;
  }, [completionPercentage]);

  return (
    <div className="px-5 pt-4 relative">
      <div
        className="absolute top-0 left-0 w-full h-full z-0 transition-all duration-500"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '626px',
          backgroundPosition: 'center -200px',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center h-[420px]">
          <div className="flex items-center relative">
            <span className="font-passion-one font-bold text-[24px] text-white absolute left-1/2 transform -translate-x-1/2">
              당번
            </span>

            <div className="flex items-center gap-[210px]">
              <PlaceNameCard
                place="플레이스 이름"
                type={completionPercentage === 0 ? 'default' : 'complete'}
              />
              <img src={notificationImage} alt="알림 아이콘" className="w-[36px] cursor-pointer " onClick={goToNotification}/>
            </div>
          </div>

          <div className="mt-[66px] mb-[25px]">
            <CircularProgressBar percentage={completionPercentage} iconSrc={sweepIcon} />
          </div>
          <img src={backgroundToggle} alt="" />
        </div>

        <main className="">
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex justify-center items-center">
              <h2 className="text-[14px] pl-1 text-[#4D83FD] font-semibold">
                {filter === 'all' ? '전체 청소' : filter === 'ing' ? '달성 완료' : '달성 미완료'}
              </h2>
              <img
                src={toggle}
                alt="달성 여부 정렬"
                onClick={() => setMemberPopUp(!memberPopUp)}
                className="w-[20px] h-[20px] cursor-pointer"
              />
              {memberPopUp && (
                <div className="absolute ml-[20px] top-[calc(100%+10px)] z-50">
                  <CategoryChip onSelect={(type) => { setFilter(type); setMemberPopUp(false); }} />
                </div>
              )}
            </div>

            <img src={sort} alt="정렬" />
          </div>

          <div className="flex flex-col gap-3">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                title={task.title}
                dueTime={task.dueTime}
                members={task.members}
                isCamera={task.isCamera}
                isChecked={task.isChecked}
                onToggle={() => handleToggleTask(task.id)}
              />
            ))}
          </div>
        </main>
      </div>
      <BottomBar />
    </div>
  );
};

export default Home;
