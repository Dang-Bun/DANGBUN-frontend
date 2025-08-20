import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FreeButton from '../../components/button/FreeButton';
import CTAButton from '../../components/button/CTAButton';
import PopupCard from '../../components/PopUp/PopUpCard';
import Header from '../../components/HeaderBar';

import { usePlaceApi } from '../../hooks/usePlaceApi';

const PlaceJoin = () => {
  const navigate = useNavigate();

  const [infoList, setInfoList] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [placeId, setPlaceId] = useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleNext = async () => {
    try {
      const information = Object.fromEntries(
        infoList.map(({ label, value }) => [label, value])
      );
      const data = {
        inviteCode: code,
        name: name,
        information: information,
      };
      const res = await usePlaceApi.joinRequest(data);
      console.log('request', res);
    } catch (e) {
      console.error('error', e);
    }

    try {
      const res = await usePlaceApi.placeSearch(placeId);
      const placeName = res.data.data.placeName;
      const category = res.data.data.category;
      console.log(res.data);
      console.log(category);
      if (code) {
        navigate('/placejoin2', {
          state: {
            placeName: placeName,
            category: category,
            placeId: placeId,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const searchCode = async () => {
    try {
      const res = await usePlaceApi.inviteCodeCheck({ inviteCode: code });

      if (res?.data?.code === 20000) {
        const infoArray = res.data.data.information.map((label: string) => ({
          label,
          value: '',
        }));
        console.log(res.data.data);
        setInfoList(infoArray);
        setConfirm(true);
        setPlaceId(res.data.data.placeId);
        setIsModalOpen(true);
      }
    } catch (e) {
      console.error('code matching error', e);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col items-center pt-[52px]'>
      <Header title='' showBackButton={true} />
      <div className='px-5 flex flex-col gap-3 w-full '>
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
            disabled={confirm}
          />
          <FreeButton
            variant={inputValue && !confirm ? 'blue' : 'thickGray'}
            fontSize={16}
            height={56}
            maxWidth={77}
            onClick={() => {
              setCode(inputValue);
              searchCode();
            }} // API request
          >
            확인
          </FreeButton>
        </div>
      </div>
      <div className='px-5 flex flex-col w-full gap-5'>
        <h2
          className={`text-xl font-normal leading-7 ${infoList.length === 0 ? 'hidden' : ''}`}
        >
          정보를 작성해주세요.
        </h2>
        <div className='flex flex-col items-start justify-start gap-3 mb-20.5'>
          <div
            className={`flex flex-row relative ${infoList.length === 0 ? 'hidden' : ''}`}
          >
            <p className='w-24 px-4 py-3.5 text-center text-base font-semibold leading-snug'>
              이름
            </p>
            <input
              type='text'
              placeholder='입력'
              className='w-64 h-14 px-3 py-3.5 bg-stone-50 rounded-lg'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          {infoList.map((item, index) => (
            <div key={index} className='flex flex-row relative'>
              <p className='w-24 px-4 py-3.5 text-center text-base font-semibold leading-snug'>
                {item.label}
              </p>
              <input
                type='text'
                placeholder='입력'
                className='w-64 h-14 px-3 py-3.5 bg-stone-50 rounded-lg'
                value={item.value}
                onChange={(e) => {
                  const newInfo = [...infoList];
                  newInfo[index].value = e.target.value;
                  setInfoList(newInfo);
                }}
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

      <CTAButton
        variant={
          infoList.every((item) => item.value.trim() !== '')
            ? 'blue'
            : 'thickGray'
        }
        style={{ position: 'fixed', bottom: '36px' }}
        onClick={handleNext}
      >
        완료
      </CTAButton>
    </div>
  );
};

export default PlaceJoin;
