import React from 'react';

interface FilterChipProps {
  label: string;
  selected?: boolean;
}

const FilterChip = ({ label, selected = false }: FilterChipProps) => {
  
   const bgColor =
    selected
        ? 'bg-[#4D83FD]' : 'bg-[#F9F9F9]';

    const textColor = 
        selected 
        ? 'text-[#FFFFFF]' 
        : 'text-black';

  return (
    <div className={`w-[105.32px] py-[7px] h-[36px] rounded-[8px] ${bgColor} ${textColor} flex items-center justify-center text-sm font-medium`}>
      {label}
    </div>
  );
};

export default FilterChip;
