import React from 'react';
import Button from '../button/PopUpButton';
import ReactModal from 'react-modal';

interface PopUpCodeProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: React.ReactNode;
  descript: string;
  input?: boolean;
  placeholder?: string;
  first?: string;
  second?: string;
  onFirstClick?: () => void;
  onSecondClick?: (inputValue?: string) => void;
  code?: string;
}

const PopUpCode = ({
  isOpen,
  onRequestClose,
  title,
  descript,
  input,
  first,
  second,
  onFirstClick,
  onSecondClick,
  code,
}: PopUpCodeProps) => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      className='flex justify-center items-center h-screen'
      overlayClassName='fixed inset-0 w-[393px] h-[852px] mx-auto bg-black/60 z-50 flex justify-center items-center'
    >
      <div
        className='flex flex-col justify-center items-center w-[306px] pt-8 pb-8 bg-[#fff] rounded-[8px] whitespace-pre-line '
        style={{ boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.05)' }}
      >
        <h2 className=' text-[16px] font-[600] '>{title}</h2>
        {descript && (
          <p className='!mt-3 text-[12px] font-[400] text-[#8e8e8e] text-center'>
            {descript}
          </p>
        )}

        <p className='w-28 h-8 !mt-5 py-[6px] bg-zinc-300/20 rounded-lg text-center justify-center items-center text-blue-500 text-sm font-semibold leading-tight'>
          {code}
        </p>

        {(first || second) && (
          <div
            className={`flex flex-row items-center w-[263px] mt-7 ${first && second ? 'justify-between' : 'justify-center'}`}
          >
            {first && (
              <Button variant='gray' onClick={onFirstClick}>
                {first}
              </Button>
            )}
            {second && (
              <Button
                style={{ cursor: 'pointer' }}
                variant='blue'
                onClick={() => {
                  onSecondClick?.(inputValue);
                  setInputValue('');
                }}
              >
                {second}
              </Button>
            )}
            {second && !input && <Button variant='blue'>{second}</Button>}
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default PopUpCode;
