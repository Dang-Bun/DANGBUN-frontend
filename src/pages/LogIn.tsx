import React from 'react';
import icon from '../assets/Icon_reverse.svg';
import CTAButton from '../components/button/CTAButton';
import Input from '../components/input/Input';
import right_chevron from '../assets/chevron/right_chevronImg.svg';

const LogIn = () => {
  return (
    <div className='w-full min-h-screen'>
      <div className='flex justify-center pb-[104px] pt-[120px]'>
        <img src={icon} alt='아이콘' />
      </div>
      <div className='w-full flex flex-col items-center gap-[10px]'>
        <Input placeholder='이메일을 입력하세요.' />
        <Input placeholder='비밀번호를 입력하세요.' />
        <CTAButton>로그인</CTAButton>
        <div className='w-[353px] flex flex-row justify-end -mt-[2.75px] -mb-[2px]'>
          <div className='text-[14px] font-normal pr-[9px]'>비밀번호 찾기</div>
          <img src={right_chevron} alt='오른쪽 화살표' />
        </div>
        <CTAButton variant='gray'>회원가입</CTAButton>
      </div>
    </div>
  );
};

export default LogIn;
