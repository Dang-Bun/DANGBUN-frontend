import React from 'react';

interface MemberPopUpProps {
  onSelect: (type: 'dangbun' | 'member') => void;
}

const MemberPopUp = ({ onSelect }: MemberPopUpProps) => {
  return (
    <div className='w-[120px] h-[80px] bg-[#F9F9F9] flex flex-col items-center justify-center rounded-[8px] shadow-xl space-y-2'>
      <button
        onClick={() => onSelect('dangbun')}
        className='w-full text-center hover:bg-gray-100'
      >
        당번
      </button>
      <div className='w-[60%] h-px bg-gray-300' />
      <button
        onClick={() => onSelect('member')}
        className='w-full text-center hover:bg-gray-100'
      >
        멤버
      </button>
    </div>
  );
};

export default MemberPopUp;
