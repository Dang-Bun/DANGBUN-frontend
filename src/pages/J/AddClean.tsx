import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import left_chevron from '../../assets/chevron/left_chevronImg.svg';
import CTAButton from '../../components/button/CTAButton';
//준서야 당일, 다음날도 저장할 수 있게 바꿔야돼

import { useCleaningApi } from '../../hooks/usePlaceApi';

export default function AddClean() {
  const navigate = useNavigate();
  const placeId = Number(localStorage.getItem('placeId'));

  return (
    <div className='w-full min-h-screen bg-white mx-auto pt-[74px]'>
      {/* 헤더 */}
      <div className='relative flex items-center mb-6'>
        <button className='absolute left-0'>
          <img
            src={left_chevron}
            alt='뒤로가기'
            className='cursor: pointer'
            onClick={() => navigate('/management/manager/duty')}
          />
        </button>
        <div className='mx-auto font-normal text-[20px]'>당번 미지정 청소</div>
      </div>
      <div className='mb-[30px] flex w-full items-center justify-center'>
        <CTAButton>추가</CTAButton>
      </div>
    </div>
  );
}
