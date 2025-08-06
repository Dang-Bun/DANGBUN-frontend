import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CTAButton from '../../components/button/CTAButton';
import BlueX from '../../assets/placeMake/BlueX.svg';
import PopUpCard from '../../components/PopUp/PopUpCard';
import FreeButton from '../../components/button/FreeButton';

import { usePlaceApi } from '../../hooks/usePlaceApi';

const PlaceMake2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { placeName, role } = location.state || {};
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [infoList, setInfoList] = React.useState([
    { label: '이름', value: '' },
    { label: '이메일', value: '' },
  ]);

  const handleNext = async () => {
    if (placeName && role) {
      const information = Object.fromEntries(
        infoList.map(({ label, value }) => [label, value])
      );
      const data = {
        placeName: placeName,
        category: role,
        managerName: localStorage.getItem('userId') || 'unknown',
        information,
      };
      try {
        const res = await usePlaceApi.placeMake(data);
        console.log('place maked!: ', res.data);
        console.log(data);
      } catch (e) {
        console.error('place making failed:', e);
      }
      try {
        const res = await usePlaceApi.placeList();
        console.log('place list : ', res.data);
      } catch (e) {
        console.error('place search failed.', e);
      }

      navigate('/placemake3', {
        state: {
          placeName: placeName,
          role: role,
          infoList: infoList,
          information,
        },
      });
    }
  };

  return (
    <div className='flex flex-col w-full h-screen items-center justify-start'>
      <div className='flex flex-col items-start w-[375px] gap-2 mb-7.75 px-5'>
        <h1 className='text-xl font-normal leading-7'>정보를 작성해주세요.</h1>
        <h2 className='text-neutral-400 text-sm font-normal leading-tight'>
          멤버가 참여하기 전에 꼭 작성해야 할 목록이에요.
        </h2>
      </div>
      <div className='flex flex-col items-start justify-start gap-3 mb-20.5'>
        {infoList.map((item, index) => (
          <div key={index} className='flex flex-row relative'>
            <button
              className={`absolute w-4 h-4 bg-neutral-100 rounded-full flex justify-center items-center cursor-pointer ${item.label === '이름' ? 'hidden' : ''}`}
              onClick={() => {
                const newList = [...infoList];
                newList.splice(index, 1);
                setInfoList(newList);
              }}
            >
              <img src={BlueX} alt='X' />
            </button>
            <p className='w-24 px-4 py-3.5 text-center text-base font-semibold leading-snug'>
              {item.label}
            </p>
            <input
              type='text'
              placeholder='"예시 텍스트를 입력해주세요."'
              className='w-64 h-14 px-3 py-3.5 bg-stone-50 rounded-lg'
              value={item.value}
              onChange={(e) => {
                const newList = [...infoList];
                newList[index].value = e.target.value;
                setInfoList(newList);
              }}
            />
          </div>
        ))}
      </div>
      {infoList.length < 4 && (
        <FreeButton
          variant='gray'
          fontSize={14}
          height={50}
          maxWidth={353}
          onClick={() => setIsModalOpen(true)}
        >
          목록 추가
        </FreeButton>
      )}
      <PopUpCard
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title='추가할 목록 이름을 입력해주세요.'
        descript=''
        input={true}
        placeholder='목록 이름 입력 (최대 6글자 입력 가능)'
        first='취소'
        second='확인'
        onFirstClick={() => setIsModalOpen(false)}
        onSecondClick={(value) => {
          if (value) {
            setInfoList((prev) => [...prev, { label: value, value: '' }]);
          }
          setIsModalOpen(false);
        }}
      />
      <CTAButton
        variant='blue'
        style={{ position: 'fixed', bottom: '42px' }}
        onClick={handleNext}
      >
        완료
      </CTAButton>
    </div>
  );
};

export default PlaceMake2;
