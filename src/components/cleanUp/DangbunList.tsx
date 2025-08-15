import React from 'react';
import { useState, useEffect } from 'react';
import Select from 'react-select';

import FLOOR_BLUE from '../../assets/cleanIcon/sweepImg_1.svg';
import CLEANER_PINK from '../../assets/cleanIcon/cleanerImg.svg';
import BUCKET_PINK from '../../assets/cleanIcon/toiletImg.svg';
import TOILET_PINK from '../../assets/cleanIcon/cupWashingImg.svg';
import TRASH_BLUE from '../../assets/cleanIcon/trashImg_2.svg';
import DISH_BLUE from '../../assets/cleanIcon/moppingImg_3.svg';
import BRUSH_PINK from '../../assets/cleanIcon/polishImg.svg';
import SPRAY_BLUE from '../../assets/cleanIcon/sprayerImg.svg';

import useDutyApi from '../../hooks/useDutyApi';

const ICON_MAP: Record<string, string> = {
  FLOOR_BLUE: FLOOR_BLUE,
  CLEANER_PINK: CLEANER_PINK,
  BUCKET_PINK: BUCKET_PINK,
  TOILET_PINK: TOILET_PINK,
  TRASH_BLUE: TRASH_BLUE,
  DISH_BLUE: DISH_BLUE,
  BRUSH_PINK: BRUSH_PINK,
  SPRAY_BLUE: SPRAY_BLUE,
};

interface DangbunListProps {
  placeId: number;
  onChange: (value: string) => void;
}

interface Cleaning {
  cleaningId: number;
  cleaningName: string;
  displayedNames: string[];
  memberCount: number;
}
const DangbunList = ({ placeId, onChange }: DangbunListProps) => {
  const [dangbunList, setdangbunList] = useState<Cleaning[]>([]);

  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await useDutyApi.list(placeId);
        console.log(res.data);
        // const list = Array.isArray(res?.data?.data)
        //   ? res.data.data.map((d: any) => ({
        //       name: d.clname,
        //       icon: d.icon,
        //     }))
        //   : [];
        //setdangbunList(list);
      } catch (e) {
        console.error(e);
        setdangbunList([]);
      }
    };
    getEffect();
  });

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
          options={dangbunList}
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
