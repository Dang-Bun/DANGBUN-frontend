import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import rightArrow from '../../assets/member/GrayRight.svg';
import GrayLine from '../../assets/member/GrayLine.svg';
import BottomBar from '../../components/BottomBar';
import { useMemberApi } from '../../hooks/useMemberApi';

type MemberRow = {
  memberId: number;
  role: '매니저' | '멤버' | string;
  name: string;
  dutyName?: string[]; // ["화장실 청소", "바닥 청소"] …
};

const MemberList_Member: React.FC = () => {
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
        console.log(waitingCount);
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

      {/* 목록 */}
      <div className='mt-4'>
        {loading && <div className='text-sm text-gray-500'>불러오는 중…</div>}
        {err && <div className='text-sm text-red-500'>{err}</div>}

        {!loading && !err && members.length === 0 && (
          <div className='text-sm text-gray-500'>등록된 멤버가 없습니다.</div>
        )}

        {!loading && !err && members.length > 0 && (
          <div className='flex flex-col gap-0'>
            {members.map((m, idx) => {
              const isManager = m.role === '매니저';
              const badgeClass = isManager
                ? 'bg-indigo-100 text-blue-500'
                : 'bg-[#ebfff6] text-[#00dc7b]';
              const badgeText = isManager ? '매니저' : '멤버';
              const firstDuty = m.dutyName?.[0] ?? '미지정';

              return (
                <div
                  key={m.memberId}
                  className='flex flex-row gap-4.5 cursor-pointer'
                  onClick={() =>
                    navigate('/managerInfomember', {
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

export default MemberList_Member;
