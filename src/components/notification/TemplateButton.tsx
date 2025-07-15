import React from 'react';

interface TemplateButtonProps {
  label: string;
  selected?: boolean;
}

const TemplateButton = ({ label, selected = false }: TemplateButtonProps) => {
   const bgColor =
    !selected
        ? 'bg-[#E5E5E5]' : 'bg-[#4D83FD]';

    const textColor = selected 
        ? 'text-[#FFFFFF]' 
        : 'text-black'; 

  return (
    <div className={`w-fit px-4 h-[31px] rounded-[8px] ${bgColor} ${textColor} flex items-center justify-center text-sm font-medium`}>
      {label}
    </div>
  );
};

export default TemplateButton;
