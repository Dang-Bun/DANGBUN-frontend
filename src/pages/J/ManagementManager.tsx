import React from 'react';
import { useNavigate } from 'react-router-dom';

import CTAButton from '../../components/button/CTAButton';
import BottomBar from '../../components/BottomBar';

import nothingDangbun from '../../assets/dangbun/nothingDangBun.svg';
import left_chevron from '../../assets/chevron/left_chevronImg.svg';

const ManagementManager = () => {
  const navigate = useNavigate();
  const Header = (
    <div className='flex w-full h-[50px] items-center mt-[72px] mb-4 px-4'>
      <div className='absolute'>
        <img
          src={left_chevron}
          alt='뒤로가기'
          className='cursor-pointer'
          onClick={() => navigate('/setting/manager')}
        />
      </div>
      <div className='flex w-full text-[20px] justify-center'>내 플레이스</div>
    </div>
  );

  return (
    <div>
      {Header}
      <div className='w-full flex justify-center my-[60px] mt-[212px] mb-[229px]'>
        <img src={nothingDangbun} alt='플레이스 없음' />
      </div>
      <BottomBar />
    </div>
  );
};

export default ManagementManager;
