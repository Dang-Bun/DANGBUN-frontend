import React from 'react';
import classNames from 'classnames';
import buildingImg from '../../assets/placeIcon/buildingImg.svg';
import cafeSmallImg from '../../assets/placeIcon/cafeSmallImg.svg';
import cinemaImg from '../../assets/placeIcon/cinemaImg.svg';
import dormitoryImg from '../../assets/placeIcon/dormitoryImg.svg';
import gymImg from '../../assets/placeIcon/gymImg.svg';
import officeImg from '../../assets/placeIcon/officeImg.svg';
import plusImg from '../../assets/placeIcon/plusImg.svg';
import restaurantImg from '../../assets/placeIcon/restaurantImg.svg';
import schoolImg from '../../assets/placeIcon/schoolImg.svg';

type RoleType =
  | 'building'
  | 'cinema'
  | 'dormitory'
  | 'gym'
  | 'office'
  | 'restaurant'
  | 'school'
  | 'plus';

interface SelectableRoleCardProps {
  role: RoleType;
  selected: boolean;
  onClick: () => void;
}

const roleStyles = {
  manager: {
    image: managerImg,
    label: '매니저',
    bg: 'bg-[#e0eaff]',
    border: 'border-[#4d83fd]',
    text: 'text-[#4d83fd]',
    check: 'bg-[#4d83fd]',
  },
  member: {
    image: memberImg,
    label: '멤버',
    bg: 'bg-[#ebfff6]',
    border: 'border-[#4ceba5]',
    text: 'text-[#4ceba5]',
    check: 'bg-[#4ceba5]',
  },
};

const SelectableRoleCard: React.FC<SelectableRoleCardProps> = ({
  role,
  selected,
  onClick,
}) => {
  const { image, label, bg, border, text } = roleStyles[role];

  return (
    <div
      className='flex flex-col items-center cursor-pointer'
      onClick={onClick}
    >
      <div
        className={classNames(
          'relative w-[156px] h-[156px] rounded-full flex flex-col items-center justify-center border transition-all',
          selected ? `${bg} ${border}` : 'bg-white border-[#DEDEDE]'
        )}
      >
        <img
          src={image}
          alt={label}
          className={classNames(
            role === 'manager'
              ? 'absolute top-[22px] left-[46px] w-[81px] h-[96.62px]'
              : 'absolute top-[39px] left-[41px] w-[84.041px] h-[72px]',
            'object-contain'
          )}
        />
        <p
          className={classNames(
            'absolute bottom-[12px] font-[Pretendard] text-[12px] not-italic font-semibold leading-[140%]',
            selected ? `${text} font-medium` : 'text-[#8e8e8e]'
          )}
        >
          {label}
        </p>
      </div>

      <div className='w-[20px] h-[20px] mt-2'>
        <img
          src={
            !selected
              ? notSelectedImg
              : role === 'member'
                ? greenSelectedImg
                : blueSelectedImg
          }
          alt='선택 상태'
          className='w-full h-full object-contain'
        />
      </div>
    </div>
  );
};

export default SelectableRoleCard;
