import React from 'react';
import placeIcon from '../../assets/home/placeIcon.svg';

interface PlaceNameCardProps {
  place: string;
  type: 'default' | 'complete';  
}

const PlaceNameCard: React.FC<PlaceNameCardProps> = ({ place, type }) => {
  const isComplete = type === 'complete';

  return (
    <div
      className={`flex items-center justify-center w-fit h-[30px] px-2.5 py-1.5 gap-2 rounded-[8px] text-[12px] font-medium
        ${isComplete ? 'bg-[#A8C9FF] text-white' : 'bg-[#BDBDBD] text-white'}
      `}
    >
      <img src={placeIcon} alt="플레이스 아이콘" className="w-3 h-4" />
      <span className='font-[12px] '>{place}</span>
    </div>
  );
};

export default PlaceNameCard;
