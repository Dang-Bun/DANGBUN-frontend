import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CTAButton from '../../components/button/CTAButton';
import FreeButton from '../../components/button/FreeButton';

import left_chevron from '../../assets/chevron/left_chevronImg.svg';
import bottom_chevron from '../../assets/chevron/bottom_chevronImg.svg';
import top_chevron from '../../assets/chevron/top_chevron.svg';
import profile from '../../assets/setting/profile.svg';

const DangerZone = () => {
  const [isListCollapsed, setIsListCollapsed] = useState(true);
  const [showExpelModal, setShowExpelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const navigate = useNavigate();

  const members = ['박완', '박한나', '신효정', '전예영'];

  const toggleList = () => {
    setIsListCollapsed(!isListCollapsed);
  };

  const handleExpel = (name: string) => {
    setSelectedMember(name);
    setShowExpelModal(true);
  };

  return (
    <div className='mt-[68px]'>
      <div className='pl-[12px]'>
        <img
          src={left_chevron}
          alt='뒤로가기'
          onClick={() => navigate('/setting')}
          className='cursor-pointer mb-[19px]'
        />
      </div>

      {/* 2. 헤더 + 목록 접기 버튼 */}
      <div className='flex justify-between items-center mb-[30px]'>
        <h2 className='text-[16px] font-normal pl-[20px]'>멤버 추방하기</h2>
        <div
          onClick={toggleList}
          className='flex flex-row gap-[12px] text-[16px] font-normal text-[#8e8e8e]'
        >
          {isListCollapsed ? '목록 열기' : '목록 접기'}
          <img
            src={isListCollapsed ? bottom_chevron : top_chevron}
            alt='화살표'
          />
        </div>
      </div>

      {/* 3. 멤버 목록 */}
      {!isListCollapsed && (
        <ul className='space-y-2'>
          {members.map((name) => (
            <li
              key={name}
              className='flex justify-between items-center pb-[16px] pr-[12px]'
            >
              <div className='flex items-center gap-[20px] text-[16px] font-semibold pl-[30px]'>
                <img src={profile} alt='프로필' />
                <span>{name}</span>
              </div>
              <FreeButton
                variant='red'
                fontSize={14}
                maxWidth={76}
                height={40}
                onClick={() => handleExpel(name)}
              >
                추방
              </FreeButton>
            </li>
          ))}
        </ul>
      )}

      {/* 5. 구분선 */}
      <hr className='my-6 border-gray-300' />

      {/* 6. 플레이스 삭제 */}
      <div className='flex justify-center cursor-pointer'>
        <CTAButton variant='red' onClick={() => setShowDeleteModal(true)}>
          플레이스 삭제
        </CTAButton>
      </div>

      {/* 추방 모달 */}
      {showExpelModal && (
        <div className='modal'>
          <p>{selectedMember}님을 정말 추방하시겠습니까?</p>
          <button onClick={() => setShowExpelModal(false)}>닫기</button>
        </div>
      )}

      {/* 플레이스 삭제 모달 */}
      {showDeleteModal && (
        <div className='modal'>
          <p>정말 이 플레이스를 삭제하시겠습니까?</p>
          <button onClick={() => setShowDeleteModal(false)}>닫기</button>
        </div>
      )}
    </div>
  );
};

export default DangerZone;
