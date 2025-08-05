import React from 'react';

interface WritingProps {
  label: string;
  type: 'member' | 'dangbun';
  selected?: boolean;
}

const WritingChip = ({ label, type, selected = true }: WritingProps) => {
  
    //bg color : default : gray, selected 색상 변경
   const bgColor =
    !selected
        ? 'bg-[#E5E5E5]'
        : type === 'member'
            ? 'bg-[#E0EAFF]'
            : 'bg-[#81A9FF]';

    //글자색 : dangbun&&선택 = 하얀색
    const textColor = 
    type === 'dangbun' && selected 
        ? 'text-[#FFFFFF]' 
        : 'text-black'; //그 외 검정

  return (
    <div className={`w-fit px-4 h-[31px] rounded-[8px] ${bgColor} ${textColor} flex items-center justify-center text-sm font-medium`}>
      {label}
    </div>
  );
};

export default WritingChip;
