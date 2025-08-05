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

interface GradRollCardProps {
  role: RoleType;
}

const roleStyles = {
  cafe: {
    image: cafeSmallImg,
    label: '카페',
  },
  building: {
    image: buildingImg,
    label: '빌딩',
  },
  cinema: {
    image: cinemaImg,
    label: '영화관',
  },
  dormitory: {
    image: dormitoryImg,
    label: ['   기숙사,', '셰어하우스'],
  },
  gym: {
    image: gymImg,
    label: '헬스장',
  },
  office: {
    image: officeImg,
    label: '사무실',
  },
  restaurant: {
    image: restaurantImg,
    label: '식당',
  },
  school: {
    image: schoolImg,
    label: '학교',
  },
  plus: {
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
