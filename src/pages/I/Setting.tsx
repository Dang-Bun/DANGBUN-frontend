import React from 'react';
import { useState, useEffect } from 'react';
import BottomBar from '../../components/BottomBar';
import PlaceName from '../../assets/setting/PlaceName.svg';
import Manager from '../../assets/placeIcon/managerImg.svg';
import Member from '../../assets/placeIcon/memberImg.svg';
import white_right_chevron from '../../assets/chevron/white_right_chevron.svg';
import blue_right_chevron from '../../assets/chevron/blue_right_chevron.svg';
import Sweep from '../../assets/cleanIcon/sweepImg_2.svg';
import NameTag from '../../assets/setting/NameTag.svg';
import Cinema from '../../assets/placeIcon/cinemaImg.svg';
import send_notification from '../../assets/setting/send_notifivation.svg';
import danger_zone from '../../assets/setting/danger_zone.svg';
import { fetchMyInfo } from '../../apis/user';
import { useNavigate } from 'react-router-dom';

const Setting = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetchMyInfo();
        setName(res.data.data.name);
      } catch (e) {
        console.error('유저 정보 가져오기 실패:', e);
      }
    };

    getUserInfo();
  }, []);

  return (
    <div className='w-full min-h-screen flex flex-col justify-between'>
      {/* 상단 */}
      <div className='px-4 pt-6'>
        {/* 플레이스 이름 & 설정 */}
        <div className='relative flex items-center mb-4'>
          <img
            src={PlaceName}
            alt='플레이스 이름'
            className='absolute left-0'
            onClick={() => {
              navigate('/myPlace');
            }}
          />
          <div className='mx-auto text-[20px] font-400'>설정</div>
        </div>

        {/* 유저 정보 카드 */}
        <div className='bg-[#81a9ff] rounded-xl p-4 mb-6'>
          <div className='flex items-center mb-4'>
            <div className='text-[14px] font-medium text-white'>
              {name} 님의 정보
            </div>
            <img src={white_right_chevron} alt='>' /> {/* 우측 화살표 */}
          </div>
          <div className='flex flex-col items-center'>
            <div className='relative w-[100px] h-[100px] flex items-center justify-center'>
              <div className='absolute inset-0 bg-[#e0eaff66] rounded-full z-0' />
              <img
                src={Manager}
                alt='프로필 이미지'
                className='mb-2 w-[52px] h-[62.03px] z-10'
              />
            </div>
            <div className='text-[12px] text-[#4d83fd] font-semibold bg-white px-3 py-1 rounded-full mb-2'>
              매니저
            </div>
            <button className='w-[287px] bg-[#4d83fd] text-white rounded-[8px] mt-[16px] px-6 py-2 text-sm flex items-center justify-center gap-4'>
              <span className='text-[12px]'>당번</span>
              <div className='w-px h-4 bg-white' />
              <span className='text-[12px]'>청소 점검</span>
            </button>
          </div>
        </div>
        <div className='bg-white rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm h-[103px]'>
          {/* 당번 관리 */}
          <div className='flex flex-col items-center flex-1'>
            <img src={NameTag} alt='당번 관리' />
            <div className='text-sm mt-1'>당번 관리</div>
          </div>

          {/* 구분선 */}
          <div className='w-px h-[40px] bg-[#D9E4FF] mx-2' />

          {/* 청소 관리 */}
          <div className='flex flex-col items-center flex-1'>
            <img src={Sweep} alt='청소 관리' className='w-[24px] h-[32.39px]' />
            <div className='text-sm mt-1'>청소 관리</div>
          </div>

          {/* 구분선 */}
          <div className='w-px h-[40px] bg-[#D9E4FF] mx-2' />

          {/* 멤버 목록 */}
          <div className='flex flex-col items-center flex-1'>
            <img
              src={Member}
              alt='멤버 목록'
              className='w-[32.29px] h-[28px]'
            />
            <div className='text-sm mt-1'>멤버 목록</div>
          </div>
        </div>

        {/* 하단 메뉴들 */}
        <div className='flex flex-col gap-[12px]'>
          <div className='bg-white rounded-xl p-4 flex justify-between items-center shadow-sm h-[56px]'>
            <div className='flex items-center gap-3'>
              <div className='relative w-[34px] h-[34px] flex items-center justify-center'>
                <div className='absolute inset-0 bg-[#D4E0FD] rounded-full z-0' />
                <img
                  src={Cinema}
                  alt='플레이스 세부 설정'
                  className='w-[15.24px] h-[16.59px] z-10'
                />
              </div>
              <span className='text-sm'>플레이스 세부 설정</span>
            </div>
            <img src={blue_right_chevron} alt='>' />
          </div>

          <div className='bg-white rounded-xl p-4 flex justify-between items-center shadow-sm h-[56px]'>
            <div className='flex items-center gap-3'>
              <div className='relative w-[34px] h-[34px] flex items-center justify-center'>
                <div className='absolute inset-0 bg-[#D4E0FD] rounded-full z-0' />
                <img
                  src={send_notification}
                  alt='알림 보내기'
                  className='z-10'
                />
              </div>
              <span className='text-sm'>알림 보내기</span>
            </div>
            <img src={blue_right_chevron} alt='>' />
          </div>
          <div className='bg-white rounded-xl p-4 flex justify-between items-center shadow-sm h-[56px]'>
            <div className='flex items-center gap-3'>
              <div className='relative w-[34px] h-[34px] flex items-center justify-center'>
                <div className='absolute inset-0 bg-[#D4E0FD] rounded-full z-0' />
                <img src={danger_zone} alt='danger zone' className='z-10' />
              </div>
              <span className='text-sm'>Danger zone</span>
            </div>
            <img src={blue_right_chevron} alt='>' />
          </div>
        </div>
      </div>

      {/* 바텀바 */}
      <div className='w-full'>
        <BottomBar />
      </div>
    </div>
  );
};

export default Setting;
