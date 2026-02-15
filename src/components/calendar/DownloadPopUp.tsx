// src/components/calendar/DownloadPopUp.tsx
import React from 'react';
import ReactModal from 'react-modal';
import closeIcon from '../../assets/closeIcon.svg';

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
  photoUrl?: string;
  hasPhoto?: boolean;
  taskTitle?: string;
  dutyName?: string;
  completedAt?: string | Date | null;
};

const DownloadPopUp: React.FC<Props> = ({
  isOpen,
  onRequestClose,
  photoUrl,
  hasPhoto = false,
  taskTitle = '청소',
  dutyName = '당번',
  completedAt,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className='flex justify-center items-center h-screen'
      overlayClassName='fixed inset-0 w-full h-screen mx-auto bg-black/30 z-50 flex justify-center items-center'
    >
      <div className='w-[302px] bg-white rounded-[12px] py-[16px] px-[18px]'>
        <div className='flex justify-between items-center mb-[17px] mt-1'>
          <span className='text-[16px] font-[400]'>
            {taskTitle} / {dutyName}
          </span>
          <button type='button' onClick={onRequestClose} className='w-9 h-9'>
            <img src={closeIcon} alt='닫기' className='w-9 h-9' />
          </button>
        </div>
        <div className='flex flex-col items-center justify-center-safe'>
          <div className='w-[264px] h-[196px] bg-[#EFEFEF] rounded-[8px] mb-4 flex items-center justify-center'>
            {hasPhoto && photoUrl ? (
              <img
                src={photoUrl}
                alt='청소 사진'
                className='w-full h-full object-cover rounded-[8px]'
              />
            ) : (
              <div className='flex flex-col items-center justify-center text-[#8e8e8e]'>
                <div className='w-16 h-16 bg-[#DEDEDE] rounded-full flex items-center justify-center mb-2'>
                  <span className='text-2xl'>📷</span>
                </div>
                <p className='text-[14px]'>이미지 없음</p>
                <p className='text-[12px] mt-1'>업로드된 사진이 없습니다</p>
              </div>
            )}
          </div>
          {hasPhoto && photoUrl && (
            <>
              <button className='w-[126px] h-[44px] mb-2 rounded-[8px] bg-[#4D83FD] text-white text-[14px] font-[600]'>
                다운로드
              </button>
              <p className='mt-3 text-[12px] text-[#8e8e8e]'>
                사진 만료일 :{' '}
                {(() => {
                  if (!completedAt) return '2025 / 00 / 00';
                  const uploadDate = new Date(completedAt);
                  const expiryDate = new Date(
                    uploadDate.getTime() + 72 * 60 * 60 * 1000
                  ); // +72시간
                  return `${expiryDate.getFullYear()} / ${String(expiryDate.getMonth() + 1).padStart(2, '0')} / ${String(expiryDate.getDate()).padStart(2, '0')}`;
                })()}
              </p>
            </>
          )}
        </div>
      </div>
    </ReactModal>
  );
};

export default DownloadPopUp;
