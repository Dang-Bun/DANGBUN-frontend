import React from 'react';
import Button from '../button/PopUpButton';
import ReactModal from 'react-modal';
import DeleteIcon from '../../assets/notificationIcon/Delete.svg';

interface PopUpCardExitProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  descript: string;
  first: string;
  second: string;
  onFirstClick: () => void;
  onSecondClick: () => void;
}

const PopUpCardExit: React.FC<PopUpCardExitProps> = ({
  isOpen,
  onRequestClose,
  title,
  descript,
  first,
  second,
  onFirstClick,
  onSecondClick,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className='flex justify-center items-center h-screen'
      overlayClassName='fixed inset-0 w-full h-screen mx-auto bg-black/60 z-50 flex justify-center items-center'
    >
      <div
        className='flex flex-col justify-center items-center w-[306px] p-5 bg-[#fff] rounded-[8px] whitespace-pre-line'
        style={{ boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.05)' }}
      >
        {/* 삭제 아이콘 */}
        <div className='w-12 h-12 flex items-center justify-center mb-3'>
          <img src={DeleteIcon} alt='삭제' className='w-30 h-30' />
        </div>

        {/* 제목 */}
        <h2 className='text-[16px] font-[600] text-center mb-2'>{title}</h2>

        {/* 설명 */}
        {descript && (
          <p className='text-[12px] font-[400] text-[#8e8e8e] text-center'>
            {descript}
          </p>
        )}

        {/* 버튼 */}
        <div className='flex flex-row items-center w-[263px] justify-between mt-5'>
          <Button variant='gray' onClick={onFirstClick}>
            {first}
          </Button>
          <Button variant='blue' onClick={onSecondClick}>
            {second}
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};

export default PopUpCardExit;
