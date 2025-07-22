import React from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import buildingImg from '../../assets/placeIcon/buildingImg.svg';
import cinemaImg from '../../assets/placeIcon/cinemaImg.svg';
import dormitoryImg from '../../assets/placeIcon/dormitoryImg.svg';
import gymImg from '../../assets/placeIcon/gymImg.svg';
import officeImg from '../../assets/placeIcon/officeImg.svg';
import restaurantImg from '../../assets/placeIcon/restaurantImg.svg';
import schoolImg from '../../assets/placeIcon/schoolImg.svg';
import cafeSmallImg from '../../assets/placeIcon/cafeSmallImg.svg';
import homeImg from '../../assets/placeIcon/homeImg.svg';

type RoleType =
  | 'cafe'
  | 'building'
  | 'cinema'
  | 'dormitory'
  | 'gym'
  | 'office'
  | 'restaurant'
  | 'school'
  | 'plus';

interface PlaceRollCardProps {
  role: RoleType;
  selected: boolean;
  onClick: () => void;
  setPlusRole?: (role: string) => void;
}

const roleStyles = {
  cafe: {
    image: cafeSmallImg,
    label: '카페',
    size: 'w-[39.879px] h-[62.469px]',
  },
  building: {
    image: buildingImg,
    label: '빌딩',
    size: 'w-[53.11px] h-[55.072px]',
  },
  cinema: {
    image: cinemaImg,
    label: '영화관',
    size: 'w-[51.54px] h-[54.122px]',
  },
  dormitory: {
    image: dormitoryImg,
    label: ['   기숙사,', '셰어하우스'],
    size: 'w-[53.73px] h-[44.63px]',
  },
  gym: {
    image: gymImg,
    label: '헬스장',
    size: 'w-[64.871px] h-[37.981px]',
  },
  office: {
    image: officeImg,
    label: '사무실',
    size: 'w-[54.707px] h-[48.425px]',
  },
  restaurant: {
    image: restaurantImg,
    label: '식당',
    size: 'w-[59.93px] h-[47.475px]',
  },
  school: {
    image: schoolImg,
    label: '학교',
    size: 'w-[61.718px] h-[46.743px]',
  },
  plus: {
    image: homeImg,
    label: '직접 입력',
    size: 'w-[46.45px] h-[49.78px]',
  },
};

const SelectableRoleCard: React.FC<PlaceRollCardProps> = ({
  role,
  selected,
  onClick,
  setPlusRole,
}) => {
  const { image, label, size } = roleStyles[role];

  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSubmitted(true);
    }
  };

  return (
    <div className='flex flex-col items-center gap-1 cursor-pointer'>
      <div
        className={classNames(
          'relative w-24 h-24 rounded-full flex flex-col items-center justify-center border transition-all',
          selected
            ? 'bg-[#e0eaff] border-[#4d83fd]'
            : 'bg-[#f6f6f6] border-[#DEDEDE]'
        )}
        onClick={() => {
          onClick();
          if (role === 'plus') {
            if (submitted) {
              setSubmitted(false);
            } else if (text) {
              setSubmitted(true);
              setPlusRole?.(text);
            }
          }
        }}
      >
        <img
          src={image}
          alt={Array.isArray(label) ? label.join(' ') : label}
          className={classNames(size)}
        />
      </div>

      <div
        className={classNames(
          'font-[Pretendard] text-[14px] font-semibold whitespace-pre-wrap',
          selected ? 'text-[#4d83fd]' : 'text-black'
        )}
      >
        {Array.isArray(label) ? (
          label.join('\n')
        ) : role === 'plus' ? (
          submitted ? (
            text
          ) : (
            <input
              type='text'
              placeholder='직접입력'
              className='w-[95.8px] h-5.25 flex justify-center items-center text-black text-center bg-neutral-100 rounded-lg text-sm font-normal'
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setPlusRole?.(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
          )
        ) : (
          label
        )}
      </div>
    </div>
  );
};

export default SelectableRoleCard;
