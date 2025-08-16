import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import CreateNotificationIcon from '../../assets/notificationIcon/CreateNotificationIcon.svg';
import NotificationTab from '../../components/notification/NotificationTab';
import NotificationCard from '../../components/notification/NotificationCard';
import BottomBar from '../../components/BottomBar';
import useNotificationApi from '../../hooks/useNotificationApi';

type NotificationItem = {
  id: string;
  type: 'inbox' | 'transmit';
  title: string;
  descript: string;
  timeAgo: string;
  read: boolean;
};

const toArray = (raw: any): any[] => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.rows)) return raw.rows;
  if (Array.isArray(raw?.content)) return raw.content;
  if (Array.isArray(raw?.list)) return raw.list;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.data)) return raw.data;          
  return [];  
};

const Notification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { placeId: placeIdParam } = useParams<{ placeId: string }>();
  const placeId = useMemo(
    () =>
      placeIdParam && !Number.isNaN(Number(placeIdParam))
        ? Number(placeIdParam)
        : undefined,
    [placeIdParam]
  );

  const defaultTab = location.state?.tab === 'transmit' ? 'transmit' : 'inbox';
  const [selectedTab, setSelectedTab] = useState<'inbox' | 'transmit'>(defaultTab);

  const [list, setList] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!placeId) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setForbidden(false);

        const res =
          selectedTab === 'transmit'
            ? await useNotificationApi.listSent(placeId, { page: 0, size: 20 })
            : await useNotificationApi.listReceived(placeId, { page: 0, size: 20 });

        const raw = res?.data?.data;
        const rows = toArray(raw);

        const items: NotificationItem[] = rows.map((r: any) => ({
          id: String(r.id ?? r.notificationId ?? ''),
          type: selectedTab,
          title: r.title ?? '',
          descript: r.summary ?? r.content ?? '',
          timeAgo: r.createdAt ?? r.created_at ?? '',
          read: !!(r.read ?? r.isRead),
        }));

        if (mounted) setList(items);
      } catch (e: any) {
        if (!mounted) return;
        const status = e?.response?.status;
        if (status === 403) {
          setForbidden(true);
          setError(e?.response?.data?.message || '해당 플레이스에 소속된 멤버가 아닙니다.');
        } else if (status === 401) {
          setError('로그인이 필요합니다.');
        } else {
          setError(e?.response?.data?.message || e?.message || '불러오기 실패');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [placeId, selectedTab]);

  const handleWriteClick = () => {
    if (!placeId) return;
    navigate(`/${placeId}/alarm/create`);
  };

  const handleCardClick = (id: string) => {
    if (!placeId) return;
    navigate(`/${placeId}/alarm/${id}`);
  };

  if (!placeId) {
    return (
      <div className="flex flex-col items-center pt-[60px] pb-[80px] gap-4 bg-white min-h-screen">
        <Header title="알림함" />
        <div className="mt-6 px-6 text-center">
          <p className="text-sm text-red-500">유효하지 않은 접근입니다.</p>
          <p className="text-sm text-gray-500 mt-1">플레이스를 먼저 선택한 뒤 다시 시도해주세요.</p>
        </div>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-[60px] pb-[80px] gap-4 bg-white min-h-screen">
      <Header
        title="알림함"
        rightElement={<img src={CreateNotificationIcon} alt="쓰기 아이콘" className="w-[24px] h-[24px]" />}
        onRightClick={handleWriteClick}
      />

      <NotificationTab selectedTab={selectedTab} onChange={setSelectedTab} />

      <div className="flex flex-col items-center gap-4 mt-4 w-full px-4">
        {loading && <p className="text-sm text-gray-500">불러오는 중…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && forbidden && (
          <div className="flex flex-col items-center gap-3 mt-2">
            <button
              className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm"
              onClick={() => navigate(`/${placeId}/join`)}
            >
              이 플레이스 참여하기
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm"
              onClick={() => navigate('/places')}
            >
              다른 플레이스 선택
            </button>
          </div>
        )}

        {!loading && !error && !forbidden && list.length === 0 && (
          <p className="text-sm text-gray-500">알림이 없습니다.</p>
        )}

        {!forbidden &&
          list.map((n) => (
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

      <p className="text-xs text-[#848484]">
        모든 알림은 최대 <b>30일</b> 동안 저장됩니다.
      </p>
      <BottomBar />
    </div>
  );
};

export default Notification;
