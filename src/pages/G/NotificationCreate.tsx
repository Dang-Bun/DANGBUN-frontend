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

type Person = { id: number; name: string };
type Duty = { id: number; name?: string };

const NotificationCreate: React.FC = () => {
  const navigate = useNavigate();
  const { placeId: placeIdParam } = useParams<{ placeId: string }>();
  const placeId = useMemo(
    () => (placeIdParam && !Number.isNaN(Number(placeIdParam)) ? Number(placeIdParam) : undefined),
    [placeIdParam]
  );

  const [selectedCard, setSelectedCard] = useState<'template' | 'write'>('template');
  const [customContent, setCustomContent] = useState('');
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [showDangbunList, setShowDangbunList] = useState(false);
  const [selectedDangbunId, setSelectedDangbunId] = useState<number | null>(null);
  const [selectedTemplateType, setSelectedTemplateType] =
    useState<'clean' | 'newMember' | 'update' | null>(null);

  // 1단계에서 추가한 당번 목록
  const [duties, setDuties] = useState<Duty[]>([]);
  const [dutyError, setDutyError] = useState<string | null>(null);
  const [dutyLoading, setDutyLoading] = useState(false);

  // 2단계: 당번별 멤버 목록 & 선택 상태
  const [dutyMembers, setDutyMembers] = useState<Record<number, Person[]>>({});
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [selectedByDuty, setSelectedByDuty] = useState<Record<number, number[]>>({});

  // 기존처럼 문자열로 관리(검색모달은 다음 단계에서 id까지 붙일 예정)
  const [manualMembers, setManualMembers] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const searchModalRef = useRef<SearchHandler>(null);

  // 당번 리스트 로드 (1단계)
  useEffect(() => {
    if (!placeId || !showDangbunList) return;
    let mounted = true;
    (async () => {
      try {
        setDutyLoading(true);
        setDutyError(null);
        const res = await useDutyApi.list(placeId);
        const raw = res?.data?.data ?? [];
        const list: Duty[] = Array.isArray(raw) ? raw.map((d: any) => ({ id: d.id, name: d.name })) : [];
        if (mounted) {
          setDuties(list);
          if (!selectedDangbunId && list[0]) setSelectedDangbunId(list[0].id);
        }
      } catch (e: any) {
        if (mounted) setDutyError(e?.response?.data?.message || e?.message || '당번 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) setDutyLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [placeId, showDangbunList]);

  // 2단계: 선택된 당번의 멤버 목록 로드
  useEffect(() => {
    if (!placeId || !selectedDangbunId) return;
    // 이미 불러왔으면 재호출 생략(원하면 제거 가능)
    if (dutyMembers[selectedDangbunId]) return;

    let mounted = true;
    (async () => {
      try {
        setMemberLoading(true);
        setMemberError(null);
        const res = await useDutyApi.getMembers(placeId, selectedDangbunId);
        const raw = res?.data?.data ?? [];
        const people: Person[] = Array.isArray(raw)
          ? raw.map((m: any) => ({ id: Number(m.id), name: String(m.name) }))
          : [];
        if (!mounted) return;
        setDutyMembers((prev) => ({ ...prev, [selectedDangbunId]: people }));
        // 기본값: 처음 로드 시 해당 당번의 모든 멤버 선택 상태로
        setSelectedByDuty((prev) => ({ ...prev, [selectedDangbunId]: people.map((p) => p.id) }));
      } catch (e: any) {
        if (!mounted) return;
        setMemberError(e?.response?.data?.message || e?.message || '해당 당번의 멤버를 불러오지 못했습니다.');
      } finally {
        if (mounted) setMemberLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [placeId, selectedDangbunId, dutyMembers]);

  const handleMemberSelect = (type: 'dangbun' | 'member') => {
    setMemberPopUp(false);
    if (type === 'member') {
      searchModalRef.current?.show();
    } else if (type === 'dangbun') {
      setShowDangbunList(true);
    }
  };

  const handleAddManualMember = (name: string) => {
    setManualMembers((prev) => (prev.includes(name) ? prev : [...prev, name]));
  };

  // 멤버 선택 토글 (id 기준)
  const toggleSelectMember = (dutyId: number, personId: number) => {
    setSelectedByDuty((prev) => {
      const cur = new Set(prev[dutyId] || []);
      if (cur.has(personId)) cur.delete(personId);
      else cur.add(personId);
      return { ...prev, [dutyId]: Array.from(cur) };
    });
  };

  // To: 표시문구 (선택된 당번별 선택된 멤버 이름들 + 수동 추가된 이름들)
  const toLabel = useMemo(() => {
    const dutyParts = Object.entries(selectedByDuty).map(([dutyIdStr, ids]) => {
      const dutyId = Number(dutyIdStr);
      const dutyName = duties.find((d) => d.id === dutyId)?.name || `당번 ${dutyId}`;
      const names = (dutyMembers[dutyId] || [])
        .filter((p) => ids.includes(p.id))
        .map((p) => p.name)
        .join(', ');
      return `${dutyName} (${names})`;
    });
    return [...dutyParts, ...manualMembers].filter(Boolean).join(', ');
  }, [duties, selectedByDuty, dutyMembers, manualMembers]);

  // 제출 가능 여부 계산(선택 수신인 수 + 내용 여부)
  const ReadyToSubmit = useMemo(() => {
    const selectedCount =
      Object.values(selectedByDuty).reduce((acc, ids) => acc + ids.length, 0) + manualMembers.length;
    const hasRecipients = selectedCount > 0;
    const hasContent =
      (selectedCard === 'template' && selectedTemplateType !== null) ||
      (selectedCard === 'write' && customContent.trim() !== '');
    return hasRecipients && hasContent;
  }, [selectedByDuty, manualMembers, selectedCard, selectedTemplateType, customContent]);

  const handleTransmit = () => {
    if (!ReadyToSubmit) return;
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      // NOTE: 라우팅은 이후 단계에서 placeId 포함으로 정리 예정
      navigate('/:placeId/alarm/create', { state: { tab: 'transmit' } });
    }, 1500);
  };

  return (
    <div>
      <Header title="알림 작성" />
      <div className="px-[20px] pt-[68px]">
        {/* To */}
        <div className="flex items-center gap-[8px]">
          <p className="text-base font-semibold">To:</p>
          <p className="text-sm font-medium">{toLabel}</p>
          <div className="relative ml-2">
            <img
              src={plusButton}
              alt="멤버/당번 추가 버튼"
              onClick={() => setMemberPopUp(!memberPopUp)}
              className="w-[20px] h-[20px] cursor-pointer"
            />
            {memberPopUp && (
              <div className="absolute left-0 z-50">
                <MemberPopUp onSelect={handleMemberSelect} />
              </div>
            )}
          </div>
        </div>

        {/* 당번 칩 목록 */}
        {showDangbunList && (
          <div className="mt-3">
            {dutyLoading && <p className="text-sm text-gray-500">불러오는 중…</p>}
            {dutyError && <p className="text-sm text-red-500">{dutyError}</p>}
            {!dutyLoading && !dutyError && duties.length === 0 && (
              <p className="text-sm text-gray-500">배정된 당번이 없습니다.</p>
            )}

            {duties.length > 0 && (
              <div className="overflow-x-auto whitespace-nowrap hide-scrollbar">
                {duties.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDangbunId(d.id)}
                    className="inline-block mr-2 cursor-pointer"
                  >
                    <WritingChip
                      label={d.name || `당번 ${d.id}`}
                      type="dangbun"
                      selected={selectedDangbunId === d.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 선택된 당번의 멤버 목록 (API) */}
        {selectedDangbunId && (
          <div className="mt-3">
            {memberLoading && <p className="text-sm text-gray-500">멤버 불러오는 중…</p>}
            {memberError && <p className="text-sm text-red-500">{memberError}</p>}

            {(dutyMembers[selectedDangbunId] || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(dutyMembers[selectedDangbunId] || []).map((m) => {
                  const selected = (selectedByDuty[selectedDangbunId] || []).includes(m.id);
                  return (
                    <div
                      key={m.id}
                      className="cursor-pointer"
                      onClick={() => toggleSelectMember(selectedDangbunId, m.id)}
                    >
                      <WritingChip label={m.name} type="member" selected={selected} />
                    </div>
                  );
                })}
              </div>
            )}
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
              <TemplateCard type="clean" selected={selectedTemplateType === 'clean'} onClick={() => setSelectedTemplateType('clean')} />
              <TemplateCard type="newMember" selected={selectedTemplateType === 'newMember'} onClick={() => setSelectedTemplateType('newMember')} />
              <TemplateCard type="update" selected={selectedTemplateType === 'update'} onClick={() => setSelectedTemplateType('update')} />
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

        {/* 전송 */}
        <CTAButton
          variant={ReadyToSubmit ? 'blue' : 'thickGray'}
          disabled={!ReadyToSubmit}
          style={{ position: 'fixed', bottom: '36px' }}
          onClick={handleTransmit}
        >
          전송
        </CTAButton>

        {/* 기존 모달/토스트 유지(다음 단계에서 API 연동 예정) */}
        <SearchModal ref={searchModalRef} onSelectMember={handleAddManualMember} />
        <Toast message="알림이 성공적으로 전송되었습니다." visible={showToast} />
      </div>
    </div>
  );
};

export default NotificationCreate;
