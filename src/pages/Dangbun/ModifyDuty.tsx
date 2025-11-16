import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDutyApi } from '../../hooks/useDutyApi';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Input from '../../components/input/Input';
import CTAButton from '../../components/button/CTAButton';
import PopUpCard from '../../components/PopUp/PopUpCard';

import left_chevron from '../../assets/chevron/left_chevronImg.svg';
import cleanerImg from '../../assets/cleanIcon/cleanerImg.svg';
import cupWashingImg from '../../assets/cleanIcon/cupWashingImg.svg';
import moppingImg from '../../assets/cleanIcon/moppingImg_3.svg';
import polishImg from '../../assets/cleanIcon/polishImg.svg';
import sprayerImg from '../../assets/cleanIcon/sprayerImg.svg';
import sweepImg from '../../assets/cleanIcon/sweepImg_2.svg';
import toiletImg from '../../assets/cleanIcon/toiletImg.svg';
import trashImg from '../../assets/cleanIcon/trashImg_2.svg';

const iconList = [
  moppingImg,
  trashImg,
  cleanerImg,
  cupWashingImg,
  polishImg,
  sprayerImg,
  sweepImg,
  toiletImg,
];

const iconMap: Record<string, string> = {
  [moppingImg]: 'BUCKET_PINK',
  [trashImg]: 'TRASH_BLUE',
  [cleanerImg]: 'CLEANER_PINK',
  [cupWashingImg]: 'DISH_BLUE',
  [polishImg]: 'BRUSH_PINK',
  [sprayerImg]: 'SPRAY_BLUE',
  [sweepImg]: 'FLOOR_BLUE',
  [toiletImg]: 'TOILET_PINK',
};

const Modifyduty = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // DutyManagement에서 넘긴 값
  const { dutyId, iconUrl, name } =
    (location.state as
      | { dutyId: number; iconUrl: string; name: string }
      | undefined) ?? {};

  const [dangbunName, setDangbunName] = useState(name);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const isFormValid = dangbunName.trim() !== '' && selectedIcon;

  useEffect(() => {
    if (iconUrl) {
      setSelectedIcon(iconUrl); // iconUrl이 바로 이미지 경로라서 그대로 사용
    }
  }, [iconUrl]);

  const handleModifyDuty = async () => {
    try {
      const placeId = Number(localStorage.getItem('placeId'));
      if (!placeId) {
        alert('placeId가 없습니다.');
        return;
      }

      const icon = selectedIcon ? iconMap[selectedIcon] : null;
      if (!icon) {
        alert('아이콘을 선택해주세요.');
        return;
      }

      const payload = {
        name: dangbunName,
        icon, // 파일명으로 변환된 값
      };

      const res = await useDutyApi.update(placeId, dutyId, payload);

      if (res.data.code === 20000) {
        console.log('당번이 성공적으로 수정되었습니다.');
        navigate('/management/manager');
      } else {
        alert(`수정 실패: ${res.data.message}`);
      }
    } catch (err) {
      console.error('당번 수정 실패', err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleDeleteDuty = async () => {
    try {
      const placeId = Number(localStorage.getItem('placeId'));
      if (!placeId) {
        alert('placeId가 없습니다.');
        return;
      }

      const res = await useDutyApi.delete(placeId, dutyId);

      if (res.data.code === 20000) {
        console.log('당번이 성공적으로 삭제되었습니다.');
        navigate('/management/manager');
      } else {
        alert(`삭제 실패: ${res.data.message}`);
      }
    } catch (err) {
      console.error('당번 삭제 실패', err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className='relative p-4 h-full'>
      {/* 상단 네비 */}
      <div className='relative flex w-full h-[50px] items-center mb-4'>
        <div className='absolute'>
          <img
            src={left_chevron}
            alt='뒤로가기'
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          />
        </div>
      </div>

      {/* 당번 이름 */}
      <div className='mb-6'>
        <div className='mb-2 text-[18px] font-normal'>당번 이름</div>
        <Input
          placeholder='당번 이름을 입력해주세요'
          value={dangbunName}
          onChange={(e) => setDangbunName(e.target.value)}
        />
      </div>

      {/* 아이콘 선택 */}
      <div>
        <div className='mb-2 text-[18px] font-normal'>아이콘</div>
        <div className='flex gap-3 overflow-x-auto pb-2 no-scrollbar'>
          {iconList.map((icon, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 w-[93px] h-[93px] rounded-lg flex items-center justify-center cursor-pointer bg-[#f6f6f6] border-2 transition
        ${selectedIcon === icon ? 'border-blue bg-blue-8' : 'border-transparent'}`}
              onClick={() => setSelectedIcon(icon)}
            >
              <img
                src={icon}
                alt={`아이콘 ${idx}`}
                className='w-[70px] h-[70px]'
              />
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className='absolute w-full flex flex-col gap-[8px] bottom-0 left-1/2 -translate-x-1/2 items-center pb-8'>
        <CTAButton
          variant={isFormValid ? 'blue' : 'thickGray'}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          수정
        </CTAButton>
        <CTAButton
          variant='gray'
          onClick={() => {
            setDeleteModalOpen(true);
          }}
        >
          삭제
        </CTAButton>
      </div>

      {/* 당번 수정 모달 */}
      <PopUpCard
        isOpen={createModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}
        title={
          <span className='font-normal text-center block'>
            <span className='font-bold'>&quot;{dangbunName}&quot;</span>을
            <br />
            <span className='text-blue'>수정</span>할까요?
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setCreateModalOpen(false)}
        onSecondClick={handleModifyDuty}
      ></PopUpCard>

      {/* 당번 삭제 모달 */}
      <PopUpCard
        isOpen={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        title={
          <span className='font-normal text-center block'>
            <span>정말 </span>
            <span className='font-bold'>&quot;{dangbunName}&quot;</span>을
            <br />
            <span className='text-blue'>삭제</span>할까요?
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setDeleteModalOpen(false)}
        onSecondClick={handleDeleteDuty}
      ></PopUpCard>
    </div>
  );
};

export default Modifyduty;
