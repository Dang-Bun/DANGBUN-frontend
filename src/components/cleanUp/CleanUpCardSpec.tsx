import React, { useState } from 'react';
import plus from '../../assets/cleanUpList/GrayPlus.svg';

const CleanUpCardSpec = () => {
  const [members, setMembers] = useState<string[]>(['김도현', '박한나']);

  return (
    <div className='flex flex-row w-[353px] rounded-lg shadow-[0px_0px_8px_0px_rgba(0,0,0,0.05)]'>
      <div className='w-[9px] h-[73px] bg-zinc-200 rounded-tl-lg rounded-bl-lg' />
      <div className='flex flex-col w-[344px] h-[73px] px-3 py-0 bg-[#f9f9f9] rounded-lg justify-center items-start'>
        <div className='flex flex-col justify-center items-start gap-1.5'>
          <p className='text-black text-base font-normal leading-snug'>
            바닥 쓸기
          </p>
          <div className='flex flex-row gap-1 items-center'>
            {members.length === 0 ? (
              <div className='flex h-5 px-2 bg-neutral-100 rounded-[300px] justify-center items-center'>
                <p className='text-neutral-400 text-xs font-normal'>
                  담당 선택
                </p>
              </div>
            ) : members.length > 1 ? (
              <div className='flex h-5 px-2 bg-[#EBFFF6] rounded-[300px] justify-center items-center'>
                <p className='text-[#00DC7B] text-xs font-normal'>
                  멤버 {members.length}명
                </p>
              </div>
            ) : (
              <></>
            )}
            {members.length === 0 ? (
              <></>
            ) : members.length === 1 ? (
              <p className='text-neutral-400 text-xs font-normal leading-tight'>
                {members[0]}
              </p>
            ) : members.length === 2 ? (
              <p className='text-neutral-400 text-xs font-normal leading-tight'>
                {members[0]}, {members[1]}
              </p>
            ) : (
              <p className='text-neutral-400 text-xs font-normal leading-tight'>
                {members[0]}, {members[1]} 등
              </p>
            )}

            <button className='flex w-5 h-5 bg-neutral-100 rounded-[300px] justify-center items-center'>
              <img src={plus} alt='추가하기' className='cursor-pointer' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanUpCardSpec;
