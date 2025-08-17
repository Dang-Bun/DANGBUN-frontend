import React, { useState } from 'react';
import line from '../../assets/member/LongGrayLine.svg';

type MemberInfoProps = {
  name: string;
  email?: string;
  phone?: string;
  onAccept?: () => Promise<void> | void; // 비동기 가능
  onReject?: () => Promise<void> | void;
};

const MemberInfo: React.FC<MemberInfoProps> = ({
  name,
  email,
  phone,
  onAccept,
  onReject,
}) => {
  const [status, setStatus] = useState<'waiting' | 'accepted' | 'rejected'>(
    'waiting'
  );

  const handleAccept = async () => {
    if (onAccept) await onAccept();
    setStatus('accepted');
  };

  const handleReject = async () => {
    if (onReject) await onReject();
    setStatus('rejected');
  };

  return (
    <div className='flex flex-col bg-white p-5 w-[353px] rounded-lg shadow-[0_0_8px_0_rgba(0,0,0,0.1)]'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-base font-semibold'>{name}</p>

        {/* 상태 표시 */}
        {status === 'accepted' && (
          <button className='w-20 h-7 rounded-lg justify-center items-center text-center text-sm bg-indigo-100 text-blue-500'>
            수락됨
          </button>
        )}
        {status === 'rejected' && (
          <button className='w-20 h-7 rounded-lg justify-center items-center text-center text-sm bg-[#bdbdbd] text-white'>
            거절됨
          </button>
        )}

        {/* 대기 중일 때만 버튼 노출 */}
        {status === 'waiting' && (
          <div className='flex flex-row gap-1.5'>
            <button
              className='w-20 h-7 rounded-lg justify-center items-center text-center text-sm bg-[#dedede] text-[#8e8e8e] cursor-pointer'
              onClick={handleReject}
            >
              거절
            </button>
            <button
              className='w-20 h-7 rounded-lg justify-center items-center text-center text-sm text-white bg-blue-500 cursor-pointer'
              onClick={handleAccept}
            >
              수락
            </button>
          </div>
        )}
      </div>

      <img src={line} alt='구분선' className='my-[18px]' />

      <div className='flex flex-col gap-3'>
        <div className='flex flex-row items-center justify-between'>
          <p className='text-zinc-500 text-sm font-semibold'>이메일</p>
          <p className='text-sm font-normal'>{email ?? '-'}</p>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <p className='text-zinc-500 text-sm font-semibold'>전화번호</p>
          <p className='text-sm font-normal'>{phone ?? '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;
