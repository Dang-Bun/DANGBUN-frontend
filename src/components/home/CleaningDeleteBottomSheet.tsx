import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

type MenuType = 'photo' | 'info' | 'name'; // name = delete

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: MenuType) => void;
  /** 딤 클릭으로 닫기 (기본 true) */
  closeOnDimClick?: boolean;
  /** 시트에 추가 클래스 */
  className?: string;
  /** 포털 대상 (기본 document.body) */
  portalTarget?: Element | null;
}

const CleaningDeleteBottomSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  closeOnDimClick = true,
  className,
  portalTarget,
}) => {
  // 열릴 때 바디 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div
      className='fixed inset-0 z-[1000]'
      role='dialog'
      aria-modal='true'
      aria-label='cleaning-action-sheet'
    >
      {/* Dim */}
      <div
        className='absolute inset-0 bg-black/40'
        onClick={closeOnDimClick ? onClose : undefined}
      />

      {/* Sheet */}
      <div
        className={[
          'absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl',
          'shadow-[0_-8px_24px_rgba(0,0,0,0.12)]',
          'pb-[max(16px,env(safe-area-inset-bottom))]',
          'animate-cdbs-slide-up',
          className ?? '',
        ].join(' ')}
      >
        {/* 그랩바 */}
        <div className='flex justify-center py-2 mb-[27px] mt-[10px]'>
          <div className='w-[64px] h-[4px] bg-[#D9D9D9] rounded-full' />
        </div>

        {/* 메뉴 */}
        <button
          onClick={() => onSelect('photo')}
          className='w-full py-4 text-center text-[16px] text-[#111] active:bg-gray-50'
        >
          사진 보기
        </button>
        <div className='h-px bg-[#E9E9E9] mx-4' />
        <button
          onClick={() => onSelect('info')}
          className='w-full py-4 text-center text-[16px] text-[#111] active:bg-gray-50'
        >
          해당 청소 정보
        </button>
        <div className='h-px bg-[#E9E9E9] mx-4' />
        <button
          onClick={() => onSelect('name')}
          className='w-full py-4 text-center text-[16px] text-[#111] active:bg-gray-50'
        >
          체크리스트에서 청소 삭제
        </button>
      </div>

      {/* 간단 애니메이션 */}
      <style>{`
        @keyframes cdbs-slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-cdbs-slide-up {
          animation: cdbs-slide-up 180ms ease-out;
        }
      `}</style>
    </div>
  );

  return createPortal(content, portalTarget ?? document.body);
};

export default CleaningDeleteBottomSheet;
