import React, { useEffect, useState } from 'react';
import Header from '../../components/HeaderBar';
import MemberInfo from './MemberInfo';
import { useMemberApi } from '../../hooks/useMemberApi';
import BottomBar from '../../components/BottomBar';

type WaitingMember = {
  memberId: number;
  name: string;
  information?: { [key: string]: string };
  createdAt?: string; // "2025-08-17" 같은 형식
};

const MemberConfirm: React.FC = () => {
  const placeId = Number(localStorage.getItem('placeId'));

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [members, setMembers] = useState<WaitingMember[]>([]);

  useEffect(() => {
    const fetchWaiting = async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await useMemberApi.listWaiting(placeId);
        // 예상 응답: { code, message, data: { members: [...] } }
        const list: WaitingMember[] = res?.data?.data?.members ?? [];
        setMembers(list);
      } catch (e: any) {
        setErr(e?.response?.data?.message ?? e?.message ?? '불러오기 실패');
      } finally {
        setLoading(false);
      }
    };
    if (placeId) fetchWaiting();
  }, [placeId]);

  return (
    <div className='relative pt-[52px] flex flex-col items-center min-h-screen'>
      <Header title='수락 대기 중인 멤버' showBackButton={true} />

      {/* 카운트 배지: 대기 인원 수 */}
      <div className='absolute top-[13px] right-[90px] w-7 h-7 z-50 flex items-center justify-center bg-blue-500 rounded-full text-white font-semibold'>
        {members.length}
      </div>

      <div className='flex flex-col mt-5 w-full items-center'>
        <p className='text-base font-normal !mb-4 w-[353px]'>오늘</p>

        {loading && (
          <div className='w-[353px] text-center text-gray-400 py-8'>
            불러오는 중…
          </div>
        )}

        {err && (
          <div className='w-[353px] text-center text-red-500 py-8'>{err}</div>
        )}

        {!loading && !err && (
          <div className='flex flex-col gap-5'>
            {members.length === 0 ? (
              <div className='w-[353px] text-center text-gray-400 py-8'>
                대기 중인 멤버가 없습니다.
              </div>
            ) : (
              members.map((m) => (
                <MemberInfo
                  key={m.memberId}
                  name={m.name}
                  information={m.information}
                  onAccept={async () => {
                    // TODO: 수락 API 연결
                    await useMemberApi.accept(placeId, m.memberId);
                    console.log('accept', m.memberId);
                  }}
                  onReject={async () => {
                    // TODO: 거절 API 연결
                    await useMemberApi.rejectWaiting(placeId, m.memberId);
                    console.log('reject', m.memberId);
                  }}
                />
              ))
            )}
          </div>
        )}
      </div>
      <BottomBar />
    </div>
  );
};

export default MemberConfirm;
