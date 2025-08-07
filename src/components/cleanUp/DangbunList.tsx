import React from 'react';
import { useState } from 'react';
import Select from 'react-select';
import c1 from '../../assets/cleanIcon/sweepImg_1.svg';
import c2 from '../../assets/cleanIcon/cleanerImg.svg';
import c3 from '../../assets/cleanIcon/toiletImg.svg';
import c4 from '../../assets/cleanIcon/cupWashingImg.svg';
import c5 from '../../assets/cleanIcon/trashImg_2.svg';
import c6 from '../../assets/cleanIcon/moppingImg_3.svg';
import c7 from '../../assets/cleanIcon/polishImg.svg';
import c8 from '../../assets/cleanIcon/sprayerImg.svg';

const DangbunList = () => {
  const options = [
    {
      value: 'sweep',
      label: '탕비실 청소당번',
      icon: c1,
    },
    {
      value: 'machine',
      label: '홀 청소당번',
      icon: c2,
    },
    {
      value: 'toilet',
      label: '화장실 청소당번',
      icon: c3,
    },
  ];

  const custom = ({ data }: any) => (
    <div className=' h-[34px] flex flex-row gap-3 text-center justify-start items-center'>
      <img src={data.icon} alt='icon' className='w-9 h-9' />
      {data.label}
    </div>
  );

  const customOption = (props: any) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className=' h-[34px] flex flex-row gap-3 text-center justify-start items-center'
      >
        <img src={data.icon} alt='icon' className='w-9 h-9' />
        {data.label}
      </div>
    );
  };

  return (
    <div>
      <label>
        <Select
          options={options}
          placeholder='선택'
          components={{ SingleValue: custom, Option: customOption }}
          className='w-[353px] h-14 py-[17px] pl-3 pr-6 rounded-lg outline-1 outline-neutral-200 bg-stone-50'
          styles={{
            control: (provided) => ({
              ...provided,
              height: '34px',
              borderRadius: '8px',
              fontSize: '16px',
            }),
          }}
        />
      </label>
    </div>
  );
};

export default DangbunList;
