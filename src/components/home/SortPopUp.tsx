import React from 'react';

interface SortPopUpProps {
  onSelect: (type: 'low' | 'high' | 'name') => void;
}

const SortPopUp = ({ onSelect }: SortPopUpProps) => {
  return (
    <div className="w-[120px] bg-[#F9F9F9] flex flex-col items-center justify-center rounded-[8px] shadow-xl py-2">
      <button
        onClick={() => onSelect('low')}
        className="w-full text-center hover:bg-gray-100 pb-2 text-[12px] text-[#797C82] font-normal"
      >
        진행률 낮은 순
      </button>
      <div className="w-[80%] h-px bg-[#DEDEDE]" />
      <button
        onClick={() => onSelect('high')}
        className="w-full text-center hover:bg-gray-100 py-2 text-[12px] text-[#797C82] font-normal"
      >
        진행률 높은 순
      </button>
      <div className="w-[80%] h-px bg-[#DEDEDE]" />
      <button
        onClick={() => onSelect('name')}
        className="w-full text-center hover:bg-gray-100 text-[12px] pt-2 text-[#797C82] font-normal"
      >
        당번 이름 순
      </button>
    </div>
  );
};

export default SortPopUp;
