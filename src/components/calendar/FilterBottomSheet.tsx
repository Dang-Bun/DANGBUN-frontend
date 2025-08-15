import React from 'react';
import grayBar from '../../assets/grayBar.svg';
import FilterChip from './FilterChip';

type FilterValue = 'all' | 'done' | 'undone';

interface FilterBottomSheetProps {
  selected: FilterValue;
  onSelect: (value: FilterValue) => void;
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ selected, onSelect }) => {
  return (
    <div className="px-[18px] py-[20px] bg-white rounded-t-[24px] flex flex-col items-center justify-center">
      <img src={grayBar} alt="바" />
      <div className="flex flex-col gap-[20px] p-[18px] w-full">
        <p className="font-normal text-base p-[10px]">필터</p>
        <div className="flex gap-[19px]">
          <button type="button" onClick={() => onSelect('all')} className="cursor-pointer">
            <FilterChip label="전체" selected={selected === 'all'} />
          </button>
          <button type="button" onClick={() => onSelect('done')} className="cursor-pointer">
            <FilterChip label="청소 완료" selected={selected === 'done'} />
          </button>
          <button type="button" onClick={() => onSelect('undone')} className="cursor-pointer">
            <FilterChip label="청소 미완료" selected={selected === 'undone'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBottomSheet;
