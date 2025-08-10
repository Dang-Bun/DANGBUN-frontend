import React from 'react';
import line from '../../assets/member/LongGrayLine.svg';

const MemberInfo = () => {
  return (
    <div className='flex flex-col bg-white p-5 w-[353px] rounded-lg shadow-[0px_0px_8px_0px_rgba(0,0,0,0.1)'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-base font-semibold'>박한나</p>

        <button className='w-20 h-7 rounded-lg justify-center items-center text-center text-sm bg-[#bdbdbd] text-white'>
          거절됨
        </button>
        <button className='w-20 h-7 rounded-lg justify-center items-center text-center text-sm bg-indigo-100 text-blue-500'>
          수락됨
        </button>
        <div className='flex flex-row gap-1.5'>
          <button className='w-20 h-7 rounded-lg justify-center items-center text-center text-sm bg-[#bdbdbd] text-white cursor-pointer'>
            거절
          </button>
          <button className='w-20 h-7 rounded-lg justify-center items-center text-center text-white bg-blue-500  text-sm cursor-pointer'>
            수락
          </button>
        </div>
      </div>
      <img src={line} alt='구분선' className='my-[18px]' />
      <div className='flex flex-col gap-3'>
        <div className='flex flex-row items-center justify-between'>
          <p className='text-zinc-500 text-sm font-semibold'>전화번호</p>
          <p className='text-sm font-normal'>010-0000-0000</p>
        </div>
        <div className='flex flex-row items-center justify-between'>
          <p className='text-zinc-500 text-sm font-semibold'>전화번호</p>
          <p className='text-sm font-normal'>010-0000-0000</p>
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;
