import React from "react";

interface ProgressBarProps {
  percentage: number;
  iconSrc: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, iconSrc }) => {
  const size = 256;
  const center = size / 2;
  const strokeWidth = 5;
  const dotRadius = 13.5;
  const ringRadius = center - dotRadius;
  const innerCircleRadius = ringRadius - dotRadius;
  const circumference = 2 * Math.PI * ringRadius;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const dashOffset = circumference - (clampedPercentage / 100) * circumference;
  const rotationAngle = (clampedPercentage / 100) * 360;

  const getStatusText = () => {
    if (clampedPercentage === 0) return "진행 전";
    if (clampedPercentage === 100) return "완료";
    return "진행중";
  };

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <g transform={`rotate(-90 ${center} ${center})`}>
          <circle cx={center} cy={center} r={innerCircleRadius} fill="white" />
          <circle
            cx={center}
            cy={center}
            r={ringRadius}
            fill="none"
            stroke="#E5E5E5"
            strokeWidth={strokeWidth}
          />
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
        </g>
        <g
          style={{
            transformOrigin: `${center}px ${center}px`,
            transition: "transform 0.5s ease-in-out",
          }}
          transform={`rotate(${rotationAngle})`}
        >
          <circle cx={center} cy={dotRadius} r={dotRadius} fill="white" />
        </g>
      </svg>
      
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <img src={iconSrc} alt="상태 아이콘" className="w-9 h-9 mb-2" />
        <span className="text-[16px] font-semibold text-[#4D83FD] leading-none py-[3px]">탕비실 청소</span>
        <div className="flex items-baseline py-[1.5px]">
          <span className="text-[64px] font-semibold tracking-[-5px] text-[#4D83FD] pr-[4px] leading-none">{clampedPercentage}</span>
          <span className="text-[24px] font-semibold text-[#4D83FD] leading-none">%</span>
        </div>
        <span className="mt-1 py-[2px] text-[14px] font-normal text-gray-500">{getStatusText()}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
