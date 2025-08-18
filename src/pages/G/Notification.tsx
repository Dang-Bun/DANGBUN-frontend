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
	const getStoredNotifications = (): NotificationItem[] => {
		if (!placeId) return [];
		try {
			const stored = localStorage.getItem(`notifications_${placeId}`);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	};

	// localStorage에 알림 목록을 저장하는 함수
	const saveNotifications = (notifications: NotificationItem[]) => {
		if (!placeId) return;
		try {
			localStorage.setItem(`notifications_${placeId}`, JSON.stringify(notifications));
		} catch (error) {
			console.error('알림 저장 실패:', error);
		}
	};

	const [list, setList] = useState<NotificationItem[]>(() => getStoredNotifications());

	// 알림 목록이 변경될 때마다 localStorage에 저장
	useEffect(() => {
		saveNotifications(list);
	}, [list, placeId]);

	useEffect(() => {
		if (navState.justCreated && selectedTab === 'transmit' && placeId) {
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
			};
			setList(prev => {
				const exists = prev.some(p => p.id === optimistic.id);
				return exists ? prev : [optimistic, ...prev];
			});
			navigate(location.pathname, { replace: true, state: { tab: 'transmit' } });
		}
	}, [navState.justCreated, selectedTab, placeId]); // navigate, location.pathname 제거

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
							console.log('카드 클릭 - 전달할 데이터:', n);
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