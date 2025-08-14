import React from 'react';

interface  CalendarSortProps {
  onSelect: (type: 'alpha' | 'completed') => void;
}

const CalendarSort = ({ onSelect }: CalendarSortProps) => {
  return (
    <div className='w-[120px] h-[66px] bg-[#F9F9F9] flex flex-col items-center justify-center rounded-[8px] shadow-xl space-y-2'>
      <button
        onClick={() => onSelect('alpha')}
        className='w-full text-[12px] text-center hover:bg-[#797C82] text-[#797C82]'
      >
        가나다 순
      </button>
      <div className='w-[60%] h-px bg-[#DEDEDE]' />
      <button
        onClick={() => onSelect('completed')}
        className='w-full text-[12px] text-center text-[#797C82] hover:bg-[#797C82]'
      >
        완료 시간 순
      </button>
    </div>
  );
};

export default CalendarSort;
