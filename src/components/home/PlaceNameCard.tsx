import React from 'react';
import placeIcon from '../../assets/home/placeIcon.svg';

interface PlaceNameCardProps {
  place?: string;                  
  type: 'default' | 'complete';
  className?: string;
  onClick?: () => void;
}

const PlaceNameCard: React.FC<PlaceNameCardProps> = ({
  place = '플레이스',           
  type,
  className,
  onClick,
}) => {
  const isComplete = type === 'complete';

  return (
    <div
      className={`flex items-center justify-center w-fit h-[30px] px-2.5 py-1.5 gap-2 rounded-[8px] text-[12px] font-medium cursor-pointer
        ${isComplete ? 'bg-[#A8C9FF] text-white' : 'bg-[#BDBDBD] text-white'}
        ${className ?? ''}`}
      aria-label={`플레이스: ${place}`}
      onClick={onClick}
    >
      <img src={placeIcon} alt="플레이스 아이콘" className="w-3 h-4" />
      <span className="text-[12px] font-medium max-w-[160px] truncate" title={place}>
        {place}
      </span>
    </div>
  );
};

export default PlaceNameCard;
