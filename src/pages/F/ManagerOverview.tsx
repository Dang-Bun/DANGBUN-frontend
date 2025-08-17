import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../../components/HeaderBar';
import PlaceProgressCard from '../../components/home/PlaceProgressCard';
import DangbunProgressCard from '../../components/home/DangbunProgressCard';
import SortPopUp from '../../components/home/SortPopUp';
import toggle from '../../assets/home/toggleDown.svg';

type DutyIconKey =
  | 'FLOOR_BLUE'
  | 'CLEANER_PINK'
  | 'BUCKET_PINK'
  | 'TOILET_PINK'
  | 'TRASH_BLUE'
  | 'DISH_BLUE'
  | 'BRUSH_PINK'
  | 'SPRAY_BLUE';

type PlaceIconKey = 'BUILDING' | 'CAFE' | 'CINEMA' | 'DORMITORY' | 'GYM' | 'HOME';

type DutySummary = {
  id: number;
  name: string;
  percent: number;      // 0~100
  iconKey: DutyIconKey; // 당번 아이콘
};

type Payload = {
  placeId?: number;
  placeName?: string;
  percent?: number;     // 전체 진행률
  placeIconKey?: PlaceIconKey;
  duties?: DutySummary[];
};

const clamp0to100 = (v: unknown) => {
  const n = typeof v === 'number' ? Math.round(v) : 0;
  return Math.max(0, Math.min(100, n));
};

const ManagerOverview: React.FC = () => {
  const { state } = useLocation() as { state?: Payload };
  const [sortType, setSortType] = useState<'low' | 'high' | 'name'>('low');
  const [popupOpen, setPopupOpen] = useState(false);

  // state 우선 → sessionStorage(새로고침 대비) 폴백
  const data: Payload | undefined = useMemo(() => {
    if (state?.placeName || state?.duties) return state;
    try {
      const raw = sessionStorage.getItem('overviewPayload');
      return raw ? (JSON.parse(raw) as Payload) : undefined;
    } catch {
      return undefined;
    }
  }, [state]);

  if (!data) {
    return (
      <div>
        <Header title="당번 진행률" />
        <div className="p-6 text-sm text-gray-500">요약 데이터가 없습니다. 홈 화면에서 다시 들어와 주세요.</div>
      </div>
    );
  }

  const totalPercent = clamp0to100(data.percent);

  const sortedDuties = useMemo(() => {
    const arr = (data.duties ?? []).slice();
    switch (sortType) {
      case 'high':
        return arr.sort((a, b) => b.percent - a.percent);
      case 'name':
        return arr.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko-KR'));
      case 'low':
      default:
        return arr.sort((a, b) => a.percent - b.percent);
    }
  }, [data.duties, sortType]);

  const sortLabel =
    sortType === 'low' ? '진행률 낮은 순' : sortType === 'high' ? '진행률 높은 순' : '당번 이름 순';

  return (
    <div>
      <Header title="당번 진행률" />

      <div className="mt-13 flex flex-col justify-center items-center w-full">
        {/* 플레이스 카드: 장소명 + 전체 퍼센트 + (필요 시) 플레이스 아이콘 */}
        <PlaceProgressCard
          placeName={data.placeName}
          percent={totalPercent}
          iconKey={data.placeIconKey}
        />

        <div className="w-full max-w-[520px] mt-4 px-4 flex justify-between">
          <span className="text-[16px] font-normal pl-1">당번 목록</span>
          <div className="relative flex items-center gap-2">
            <h2 className="text-[12px] text-[#797C82] font-normal">{sortLabel}</h2>
            <img
              src={toggle}
              alt="정렬"
              onClick={() => setPopupOpen(v => !v)}
              className="w-[20px] h-[20px] cursor-pointer select-none"
            />
            {popupOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50">
                <SortPopUp
                  onSelect={(t) => {
                    setSortType(t);
                    setPopupOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="h-3" />
        <div className="grid grid-cols-2 gap-3">
          {sortedDuties.map((d) => (
            <DangbunProgressCard
              key={d.id}
              dutyName={d.name}
              percent={clamp0to100(d.percent)}
              iconKey={d.iconKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
