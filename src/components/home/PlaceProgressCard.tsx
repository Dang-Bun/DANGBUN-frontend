// src/components/home/PlaceProgressCard.tsx
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BlueChip from './BlueChip';

import buildingImg from '../../assets/placeIcon/buildingImg.svg';
import cinemaImg from '../../assets/placeIcon/cinemaImg.svg';
import dormitoryImg from '../../assets/placeIcon/dormitoryImg.svg';
import gymImg from '../../assets/placeIcon/gymImg.svg';
import officeImg from '../../assets/placeIcon/officeImg.svg';
import restaurantImg from '../../assets/placeIcon/restaurantImg.svg';
import schoolImg from '../../assets/placeIcon/schoolImg.svg';
import cafeSmallImg from '../../assets/placeIcon/cafeSmallImg.svg';
import homeImg from '../../assets/placeIcon/homeImg.svg';

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
  
const categoryIcon: Record<Category, string> = {
  CAFE: cafeSmallImg,
  RESTAURANT: restaurantImg,
  THEATER: cinemaImg,
  DORMITORY: dormitoryImg,
  BUILDING: buildingImg,
  OFFICE: officeImg,
  SCHOOL: schoolImg,
  GYM: gymImg,
  ETC: homeImg,
};

interface Props {
  placeName?: string;
  placeId?: number | string;
  percent?: number;
  iconSrc?: string;         //  직접 경로를 받을 수도 있고
  iconKey?: Category;   //  키를 받을 수도 있음
}

const BASE_R = 70;
const TRACK_R = 59;
const STROKE = 7;
const SIZE = BASE_R * 2;

const PlaceProgressCard: React.FC<Props> = (props) => {
  const { state } = useLocation() as {
    state?: {
      placeId?: number | string;
      placeName?: string;
      percent?: number;
      iconSrc?: string;         // state로도 들어올 수 있음
      iconKey?: Category;
    };
  };

  const placeName = props.placeName ?? state?.placeName ?? '';
  const rawPercent = props.percent ?? state?.percent ?? 0;

  //  최종 아이콘 "경로"만 만든다
  const PlaceIconSrc = useMemo(() => {
    const direct = props.iconSrc ?? state?.iconSrc;
    if (direct) return direct;                               // 우선순위 1: 직접 경로
    const key = props.iconKey ?? state?.iconKey;
    return key ? categoryIcon[key] : undefined;            // 우선순위 2: 키 → 경로 매핑
  }, [props.iconSrc, state?.iconSrc, props.iconKey, state?.iconKey]);

  const percent = useMemo(() => {
    const n = Math.round(Number(rawPercent));
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  }, [rawPercent]);

  const done = percent === 100;

  const c = BASE_R;
  const circumference = 2 * Math.PI * TRACK_R;
  const dashOffset = circumference * (1 - percent / 100);

  return (
    <section className="w-[353px] h-fit rounded-[12px] bg-[#81A9FF] p-3 flex flex-col gap-2">
      <div className="w-full flex items-center justify-between">
        <BlueChip title={placeName || ' '} />
        <div className={`h-[28px] px-3 rounded-[21px] text-[14px] font-semibold leading-[28px] ${done ? 'bg-[#EBFFF6] text-[#22C55E]' : 'bg-[#E0EAFF] text-[#4D83FD]'}`}>
          {done ? '진행완료' : '진행중'}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex-1 w-full flex items-center justify-center relative">
          <svg width={SIZE} height={SIZE}>
            <circle cx={c} cy={c} r={BASE_R} fill="#FFFFFF" />
            <g transform={`rotate(-90 ${c} ${c})`}>
              <circle cx={c} cy={c} r={TRACK_R} fill="none" stroke="#E0EAFF" strokeWidth={STROKE} strokeLinecap="round" />
              <circle cx={c} cy={c} r={TRACK_R} fill="none" stroke="#4D83FD" strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
            </g>
          </svg>

          {PlaceIconSrc && (
            <img
              src={PlaceIconSrc}
              alt="place icon"
              className="absolute z-10 object-contain select-none pointer-events-none"
              style={{ width: 70, height: 70, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              draggable={false}
            />
          )}
        </div>

        <div className="flex items-center gap-2 justify-center pb-2">
          <span className="text-white text-[14px] leading-[14px]">전체 진행률</span>
          <span className="px-3 py-[2px] rounded-full bg-white text-[#4D83FD] text-[14px] font-semibold">{percent}%</span>
        </div>
      </div>
    </section>
  );
};

export default PlaceProgressCard;
