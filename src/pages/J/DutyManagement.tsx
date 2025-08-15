import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDutyApi } from '../../hooks/useDutyApi';

import left_chevron from '../../assets/chevron/white_left_chevronImg.svg';
import modify from '../../assets/dangbun/Modify.svg';
import plus from '../../assets/dangbun/plus.svg';
import unselectedDangbun from '../../assets/checkIcon/unselectedDangbun.svg';
import selectedDangbun from '../../assets/checkIcon/selectedDangbun.svg';

type DutyMember = { memberId: number; role: string; name: string };
type Cleaning = { cleaningId: number; name: string };
type RoleItem = {
  cleaningId: number;
  cleaningName: string;
  displayedNames: string[];
  memberCount: number;
};

/** ---------- 바텀시트 모달 ---------- */
type MembersPickerModalProps = {
  open: boolean;
  allMembers: DutyMember[];
  initialSelectedIds: number[];
  dutyId: number;
  placeId: number;
  onClose: () => void;
  onConfirm: (selectedIds: number[]) => void;
};

const MembersPickerModal: React.FC<MembersPickerModalProps> = ({
  open,
  allMembers,
  initialSelectedIds,
  dutyId,
  placeId,
  onClose,
  onConfirm,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(initialSelectedIds)
  );
  const handleConfirm = async () => {
    const memberIdsArray = Array.from(selectedIds);
    try {
      await useDutyApi.addMember(placeId, dutyId, {
        memberIds: memberIdsArray,
      });
      onConfirm(memberIdsArray); // 부모에도 전달
      onClose();
    } catch (err) {
      console.error('멤버 추가 실패:', err);
      alert('멤버 추가에 실패했습니다.');
    }
  };

  // 모달 열릴 때마다 초기 선택 복원 & 검색 초기화
  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(initialSelectedIds));
      setQuery('');
      // 스크롤 잠금 (선택)
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, initialSelectedIds]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return allMembers;
    return allMembers.filter((m) =>
      m.name.toLowerCase().includes(q.toLowerCase())
    );
  }, [query, allMembers]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((m) => selectedIds.has(m.memberId));

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        // 필터된 것들만 해제
        filtered.forEach((m) => next.delete(m.memberId));
      } else {
        // 필터된 것들만 선택
        filtered.forEach((m) => next.add(m.memberId));
      }
      return next;
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black/50 z-40'
        onClick={onClose}
        aria-hidden
      />
      {/* Bottom Sheet */}
      <div
        className='fixed w-[393px] bottom-0 z-50 rounded-t-[18px] bg-white shadow-2xl'
        role='dialog'
        aria-modal='true'
      >
        {/* 드래그 핸들 */}
        <div className='w-full flex justify-center pt-3'>
          <div className='w-12 h-1.5 bg-gray-300 rounded-full' />
        </div>

        {/* 헤더(검색 + 전체 선택) */}
        <div className='px-4 pt-[44px] pb-2'>
          <div className='flex items-center mb-[18px]'>
            {/* 검색 입력 */}
            <div className='flex-1 flex items-center gap-2 px-3 h-10 rounded-full bg-gray-100'>
              <span className='text-gray-400'>🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='검색'
                className='flex-1 bg-transparent outline-none text-[15px]'
              />
            </div>
          </div>
          {/* 전체 선택 */}
          <button
            onClick={toggleAllFiltered}
            className='flex items-center gap-2 pl-[250px] h-10 text-[16px] font-normal cursor-pointer'
            title='필터된 결과 기준 전체 선택/해제'
          >
            <span className='text-gray-600'>전체 선택</span>
            <img
              src={allFilteredSelected ? selectedDangbun : unselectedDangbun}
              alt='전체 선택'
            />
          </button>
        </div>

        {/* 목록(칩) */}
        <div className='px-4 pb-4 max-h-[50vh] overflow-y-auto'>
          {filtered.length === 0 ? (
            <div className='text-center text-gray-400 py-10 text-sm'>
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className='flex flex-wrap gap-2'>
              {filtered.map((m) => {
                const selected = selectedIds.has(m.memberId);
                return (
                  <button
                    key={m.memberId}
                    onClick={() => toggleOne(m.memberId)}
                    className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition
                    ${selected ? 'bg-[#00dd7c] text-white shadow-sm' : 'bg-[#e5e5e5] text-white'}`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className='px-4 pb-5 flex gap-2'>
          <button
            onClick={onClose}
            className='flex-1 h-11 rounded-[10px] bg-gray-100 text-gray-600 font-semibold'
          >
            취소
          </button>
          <button
            onClick={() => {
              onConfirm(Array.from(selectedIds));
              handleConfirm();
            }}
            className='flex-1 h-11 rounded-[10px] bg-blue text-white font-semibold'
          >
            확인
          </button>
        </div>
      </div>
    </>
  );
};

const DutyManagement = () => {
  const [roleItems, setRoleItems] = useState<RoleItem[]>([]);
  const [allMembers, setAllMembers] = useState<DutyMember[]>([]);
  const [cleanings, setCleanings] = useState<Cleaning[]>([
    {
      cleaningId: 1,
      name: '바닥 쓸기',
    },
    {
      cleaningId: 2,
      name: '재고 채우기',
    },
    {
      cleaningId: 3,
      name: '재활용 쓰레기',
    },
    {
      cleaningId: 4,
      name: '창문 닦기',
    },
    {
      cleaningId: 5,
      name: '커피머신 세척',
    },
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  // ManagementManager에서 넘긴 값
  const { dutyId, iconUrl, name } =
    (location.state as
      | { dutyId: number; iconUrl: string; name: string }
      | undefined) ?? {};

  const placeId = Number(localStorage.getItem('placeId'));

  // 탭/데이터 상태
  const [activeTab, setActiveTab] = useState<'info' | 'role'>('info');

  // 실제 선택되어 카드에 표시될 멤버
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const selectedMembers = useMemo(
    () => allMembers.filter((m) => selectedMemberIds.includes(m.memberId)),
    [allMembers, selectedMemberIds]
  );

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 모달 오픈
  const [pickerOpen, setPickerOpen] = useState(false);

  const [cleaningsLoading, setCleaningsLoading] = useState(false);
  const [cleaningsErr, setCleaningsErr] = useState<string | null>(null);

  // 안전장치
  useEffect(() => {
    if (!placeId || !dutyId) navigate('/management/manager');
  }, [placeId, dutyId, navigate]);
  console.log(allMembers);

  // 멤버 불러오기
  useEffect(() => {
    if (!placeId || !dutyId) return;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await useDutyApi.getMembers(placeId, dutyId);
        const list: DutyMember[] = res.data?.data ?? [];
        setAllMembers(list);

        // 최초 진입 시 이미 선택된 값(있다면) 세팅을 원하면 여기서 setSelectedMemberIds(...)
        // setSelectedMemberIds(list.map(m => m.memberId)); // 예: 모두 선택
      } catch (e: any) {
        setErr(
          e?.response?.data?.message ?? e?.message ?? '맴버 불러오기 실패'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [placeId, dutyId]);

  // 청소 불러오기
  // useEffect(() => {
  //   if (!placeId || !dutyId) return;
  //   (async () => {
  //     try {
  //       setCleaningsLoading(true);
  //       setCleaningsErr(null);
  //       const res = await useDutyApi.getCleanings(placeId, dutyId);
  //       setCleanings(res.data?.data ?? []);
  //     } catch (e: any) {
  //       setCleaningsErr(
  //         e?.response?.data?.message ?? e?.message ?? '청소 불러오기 실패'
  //       );
  //     } finally {
  //       setCleaningsLoading(false);
  //     }
  //   })();
  // }, [placeId, dutyId]);

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {/* 상단 헤더 */}
      <div className='flex items-center justify-between bg-blue px-4 pt-15'>
        <img
          src={left_chevron}
          alt='뒤로가기'
          className='cursor-pointer'
          onClick={() => navigate('/management/manager')}
        />
        <img
          src={modify}
          alt='수정'
          className='cursor-pointer'
          onClick={() =>
            navigate('/management/manager/duty/modify', {
              state: {
                dutyId: dutyId,
                iconUrl: iconUrl,
                name: name,
              },
            })
          }
        />
      </div>

      {/* 상단 파란 영역 + 아이콘/이름 (경계 걸침) */}
      <div className='bg-blue relative flex flex-col items-center pb-30'>
        <div className='absolute top-full -translate-y-1/2 flex flex-col items-center'>
          {iconUrl && (
            <img
              src={iconUrl}
              alt='당번 아이콘'
              className='w-[130px] h-[130px]'
            />
          )}
          <span className='mt-2 px-3 py-1 bg-blue rounded-lg text-white text-sm font-semibold'>
            {name}
          </span>
        </div>
      </div>

      {/* 내용 카드 */}
      <div className='bg-white rounded-[12px] flex-1 px-4 pt-[80px] mt-[1px] shadow-md'>
        {/* 탭 */}
        <div className='flex bg-[#f6f6f6] mt-4 h-[46px] w-[353px] rounded-[8px]'>
          <button
            className={`flex-1 py-2 text-center font-semibold mt-[4px] ${
              activeTab === 'info'
                ? 'text-blue bg-[#fefefe] rounded-[8px] h-[38px] ml-[5px]'
                : 'text-gray-400 font-medium cursor-pointer'
            }`}
            onClick={() => setActiveTab('info')}
          >
            정보
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold mt-[4px] ${
              activeTab === 'role'
                ? 'text-blue bg-[#fefefe] rounded-[8px] h-[38px] mr-[5px]'
                : 'text-gray-400 font-medium cursor-pointer'
            }`}
            onClick={() => setActiveTab('role')}
          >
            역할 분담
          </button>
        </div>

        {/* 정보 탭 */}
        {activeTab === 'info' && (
          <>
            {/* 멤버 섹션 */}
            <div className='mt-1'>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-semibold text-gray-700'>멤버</span>
                <img
                  src={plus}
                  alt='멤버 추가'
                  className='cursor-pointer'
                  onClick={() => setPickerOpen(true)}
                />
              </div>

              {loading && (
                <div className='h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm'>
                  불러오는 중…
                </div>
              )}
              {err && (
                <div className='h-16 bg-red-50 rounded-lg flex items-center justify-center text-red-500 text-sm'>
                  {err}
                </div>
              )}
              {!loading && !err && selectedMembers.length === 0 && (
                <div className='h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm'>
                  멤버를 추가해 주세요.
                </div>
              )}
              {!loading && !err && selectedMembers.length > 0 && (
                <div className='flex flex-wrap gap-2 shadow-md px-2 py-2 rounded-[8px]'>
                  {selectedMembers.map((m) => (
                    <span
                      key={m.memberId}
                      className='inline-flex items-center px-3 py-1 rounded-[6px] bg-[#00dd7c] text-white text-sm'
                      title={m.role ? `역할: ${m.role}` : undefined}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 청소 섹션 */}
            <div className='mt-4'>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-semibold text-gray-700'>청소</span>
                <img
                  src={plus}
                  alt='청소 추가'
                  className='cursor-pointer'
                  onClick={() =>
                    navigate('/management/manager/duty/addclean', {
                      state: {
                        dutyId: dutyId,
                      },
                    })
                  }
                />
              </div>

              {/* 상태별 */}
              {cleaningsLoading && (
                <div className='h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm'>
                  불러오는 중…
                </div>
              )}

              {cleaningsErr && (
                <div className='h-16 bg-red-50 rounded-lg flex items-center justify-center text-red-500 text-sm'>
                  {cleaningsErr}
                </div>
              )}

              {!cleaningsLoading && !cleaningsErr && cleanings.length === 0 && (
                <div className='h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm'>
                  청소를 추가해 주세요.
                </div>
              )}

              {!cleaningsLoading && !cleaningsErr && cleanings.length > 0 && (
                <div className='grid grid-cols-2 gap-3'>
                  {cleanings.map((c) => (
                    <div
                      key={c.cleaningId}
                      className='relative rounded-[12px] bg-[#f8f8f8] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-4 py-3 flex items-center justify-between'
                    >
                      <span className='text-[#5a5d62] text-[14px]'>
                        {c.name}
                      </span>

                      {/* 점3개 버튼(시안의 우측 점 버튼) */}
                      <button
                        type='button'
                        aria-label='메뉴'
                        className='w-8 h-8 rounded-[10px] bg-[#f8f8f8] flex items-center justify-center active:scale-95'
                        // onClick={() => openCleaningMenu(c.cleaningId)}  // 필요시 핸들러 연결
                      >
                        {/* vertical dots svg */}
                        <svg viewBox='0 0 4 18' className='w-4 h-4'>
                          <circle cx='2' cy='2' r='2' fill='#A8B0BA' />
                          <circle cx='2' cy='9' r='2' fill='#A8B0BA' />
                          <circle cx='2' cy='16' r='2' fill='#A8B0BA' />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* 역할 분담 탭 */}
        {activeTab === 'role' && (
          <div className='pt-[50px]'>
            <div className='space-y-3'>
              {roleItems.map((item) => {
                const hasAssignees = item.memberCount > 0;
                return (
                  <div
                    key={item.cleaningId}
                    className='rounded-[12px] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100'
                  >
                    {/* 제목 */}
                    <div className='text-[16px] font-normal text-black mb-2'>
                      {item.cleaningName}
                    </div>

                    {/* 하단 라인 */}
                    <div className='flex items-center gap-2'>
                      {hasAssignees ? (
                        <>
                          <span className='px-2 py-[3px] text-[11px] rounded-full bg-green-1 text-green-2'>
                            멤버 {item.memberCount}명
                          </span>
                          <span className='text-[12px] text-gray-500'>
                            {item.displayedNames.slice(0, 2).join(', ')}{' '}
                            {item.memberCount > 2 && '등'}
                          </span>
                          <button
                            type='button'
                            className='w-6 h-6 rounded-full bg-[#F1F2F4] text-gray-500 grid place-items-center active:scale-95'
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <>
                          <span className='px-2 py-[3px] text-[12px] rounded-full bg-[#f0f0f0] text-gray-6'>
                            담당 선택
                          </span>
                          <button
                            type='button'
                            className='ml-1 w-6 h-6 rounded-full bg-[#f0f0f0] text-gray-6 grid place-items-center active:scale-95'
                          >
                            +
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 멤버 선택 모달 */}
      <MembersPickerModal
        open={pickerOpen}
        allMembers={allMembers}
        initialSelectedIds={selectedMemberIds}
        dutyId={dutyId}
        placeId={placeId}
        onClose={() => setPickerOpen(false)}
        onConfirm={(ids) => {
          setSelectedMemberIds(ids);
          setPickerOpen(false);
        }}
      />
    </div>
  );
};

export default DutyManagement;
