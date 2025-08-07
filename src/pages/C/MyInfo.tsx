import React from 'react';
import leftChevron from '../assets/chevron/left_chevronImg.svg';
import CTAButton from '../../components/button/CTAButton';

const MyInfoPage = () => {
  return (
    <div className='w-full max-w-[393px] min-h-screen mx-auto bg-white flex flex-col justify-between py-6 px-4'>
      {/* 상단 헤더 */}
      <div>
        <div className='flex items-center mb-6'>
          <img src={leftChevron} alt='뒤로가기' className='w-6 h-6' />
          <div className='flex-1 text-center text-base font-semibold'>
            내 정보
          </div>
        </div>

        {/* 이름 */}
        <div className='flex justify-between items-center py-4 border-b border-[#EAEAEA]'>
          <span className='text-sm font-semibold text-black'>이름</span>
          <span className='text-sm text-[#B7B7B7]'>
            {' '}
            {/* ← 나중에 API 값 삽입 */}{' '}
          </span>
        </div>

        {/* 이메일 */}
        <div className='flex justify-between items-center py-4 border-b border-[#EAEAEA]'>
          <span className='text-sm font-semibold text-black'>이메일</span>
          <span className='text-sm text-[#B7B7B7]'>
            {' '}
            {/* ← 나중에 API 값 삽입 */}{' '}
          </span>
        </div>
      </div>

      {/* 하단 영역 */}
      <div className='flex flex-col gap-2'>
        <span className='text-xs text-[#B7B7B7]'>서비스 탈퇴</span>
        <CTAButton variant='blue'>로그아웃</CTAButton>
      </div>
    </div>
  );
};

export default MyInfoPage;
