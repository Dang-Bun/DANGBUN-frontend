import '../../styles/CalendarOverride.css';

import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useDutyStore, useDuties } from '../../stores/useDutyStore';
import { initialDuties } from '../../stores/Test/initialDuties';
import Header from '../../components/HeaderBar';
import toggleDown from '../../assets/home/toggleDown.svg';
import toggleUp from '../../assets/home/toggleUp.svg';

dayjs.locale('ko');

const CYCLE_TEXT = '화, 금마다';
const MEMBER_NAMES = ['백상희', '김도현', '최준서', '박완'];

const CalendarDetail: React.FC = () => {
  const seedIfEmpty = useDutyStore((s) => s.seedIfEmpty);
  const duties = useDuties();

  useEffect(() => {
    seedIfEmpty(initialDuties);
  }, [seedIfEmpty]);

  const today = new Date();
  const [activeStartDate, setActiveStartDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [expanded, setExpanded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false); // ✅ 캘린더 토글 상태
  const VISIBLE_COUNT = 3;
  const hasMore = MEMBER_NAMES.length > VISIBLE_COUNT;
  const firstRow = MEMBER_NAMES.slice(0, VISIBLE_COUNT);
  const rest = hasMore ? MEMBER_NAMES.slice(VISIBLE_COUNT) : [];

  const highlightDays = useMemo(() => {
    const map: Record<string, number> = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
    return new Set(
      CYCLE_TEXT
        .replace('마다', '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((k) => map[k])
        .filter((n): n is number => n !== undefined)
    );
  }, []);

  const monthOptions = useMemo(
    () => Array.from({ length: 6 }, (_, i) => dayjs(today).add(i, 'month').startOf('month')),
    [today]
  );
  const monthValue = dayjs(activeStartDate).format('YYYY-MM');
  const onChangeMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = dayjs(e.target.value).startOf('month').toDate();
    setActiveStartDate(next);
  };

  const tileClassName = ({ date, view, activeStartDate }: any) => {
    if (view !== 'month') return '';

    const isSameMonth =
      activeStartDate.getMonth() === date.getMonth() &&
      activeStartDate.getFullYear() === date.getFullYear();

    const base =
      ' !w-[36px] !h-[36px] !my-[9px] flex items-center justify-center text-base text-center';

    if (!isSameMonth) return base + ' text-[#8e8e8e]';

    if (highlightDays.has(date.getDay())) {
      return base + ' !bg-blue-500 !text-white !rounded-full';
    }

    return base + ' text-black';
  };

  return (
    <div>
      <Header title="청소 정보" />

      {/* 청소 기본 정보 */}
      <div className="flex flex-col px-5 py-4 gap-8">
        <div className="flex justify-between mt-10">
          <span className="text-[16px] font-semibold">청소 이름</span>
          <span className="text-[#8E8E8E] text-[16px] font-normal">바닥 쓸기</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[16px] font-semibold">당번</span>
          <span className="text-[#8E8E8E] text-[16px] font-normal">{duties[0]?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[16px] font-semibold">담당 멤버</span>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {firstRow.map((name, idx) => (
                  <span
                    key={`first-${idx}`}
                    className="w-fit h-[25px] px-3 py-1 rounded-[5px] bg-[#00DD7C] text-white text-[12px] font-semibold"
                  >
                    {name}
                  </span>
                ))}
              </div>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="ml-1.5 flex items-center justify-center w-[28px] h-[28px] rounded-full"
                  aria-label={expanded ? '멤버 접기' : '멤버 더보기'}
                >
                  {expanded ? (
                    <img src={toggleUp} alt="펼치기 아이콘" className="w-9 h-9" />
                  ) : (
                    <img src={toggleDown} alt="펼치기 아이콘" className="w-9 h-9" />
                  )}
                </button>
              )}
            </div>
            {expanded && hasMore && (
              <div className="flex flex-wrap gap-1.5">
                {rest.map((name, idx) => (
                  <span
                    key={`rest-${idx}`}
                    className="w-fit h-[25px] px-1 py-1 rounded-[5px] bg-[#00DD7C] text-white text-[12px] font-semibold"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-[16px] font-semibold">인증 방법</span>
          <span className="text-[#8E8E8E] text-[16px] font-normal">사진 인증</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[16px] font-semibold">청소 주기</span>
          <span className="text-[#8E8E8E] text-[16px] font-normal">{CYCLE_TEXT}</span>
        </div>
      </div>

      {/* 세부 날짜 보기 */}
      <div className="w-full flex flex-col px-5 py-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-[16px] font-semibold">세부 날짜 보기</p>
          
            <button
              type="button"
              onClick={() => setShowCalendar((prev) => !prev)}
              aria-label={showCalendar ? '달력 접기' : '달력 펼치기'}
            >
              {showCalendar ? (
                <img src={toggleUp} alt="펼치기" className="w-6 h-6" />
              ) : (
                <img src={toggleDown} alt="접기" className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

           
        {showCalendar && (
          <div className='flex flex-col items-end '>
            <select
              value={monthValue}
              onChange={onChangeMonth}
              className="text-zinc-500 text-base font-normal mr-4"
            >
              {monthOptions.map((m) => (
                <option key={m.format('YYYY-MM')} value={m.format('YYYY-MM')}>
                  {m.format('YYYY년 M월')}
                </option>
              ))}
            </select>
          <div className=" w-[353px] h-fit py-5 mt-4 bg-stone-50 rounded-2xl shadow-[0px_0px_8px_0px_rgba(0,0,0,0.05)] mx-auto">
             
            <Calendar
              className="w-80"
              locale="ko-KR"
              calendarType="gregory"
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) setActiveStartDate(activeStartDate);
              }}
              formatDay={(_, date) => date.getDate().toString()}
              showNeighboringMonth
              prevLabel={null}
              prev2Label={null}
              nextLabel={null}
              next2Label={null}
              navigationLabel={() => null}
              tileClassName={tileClassName}
              tileDisabled={() => true}
            />
          </div>
          
      </div>
        )}
    </div>
  );
};

export default CalendarDetail;
