import React from 'react';

interface BlueChipProps {
  title: string;
  maxLength?: number;
}
const BlueChip = ({ title, maxLength = 7 }: BlueChipProps) => {
  const displayTitle =
    title.length > maxLength ? title.slice(0, maxLength) : title;

  return (
    <div className='bg-[#4D83FD] rounded-[21px] w-fit h-[28px] px-3 py-2.5 flex items-center'>
      <span className='text-[14px] text-white font-semibold'>
        {displayTitle}
      </span>
    </div>
  );
};

export default BlueChip;
