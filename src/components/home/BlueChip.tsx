import React from 'react'

interface BlueChipProps {
    title : string;
}
const BlueChip = ({ title }: BlueChipProps) => {
  return (
    <div className='bg-[#4D83FD] rounded-[21px] w-fit h-[28px] px-3 py-2.5 flex items-center'>
      <span className='text-[14px] text-white font-semibold'>{title}</span>
    </div>

  )
}

export default BlueChip
