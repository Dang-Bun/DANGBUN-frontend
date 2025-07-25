import React from 'react';
import FreeButton from '../../components/button/FreeButton';
import CTAButton from '../../components/button/CTAButton';
import BlueX from '../../assets/placeMake/BlueX.svg';

const PlaceJoin = () => {
  const [infoList, setInfoList] = React.useState([
    { label: '이메일', value: '' },
  ]);

  return (
    <div>
      <div>
        <h1 className='text-xl font-normal leading-7'>
          참여 코드를 입력해주세요.
        </h1>
        <div className='flex flex-row gap-2 mb-13.5'>
          <input
            type='text'
            placeholder='참여코드 입력'
            className='w-64 h-14 px-3 py-3.5 bg-stone-50 rounded-lg items-center'
          />
          <FreeButton variant='blue' fontSize={16} height={56} maxWidth={77}>
            확인
          </FreeButton>
        </div>
      </div>
      <div>
        <h2 className='text-xl font-normal leading-7'>정보를 작성해주세요.</h2>
        <div className='flex flex-col items-start justify-start gap-3 mb-20.5'>
          <div className='flex flex-row'>
            <p className='w-24 px-4 py-3.5 text-center text-base font-semibold leading-snug'>
              이름
            </p>
            <input
              type='text'
              placeholder='입력'
              className='w-64 h-14 px-3 py-3.5 bg-stone-50 rounded-lg'
            />
          </div>

          {infoList.map((item, index) => (
            <div key={index} className='flex flex-row relative'>
              <button
                className='absolute w-4 h-4 bg-neutral-100 rounded-full flex justify-center items-center cursor-pointer'
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
      <CTAButton variant='gray'>완료</CTAButton>
    </div>
  );
};

export default PlaceJoin;
