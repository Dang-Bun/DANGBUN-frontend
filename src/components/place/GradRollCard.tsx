import React from 'react';
import buildingImg from '../../assets/placeIcon/buildingImg.svg';
import cinemaImg from '../../assets/placeIcon/cinemaImg.svg';
import dormitoryImg from '../../assets/placeIcon/dormitoryImg.svg';
import gymImg from '../../assets/placeIcon/gymImg.svg';
import officeImg from '../../assets/placeIcon/officeImg.svg';
import restaurantImg from '../../assets/placeIcon/restaurantImg.svg';
import schoolImg from '../../assets/placeIcon/schoolImg.svg';
import cafeSmallImg from '../../assets/placeIcon/cafeSmallImg.svg';
import homeImg from '../../assets/placeIcon/homeImg.svg';
import gradCircle from '../../assets/placeMake/GradCircle.svg';

export type RoleType =
  | 'CAFE'
  | 'RESTAURANT'
  | 'THEATER'
  | 'DORMITORY'
  | 'BUILDING'
  | 'OFFICE'
  | 'SCHOOL'
  | 'GYM'
  | 'ETC';

interface GradRollCardProps {
  role: RoleType;
}

const roleStyles = {
  CAFE: {
    image: cafeSmallImg,
    label: '카페',
  },
  BUILDING: {
    image: buildingImg,
    label: '빌딩',
  },
  THEATER: {
    image: cinemaImg,
    label: '영화관',
  },
  DORMITORY: {
    image: dormitoryImg,
    label: ['   기숙사,', '셰어하우스'],
  },
  GYM: {
    image: gymImg,
    label: '헬스장',
  },
  OFFICE: {
    image: officeImg,
    label: '사무실',
  },
  RESTAURANT: {
    image: restaurantImg,
    label: '식당',
  },
  SCHOOL: {
    image: schoolImg,
    label: '학교',
  },
  ETC: {
    image: homeImg,
    label: '직접 입력',
  },
};

const GradRollCard: React.FC<GradRollCardProps> = ({ role }) => {
  const { image, label } = roleStyles[role];

  return (
    <div className='flex relative flex-col items-center justify-center gap-1'>
      <img src={gradCircle} alt='gradation circle' />

      <img
        src={image}
        alt={Array.isArray(label) ? label.join(' ') : label}
        className={'absolute h-[118px]'}
      />
    </div>
  );
};

export default GradRollCard;
