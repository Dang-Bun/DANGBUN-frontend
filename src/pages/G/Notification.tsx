import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import CreateNotificationIcon from '../../assets/notificationIcon/CreateNotificationIcon.svg';
import NotificationTab from '../../components/notification/NotificationTab';
import NotificationCard from '../../components/notification/NotificationCard';
import BottomBar from '../../components/BottomBar';
import useNotificationApi from '../../hooks/useNotificationApi';
import { useMemberApi } from '../../hooks/useMemberApi';

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

	const navState = (location.state as { tab?: string; justCreated?: Record<string, unknown> }) || {};
	const defaultTab: 'inbox' | 'transmit' =
		navState.tab === 'transmit' ? 'transmit' : 'inbox';

	const [selectedTab, setSelectedTab] = useState<'inbox' | 'transmit'>(defaultTab);
	const [inboxList, setInboxList] = useState<NotificationItem[]>([]);
	const [transmitList, setTransmitList] = useState<NotificationItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | null>(null);

	// API에서 알림 목록을 가져오는 함수
	const fetchNotifications = async (tab: 'inbox' | 'transmit') => {
		if (!placeId) return;
		
		setLoading(true);
		try {
			let response;
			if (tab === 'inbox') {
				response = await useNotificationApi.listReceived(placeId, { page: 0, size: 50 });
			} else {
				response = await useNotificationApi.listSent(placeId, { page: 0, size: 50 });
			}

			console.log(`🔍 ${tab} API 응답:`, response?.data);

			// API 응답 구조에 맞게 데이터 추출
			const responseData = response?.data?.data || response?.data || {};
			const data = Array.isArray(responseData) 
				? responseData 
				: responseData?.notifications || responseData?.data || [];
			
			if (!Array.isArray(data)) {
				console.error(`${tab} 알림 목록 데이터가 배열이 아닙니다:`, data);
				if (tab === 'inbox') {
					setInboxList([]);
				} else {
					setTransmitList([]);
				}
				return;
			}
			
			const notifications: NotificationItem[] = data.map((item: Record<string, unknown>, index: number) => {
				// 서버에서 가져온 ID 사용
				let itemId: string | number | undefined;
				
				if (tab === 'inbox') {
					// 받은 알림: notificationReceiverId.notificationId 사용
					const notificationReceiverId = item.notificationReceiverId as Record<string, unknown> | undefined;
					itemId = notificationReceiverId?.notificationId as string | number | undefined;
				} else {
					// 보낸 알림: 직접 id 또는 notificationId 사용
					itemId = item.id || item.notificationId;
				}
				
				if (!itemId) {
					console.error('알림 ID를 찾을 수 없습니다:', item);
					return null;
				}
				
				const uniqueId = String(itemId);
				
				// 날짜 처리 개선
				const dateStr = item.createdAt || item.sentAt || item.createdTime || item.sentTime;
				let timeAgo = '방금 전';
				if (dateStr) {
					try {
						const date = new Date(String(dateStr));
						if (!isNaN(date.getTime())) {
							const now = new Date();
							const diffMs = now.getTime() - date.getTime();
							const diffMins = Math.floor(diffMs / (1000 * 60));
							const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
							const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
							
							if (diffMins < 1) timeAgo = '방금 전';
							else if (diffMins < 60) timeAgo = `${diffMins}분 전`;
							else if (diffHours < 24) timeAgo = `${diffHours}시간 전`;
							else if (diffDays < 7) timeAgo = `${diffDays}일 전`;
							else timeAgo = date.toLocaleDateString('ko-KR');
						}
					} catch (e) {
						console.warn('날짜 파싱 실패:', dateStr, e);
						timeAgo = '방금 전';
					}
				}
				
				// 보낸 알림과 받은 알림 구분
				let senderName = '알 수 없음';
				let receivers: { id: number; name: string }[] = [];
				
				if (tab === 'transmit') {
					// 보낸 알림: 현재 사용자가 보낸 사람
					senderName = currentUser?.name || '나';
					// 받는 사람들 정보
					if (Array.isArray(item.receivers || item.recipients)) {
						receivers = (item.receivers || item.recipients).map((r: unknown) => ({
							id: Number((r as Record<string, unknown>)?.id || 0),
							name: String((r as Record<string, unknown>)?.name || '')
						}));
					}
					

				} else {
					// 받은 알림: 현재 사용자가 받는 사람인지 확인
					// API 응답 구조에 따라 receiverId 확인
					const notificationReceiverId = item.notificationReceiverId as Record<string, unknown> | undefined;
					const receiverId = notificationReceiverId?.receiverId as number | undefined;
					
					// 현재 사용자가 받는 사람이 아니면 이 알림을 제외
					if (!currentUser || receiverId !== currentUser.id) {
						return null;
					}
					
					// 보낸 사람 정보 - API 문서에 따른 senderName 직접 사용
					senderName = String(item.senderName || '알 수 없음');
					
					// 받는 사람들 정보 - 현재 사용자 정보 사용
					receivers = [{
						id: currentUser.id,
						name: currentUser.name
					}];
				}
				
				// 읽음 상태 처리 - 받은 알림만 읽음 상태 고려
				const readStatus = tab === 'inbox' 
					? Boolean(item.isRead || item.read || false)  // 받은 알림만 읽음 상태 확인
					: false;  // 보낸 알림은 항상 읽음 처리됨으로 간주
				
				return {
					id: uniqueId,
					type: tab,
					title: String(item.title || item.content || '알림'),
					descript: String(item.content || item.message || ''),
					timeAgo,
					read: readStatus,
					senderName,
					receivers,
				};
			}).filter(Boolean) as NotificationItem[];

			if (tab === 'inbox') {
				setInboxList(notifications);
			} else {
				setTransmitList(notifications);
			}
		} catch (error) {
			console.error(`${tab} 알림 목록 가져오기 실패:`, error);
			if (tab === 'inbox') {
				setInboxList([]);
			} else {
				setTransmitList([]);
			}
		} finally {
			setLoading(false);
		}
	};

	// 현재 사용자 정보 가져오기
	useEffect(() => {
		const fetchCurrentUser = async () => {
			if (!placeId) return;
			
			try {
				const response = await useMemberApi.me(placeId);
				const userData = response?.data?.data || response?.data || response;
				if (userData) {
					setCurrentUser({
						id: Number(userData.id || userData.memberId || 0),
						name: String(userData.name || userData.memberName || userData.userName || '나')
					});
				}
			} catch (error) {
				console.error('현재 사용자 정보 가져오기 실패:', error);
			}
		};
		
		fetchCurrentUser();
	}, [placeId]);

	// 컴포넌트 마운트 시 알림 목록 가져오기
	useEffect(() => {
		if (placeId && currentUser) {
			fetchNotifications('inbox');
			fetchNotifications('transmit');
		}
	}, [placeId, currentUser]);

	// 탭 변경 시 해당 탭의 알림 목록 새로고침
	useEffect(() => {
		if (placeId && currentUser) {
			fetchNotifications(selectedTab);
		}
	}, [selectedTab, placeId, currentUser]);

	// 새로 생성된 알림 처리
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
					case 'CLEANING_LIST_CHANGED':
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
	}, [navState.justCreated, placeId, navigate, location.pathname]);

	const handleWriteClick = () => {
		if (!placeId) return;
		navigate(`/${placeId}/alarm/create`);
	};

	// 읽음 처리 함수 - 받은 알림에서만 작동
	const handleReadNotification = async (notificationId: string) => {
		if (!placeId) return;
		
		try {
			// markAsRead API로 읽음 처리
			await useNotificationApi.markAsRead(placeId, Number(notificationId));
			
			// 로컬 상태 업데이트 - 받은 알림만 업데이트
			setInboxList(prev => 
				prev.map(item => 
					item.id === notificationId ? { ...item, read: true } : item
				)
			);
			
			// 홈 화면의 알림 상태도 업데이트하기 위해 이벤트 발생
			window.dispatchEvent(new CustomEvent('notificationRead', { 
				detail: { placeId, notificationId } 
			}));
			
			// 읽지 않은 알림 상태 업데이트 이벤트 발생
			window.dispatchEvent(new CustomEvent('notificationStatusChanged', { 
				detail: { placeId } 
			}));
		} catch (error) {
			console.error('읽음 처리 실패:', error);
		}
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

	// 현재 선택된 탭에 따른 알림 목록
	const list = selectedTab === 'inbox' ? inboxList : transmitList;

	return (
		<div className="flex flex-col items-center pt-[60px] pb-[80px] gap-4 bg-white min-h-screen">
			<Header
				title="알림함"
				showBackButton={false}
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
				{loading && (
					<p className="text-sm text-gray-500">불러오는 중...</p>
				)}

				{!loading && list.length === 0 && (
					<p className="text-sm text-gray-500">알림이 없습니다.</p>
				)}

				{list.map((n) => (
					<NotificationCard
						key={n.id}
						type="manager"
						read={n.read}
						title={n.title}
						descript={n.descript}
						timeAgo={n.timeAgo}
						onClick={() => {
							console.log('🔍 알림 클릭:', {
								id: n.id,
								title: n.title,
								selectedTab,
								read: n.read,
								placeId
							});
							
							// 읽음 처리 - 받은 알림에서만
							if (selectedTab === 'inbox' && !n.read) {
								handleReadNotification(n.id);
							}
							
							const targetUrl = `/${placeId}/alarm/${n.id}`;
							console.log('🚀 이동할 URL:', targetUrl);
							
							navigate(targetUrl, {
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