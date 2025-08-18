import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import slidCheck from '../../assets/calendar/slidCheck.svg';

type Props = {
  disabled?: boolean;
  onToggle?: () => void;
  onCardClick?: () => void;
  children: React.ReactNode;
};

const ACTION_W = 60;

const SwipeableRow: React.FC<Props> = ({ disabled, onToggle, onCardClick, children }) => {
  const [revealed, setRevealed] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!disabled) {
        setRevealed(true);
      }
    },
    onSwipedRight: () => setRevealed(false),
    trackMouse: true,
  });

  return (
    <div {...handlers} className="relative w-full">
      <div
        className="absolute w-full bg-[#4D83FD] right-0 top-0 bottom-0 flex items-center p-5 justify-end rounded-[8px]"
      >
        <img 
          src={slidCheck} 
          alt="체크" 
          className="w-7 h-7 cursor-pointer" 
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
            setRevealed(false);
          }}
        />
      </div>

      <div
        className={`relative rounded-[8px] overflow-hidden ${revealed ? 'bg-[#E9ECF4]' : 'bg-white'}`}
        style={{
          width: revealed ? `calc(100% - ${ACTION_W}px)` : '100%',
          transition: 'width 200ms ease',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableRow;