import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import WritingChip from '../../components/notification/WritingChip';
import ScrollToTop from '../../components/notification/ScrollToTop';
import BottomBar from '../../components/BottomBar';
import useNotificationApi from '../../hooks/useNotificationApi';

type NotificationDetailType = {
  id: number;
  title: string;
  sender: string;
  receivers: { id: number; name: string }[];
  time: string;
  content: string;
};

const NotificationDetail = () => {
  const { placeId, id } = useParams<{ placeId: string; id: string }>();
  const notificationId = id; // 라우터에서 :id로 정의되어 있으므로 id를 사용
  const location = useLocation();
  const [notification, setNotification] = useState<NotificationDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!placeId || !notificationId) {
        setLoading(false);
        return;
      }
      
      // location.state에서 전달받은 알림 데이터 확인
      const passedNotification = (location.state as any)?.notification;
      
      if (passedNotification) {
        // 제목을 첫 번째 마침표까지만 표시
        const titleWithFirstPeriod = passedNotification.title.includes('.') 
          ? passedNotification.title.split('.')[0] + '.'
          : passedNotification.title;
        
        // 전달받은 데이터가 있으면 사용
        const parsed: NotificationDetailType = {
          id: Number(passedNotification.id),
          title: titleWithFirstPeriod,
          sender: passedNotification.senderName || '나', // 실제 발신자 이름 사용
          receivers: passedNotification.receivers || [], // 실제 수신자 정보 사용
          time: passedNotification.timeAgo,
          content: passedNotification.descript,
        };
        setNotification(parsed);
        setLoading(false);
        return;
      }

      // 전달받은 데이터가 없으면 API 호출
      try {
        const res = await useNotificationApi.detail(Number(placeId), notificationId);
        const data = res?.data;

        // 제목을 첫 번째 마침표까지만 표시
        const apiTitle = data?.title ?? '';
        const apiTitleWithFirstPeriod = apiTitle.includes('.') 
          ? apiTitle.split('.')[0] + '.'
          : apiTitle;
        
        const parsed: NotificationDetailType = {
          id: Number(data?.id ?? data?.notificationId),
          title: apiTitleWithFirstPeriod,
          sender: data?.senderName ?? '알 수 없음',
          receivers: Array.isArray(data?.receivers)
            ? data.receivers.map((r: any) => ({
                id: Number(r?.id ?? r?.memberId),
                name: r?.name ?? r?.memberName ?? '멤버',
              }))
            : [],
          time: data?.createdAt ?? '',
          content: data?.content ?? data?.message ?? '',
        };

        setNotification(parsed);
      } catch (err) {
        console.error('API 호출 실패:', err);
        setNotification(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
  }, [placeId, notificationId, location.state]);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (!notification) return <div className="p-4">존재하지 않는 알림입니다.</div>;

  return (
    <div>
      <Header title="알림함" />
      <div className="px-[20px] pt-[68px] gap-[8px]">
        <p className="text-base font-bold mb-2">{notification.title}</p>

        <div className="flex gap-[12px] items-center my-[10px]">
          <span className="text-sm font-medium">보낸 사람</span>
          <WritingChip label={notification.sender} type="member" selected={true}/>
        </div>

        <div className="flex gap-[12px] items-center my-[10px]">
          <span className="text-sm font-medium">받는 사람</span>
          {notification.receivers.length > 0 ? (
            notification.receivers.map((r) => (
              <WritingChip key={r.id} label={r.name} type="member" selected={true} />
            ))
          ) : (
            <WritingChip label="전체" type="member" selected={true}/>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-4">{notification.time}</p>

        <div className="bg-[#F6F6F6] h-[1px] my-[16px]"></div>

        <p className="text-sm leading-relaxed mt-[6px] whitespace-pre-wrap">
          {notification.content}
        </p>
      </div>
      <ScrollToTop />
      <BottomBar />
    </div>
  );
};

export default NotificationDetail;
