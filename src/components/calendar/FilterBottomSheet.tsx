import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import grayBar from '../../assets/grayBar.svg';
import FilterChip from './FilterChip';

type FilterValue = 'all' | 'done' | 'undone';

interface FilterBottomSheetProps {
  isOpen: boolean; // ← 열림/닫힘
  selected: FilterValue;
  onSelect: (value: FilterValue) => void;
  onClose: () => void; // ← 닫기 핸들러(딤 클릭/ESC)
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  selected,
  onSelect,
  onClose,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // 열렸을 때: 바디 스크롤 잠금 + ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div className='fixed inset-0 z-[1000]' role='dialog' aria-modal='true'>
      {/* 딤 */}
      <div className='absolute inset-0 bg-black/30' onClick={onClose} />

      {/* 바텀 시트 */}
      <div className='absolute inset-x-0 bottom-0 flex justify-center'>
        <div
          ref={sheetRef}
          className='w-full max-w-[480px] bg-white rounded-t-[24px] shadow-xl overflow-hidden animate-[slideUp_180ms_ease-out]'
          onClick={(e) => e.stopPropagation()} // 시트 내부 클릭은 전파 막기
        >
          {/* 그랩바 */}
          <div className='flex justify-center py-2 mt-[10px] mb-[27px]'>
            <img src={grayBar} alt='바' />
          </div>

          {/* 내용 */}
          <div className='px-[18px] pb-[24px]'>
            <p className='font-normal text-base px-[10px]'>필터</p>
            <div className='flex gap-[19px] px-[10px] mt-[28px]'>
              <button
                type='button'
                className='cursor-pointer'
                onClick={() => {
                  onSelect('all');
                  onClose();
                }}
              >
                <FilterChip label='전체' selected={selected === 'all'} />
              </button>
              <button
                type='button'
                className='cursor-pointer'
                onClick={() => {
                  onSelect('done');
                  onClose();
                }}
              >
                <FilterChip label='청소 완료' selected={selected === 'done'} />
              </button>
              <button
                type='button'
                className='cursor-pointer'
                onClick={() => {
                  onSelect('undone');
                  onClose();
                }}
              >
                <FilterChip
                  label='청소 미완료'
                  selected={selected === 'undone'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 단일 파일용 키프레임 정의 */}
      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );

  // 포털로 최상단에 렌더
  return createPortal(content, document.body);
};

export default FilterBottomSheet;
