import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CTAButton from '../../components/button/CTAButton';
import FreeButton from '../../components/button/FreeButton';
import PopUpCard from '../../components/PopUp/PopUpCard';

import left_chevron from '../../assets/chevron/left_chevronImg.svg';
import bottom_chevron from '../../assets/chevron/bottom_chevronImg.svg';
import top_chevron from '../../assets/chevron/top_chevron.svg';
import profile from '../../assets/setting/profile.svg';

const DangerZone = () => {
  const [isListCollapsed, setIsListCollapsed] = useState(true);
  const [showExpelModal, setShowExpelModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [dPlaceModalOpen1, setdPlaceModalOpen1] = React.useState(false);
  const [dPlaceModalOpen2, setdPlaceModalOpen2] = React.useState(false);

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
        <CTAButton variant='red' onClick={() => setdPlaceModalOpen1(true)}>
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

      <PopUpCard
        isOpen={dPlaceModalOpen1}
        onRequestClose={() => setdPlaceModalOpen1(false)}
        title={
          <span className='font-normal'>
            정말 플레이스를 삭제 하시겠습니까?
          </span>
        }
        descript={`해당 플레이스의 모든 정보는 복구할 수 없습니다.\n삭제 신청 후 7일 뒤에 플레이스가 완전히 삭제되며,\n신청과 동시에 멤버 모두에게 알림이 전송됩니다.\n계속하시려면 “플레이스 이름”을 입력해주세요.`}
        input={true}
        placeholder='플레이스 이름 입력'
        first='취소'
        second='삭제'
        onFirstClick={() => setdPlaceModalOpen1(false)}
        onSecondClick={async () => {
          setdPlaceModalOpen1(false);
          setdPlaceModalOpen2(true);
        }}
      ></PopUpCard>
      <PopUpCard
        isOpen={dPlaceModalOpen2}
        onRequestClose={() => setdPlaceModalOpen2(false)}
        title={
          <span className='font-normal'>
            <span className='font-bold'>삭제</span>가 완료 되었습니다.
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        second='확인'
        onSecondClick={() => {
          navigate('/myPlace');
        }}
      ></PopUpCard>
    </div>
  );
};

export default DangerZone;
