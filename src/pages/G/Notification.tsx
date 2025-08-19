import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import CreateNotificationIcon from '../../assets/notificationIcon/CreateNotificationIcon.svg';
import NotificationTab from '../../components/notification/NotificationTab';
import NotificationCard from '../../components/notification/NotificationCard';
import BottomBar from '../../components/BottomBar';

type NotificationItem = {
	id: string;
	type: 'inbox' | 'transmit';
	title: string;
	descript: string;
	timeAgo: string;
	read: boolean;
	senderName?: string;
	receivers?: { id: number; name: string }[];
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

	const navState = (location.state as any) || {};
	const defaultTab: 'inbox' | 'transmit' =
		navState.tab === 'transmit' ? 'transmit' : 'inbox';

	const [selectedTab, setSelectedTab] = useState<'inbox' | 'transmit'>(defaultTab);
	
	// localStorage에서 알림 목록을 가져오는 함수
	const getStoredNotifications = (tab: 'inbox' | 'transmit'): NotificationItem[] => {
		if (!placeId) return [];
		try {
			const stored = localStorage.getItem(`notifications_${placeId}_${tab}`);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	};

	// localStorage에 알림 목록을 저장하는 함수
	const saveNotifications = (notifications: NotificationItem[], tab: 'inbox' | 'transmit') => {
		if (!placeId) return;
		try {
			localStorage.setItem(`notifications_${placeId}_${tab}`, JSON.stringify(notifications));
		} catch (error) {
			console.error('알림 저장 실패:', error);
		}
	};

	const [inboxList, setInboxList] = useState<NotificationItem[]>(() => getStoredNotifications('inbox'));
	const [transmitList, setTransmitList] = useState<NotificationItem[]>(() => getStoredNotifications('transmit'));

	// 현재 선택된 탭에 따른 알림 목록
	const list = selectedTab === 'inbox' ? inboxList : transmitList;

	// 알림 목록이 변경될 때마다 localStorage에 저장
	useEffect(() => {
		saveNotifications(inboxList, 'inbox');
	}, [inboxList, placeId]);

	useEffect(() => {
		saveNotifications(transmitList, 'transmit');
	}, [transmitList, placeId]);

	useEffect(() => {
		if (navState.justCreated && placeId) {
			const jc = navState.justCreated;
			
			// 템플릿 타입을 사용자 친화적인 제목으로 변환
			const getTitle = (template: string) => {
				switch (template) {
					case 'CLEANING_PENDING':
						return '미완료된 청소를 진행해주세요.';
					case 'NEW_MEMBER_JOINED':
						return '새로운 멤버가 참여했어요.';
					case 'TASK_LIST_UPDATE':
						return '청소 목록 변동사항을 전달해주세요.';
					default:
						return '알림';
				}
			};

			const optimistic: NotificationItem = {
				id: String(jc.id ?? jc.notificationId ?? Date.now()),
				type: 'transmit',
				title: jc.title ?? (jc.template ? getTitle(jc.template) : '알림'),
				descript: jc.content ?? jc.message ?? '',
				timeAgo: jc.createdAt ?? new Date().toISOString(),
				read: false,
				senderName: jc.senderName || '나',
				receivers: jc.receivers || [],
			};
			
			// 보낸 알림 탭에만 추가
			setTransmitList(prev => {
				const exists = prev.some(p => p.id === optimistic.id);
				return exists ? prev : [optimistic, ...prev];
			});
			
			navigate(location.pathname, { replace: true, state: { tab: 'transmit' } });
		}
	}, [navState.justCreated, placeId]); // selectedTab 제거

	const handleWriteClick = () => {
		if (!placeId) return;
		navigate(`/${placeId}/alarm/create`);
	};

	if (!placeId) {
		return (
			<div className="flex flex-col items-center pt-[60px] pb-[80px] gap-4 bg-white min-h-screen">
				<Header title="알림함" />
				<div className="mt-6 px-6 text-center">
					<p className="text-sm text-red-500">유효하지 않은 접근입니다.</p>
					<p className="text-sm text-gray-500 mt-1">
						플레이스를 먼저 선택한 뒤 다시 시도해주세요.
					</p>
				</div>
				<BottomBar />
			</div>
		);
	}

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

			<NotificationTab selectedTab={selectedTab} onChange={(tab) => setSelectedTab(tab)} />

			<div className="flex flex-col items-center gap-4 mt-4 w-full px-4">
				{list.length === 0 && (
					<p className="text-sm text-gray-500">알림이 없습니다.</p>
				)}

				{list.map((n) => (
					<NotificationCard
						key={n.id}
						type="member"
						read={n.read}
						title={n.title}
						descript={n.descript}
						timeAgo={n.timeAgo}
						onClick={() => {
							// 읽음 처리
							if (!n.read) {
								if (selectedTab === 'inbox') {
									setInboxList(prev => 
										prev.map(item => 
											item.id === n.id ? { ...item, read: true } : item
										)
									);
								} else {
									setTransmitList(prev => 
										prev.map(item => 
											item.id === n.id ? { ...item, read: true } : item
										)
									);
								}
							}
							
							navigate(`/${placeId}/alarm/${n.id}`, {
								state: {
									notification: n
								}
							});
						}}
					/>
				))}
			</div>

			<p className="text-xs text-[#848484]">
				모든 알림은 최대 <span className="font-semibold"> 30일 </span> 동안 저장됩니다.
			</p>
			<BottomBar />
		</div>
	);
};

export default Notification;