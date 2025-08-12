import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const CreateDangbun = () => {
  const navigate = useNavigate();
  const [dangbunName, setDangbunName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const isFormValid = dangbunName.trim() !== '' && selectedIcon;

  return (
    <div className='p-4'>
      {/* 상단 네비 */}
      <div className='relative flex w-full h-[50px] items-center mt-[72px] mb-4'>
        <div className='absolute'>
          <img
            src={left_chevron}
            alt='뒤로가기'
            className='cursor-pointer'
            onClick={() => navigate('/management/manager')}
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
        <div className='flex gap-3 overflow-x-auto pb-2 hide-scrollbar'>
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
      <div className='mt-[397px]'>
        <CTAButton
          variant={isFormValid ? 'blue' : 'thickGray'}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          당번 생성
        </CTAButton>
      </div>
      <PopUpCard
        isOpen={createModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}
        title={
          <span className='font-normal text-center block'>
            <span className='font-bold'>"{dangbunName}"</span>을
            <br />
            <span className='text-blue'>생성</span>할까요?
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setCreateModalOpen(false)}
        onSecondClick={() => navigate('/management/manager')}
      ></PopUpCard>
    </div>
  );
};

export default CreateDangbun;
