import React, { useMemo } from 'react';
import BlueChip from './BlueChip';

import FLOOR_BLUE from '../../assets/cleanIcon/sweepImg_2.svg';
import CLEANER_PINK from '../../assets/cleanIcon/cleanerImg.svg';
import BUCKET_PINK from '../../assets/cleanIcon/moppingImg_3.svg';
import TOILET_PINK from '../../assets/cleanIcon/toiletImg.svg';
import TRASH_BLUE from '../../assets/cleanIcon/trashImg_2.svg';
import DISH_BLUE from '../../assets/cleanIcon/cupWashingImg.svg';
import BRUSH_PINK from '../../assets/cleanIcon/polishImg.svg';
import SPRAY_BLUE from '../../assets/cleanIcon/sprayerImg.svg';

type DutyIconKey =
  | 'FLOOR_BLUE'
  | 'CLEANER_PINK'
  | 'BUCKET_PINK'
  | 'TOILET_PINK'
  | 'TRASH_BLUE'
  | 'DISH_BLUE'
  | 'BRUSH_PINK'
  | 'SPRAY_BLUE';

const ICON_URL: Record<DutyIconKey, string> = {
  FLOOR_BLUE,
  CLEANER_PINK,
  BUCKET_PINK,
  TOILET_PINK,
  TRASH_BLUE,
  DISH_BLUE,
  BRUSH_PINK,
  SPRAY_BLUE,
};

type Props = {
  dutyName: string;
  percent?: number;
  iconKey?: DutyIconKey;
  iconSrc?: string;
  width?: number;
  height?: number;
};

const SIZE = 120;
const BASE_R = 60;
const TRACK_R = 54;
const STROKE = 6;

const DangbunProgressCard: React.FC<Props> = ({
  dutyName,
  percent = 0,
  iconKey,
  iconSrc,
}) => {
  const c = BASE_R;
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  const circumference = 2 * Math.PI * TRACK_R;
  const dashOffset = circumference * (1 - p / 100);

  const status = p === 0 ? '진행 전' : p === 100 ? '진행완료' : '진행중';

  const centerIcon = useMemo(() => {
    if (iconSrc) return iconSrc;
    if (iconKey) return ICON_URL[iconKey];
    return undefined;
  }, [iconKey, iconSrc]);

  return (
    <section
      className="w-[176px] rounded-[8.5px] bg-[#F6F6F6] p-2.5 flex flex-col gap-3"
    >
      <div className="w-full flex items-center justify-between">
        <BlueChip title={dutyName} />
        <div className="h-[22px] px-3 py-1 rounded-[31px] leading-[22px] bg-[#E0EAFF] flex items-center">
          <span className="text-[#4D83FD] px-1 py-[2px] rounded-[21px] text-[12px] font-semibold">{p}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex-1 w-full flex items-center justify-center relative">
          <svg width={SIZE} height={SIZE}>
            <circle cx={c} cy={c} r={BASE_R} fill="#FFFFFF" />
            <g transform={`rotate(-90 ${c} ${c})`}>
              <circle
                cx={c}
                cy={c}
                r={TRACK_R}
                fill="none"
                stroke="#E0EAFF"
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
              <circle
                cx={c}
                cy={c}
                r={TRACK_R}
                fill="none"
                stroke="#4D83FD"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </g>
          </svg>

          {centerIcon && (
            <img
              src={centerIcon}
              alt="duty icon"
              className="absolute z-10 object-contain select-none pointer-events-none"
              style={{ width: 64, height: 64, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              draggable={false}
            />
          )}
        </div>

        <div className="flex items-center gap-2 justify-center">
          <span className="px-3 py-[2px] rounded-[21px] bg-[#E0EAFF] text-[#4D83FD] text-[12px] font-semibold">
            {status}
          </span>
        </div>
      </div>
    </section>
  );
};

export default DangbunProgressCard;
