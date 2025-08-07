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

interface DangbunListProps {
  onChange: (value: string) => void;
}

const DangbunList = ({ onChange }: DangbunListProps) => {
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

  const handleChange = (option: any) => {
    onChange(option.value);
  };

  const custom = ({ data }: any) => (
    <div className='flex flex-row gap-3 items-center h-[34px] text-black text-base font-normal leading-snug'>
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
        className='  h-[34px] p-[10px] flex flex-row gap-3 my-4 text-center justify-start items-center cursor-pointer'
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
          onChange={handleChange}
          styles={{
            control: (provided) => ({
              ...provided,
              display: 'flex',
              height: '56px',
              paddingLeft: '12px',
              paddingRight: '15px',
              alignItems: 'center',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#8e8e8e',
              borderColor: '#dedede',
            }),
            option: (provided) => ({
              ...provided,
              display: 'flex',
              alignItems: 'center',
            }),
            indicatorSeparator: () => ({ display: 'none' }),
            dropdownIndicator: () => ({
              cursor: 'pointer',
            }),
            menu: () => ({
              display: 'flex',
              width: '353px',
              borderRadius: '8px',
              background: '#fff',
              boxShadow: '0 0 8px 0 rgba(0,0,0,0.10)',
              marginTop: '12px',
            }),
            input: () => ({
              display: 'none',
            }),
            valueContainer: () => ({
              padding: 0,
              margin: 0,
            }),
          }}
        />
      </label>
    </div>
  );
};

export default DangbunList;
