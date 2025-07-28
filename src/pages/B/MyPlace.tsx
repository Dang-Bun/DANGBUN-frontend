import React from 'react';
import nothingPlace from '../../assets/placeIcon/nothingPlaceImg.svg';
import threebar from '../../assets/nav/threebar.svg';
import CTAButton from '../../components/button/CTAButton';

const MyPlace = () => {
  return (
    <div>
      <div className='flex w-full h-[50px] items-center mt-[72px] mb-[205px]'>
        <div className='flex w-full text-[20px] justify-center'>
          내 플레이스
        </div>
        <img src={threebar} alt='목록' />
      </div>
      <div className='w-full flex justify-center mb-[229px]'>
        <img src={nothingPlace} alt='플레이스 없음' />
      </div>
      <div className='flex justify-center'>
        <CTAButton>플레이스 추가</CTAButton>
      </div>
    </div>
  );
};

export default MyPlace;
