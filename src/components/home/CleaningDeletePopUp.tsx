import React from 'react';

interface CleaningDeletePopUpProps {
  onSelect: (type: 'low' | 'high' | 'name') => void;
}

const CleaningDeletePopUp = ({ onSelect }: CleaningDeletePopUpProps) => {
  return (
    <div className="w-[120px] bg-[#F9F9F9] flex flex-col items-center justify-center rounded-[8px] shadow-xl py-2">
     
      <button
        onClick={() => onSelect('name')}
        className="w-full text-center hover:bg-gray-100 text-[12px] text-[#797C82] font-normal"
      >
        청소 삭제하기
      </button>
    </div>
  );
};

export default CleaningDeletePopUp;
