import React from 'react';
import closeIcon from '../../assets/closeIcon.svg';

interface RecentSearchProps {
  label: string;
  deleted ?: boolean;
}

const RecentSearch = ({ label, deleted = false }: RecentSearchProps) => {
   const bgColor =
    !deleted
        ? 'bg-[#F6F6F6]' : 'bg-[#BDBDBD]';

  return (
    <div className={`w-fit p-[16px] h-[31px] rounded-[8px] gap-[5px] ${bgColor} flex items-center justify-center text-sm font-medium`}>
      {label}
      <img src={closeIcon} alt="닫기" />
    </div>
  );
};

export default RecentSearch;
