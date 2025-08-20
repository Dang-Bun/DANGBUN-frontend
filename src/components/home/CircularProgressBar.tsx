import React from "react";
import dotActive from '../../assets/home/dotIndicatorBlue.svg';
import dotDefault from '../../assets/home/dotIndicator.svg';

// 카테고리 아이콘 (ManagerHome과 동일)
import BUILDING_IMG from '../../assets/placeIcon/buildingImg.svg';
import CINEMA_IMG from '../../assets/placeIcon/cinemaImg.svg';
import DORMITORY_IMG from '../../assets/placeIcon/dormitoryImg.svg';
import GYM_IMG from '../../assets/placeIcon/gymImg.svg';
import OFFICE_IMG from '../../assets/placeIcon/officeImg.svg';
import RESTAURANT_IMG from '../../assets/placeIcon/restaurantImg.svg';
import SCHOOL_IMG from '../../assets/placeIcon/schoolImg.svg';
import CAFE_IMG from '../../assets/placeIcon/cafeSmallImg.svg';
import HOME_IMG from '../../assets/placeIcon/homeImg.svg';

// 당번 아이콘 (ManagerHome과 동일)
import CLEANER_PINK from '../../assets/cleanIcon/cleanerImg.svg';
import BUCKET_PINK from '../../assets/cleanIcon/cupWashingImg.svg';
import BRUSH_PINK from '../../assets/cleanIcon/moppingImg_3.svg';
import DISH_BLUE from '../../assets/cleanIcon/polishImg.svg';
import SPRAY_BLUE from '../../assets/cleanIcon/sprayerImg.svg';
import FLOOR_BLUE from '../../assets/cleanIcon/sweepImg_2.svg';
import TOILET_PINK from '../../assets/cleanIcon/toiletImg.svg';
import TRASH_BLUE from '../../assets/cleanIcon/trashImg_2.svg';


type Category =
  | 'CAFE'
  | 'RESTAURANT'
  | 'THEATER'
  | 'DORMITORY'
  | 'BUILDING'
  | 'OFFICE'
  | 'SCHOOL'
  | 'GYM'
  | 'ETC';
  
const CATEGORY_ICON_SRC: Record<string, string> = {
  CAFE: CAFE_IMG,
  RESTAURANT: RESTAURANT_IMG,
  THEATER: CINEMA_IMG,
  DORMITORY: DORMITORY_IMG,
  BUILDING: BUILDING_IMG,
  OFFICE: OFFICE_IMG,
  SCHOOL: SCHOOL_IMG,
  GYM: GYM_IMG,
  ETC: HOME_IMG,
};

const DUTY_ICON_SRC: Record<string, string> = {
  FLOOR_BLUE,
  CLEANER_PINK,
  BUCKET_PINK,
  TOILET_PINK,
  TRASH_BLUE,
  DISH_BLUE,
  BRUSH_PINK,
  SPRAY_BLUE,
};

interface ProgressBarProps {
  percentage: number;
  iconSrc: string;     
  title: string;
  onCenterClick?: () => void;
  dotCount?: number;
  dotIndex?: number;
  onDotSelect?: (idx: number) => void;
}

const CONFIG = {
  size: 256,
  strokeWidth: 5,
  dotRadius: 13.5,
};

const ProgressRing: React.FC<{
  size: number;
  center: number;
  ringRadius: number;
  innerCircleRadius: number;
  strokeWidth: number;
  circumference: number;
  dashOffset: number;
  rotationAngle: number;
  dotRadius: number;
  onCenterClick?: () => void;
}> = ({ size, center, ringRadius, innerCircleRadius, strokeWidth, circumference, dashOffset, rotationAngle, dotRadius, onCenterClick }) => (
  <svg width={size} height={size} className="absolute top-0 left-0">
    <g transform={`rotate(-90 ${center} ${center})`}>
      <circle cx={center} cy={center} r={ringRadius} fill="none" stroke="#E5E5E5" strokeWidth={strokeWidth} />
      <circle
        cx={center}
        cy={center}
        r={ringRadius}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
      />
      <circle
        cx={center}
        cy={center}
        r={innerCircleRadius}
        fill="white"
        onClick={onCenterClick}
        style={{ cursor: onCenterClick ? 'pointer' : 'default' }}
      />
    </g>
    <g
      style={{ transformOrigin: `${center}px ${center}px`, transition: "transform 0.5s ease-in-out" }}
      transform={`rotate(${rotationAngle})`}
    >
      <circle cx={center} cy={dotRadius} r={dotRadius} fill="white" />
    </g>
  </svg>
);

const CenterContent: React.FC<{
  iconSrc: string;
  title: string;
  percentage: number;
  statusText: string;
  onCenterClick?: () => void;
}> = ({ iconSrc, title, percentage, statusText, onCenterClick }) => (
  <div
    className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center select-none"
    onClick={onCenterClick}
    role={onCenterClick ? 'button' : undefined}
    style={{ cursor: onCenterClick ? 'pointer' : 'default' }}
  >
    <img src={iconSrc} alt="상태 아이콘" className="w-9 h-9 mb-2" draggable={false} />
    <span className="text-[16px] font-semibold text-[#4D83FD] leading-none py-[3px]">{title}</span>
    <div className="flex items-baseline py-[1.5px]">
      <span className="text-[64px] font-semibold tracking-[-5px] text-[#4D83FD] pr-[4px] leading-none">{percentage}</span>
      <span className="text-[24px] font-semibold text-[#4D83FD] leading-none">%</span>
    </div>
    <span className="mt-1 py-[2px] text-[14px] font-normal text-gray-500">{statusText}</span>
  </div>
);

const Indicator: React.FC<{
  count: number;
  index: number;
  onSelect?: (idx: number) => void;
}> = ({ count, index, onSelect }) => {
  if (count <= 1) return null;

  return (
    <div className="absolute left-0 right-0 -bottom-6 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, idx) => {
        const isActive = idx === index;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect?.(idx)}
            aria-label={`indicator-${idx}`}
            aria-pressed={isActive}
            className="w-4 h-4 p-0 flex items-center justify-center"
          >
            <img
              src={isActive ? dotActive : dotDefault}
              alt={isActive ? '현재 페이지' : '다른 페이지'}
              className="w-2.5 h-2.5"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  iconSrc,
  title,
  onCenterClick,
  dotCount = 0,
  dotIndex = 0,
  onDotSelect,
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const center = CONFIG.size / 2;
  const ringRadius = center - CONFIG.dotRadius;
  const innerCircleRadius = ringRadius - CONFIG.dotRadius;
  const circumference = 2 * Math.PI * ringRadius;
  const dashOffset = circumference - (clampedPercentage / 100) * circumference;
  const rotationAngle = (clampedPercentage / 100) * 360;

  const getStatusText = () => {
    if (clampedPercentage === 0) return "진행 전";
    if (clampedPercentage === 100) return "완료";
    return "진행중";
  };

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: CONFIG.size, height: CONFIG.size }}
    >
      <ProgressRing
        size={CONFIG.size}
        center={center}
        ringRadius={ringRadius}
        innerCircleRadius={innerCircleRadius}
        strokeWidth={CONFIG.strokeWidth}
        circumference={circumference}
        dashOffset={dashOffset}
        rotationAngle={rotationAngle}
        dotRadius={CONFIG.dotRadius}
        onCenterClick={onCenterClick}
      />
      
      <CenterContent
        iconSrc={iconSrc}
        title={title}
        percentage={clampedPercentage}
        statusText={getStatusText()}
        onCenterClick={onCenterClick}
      />
      
      <Indicator
        count={dotCount}
        index={dotIndex}
        onSelect={onDotSelect}
      />
    </div>
  );
};

export default ProgressBar;