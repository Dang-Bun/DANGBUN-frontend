import React from 'react';
import CTAButton from '../../components/button/CTAButton';
import BlueX from '../../assets/placeMake/BlueX.svg';
import PopUpCard from '../../components/PopUp/PopUpCard';

const PlaceMake2 = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <div>
      <div className='flex flex-col gap-2 mb-7.75'>
        <h1 className='text-xl font-normal leading-7'>정보를 작성해주세요.</h1>
        <h2 className='text-neutral-400 text-sm font-normal leading-tight'>
          멤버가 참여하기 전에 꼭 작성해야 할 목록이에요.
        </h2>
      </div>
      <div className='flex flex-col gap-3 mb-20.5'>
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
        <div className='flex flex-row relative'>
          <button className='absolute w-4 h-4 bg-neutral-100 rounded-full flex justify-center items-center cursor-pointer'>
            <img src={BlueX} alt='X' />
          </button>
          <p className='w-24 px-4 py-3.5 text-center text-base font-semibold leading-snug'>
            이메일
          </p>
          <input
            type='text'
            placeholder='입력'
            className='w-64 h-14 px-3 py-3.5 bg-stone-50 rounded-lg'
          />
        </div>
      </div>
      <CTAButton variant='gray' onClick={() => setIsModalOpen(true)}>
        목록 추가
      </CTAButton>
      <CTAButton variant='blue' className='fixed bottom-[97px]'>
        완료
      </CTAButton>

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
        onSecondClick={() => {}}
      />
    </div>
  );
};

export default PlaceMake2;
