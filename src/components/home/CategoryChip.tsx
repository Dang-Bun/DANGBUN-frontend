import React from 'react';

interface CategoryChipProps {
  onSelect: (type: 'all' | 'ing'| 'done') => void;
}

const CategoryChip = ({ onSelect }: CategoryChipProps) => {
  return (
    <div className="w-[120px] h-fit bg-[#F9F9F9] flex flex-col items-center justify-center rounded-[8px] shadow-xl">
      <button
        onClick={() => onSelect('all')}
        className="text-center hover:bg-gray-100 text-[#797C82] font-[14px] py-2.5"
      >
        전체 청소
      </button>
      <div className="w-[60%] h-px bg-gray-300" />
      <button
        onClick={() => onSelect('ing')}
        className="text-center hover:bg-gray-100 text-[#797C82] font-[14px] py-2.5"
      >
        달성 완료
      </button>
      <div className="w-[60%] h-px bg-gray-300" />
      <button
        onClick={() => onSelect('done')}
        className="text-center hover:bg-gray-100 text-[#797C82] font-[14px] py-2.5"
      >
        달성 미완료
      </button>
    </div>
  );
};

export default CategoryChip;
