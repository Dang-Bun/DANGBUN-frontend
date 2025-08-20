import React, { useEffect, useState } from 'react';
import HeaderBar from '../../components/HeaderBar';
import FreeButton from '../../components/button/FreeButton';
import { usePlaceApi } from '../../hooks/usePlaceApi';
import PopUpCard from '../../components/PopUp/PopUpCard';

const EnterCode = () => {
  const [inviteCode, setInviteCode] = useState<string>('');
  const placeId = Number(localStorage.getItem('placeId'));
  const [modalOpen, setModalOpen] = useState(false);

  // 📌 참여 코드 조회
  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const res = await usePlaceApi.getInviteCode(placeId);
        if (res.data.code === 20000) {
          setInviteCode(res.data.data.inviteCode);
        } else {
          alert(`❌ 실패: ${res.data.message}`);
        }
      } catch (err: any) {
        alert(`에러: ${err.response?.data?.message || err.message}`);
      }
    };

    fetchInviteCode();
  }, [placeId]);

  // 복사하기
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setModalOpen(true); // 팝업 열기
      setTimeout(() => {
        setModalOpen(false); // 2초 뒤 자동 닫기
      }, 2000);
    } catch {
      console.log('복사 실패 😢');
    }
  };

  return (
    <div className='w-full max-w-[393px] min-h-screen mx-auto px-4 py-6 flex flex-col'>
      {/* 상단 헤더 */}
      <HeaderBar title='참여코드 생성' />
      <div className='text-black text-[20px] font-normal'>참여 코드</div>
      {/* 참여 코드 영역 */}
      <div className='flex w-full items-center gap-[10px] mt-[20px]'>
        {/* 코드 */}
        <div className='flex w-[268px] h-[56px] bg-[#f9f9f9] rounded-lg items-center px-4 text-[16px] text-[#5a5d62] font-semibold'>
          {inviteCode || '---'}
        </div>

        {/* 복사 버튼 */}
        <div className='cursor-pointer w-[77px]'>
          <FreeButton
            variant='blue'
            maxWidth={77}
            height={56}
            fontSize={16}
            onClick={handleCopy}
          >
            복사
          </FreeButton>
        </div>
      </div>
      <PopUpCard
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        title={
          <span className='font-normal text-center block'>
            <span className='font-bold'>복사</span>가 완료 되었습니다.
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        first=''
        second=''
      />
    </div>
  );
};

export default EnterCode;
