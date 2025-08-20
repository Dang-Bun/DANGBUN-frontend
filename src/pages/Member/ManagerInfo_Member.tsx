import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import UserIcon from '../../assets/member/UserIcon.svg';
import GreenUser from '../../assets/member/GreenUser.svg';
import { useMemberApi } from '../../hooks/useMemberApi';
import { useCleaningApi } from '../../hooks/useCleaningApi';

type MemberInfoResp = {
  member: {
    name: string;
    role: '매니저' | '멤버'; // ← 서버에서 한글로 옴
    information?: Record<string, any>; // {"이메일": "...", "전화번호": "..."}
  };
  duties: { dutyId: number; dutyName: string }[];
};

const ManagerInfo_Member: React.FC = () => {
  const location = useLocation();
  const placeId = Number(localStorage.getItem('placeId'));
  const memberId = (location.state as { memberId?: number })?.memberId;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<MemberInfoResp | null>(null);

  const [myId, setMyId] = useState<number[]>([]);
  // 선택된 dutyId 목록 (빈 슬롯은 null)
  const [selectedDutyIds, setSelectedDutyIds] = useState<Array<number | null>>(
    []
  );

  useEffect(() => {
    if (!data) return;
    const ids = (data.duties ?? []).map((d) => d.dutyId);
    // 최소 1행은 보이도록
    setSelectedDutyIds(ids.length ? ids : [null]);
  }, [data]);

  useEffect(() => {
    const effecthandle = async () => {
      try {
        const memberres = await useMemberApi.me(placeId);
        const newId = memberres.data.data.memberId;

        if (newId) {
          setMyId((prev) => (prev.includes(newId) ? prev : [...prev, newId]));
        }
        console.log(myId);
      } catch (e) {
        console.error(e);
      }
    };
    effecthandle();
  });

  useEffect(() => {
    const effecthandle2 = async () => {
      try {
        const res = await useCleaningApi.getCleaningsDuties(placeId, myId);
        console.log(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    effecthandle2();
  });

  useEffect(() => {
    if (!placeId || !memberId) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await useMemberApi.get(placeId, memberId);
        const body: MemberInfoResp = res?.data?.data;
        setData(body ?? null);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message ?? e?.message ?? '멤버 정보 불러오기 실패'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [placeId, memberId]);

  const name = data?.member?.name ?? '';
  const role = data?.member?.role ?? '멤버';
  const isManager = role === '매니저';
  const duties = data?.duties ?? [];
  const informations = data?.member?.information ?? {};

  return (
    <div className='flex flex-col pt-[52px] px-5 justify-center items-center'>
      <Header title='' showBackButton={true} />

      {/* 로딩/에러 */}
      {loading && (
        <div className='w-full max-w-[345px] my-4 text-sm text-gray-500'>
          불러오는 중…
        </div>
      )}
      {err && (
        <div className='w-full max-w-[345px] my-4 text-sm text-red-500'>
          {err}
        </div>
      )}

      {/* 멤버 카드 (역할에 따라 색/아이콘 변경) */}
      {!loading && !err && data && (
        <div className='w-[345px] rounded-lg mb-[23px]'>
          {/* 상단 바 */}
          <div
            className={`flex flex-row h-11 px-3.5 items-center gap-3.5 rounded-tr-lg rounded-tl-lg ${
              isManager ? 'bg-blue-500' : 'bg-[#38be7b]'
            }`}
          >
            <div className='w-7 h-7 bg-white rounded-full flex items-center justify-center'>
              <img src={isManager ? UserIcon : GreenUser} alt={role} />
            </div>
            <p className='text-white font-semibold'>{name}</p>
          </div>

          {/* 내용 카드 */}
          <div className='flex flex-col px-4 py-[11px] bg-[#f9f9f9] rounded-br-lg rounded-bl-lg'>
            <div className='flex flex-row items-center justify-between'>
              <p
                className={`${isManager ? 'text-blue-500' : 'text-[#38be8b]'} font-semibold`}
              >
                직책
              </p>
              <div
                className={`h-8 px-3 flex rounded-lg justify-center items-center text-sm font-semibold text-center
                ${isManager ? 'bg-indigo-100 text-blue-500' : 'bg-[#ebfff6] text-[#00dd7c]'}`}
              >
                {role}
              </div>
            </div>

            <div className='self-stretch h-0 opacity-50 outline-1 outline-offset-[-0.25px] outline-neutral-200 my-2.5' />

            <div className='flex flex-row items-center justify-between'>
              <p className='text-zinc-500 font-semibold'>당번</p>
              <div className='flex flex-col gap-1'>
                {duties.length > 0 ? (
                  duties.map((duty: { dutyName: string }, idx: number) => (
                    <p key={idx} className='text-base'>
                      {duty.dutyName}
                    </p>
                  ))
                ) : (
                  <p className='text-base font-normal text-[#bdbdbd]'>미지정</p>
                )}
              </div>
            </div>
            <div>
              {informations ? (
                Object.entries(informations).map(([key, value]) => (
                  <div
                    key={key}
                    className='flex flex-row items-center justify-between gap-[18px]'
                  >
                    <p className='text-zinc-500 font-semibold'>{key}</p>
                    <div className='flex flex-col gap-2'>
                      <p className='text-base'>{value}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-base'>미지정</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerInfo_Member;
