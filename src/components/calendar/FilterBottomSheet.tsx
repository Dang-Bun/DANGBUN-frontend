import React from 'react'
import grayBar from '../../assets/grayBar.svg';
import FilterChip from './FilterChip';

const FilterBottomSheet = () => {
  return (
    <div className='px-[18px] py-[20px] bg-white rounded-[24px] flex flex-col items-center justify-center '>
        <img src={grayBar} alt="바" />
        <div className='flex flex-col gap-[20px] p-[18px]'>
            <p className='font-normal text-base p-[10px]'>필터</p>
            <div className='flex gap-[19px]'>
                <FilterChip label="전체" selected/>
                <FilterChip label="청소 완료" />
                <FilterChip label="청소 미완료" />
            </div>
        </div>
    </div>
  )
}
export default FilterBottomSheet