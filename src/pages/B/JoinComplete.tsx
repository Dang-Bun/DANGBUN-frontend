import React from 'react';
import joinComplete from '../../assets/checkIcon/joinCompleteImg.svg';
import CTAButton from '../../components/button/CTAButton';

const SelectPlace = () => {
  return (
    <div className='flex flex-col items-center'>
      <div>
        <div className='w-full mt-[204px] text-[#000] text-center text-[24px] font-[600]'>
          회원가입 완료 !
        </div>
        <div className='mt-[12px] text-gray-6 text-[14px] font-medium'>
          이제 당번에서 플레이스를 생성하거나 참여할 수 있어요
        </div>
      </div>
      <div className='mt-[56px]'>
        <img src={joinComplete} alt='회원가입 완료 표시' />
      </div>
      <div>
        <CTAButton>내 플레이스로 이동</CTAButton>
      </div>
    </div>
  );
};

export default SelectPlace;
