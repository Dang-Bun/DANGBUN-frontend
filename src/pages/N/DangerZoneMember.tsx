import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CTAButton from '../../components/button/CTAButton';
import PopUpCardDanger from '../../components/PopUp/PopUpCardDanger';

import left_chevron from '../../assets/chevron/left_chevronImg.svg';

const DangerZoneMember = () => {
  const [dPlaceModalOpen1, setdPlaceModalOpen1] = React.useState(false);
  const [dPlaceModalOpen2, setdPlaceModalOpen2] = React.useState(false);

  const navigate = useNavigate();

  return (
    <div className='mt-[68px]'>
      <div className='pl-[12px]'>
        <img
          src={left_chevron}
          alt='뒤로가기'
          onClick={() => navigate('/setting/member')}
          className='cursor-pointer mb-[19px]'
        />
      </div>

      {/* 2. 헤더 + 목록 접기 버튼 */}
      <div className='flex justify-between items-center mb-[30px]'>
        <h2 className='text-[16px] font-normal pl-[20px]'>플레이스 나가기</h2>
      </div>
      <div className='flex justify-center cursor-pointer'>
        <CTAButton variant='red' onClick={() => setdPlaceModalOpen1(true)}>
          플레이스 나가기
        </CTAButton>
      </div>

      {/* 플레이스 나가기 모달 */}
      <PopUpCardDanger
        isOpen={dPlaceModalOpen1}
        onRequestClose={() => setdPlaceModalOpen1(false)}
        title={
          <span className='font-normal'>해당 플레이스에서 나가시겠습니까?</span>
        }
        descript={`계속하시려면 “플레이스 이름”을 입력해주세요. `}
        input={true}
        placeholder='플레이스 이름 입력'
        first='취소'
        second='나가기'
        onFirstClick={() => setdPlaceModalOpen1(false)}
        onSecondClick={async () => {
          setdPlaceModalOpen1(false);
          setdPlaceModalOpen2(true);
        }}
      ></PopUpCardDanger>
      <PopUpCardDanger
        isOpen={dPlaceModalOpen2}
        onRequestClose={() => setdPlaceModalOpen2(false)}
        title={
          <span className='font-normal'>
            <span className='font-bold'>나가기</span>가 완료 되었습니다.
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        second='확인'
        onSecondClick={() => {
          navigate('/myPlace');
        }}
      ></PopUpCardDanger>
    </div>
  );
};

export default DangerZoneMember;
