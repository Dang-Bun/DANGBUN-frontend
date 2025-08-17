import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import rightArrow from '../../assets/member/GrayRight.svg';
import GrayLine from '../../assets/member/GrayLine.svg';
import BottomBar from '../../components/BottomBar';
import Envelop from '../../assets/member/Envelop.svg';
import whitearrow from '../../assets/member/whitearrow.svg';
import { useMemberApi } from '../../hooks/useMemberApi';
import right_chevron from '../../assets/chevron/right_chevronImg.svg';
import EnterCode from '../../assets/member/EnterCode.svg';

type MemberRow = {
  memberId: number;
  role: '매니저' | '멤버' | string;
  name: string;
  dutyName?: string[]; // ["화장실 청소", "바닥 청소"] …
};

const MemberList: React.FC = () => {
  const navigate = useNavigate();
  const placeId = Number(localStorage.getItem('placeId'));

  const [waitingCount, setWaitingCount] = useState(0);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await useMemberApi.list(placeId);
        // 응답 예시:
        // { code:20000, data:{ waitingMemberNumber:4, members:[{memberId, role, name, dutyName:[...]}] } }
        const data = res?.data?.data ?? {};
        setWaitingCount(data.waitingMemberNumber ?? 0);
        setMembers(data.members ?? []);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message ?? e?.message ?? '멤버 목록 불러오기 실패'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [placeId]);

  return (
    <div className='pt-[52px] px-5'>
      <Header title='멤버 목록' showBackButton={true} />
      {waitingCount !== 0 && ( // 새 멤버 대기 배너
        <button
          className='cursor-pointer'
          onClick={() => navigate('/memberconfirm')}
        >
          <div className='flex flex-row w-[353px] h-24 py-[21px] px-[21px] mt-[21px] mb-[21px] bg-blue-500 rounded-lg items-center justify-between'>
            <div className='flex flex-row gap-[21px] items-center'>
              <div className='relative flex justify-center items-center bg-white w-14 h-14 rounded-full'>
                <img src={Envelop} alt='편지' />
                {waitingCount > 0 && (
                  <div className='absolute top-3 right-2 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-center text-white font-semibold text-[8px] leading-3'>
                    {waitingCount}
                  </div>
                )}
              </div>
              <p className='text-white text-start text-sm font-normal'>
                <span className='text-sm font-semibold'>새로운 멤버</span>가{' '}
                <br />
                참여를 기다리고 있어요 !
              </p>
            </div>
            <img src={whitearrow} alt='이동' />
          </div>
        </button>
      )}

      <button
        onClick={() => navigate('entercode')}
        className='w-full flex flex-row items-center justify-between bg-[#f9f9f9] rounded-lg px-4 py-3 shadow-sm cursor-pointer'
      >
        {/* 왼쪽 아이콘 + 텍스트 */}
        <div className='flex flex-row items-center gap-3'>
          <img src={EnterCode} alt='참여코드' className='w-8 h-8' />
          <p className='text-sm text-black'>
            <span className='font-semibold'>참여코드</span>로 새 멤버를 초대해
            보세요
          </p>
        </div>

        {/* 오른쪽 화살표 */}
        <img src={right_chevron} alt='더보기' className='w-4 h-4' />
      </button>

      {/* 목록 */}
      <div className='mt-4'>
        {loading && <div className='text-sm text-gray-500'>불러오는 중…</div>}
        {err && <div className='text-sm text-red-500'>{err}</div>}

        {!loading && !err && members.length === 0 && (
          <div className='text-sm text-gray-500'>등록된 멤버가 없습니다.</div>
        )}

        {!loading && !err && members.length > 0 && (
          <div className='flex flex-col gap-0'>
            {members
              .slice()
              .reverse()
              .map((m, idx) => {
                const isManager = m.role === '매니저';
                const badgeClass = isManager
                  ? 'bg-indigo-100 text-blue-500'
                  : 'bg-[#ebfff6] text-[#00dc7b]';
                const badgeText = isManager ? '매니저' : '멤버';
                const firstDuty = m.dutyName?.[0] ?? '-';

                return (
                  <div
                    key={m.memberId}
                    className='flex flex-row gap-4.5 cursor-pointer'
                    onClick={() =>
                      navigate('/managerInfo', {
                        state: {
                          memberId: m.memberId,
                        },
                      })
                    }
                  >
                    {/* 역할 배지 */}
                    <div
                      className={`flex w-[61px] h-7 my-4 rounded-lg justify-center items-center text-sm font-semibold ${badgeClass}`}
                    >
                      {badgeText}
                    </div>

                    {/* 멤버 한 줄 */}
                    <div className='flex-1'>
                      <div className='flex flex-row justify-between items-center w-[271px] my-4'>
                        <p className='text-base font-semibold'>{m.name}</p>
                        <button className='flex flex-row items-center justify-center gap-4.5 cursor-pointer'>
                          <p className='text-zinc-500 text-sm'>{firstDuty}</p>
                          <img
                            src={rightArrow}
                            alt='더보기'
                            className='w-1.5 h-3'
                          />
                        </button>
                      </div>
                      {/* 구분선 (마지막 아이템 제외하고 표시하려면 idx 체크) */}
                      {idx < members.length - 1 && (
                        <img src={GrayLine} alt='구분선' />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <BottomBar />
    </div>
  );
};

export default MemberList;
