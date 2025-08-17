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

  // 당번별 선택된 멤버 id
  const [dangbunSelections, setDangbunSelections] = useState<Record<number, number[]>>({});
  // 검색/수동 추가 멤버
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

    const content =
      selectedCard === 'write'
        ? customContent.trim()
        : selectedTemplateType === 'clean'
        ? '미완료된 청소를 진행해주세요.'
        : selectedTemplateType === 'newMember'
        ? '새로운 멤버가 참여했어요.'
        : selectedTemplateType === 'update'
        ? '청소 목록 변경사항을 전달해주세요.'
        : '';

    // 실제 존재하는(양수) id만 전송
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

    const variants = [
      { content, recipients: recipientIds.map((id) => ({ memberId: id })) }, // A
      { content, recipientIds },                                             // B
      { message: content, recipientIds },                                    // C
    ];

    try {
      let ok = false; let lastErr: any = null;
      for (const body of variants) {
        try {
          await useNotificationApi.create(placeId, body);
          ok = true; break;
        } catch (e: any) {
          lastErr = e;
          const st = e?.response?.status;
          if (st && st !== 400) break; // 비-400은 즉시 중단
        }
      }
      if (!ok) throw lastErr;

      setToastMsg('알림이 성공적으로 전송되었습니다.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/alarm', { state: { tab: 'transmit' } });
      }, 1100);
    } catch (e: any) {
      const st = e?.response?.status;
      setToastMsg(st === 400 ? '필수 입력이 누락됐습니다.(400)' : `전송 실패${st ? `(${st})` : ''}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1400);
    }
  };

  // 당번 목록: 당번 버튼을 처음 열었을 때 1회 로드
  useEffect(() => {
    if (!showDangbunList || duties.length > 0) return;
    (async () => {
      try {
        const res = await useDutyApi.list(placeId);
        const raw = res?.data;
        const arr: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.duties)
          ? raw.duties
          : [];
        const parsed: Duty[] = arr
          .map((it: any) => {
            const id = Number(it?.id ?? it?.dutyId ?? it?.duty_id);
            if (!Number.isFinite(id)) return null;
            return { id, name: it?.name ?? it?.title ?? `당번 ${id}` };
          })
          .filter(Boolean) as Duty[];
        setDuties(parsed);
      } catch {
        setDuties([]);
      }
    })();
  }, [showDangbunList, duties.length, placeId]);

  // 특정 당번 멤버 로드(캐시)
  const ensureDutyMembers = async (dutyId: number) => {
    if (dutyMembers[dutyId]) return;
    setLoadingMembers(true);
    try {
      const res = await useDutyApi.getMembers(placeId, dutyId);
      const raw = res?.data;
      const list: Person[] = Array.isArray(raw)
        ? raw
            .map((m: any) => ({
              id: Number(m?.id ?? m?.memberId),
              name: String(m?.name ?? m?.memberName ?? ''),
            }))
            .filter((p) => Number.isFinite(p.id) && p.name)
        : Array.isArray(raw?.data)
        ? raw.data
            .map((m: any) => ({
              id: Number(m?.id ?? m?.memberId),
              name: String(m?.name ?? m?.memberName ?? ''),
            }))
            .filter((p: any) => Number.isFinite(p.id) && p.name)
        : Array.isArray(raw?.members)
        ? raw.members
            .map((m: any) => ({
              id: Number(m?.id ?? m?.memberId),
              name: String(m?.name ?? m?.memberName ?? ''),
            }))
            .filter((p: any) => Number.isFinite(p.id) && p.name)
        : [];
      setDutyMembers((prev) => ({ ...prev, [dutyId]: list }));
    } finally {
      setLoadingMembers(false);
    }
  };

  return (
    <div>
      <Header title="알림 작성" />
      <div className="px-[20px] pt-[68px]">
        {/* To */}
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

        {/* 당번 리스트 */}
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
                    await ensureDutyMembers(duty.id);
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

        {/* 선택된 당번의 멤버 리스트 */}
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

        {/* 내용 */}
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
