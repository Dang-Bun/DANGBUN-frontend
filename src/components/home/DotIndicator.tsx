//ui 수정 예정

import React from 'react';
import dotActive from '../../assets/home/dotIndicatorBlue.svg';
import dotDefault from '../../assets/home/dotIndicator.svg';

interface Props {
  total: number;
  active: number;                
  onSelect: (idx: number) => void;
  className?: string;
}

const DotIndicator: React.FC<Props> = ({ total, active, onSelect, className }) => {
  if (total <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-[6px] ${className ?? ''}`}>
      {Array.from({ length: total }).map((_, idx) => {
        const isActive = active === idx;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(idx)}
            aria-label={`indicator-${idx}`}
            aria-pressed={isActive}
            className="p-0 flex items-center justify-center"
          >
            <img
              src={isActive ? dotActive : dotDefault}
              alt={isActive ? '현재 페이지' : '다른 페이지'}
              className="w-full h-full"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
};

export default DotIndicator;
