import React, { useMemo, useState } from 'react';
import PlaceProgressCard from '../../components/home/PlaceProgressCard';
import DangbunProgressCard from '../../components/home/DangbunProgressCard';
import { useLocation } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import SortPopUp from '../../components/home/SortPopUp'; // 경로 맞춰서 import
import toggle from '../../assets/home/toggleDown.svg'; // 실제 아이콘 경로로 수정

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
type DutySummary = { id: number; name: string; percent: number; iconKey: DutyIconKey };
type Payload = {
  placeId?: number;
  placeName?: string;
  percent?: number; // 이전 페이지 전달값 사용
  placeIconKey?: PlaceIconKey;
  duties?: DutySummary[]; // 이전 페이지 전달값 사용
};

const ManagerOverview: React.FC = () => {
  const { state } = useLocation() as { state?: Payload };
  const [sortType, setSortType] = useState<'low' | 'high' | 'name'>('low');
  const [popupOpen, setPopupOpen] = useState(false);

  const data = useMemo<Payload | undefined>(() => {
    if (state && (state.placeName || state.duties)) return state;
    const raw = sessionStorage.getItem('overviewPayload');
    try {
      return raw ? (JSON.parse(raw) as Payload) : undefined;
    } catch {
      return undefined;
    }
  }, [state]);

  // 전체 진행률: 반드시 이전 페이지 전달값 사용
  const percent = useMemo(() => {
    const p = typeof data?.percent === 'number' ? Math.round(data.percent) : 0;
    return Math.max(0, Math.min(100, p));
  }, [data?.percent]);

  // 카드 정렬: 이전 페이지에서 받은 개별 duty.percent 기준
  const sortedDuties = useMemo(() => {
    const arr = [...(data?.duties ?? [])];
    if (sortType === 'low') return arr.sort((a, b) => (a.percent ?? 0) - (b.percent ?? 0));
    if (sortType === 'high') return arr.sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0));
    if (sortType === 'name') return arr.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    return arr;
  }, [data?.duties, sortType]);

  const sortLabel =
    sortType === 'low' ? '진행률 낮은 순' : sortType === 'high' ? '진행률 높은 순' : '당번 이름 순';

  return (
    <div>
      <Header title="당번 진행률" />
      <div className="mt-13 flex flex-col justify-center items-center w-full">
        <PlaceProgressCard placeName={data?.placeName} percent={percent} iconKey={data?.placeIconKey} />

         <div className="w-full max-w-[520px] mt-4 px-4 flex justify-between">
          <span className='text-[16px] font-normal pl-1'>당번 목록</span>
          <div className="relative flex justify-start items-center gap-2">
            <h2 className="text-[12px] text-[#797C82] font-normal">{sortLabel}</h2>
            <img
              src={toggle}
              alt="정렬"
              onClick={() => setPopupOpen((v) => !v)}
              className="w-[20px] h-[20px] cursor-pointer select-none"
            />
            {popupOpen && (
              <div className="absolute right-[1px] top-[calc(100%+8px)] z-50">
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
            <DangbunProgressCard key={d.id} dutyName={d.name} percent={d.percent} iconKey={d.iconKey} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
