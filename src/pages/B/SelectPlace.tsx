import React from 'react';
import joinComplete from '../../assets/checkIcon/joinCompleteImg.svg';
import CTAButton from '../../components/button/CTAButton';

const SelectPlace = () => {
  return (
    <div>
      <div>
        <div>회원가입 완료</div>
        <div>이제 당번에서 플레이스를 생성하거나 참여할 수 있어요</div>
      </div>
      <div>
        <img src={joinComplete} alt='회원가입 완료 표시' />
      </div>
      <CTAButton>내 플레이스로 이동</CTAButton>
    </div>
  );
};

export default SelectPlace;
