import React from 'react';
import closeIcon from '../../assets/closeIcon.svg';

interface RecentSearchProps {
  label: string;
  deleted?: boolean;
  onDelete?: () => void; 
}

const RecentSearch = ({ label, deleted = false, onDelete }: RecentSearchProps) => {
  const bgColor = !deleted ? 'bg-[#F6F6F6]' : 'bg-[#BDBDBD]';

  return (
    <div
      className={`w-fit px-[10px] h-[31px] rounded-[8px] gap-[5px] text-sm font-normal ${bgColor} flex items-center justify-center`}
    >
      <span>{label}</span>
      <img
        src={closeIcon}
        alt="닫기"
        className="cursor-pointer"
        onClick={onDelete}  
      />
    </div>
  );
};

export default RecentSearch;
