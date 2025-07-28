import React from 'react';
import { useNavigate } from 'react-router-dom';
import arrowBack from '../assets/nav/arrowBack.svg';

interface HeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  onRightClick?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  rightElement,
  onRightClick,
  showBackButton = true,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[52px] bg-white z-50 flex items-center justify-center ">

      {showBackButton && (
        <button
          onClick={handleBack}
          className="absolute left-4"
          aria-label="뒤로가기"
        >
          <img src={arrowBack} alt="뒤로가기" className="w-5 h-5" />
        </button>
      )}

      <span className="text-[18px] font-semibold text-black">{title}</span>

      {rightElement && (
        <button
          onClick={onRightClick}
          className="absolute right-4 w-[36px] h-[36px]"
          aria-label="오른쪽 아이콘"
        >
          {rightElement}
        </button>
      )}
    </header>
  );
};

export default Header;
