import React from 'react';

interface UpLoadProps {
  onSelect: (type: 'low' | 'high') => void;
}

const UpLoad: React.FC<UpLoadProps> = ({ onSelect }) => {
  return (
    <div className="w-[160px] bg-[#F9F9F9] flex flex-col items-center justify-center rounded-[8px] shadow-xl py-2">
      <button
        onClick={() => onSelect('low')}
        className="w-full text-center hover:bg-gray-100 py-2 text-[12px] text-[#797C82] font-normal"
      >
        앨범에서 사진 올리기
      </button>
      <div className="w-[80%] h-px bg-[#DEDEDE]" />
      <button
        onClick={() => onSelect('high')}
        className="w-full text-center hover:bg-gray-100 py-2 text-[12px] text-[#797C82] font-normal"
      >
        사진 찍기
      </button>
    </div>
  );
};

export default UpLoad;
