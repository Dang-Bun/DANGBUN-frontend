import React from 'react';
import classNames from 'classnames';
import managerImg from '../../assets/placeIcon/managerImg.svg';
import memberImg from '../../assets/placeIcon/memberImg.svg';
import notSelectedImg from '../../assets/checkIcon/notSelectedImg.svg';
import greenSelectedImg from '../../assets/checkIcon/greenSelected.svg';
import blueSelectedImg from '../../assets/checkIcon/blueSelectedImg.svg';

export type RoleType = 'manager' | 'member';

interface SelectableRollCardProps {
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
  },
  member: {
    image: memberImg,
    label: '멤버',
    bg: 'bg-[#ebfff6]',
    border: 'border-[#4ceba5]',
    text: 'text-[#4ceba5]',
  },
};

const SelectableRoleCard: React.FC<SelectableRollCardProps> = ({
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
