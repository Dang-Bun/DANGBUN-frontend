import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import left_chevron from '../../assets/chevron/white_left_chevronImg.svg';
import modify from '../../assets/dangbun/Modify.svg';
import plus from '../../assets/dangbun/plus.svg';

const DutyManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dutyId, iconUrl, name } = location.state || {};

  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {/* 상단 헤더 */}
      <div className='flex items-center justify-between bg-blue px-4 pt-15'>
        <img
          src={left_chevron}
          alt='뒤로가기'
          className='cursor-pointer'
          onClick={() => navigate('/management/manager')}
        />
        <img
          src={modify}
          alt='수정'
          className='cursor-pointer'
          onClick={() =>
            navigate('/management/manager/duty/modify', { state: { dutyId } })
          }
        />
      </div>

      {/* 상단 파란색 영역 */}
      <div className='bg-blue relative flex flex-col items-center pb-30'>
        {/* 아이콘 */}
        <div className='absolute top-full -translate-y-1/2 flex flex-col items-center'>
          <img
            src={iconUrl}
            alt='당번 아이콘'
            className='w-[130px] h-[130px]'
          />
          <span className='mt-2 px-3 py-1 bg-blue rounded-lg text-white text-sm font-semibold'>
            {name}
          </span>
        </div>
      </div>

      {/* 내용 카드 */}
      <div className='bg-white rounded-[12px] flex-1 px-4 pt-[80px] mt-[1px] shadow-md'>
        {/* 탭 메뉴 */}
        <div className='flex bg-[#f6f6f6] mt-4 h-[46px] w-[353px] rounded-[8px]'>
          <button
            className={`flex-1 py-2 text-center font-semibold mt-[4px] ${
              activeTab === 'info'
                ? 'text-blue bg-[#fefefe] rounded-[8px] h-[38px] ml-[5px]'
                : 'text-gray-400 font-medium'
            }`}
            onClick={() => setActiveTab('info')}
          >
            정보
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold mt-[4px] ${
              activeTab === 'role'
                ? 'text-blue bg-[#fefefe] rounded-[8px] h-[38px] mr-[5px]'
                : 'text-gray-400 font-medium'
            }`}
            onClick={() => setActiveTab('role')}
          >
            역할 분담
          </button>
        </div>

        {/* 정보 탭 내용 */}
        {activeTab === 'info' && (
          <>
            {/* 멤버 */}
            <div className='mt-1'>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-semibold text-gray-700'>멤버</span>
                <img src={plus} alt='맴버 추가' className='cursor-pointer' />
              </div>
              <div className='h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm'>
                멤버를 추가해 주세요.
              </div>
            </div>

            {/* 청소 */}
            <div>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-semibold text-gray-700'>청소</span>
                <img
                  src={plus}
                  alt='청소 추가'
                  className='cursor-pointer'
                  onClick={() => navigate('/management/manager/duty/addclean')}
                />
              </div>
              <div className='h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm'>
                청소를 추가해 주세요.
              </div>
            </div>
          </>
        )}

        {/* 역할 분담 탭 내용 */}
        {activeTab === 'role' && (
          <div className='text-gray-500 text-center py-8'>
            역할 분담 내용을 여기에 표시합니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default DutyManagement;
