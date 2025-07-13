import React from 'react';
import classNames from 'classnames';
import buildingImg from '../../assets/placeIcon/buildingImg.svg';
import cinemaImg from '../../assets/placeIcon/cinemaImg.svg';
import dormitoryImg from '../../assets/placeIcon/dormitoryImg.svg';
import gymImg from '../../assets/placeIcon/gymImg.svg';
import officeImg from '../../assets/placeIcon/officeImg.svg';
import plusImg from '../../assets/placeIcon/plusImg.svg';
import restaurantImg from '../../assets/placeIcon/restaurantImg.svg';
import schoolImg from '../../assets/placeIcon/schoolImg.svg';
import cafeSmallImg from '../../assets/placeIcon/cafeSmallImg.svg';

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
    label: '기숙사, 셰어하우스',
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
    image: plusImg,
    label: '직접 입력',
    size: 'w-[26.59px] h-[26.59px]',
  },
};

const SelectableRoleCard: React.FC<PlaceRollCardProps> = ({
  role,
  selected,
  onClick,
}) => {
  const { image, label, size } = roleStyles[role];

  return (
    <div
      className='flex flex-col items-center cursor-pointer'
      onClick={onClick}
    >
      <div
        className={classNames(
          'relative w-[91px] h-[91px] rounded-full flex flex-col items-center justify-center border transition-all',
          selected
            ? 'bg-[#e0eaff] border-[#4d83fd]'
            : 'bg-[#f6f6f6] border-[#DEDEDE]'
        )}
      >
        <img src={image} alt={label} className={classNames(size)} />
      </div>

      <div
        className={classNames(
          'font-[Pretendard] text-[14px]',
          role === 'plus'
            ? 'text-[#bdbdbd]'
            : selected
              ? 'text-[#4d83fd]'
              : 'text-black'
        )}
      >
        {label}
      </div>
    </div>
  );
};

export default SelectableRoleCard;
