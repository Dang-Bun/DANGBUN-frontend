import React, { useState } from 'react';
import type { StylesConfig } from 'react-select';
import Select from 'react-select';
import Header from '../../components/HeaderBar';
import grayPlus from '../../assets/header/GrayPlus.svg';
import grayRight from '../../assets/cleanUpList/grayRight.svg';
import cleanUpImg from '../../assets/cleanUpList/cleanUp.svg';
import BottomBar from '../../components/BottomBar';
import CleanUpCard from '../../components/cleanUp/CleanUpCard';

const CleanUpList = () => {
  const options = [{ value: '당번1', label: '당번1' }];
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [clean, setClean] = useState<string[]>(['바닥 쓸기', '재고 채우기']);

  const handleChange = (option: { value: string; label: string } | null) => {
    console.log('opiton: ', option);
    setSelectedOption(option);
  };

  const custom: StylesConfig<{ value: string; label: string }, false> = {
    control: (provided, state) => ({
      ...provided,
      height: '32px',
      borderRadius: '8px',
      borderColor: '#E5e5e5',
      padding: '5px 8px 5px 12px',
      fontSize: '14px',
      fontWeight: '400',
      color: '#e5e5e5',
      '&:hover': {
        borderColor: '#bdbdbd',
      },
    }),
    container: (provided) => ({
      ...provided,
      padding: '0',
      margin: '0',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0px',
      width: 'auto',
      height: 'auto',
    }),
    singleValue: (provided) => ({
      ...provided,
      padding: '0px',
      margin: '0px',
    }),
    input: (provided) => ({
      ...provided,
      padding: '0',
      margin: '0',
    }),

    indicatorSeparator: () => ({
      display: 'none',
      padding: '0',
      margin: '0',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#bebebe',
      padding: '0 0 0 4.67px',
      margin: '0',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#bebebe',
      width: '25px',
    }),
    menu: (provided) => ({
      ...provided,
      width: '70px',
      marginTop: '4px',
    }),
  };

  return (
    <div className='flex flex-col w-[393px] px-5 '>
      <div className='fixed w-[353px]'>
        <Header
          title='청소 관리'
          rightElement={<img src={grayPlus} alt='추가' />}
          showBackButton={true}
        />
        <div className='flex flex-row justify-between mt-[52px] mb-3'>
          <p className='text-black text-sm font-normal leading-tight'>총 0개</p>
          <button className='flex flex-row gap-1 justify-center items-center'>
            <p className='text-[#BDBDBD] text-sm font-normal leading-tight'>
              당번 미지정 청소
            </p>
            <img src={grayRight} alt='당번 미지정 청소' />
          </button>
        </div>
        <Select
          className='w-fit mb-3'
          styles={custom}
          options={options}
          onChange={handleChange}
          placeholder='멤버'
          value={selectedOption}
        />
      </div>

      {clean.length === 0 ? (
        <div className='flex flex-col h-[calc(100vh-131.5px-83px)] mt-[131.5px]  items-center justify-center gap-5'>
          <img src={cleanUpImg} alt='empty' />
          <div className='flex flex-col gap-[11px] items-center'>
            <p className='text-zinc-500 text-base font-semibold leading-snug'>
              저장된 청소가 없어요.
            </p>
            <p className='text-neutral-400 text-sm font-normal leading-tight text-center'>
              플레이스에 필요한 청소 목록을 추가해 <br /> 관리해보세요.
            </p>{' '}
          </div>
        </div>
      ) : (
        <div className='flex flex-col h-[calc(100vh-131.5px-83px)] mt-[131.5px]  items-center justify-start'>
          <CleanUpCard />
        </div>
      )}

      <BottomBar />
    </div>
  );
};

export default CleanUpList;
