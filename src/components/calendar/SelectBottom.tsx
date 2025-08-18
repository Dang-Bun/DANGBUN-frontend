import React from 'react';
import { useNavigate } from 'react-router-dom';
import grayBar from '../../assets/grayBar.svg';

type Props = {
  onOpenInfo?: () => void;
  onViewPhoto?: () => void;
  onDelete?: () => void;
};

const SelectBottom: React.FC<Props> = ({ onOpenInfo, onViewPhoto, onDelete }) => {
  const handleOpenInfo = () => {
    onOpenInfo?.();
  };

  return (
    <div className="h-[212px] gapx-[18px] bg-white rounded-[24px] flex flex-col items-center justify-center z-50 relative">
      <img src={grayBar} alt="바" className="pt-[20px]" />
      <div className="flex flex-col p-[18px] w-full max-w-[375px]">
        <div>
          <button className="w-full p-[10px] flex justify-center" onClick={onViewPhoto}>
            사진 보기
          </button>
          <div className="w-[339px] h-[1px] bg-[#DEDEDE] mx-auto" />
        </div>
        <div>
          <button className="w-full p-[16px] flex justify-center" onClick={handleOpenInfo}>
            해당 청소 정보
          </button>
          <div className="w-[339px] h-[1px] bg-[#DEDEDE] mx-auto" />
        </div>
        <div>
          <button className="w-full p-[10px] flex justify-center" onClick={onDelete}>
            체크리스트에서 청소 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectBottom;
