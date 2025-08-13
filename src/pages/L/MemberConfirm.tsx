import React from 'react';
import Header from '../../components/HeaderBar';
import MemberInfo from './MemberInfo';

const MemberConfirm = () => {
  return (
    <div className='relative bg-stone-50 pt-[52px] flex flex-col items-center'>
      <Header title='수락 대기 중인 멤버' showBackButton={true} />
      <div className=' absolute top-[13px] right-[90px] w-7 h-7 z-50 flex items-center justify-center bg-blue-500 rounded-full text-center text-white font-semibold'>
        3
      </div>

      <div className='flex flex-col mt-5'>
        <p className='text-base font-normal !mb-4'>오늘</p>
        <div className='flex flex-col gap-5'>
          <MemberInfo />
          <MemberInfo />
          <MemberInfo />
        </div>
      </div>
    </div>
  );
};

export default MemberConfirm;
