import React from 'react';
import KakaoLogo from '../../assets/login/kakao.svg';

const KakaoLogInButton = () => {
  return (
    <button className='w-full h-14 relative flex items-center justify-center bg-[#FEE500] rounded-lg'>
      <img
        src={KakaoLogo}
        alt='카카오 로고'
        className='absolute top-4.5 left-4'
      />
      <div className='text-base font-medium'>카카오 로그인</div>
    </button>
  );
};

export default KakaoLogInButton;
