import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TemplateCard from '../../components/notification/TemplateCard';
import TemplateButton from '../../components/notification/TemplateButton';
import Header from '../../components/HeaderBar';
import plusButton from '../../assets/notificationIcon/plusButton.svg';
import SearchModal from '../../components/notification/SearchModal';
import type { SearchHandler } from '../../components/notification/SearchModal';
import MemberPopUp from '../../components/notification/MemberPopUp';
import WritingChip from '../../components/notification/WritingChip';
import CTAButton from '../../components/button/CTAButton';
import Toast from '../../components/PopUp/TostPopUp';
import useDutyApi from '../../hooks/useDutyApi';
import useNotificationApi from '../../hooks/useNotificationApi';

type Duty = { id: number; name?: string };
type Person = { id: number; name: string };

const TEMPLATE_MAP = {
	clean: 'CLEANING_PENDING',
	newMember: 'NEW_MEMBER_JOINED',
	update: 'TASK_LIST_UPDATE',
} as const;

const DEFAULT_MSG: Record<keyof typeof TEMPLATE_MAP, string> = {
	clean: '미완료된 청소를 진행해주세요.',
	newMember: '새로운 멤버가 참여했어요.',
	update: '청소 목록 변동사항을 전달해주세요.',
};

const NotificationCreate: React.FC = () => {
	const navigate = useNavigate();
	const { placeId: placeIdParam } = useParams<{ placeId: string }>();
	const placeId = useMemo(() => Number(placeIdParam) || 1, [placeIdParam]);

	const [selectedCard, setSelectedCard] = useState<'template' | 'write'>('template');
	const [customContent, setCustomContent] = useState('');
	const [memberPopUp, setMemberPopUp] = useState(false);
	const [showDangbunList, setShowDangbunList] = useState(false);
	const [selectedDangbunId, setSelectedDangbunId] = useState<number | null>(null);
	const [selectedTemplateType, setSelectedTemplateType] =
		useState<'clean' | 'newMember' | 'update' | null>(null);
	const [dangbunSelections, setDangbunSelections] = useState<Record<number, number[]>>({});
	const [manualMembers, setManualMembers] = useState<Person[]>([]);
	const [toastMsg, setToastMsg] = useState('');
	const [showToast, setShowToast] = useState(false);
	const [duties, setDuties] = useState<Duty[]>([]);
	const [dutyMembers, setDutyMembers] = useState<Record<number, Person[]>>({});
	const [loadingMembers, setLoadingMembers] = useState(false);
	const searchModalRef = useRef<SearchHandler>(null);

	const handleMemberSelect = (type: 'dangbun' | 'member') => {
		setMemberPopUp(false);
		if (type === 'member') searchModalRef.current?.show();
		else setShowDangbunList(true);
	};

	const handleAddManualMember = (person: Person) => {
		setManualMembers((prev) => (prev.find((p) => p.id === person.id) ? prev : [...prev, person]));
	};

	const ReadyToSubmit =
		(Object.values(dangbunSelections).some((arr) => arr.length > 0) || manualMembers.length > 0) &&
		((selectedCard === 'template' && selectedTemplateType !== null) ||
		(selectedCard === 'write' && customContent.trim() !== ''));

	const handleTransmit = async () => {
		if (!ReadyToSubmit) return;

		const idsFromManual = manualMembers.map((m) => m.id).filter((id) => id > 0);
		const idsFromDangbun = Object.values(dangbunSelections)
			.flat()
			.filter((id) => id > 0);
		const recipientIds = Array.from(new Set([...idsFromManual, ...idsFromDangbun]));

		if (recipientIds.length === 0) {
			setToastMsg('전송할 수신자가 없습니다.');
			setShowToast(true);
			setTimeout(() => setShowToast(false), 1400);
			return;
		}

		let payload: {
			receiverMemberIds: number[];
			template: string;
			content: string;
		};

		if (selectedCard === 'template' && selectedTemplateType) {
			payload = {
				receiverMemberIds: recipientIds,
				template: TEMPLATE_MAP[selectedTemplateType],
				content: DEFAULT_MSG[selectedTemplateType],
			};
		} else {
			payload = {
				receiverMemberIds: recipientIds,
				template: 'CUSTOM',
				content: customContent.trim(),
			};
		}

		try {
			const res = await useNotificationApi.create(placeId, payload);
			console.log('알림 생성 응답:', res?.data); // 디버깅용 로그
			
			// 서버 응답 상태 확인 - 500 에러 등이 발생했을 때 처리
			if (!res || res.status >= 400) {
				throw new Error(`서버 오류: ${res?.status || '알 수 없는 오류'}`);
			}
			
			// 응답 데이터 확인
			if (res.data && res.data.code && res.data.code !== 20000) {
				throw new Error(`서버 오류: ${res.data.message || '알림 생성 실패'}`);
			}
			
			setToastMsg('알림이 성공적으로 전송되었습니다.');
			setShowToast(true);
			setTimeout(() => {
				setShowToast(false);
				// 서버 응답 데이터를 무시하고 항상 올바른 데이터 사용
				const notificationData = {
					id: Date.now(),
					title: selectedCard === 'template' && selectedTemplateType 
						? DEFAULT_MSG[selectedTemplateType] 
						: customContent.trim(),
					content: selectedCard === 'template' && selectedTemplateType 
						? DEFAULT_MSG[selectedTemplateType] 
						: customContent.trim(),
					template: selectedCard === 'template' && selectedTemplateType 
						? TEMPLATE_MAP[selectedTemplateType] 
						: 'CUSTOM',
					createdAt: new Date().toISOString(),
				};
				navigate(`/${placeId}/alarm`, {
					state: {
						tab: 'transmit',
						justCreated: notificationData,
					},
				});
			}, 1100);
		} catch (e: unknown) {
			console.error('알림 전송 실패:', e);
			const error = e as { response?: { status?: number; data?: { message?: string } }; message?: string };
			const st = error?.response?.status;
			const serverMsg = error?.response?.data?.message;
			const errorMsg = error?.message;
			
			let displayMsg = '';
			if (st === 500) {
				displayMsg = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (500)';
			} else if (st === 400) {
				displayMsg = '필수 입력이 누락됐습니다. (400)';
			} else if (serverMsg) {
				displayMsg = `${serverMsg}${st ? ` (${st})` : ''}`;
			} else if (errorMsg) {
				displayMsg = errorMsg;
			} else {
				displayMsg = `전송 실패${st ? ` (${st})` : ''}`;
			}
			
			setToastMsg(displayMsg);
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000); // 에러 메시지는 더 오래 표시
		}
	};

	useEffect(() => {
		if (!showDangbunList || duties.length > 0) return;
		(async () => {
			try {
				const res = await useDutyApi.list(placeId);
				const raw = res?.data;
				const arr: unknown[] = Array.isArray(raw)
					? raw
					: Array.isArray(raw?.data)
					? raw.data
					: Array.isArray(raw?.duties)
					? raw.duties
					: [];
				const parsed: Duty[] = arr
					.map((it: unknown) => {
						const item = it as { id?: number; dutyId?: number; duty_id?: number; name?: string; title?: string };
						const id = Number(item?.id ?? item?.dutyId ?? item?.duty_id);
						if (!Number.isFinite(id)) return null;
						return { id, name: item?.name ?? item?.title ?? `당번 ${id}` };
					})
					.filter(Boolean) as Duty[];
				setDuties(parsed);
			} catch {
				setDuties([]);
			}
		})();
	}, [showDangbunList, duties.length, placeId]);

	const ensureDutyMembers = async (dutyId: number): Promise<Person[]> => {
		if (dutyMembers[dutyId]) return dutyMembers[dutyId];
		setLoadingMembers(true);
		try {
			const res = await useDutyApi.getMembers(placeId, dutyId);
			const raw = res?.data;
			const list: Person[] = Array.isArray(raw)
				? raw
					.map((m: unknown) => {
						const member = m as { id?: number; memberId?: number; name?: string; memberName?: string };
						return {
							id: Number(member?.id ?? member?.memberId),
							name: String(member?.name ?? member?.memberName ?? ''),
						};
					})
					.filter((p) => Number.isFinite(p.id) && p.name)
				: Array.isArray(raw?.data)
				? raw.data
					.map((m: unknown) => {
						const member = m as { id?: number; memberId?: number; name?: string; memberName?: string };
						return {
							id: Number(member?.id ?? member?.memberId),
							name: String(member?.name ?? member?.memberName ?? ''),
						};
					})
					.filter((p) => Number.isFinite(p.id) && p.name)
				: Array.isArray(raw?.members)
				? raw.members
					.map((m: unknown) => {
						const member = m as { id?: number; memberId?: number; name?: string; memberName?: string };
						return {
							id: Number(member?.id ?? member?.memberId),
							name: String(member?.name ?? member?.memberName ?? ''),
						};
					})
					.filter((p) => Number.isFinite(p.id) && p.name)
				: [];
			setDutyMembers((prev) => ({ ...prev, [dutyId]: list }));
			return list;
		} finally {
			setLoadingMembers(false);
		}
	};

	return (
		<div>
			<Header title="알림 작성" />
			<div className="px-[20px] pt-[68px]">
				<div className="flex items-center gap-[8px]">
					<p className="text-base font-semibold">To:</p>
					<p className="text-sm font-medium">
						{[
							...Object.entries(dangbunSelections)
								.map(([idStr, ids]) => {
									const dutyId = Number(idStr);
									const names =
										(dutyMembers[dutyId] || [])
											.filter((p) => ids.includes(p.id))
											.map((p) => p.name);
									return names.length ? `당번 ${dutyId} (${names.join(', ')})` : null;
								})
								.filter(Boolean) as string[],
							...manualMembers.map((m) => m.name),
						].join(', ')}
					</p>

					<div className="relative ml-2">
						<img
							src={plusButton}
							alt="멤버/당번 추가 버튼"
							onClick={() => setMemberPopUp((v) => !v)}
							className="w-[20px] h-[20px] cursor-pointer"
						/>
						{memberPopUp && (
							<div className="absolute left-0 z-50">
								<MemberPopUp onSelect={handleMemberSelect} />
							</div>
						)}
					</div>
				</div>

				{showDangbunList && (
					<div className="overflow-x-auto whitespace-nowrap hide-scrollbar mt-3">
						{duties.map((duty) => {
							const isSelected = selectedDangbunId === duty.id;
							return (
								<div
									key={duty.id}
									className="inline-block mr-2 cursor-pointer"
									onClick={async () => {
										if (isSelected) {
											setSelectedDangbunId(null);
											return;
										}
										setSelectedDangbunId(duty.id);
										const members = await ensureDutyMembers(duty.id);
										const memberIds = members.map((m) => m.id);
										setDangbunSelections((prev) => ({
											...prev,
											[duty.id]: memberIds,
										}));
									}}
								>
									<WritingChip
										label={duty.name ?? `당번 ${duty.id}`}
										type="dangbun"
										selected={isSelected}
									/>
								</div>
							);
						})}
					</div>
				)}

				{selectedDangbunId && (
					<div className="flex flex-wrap gap-2 mt-3">
						{loadingMembers && !dutyMembers[selectedDangbunId] ? (
							<p className="text-sm text-gray-500 px-1">멤버를 불러오는 중...</p>
						) : dutyMembers[selectedDangbunId] ? (
							dutyMembers[selectedDangbunId].length > 0 ? (
								dutyMembers[selectedDangbunId].map((person) => {
									const selected =
										(dangbunSelections[selectedDangbunId] || []).includes(person.id);
									return (
										<div
											key={person.id}
											className="cursor-pointer"
											onClick={() => {
												setDangbunSelections((prev) => {
													const current = prev[selectedDangbunId] || [];
													const updated = selected
														? current.filter((id) => id !== person.id)
														: [...current, person.id];
													return { ...prev, [selectedDangbunId]: updated };
												});
											}}
										>
											<WritingChip label={person.name} type="member" selected={selected} />
										</div>
									);
								})
							) : (
								<p className="text-sm text-gray-500 px-1">멤버가 없습니다.</p>
							)
						) : null}
					</div>
				)}

				<div>
					<p className="text-base font-semibold py-[12px]">어떤 내용을 보내시나요?</p>
					<div className="flex gap-[8px]">
						<div onClick={() => setSelectedCard('template')}>
							<TemplateButton label="템플릿" selected={selectedCard === 'template'} />
						</div>
						<div onClick={() => setSelectedCard('write')}>
							<TemplateButton label="직접 입력" selected={selectedCard === 'write'} />
						</div>
					</div>

					{selectedCard === 'template' && (
						<div className="flex flex-col gap-[8px] mt-4">
							<TemplateCard
								type="clean"
								selected={selectedTemplateType === 'clean'}
								onClick={() => setSelectedTemplateType('clean')}
							/>
							<TemplateCard
								type="newMember"
								selected={selectedTemplateType === 'newMember'}
								onClick={() => setSelectedTemplateType('newMember')}
							/>
							<TemplateCard
								type="update"
								selected={selectedTemplateType === 'update'}
								onClick={() => setSelectedTemplateType('update')}
							/>
						</div>
					)}

					{selectedCard === 'write' && (
						<div className="relative w-full mt-4">
							<textarea
								placeholder="알림 내용을 작성해주세요"
								className={`w-[353px] h-[325px] bg-[#F9F9F9] font-normal text-sm py-[24px] px-[21px] rounded-[16px] outline-none resize-none ${
									customContent.trim() === '' ? 'text-[#797C82]' : 'text-black'
								}`}
								rows={6}
								maxLength={1000}
								value={customContent}
								onChange={(e) => setCustomContent(e.target.value)}
							/>
							<p className="text-sm text-right text-[#797C82] absolute bottom-[16px] right-[22px]">
								{customContent.length} / 1000
							</p>
						</div>
					)}
				</div>

				<CTAButton
					variant={ReadyToSubmit ? 'blue' : 'thickGray'}
					disabled={!ReadyToSubmit}
					style={{ position: 'fixed', bottom: '36px' }}
					onClick={handleTransmit}
				>
					전송
				</CTAButton>

				<SearchModal ref={searchModalRef} placeId={placeId} onSelectMember={handleAddManualMember} />
				<Toast message={toastMsg} visible={showToast} />
			</div>
		</div>
	);
};

export default NotificationCreate;