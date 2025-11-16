import React from 'react';
import { useNavigate } from 'react-router-dom';
import left_chevron from '../assets/chevron/left_chevronImg.svg';

interface HeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  onRightClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  rightElement,
  onRightClick,
  showBackButton = true,
  onBackClick,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      if (window.history.length > 1) navigate(-1);
      else navigate('/');
    }
  };

  return (
    <header className='fixed top-0 left-0 right-0 h-[52px] bg-white z-50 flex items-center justify-center'>
      <div className='relative w-full h-full flex items-center justify-center mx-auto'>
        {showBackButton && (
          <button
            onClick={handleBack}
            className='absolute left-4 cursor-pointer'
            aria-label='뒤로가기'
          >
            <img src={left_chevron} alt='뒤로가기' />
          </button>
        )}

        <span className='text-[18px] font-semibold text-black'>{title}</span>

        {rightElement && (
          <button
            onClick={onRightClick}
            className='absolute right-5 cursor-pointer'
            aria-label='오른쪽 아이콘'
          >
            {rightElement}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
