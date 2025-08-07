import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import CreateNotificationIcon from '../../assets/notificationIcon/CreateNotificationIcon.svg';
import NotificationTab from '../../components/notification/NotificationTab';
import NotificationCard from '../../components/notification/NotificationCard';
import BottomBar from '../../components/BottomBar';

const notifications = [
  {
    id: '1',
    type: 'inbox',
    sender: '매니저',
    receiver: ['멤버1', '멤버2'],
    title: '미완료된 청소 빠르게 진행해주세요.',
    descript: '날씨가 덥고 습도가 높습니다. 빠르게 정리해주세요.',
    fullText: `날씨가 굉장히 덥고 종일 습도는 80%를 넘길 예정입니다.
비가 올 때는 물품을 잘 보호하시고, 우산에도 주의하세요.
관리자 드림.`,
    timeAgo: '1시간 전',
    read: false,

  },
  {
    id: '2',
    type: 'transmit',
    sender: '매니저',
    receiver: ['멤버1'],
    title: '청소 완료 확인되었습니다.',
    descript: '회원님이 맡은 청소가 완료되었습니다.',
    fullText: '청소 상태 확인 결과 이상 없습니다.',
    timeAgo: '3시간 전',
    read: true,
  }
];


const Notification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTab = location.state?.tab === 'transmit' ? 'transmit' : 'inbox'; 
  const [selectedTab, setSelectedTab] = useState<'inbox' | 'transmit'>(defaultTab);


  const handleWriteClick = () => {
    navigate('/alarm/create');
  };

  const handleCardClick = (id: string) => {
    navigate(`/alarm/${id}`);
  };

  const filtered = notifications.filter(n => n.type === selectedTab);

  return (
    <div className="flex flex-col items-center pt-[60px] pb-[80px] gap-4 bg-white min-h-screen">
      <Header
        title="알림함"
        rightElement={
          <img
            src={CreateNotificationIcon}
            alt="쓰기 아이콘"
            className="w-[24px] h-[24px]"
          />
        }
        onRightClick={handleWriteClick}
      />

      <NotificationTab selectedTab={selectedTab} onChange={setSelectedTab}/>

      <div className="flex flex-col items-center gap-4 mt-4">
        {filtered.map(n => (
          <NotificationCard
            key={n.id}
            type="member"
            read={n.read}
            title={n.title}
            descript={n.descript}
            timeAgo={n.timeAgo}
            onClick={() => handleCardClick(n.id)}
          />
        ))}
      </div>
      <p className="text-xs text-[#848484]">모든 알림은 최대 <b>30일</b> 동안 저장됩니다.</p>
      <BottomBar></BottomBar>
    </div>
  );
};

export default Notification;
