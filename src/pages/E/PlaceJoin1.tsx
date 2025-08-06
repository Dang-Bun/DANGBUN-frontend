import React from 'react';
import { useNavigate } from 'react-router-dom';
import FreeButton from '../../components/button/FreeButton';
import CTAButton from '../../components/button/CTAButton';
import BlueX from '../../assets/placeMake/BlueX.svg';
import PopupCard from '../../components/PopUp/PopUpCard';

import { usePlaceApi } from '../../hooks/usePlaceApi';

const PlaceJoin = () => {
  const navigate = useNavigate();

  const [infoList, setInfoList] = React.useState([
    { label: '이메일', value: '' },
  ]);
  const [code, setCode] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleNext = () => {
    if (code) {
      navigate('/placejoin2', {
        state: {
          code: code,
        },
      });
    }
  };

  const searchCode = async () => {
    setCode(inputValue);
    try {
      console.log(code);
      const res = await usePlaceApi.inviteCodeCheck({ inviteCode: code });
      console.log(res);

      if (res?.data?.code === 20000) {
        const infoArray = res.data.data.information.map((label: string) => ({
          label,
          value: '',
        }));
        setInfoList(infoArray);
        setIsModalOpen(true);
      }
    } catch (e) {
      console.error('code matching error', e);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col items-center'>
      <div className='px-5 flex flex-col gap-3 w-full'>
        <h1 className='text-xl font-normal leading-7'>
          참여 코드를 입력해주세요.
        </h1>
        <div className='flex flex-row gap-2 mb-13.5'>
          <input
            type='text'
            placeholder='참여코드 입력'
            className='w-64 h-14 px-3 py-3.5 bg-stone-50 rounded-lg items-center'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <FreeButton
            variant={inputValue ? 'blue' : 'thickGray'}
            fontSize={16}
            height={56}
            maxWidth={77}
            onClick={searchCode} // API request
          >
            확인
          </FreeButton>
        </div>
      </div>
      <div className='px-5 flex flex-col w-full gap-5'>
        <h2 className='text-xl font-normal leading-7'>정보를 작성해주세요.</h2>
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
                placeholder='입력'
                className='w-64 h-14 px-3 py-3.5 bg-stone-50 rounded-lg'
              />
            </div>
          ))}
        </div>
      </div>

      <PopupCard
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title={
          <>
            <p className='font-normal'>참여코드가 확인되었습니다. </p>
          </>
        }
        descript=''
        input={false}
        placeholder=''
        second='확인'
        onSecondClick={() => {
          setIsModalOpen(false);
        }}
      ></PopupCard>

      <button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        {' '}
        팝업 체크
      </button>
      <CTAButton
        variant='thickGray'
        style={{ position: 'fixed', bottom: '36px' }}
        onClick={handleNext}
      >
        완료
      </CTAButton>
    </div>
  );
};

export default PlaceJoin;
