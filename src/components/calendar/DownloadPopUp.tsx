// src/components/calendar/DownloadPopUp.tsx
import React from 'react';
import ReactModal from 'react-modal';
import closeIcon from '../../assets/closeIcon.svg';

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};

const DownloadPopUp: React.FC<Props> = ({ isOpen, onRequestClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className="flex justify-center items-center h-screen"
      overlayClassName="fixed inset-0 w-[393px] h-screen mx-auto bg-black/60 z-50 flex justify-center items-center"
    >
      <div className="w-[302px] bg-white rounded-[12px] py-[16px] px-[18px]">
        <div className="flex justify-between items-center mb-[17px] mt-1">
          <span className="text-[16px] font-[400]">청소 이름 / 당번 A</span>
          <button type="button" onClick={onRequestClose} className="w-9 h-9">
            <img src={closeIcon} alt="닫기" className='w-9 h-9' />
          </button>
        </div>
        <div className='flex flex-col items-center justify-center-safe'>
            <div className="w-[264px] h-[196px] bg-[#EFEFEF] rounded-[8px] mb-4 flex items-center justify-center text-[#8e8e8e]">
            이미지 영역
             </div>
            <button className="w-[126px] h-[44px] mb-2 rounded-[8px] bg-[#4D83FD] text-white text-[14px] font-[600]">
                다운로드
            </button>
            <p className="mt-3 text-[12px] text-[#8e8e8e]">사진 만료일 : 2025 / 00 / 00</p>
        </div>
      </div>
    </ReactModal>
  );
};

export default DownloadPopUp;
