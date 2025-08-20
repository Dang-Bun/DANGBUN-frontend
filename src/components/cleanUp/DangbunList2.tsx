import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';

import FLOOR_BLUE from '../../assets/cleanIcon/sweepImg_2.svg';
import CLEANER_PINK from '../../assets/cleanIcon/cleanerImg.svg';
import BUCKET_PINK from '../../assets/cleanIcon/moppingImg_3.svg';
import TOILET_PINK from '../../assets/cleanIcon/toiletImg.svg';
import TRASH_BLUE from '../../assets/cleanIcon/trashImg_2.svg';
import DISH_BLUE from '../../assets/cleanIcon/cupWashingImg.svg';
import BRUSH_PINK from '../../assets/cleanIcon/polishImg.svg';
import SPRAY_BLUE from '../../assets/cleanIcon/sprayerImg.svg';

import useDutyApi from '../../hooks/useDutyApi';

const ICON_MAP: Record<string, string> = {
  FLOOR_BLUE,
  CLEANER_PINK,
  BUCKET_PINK,
  TOILET_PINK,
  TRASH_BLUE,
  DISH_BLUE,
  BRUSH_PINK,
  SPRAY_BLUE,
};

interface DangbunListProps {
  placeId: number;
  /** 현재 선택된 dutyId (없으면 null/undefined) */
  value?: number | null;
  /** 사용자가 선택 변경 시 선택된 dutyId 전달 */
  onSelectDuty: (dutyId: number) => void;
}

interface DangbunOption {
  value: number; // dutyId
  name: string; // dutyName
  icon: string; // icon url
}

const DangbunList2 = ({ placeId, value, onSelectDuty }: DangbunListProps) => {
  const [options, setOptions] = useState<DangbunOption[]>([]);

  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await useDutyApi.list(placeId);
        const list: DangbunOption[] = Array.isArray(res?.data?.data)
          ? res.data.data.map((d: any) => ({
              value: Number(d.dutyId),
              name: d.name,
              icon: ICON_MAP[d.icon] ?? d.icon,
            }))
          : [];
        setOptions(list);
      } catch (e) {
        console.error(e);
        setOptions([]);
      }
    };
    getEffect();
  }, [placeId]);

  // props.value(dutyId)에 해당하는 option 찾기 -> Select의 value에 꽂기
  const selectedOption = useMemo(
    () =>
      value == null ? null : (options.find((o) => o.value === value) ?? null),
    [options, value]
  );

  const handleChange = (option: DangbunOption | null) => {
    if (option) onSelectDuty(option.value);
  };

  const SingleValue = ({ data }: { data: DangbunOption }) => (
    <div className='flex flex-row gap-3 items-center h-[34px] text-black text-base font-normal leading-snug'>
      <img src={data.icon} alt='icon' className='w-9 h-9' />
      {data.name}
    </div>
  );

  const Option = (props: any) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className='h-[34px] p-[10px] flex flex-row gap-3 my-4 text-center justify-start items-center cursor-pointer'
      >
        <img src={data.icon} alt='icon' className='w-9 h-9' />
        {data.name}
      </div>
    );
  };

  return (
    <label>
      <Select<DangbunOption, false>
        options={options}
        value={selectedOption} // ✅ 미리 선택된 값 표시
        onChange={handleChange}
        placeholder='선택'
        components={{ SingleValue, Option }}
        getOptionLabel={(o) => o.name} // 검색/라벨 기준
        getOptionValue={(o) => String(o.value)} // 동일성 기준
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
          dropdownIndicator: () => ({ cursor: 'pointer' }),
          menu: () => ({
            display: 'flex',
            width: '353px',
            borderRadius: '8px',
            background: '#fff',
            boxShadow: '0 0 8px 0 rgba(0,0,0,0.10)',
            marginTop: '12px',
          }),
          input: () => ({ display: 'none' }),
          valueContainer: () => ({ padding: 0, margin: 0 }),
        }}
      />
    </label>
  );
};

export default DangbunList2;
