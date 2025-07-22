import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import bottomChevron from '../../assets/chevron/bottom_chevronImg.svg';

interface DropdownProps {
  options: string[];
  defaultValue?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  defaultValue = '',
  placeholder = '선택하세요',
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsCustomInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustomInput]);

  const handleSelect = (option: string) => {
    if (option === '직접입력') {
      setIsOpen(false);
      setIsCustomInput(true);
    } else {
      setSelected(option);
      setIsOpen(false);
      setIsCustomInput(false);
      if (onSelect) onSelect(option);
    }
  };

  const confirmCustomInput = () => {
    if (!customValue.trim()) return;
    setSelected(customValue);
    if (onSelect) onSelect(customValue);
    setIsOpen(false);
    setIsCustomInput(false);
  };

  return (
    <div className='relative w-full max-w-[158px]' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => {
          setIsOpen((prev) => !prev);
          setIsCustomInput(false);
        }}
        className='w-full h-[50px] rounded-[8px] bg-[#F9F9F9] text-[16px] font-normal px-3 py-[14px] flex justify-between items-center'
      >
        {isCustomInput ? (
          <input
            ref={inputRef}
            type='text'
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onBlur={confirmCustomInput}
            onKeyDown={(e) => e.key === 'Enter' && confirmCustomInput()}
            className='bg-transparent outline-none w-full text-[#1e1e1e]'
            placeholder='입력하세요'
          />
        ) : (
          <span className={selected ? 'text-[#1e1e1e]' : 'text-[#8E8E8E]'}>
            {selected || placeholder}
          </span>
        )}
        <img src={bottomChevron} alt='아래화살표' />
      </button>

      {isOpen && (
        <ul className='absolute top-[calc(100%+6.25px)] left-0 right-0 w-full max-w-[158px] bg-[#F9F9F9] rounded-[8px] py-2 z-[1000] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'>
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={classNames(
                'px-[7px] py-[4px] text-[16px] text-[#8E8E8E] cursor-pointer hover:bg-[#E0EAFF]',
                {
                  'bg-[#E0EAFF]':
                    option === selected ||
                    (isCustomInput && option === '직접입력'),
                }
              )}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
