import React from 'react';
import Button from '../button/PopUpButton';
import ReactModal from 'react-modal';

interface PopUpCardProps {
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
}

const PopUpCard = ({
  isOpen,
  onRequestClose,
  title,
  descript,
  input,
  placeholder,
  first,
  second,
  onFirstClick,
  onSecondClick,
}: PopUpCardProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

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

        {input && (
          <input
            className='flex justify-center items-center h-10 w-[263px] mt-5 pt-2.5 pb-2.5 pl-3 rounded-[8px] bg-[#F9f9f9] text-sm font-normal'
            type='text'
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
          />
        )}
        {(first || second) && (
          <div
            className={`flex flex-row items-center w-[263px] mt-7 ${first && second ? 'justify-between' : 'justify-center'}`}
          >
            {first && (
              <Button variant='gray' onClick={onFirstClick}>
                {first}
              </Button>
            )}
            {second && input && (
              <Button
                style={{ cursor: inputValue ? 'pointer' : 'default' }}
                variant={inputValue ? 'blue' : 'thickGray'}
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

export default PopUpCard;
