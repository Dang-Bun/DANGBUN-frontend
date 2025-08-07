// src/pages/NotificationDetail.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import WritingChip from '../../components/notification/WritingChip';
import ScrollToTop from '../../components/notification/ScrollToTop';
import BottomBar from '../../components/BottomBar';

const dummyNotifications = [
  {
    id: '1',
    title: '미완료된 청소 빠르게 진행해주세요.',
    sender: '매니저',
    receiver: ['멤버 1', '멤버 2'],
    time: '2025.06.25 오전 10:11',
    content: `날씨가 굉장히 덥고,종일 습도는 80%를 넘길 예정입니다. 비가 올 때는 창문을 닫고 빗물받이, 우산꽂이, 우산털이를 준비해줍니다. 각 플레이스에서는 우산 정리와 출입구 주변 점검을 완료한 뒤, 이상 유무를 관리자에게 공유해주세요. 습기로 인한 곰팡이 발생 가능성도 고려해주시기 바랍니다.

관리자 드림.`
  },
  {
    id: '2',
    title: '청소 완료 확인되었습니다.',
    sender: '매니저',
    receiver: ['멤버 1'],
    time: '2025.06.25 오전 11:00',
    content: '청소 상태 확인 결과 이상 없습니다.'
  }
];

const NotificationDetail = () => {
  const { id } = useParams();

  const notification = dummyNotifications.find(n => n.id === id);

  if (!notification) return <div>존재하지 않는 알림입니다.</div>;

  return (
    <div>
       <Header title="알림함" />
        <div className='px-[20px] pt-[68px] gap-[8px]'>
            <p className="text-base font-bold mb-2">{notification.title}</p>

            <div className="flex gap-[12px] items-center my-[10px]">
                <span className="text-sm font-medium">보낸 사람</span>
                <WritingChip label='매니저' type='member'/>
            </div>

            <div className="flex gap-[12px] items-center my-[10px]">
                <span className="text-sm font-medium">받는 사람</span>
                {notification.receiver.map((r, idx) => (
                    <WritingChip key={idx} label={r} type='member'/>
                ))}
            </div>
            <p className="text-xs text-gray-500 mb-4">{notification.time}</p>

            <div className='bg-[#F6F6F6] h-[1px] my-[16px]'></div>

            <p className="text-sm leading-relaxed mt-[6px] whitespace-pre-wrap">{notification.content}</p>
        </div>
         <ScrollToTop/>
         <BottomBar/>
    </div>
  );
};

export default NotificationDetail;
