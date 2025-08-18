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
  const { placeId, notificationId } = useParams<{ placeId: string; notificationId: string }>();
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
      console.log('전달받은 알림 데이터:', passedNotification);
      
      if (passedNotification) {
        // 전달받은 데이터가 있으면 사용
        const parsed: NotificationDetailType = {
          id: Number(passedNotification.id),
          title: passedNotification.title,
          sender: '나', // 보낸 알림이므로 발신자는 '나'
          receivers: [], // 수신자 정보는 별도로 필요
          time: passedNotification.timeAgo,
          content: passedNotification.descript,
        };
        console.log('파싱된 알림 데이터:', parsed);
        setNotification(parsed);
        setLoading(false);
        return;
      }

      // 전달받은 데이터가 없으면 API 호출
      try {
        console.log('API 호출 시작');
        const res = await useNotificationApi.detail(Number(placeId), notificationId);
        const data = res?.data;
        console.log('API 응답:', data);

        const parsed: NotificationDetailType = {
          id: Number(data?.id ?? data?.notificationId),
          title: data?.title ?? '',
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
          <WritingChip label={notification.sender} type="member" />
        </div>

        <div className="flex gap-[12px] items-center my-[10px]">
          <span className="text-sm font-medium">받는 사람</span>
          {notification.receivers.map((r) => (
            <WritingChip key={r.id} label={r.name} type="member" />
          ))}
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
