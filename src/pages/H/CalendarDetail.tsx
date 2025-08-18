import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useParams } from 'react-router-dom';
import Header from '../../components/HeaderBar';
import toggleDown from '../../assets/home/toggleDown.svg';
import toggleUp from '../../assets/home/toggleDown.svg';
import useCalendarApi from '../../hooks/useCalendarApi';

dayjs.locale('ko');

interface CleaningData {
  cleaningId: number;
  dutyName: string;
  membersName: string[];
  needPhoto: boolean;
  repeatType: 'WEEKLY';
  repeatDays: string[];
  dates: string[];
}

const CalendarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cleaningData, setCleaningData] = useState<CleaningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeStartDate, setActiveStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [expanded, setExpanded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const VISIBLE_COUNT = 3;

  useEffect(() => {
    const fetchCleaningData = async () => {
      try {
        setLoading(true);
        setError(null);

        const PLACE_ID = localStorage.getItem('placeId');
        const accessToken = localStorage.getItem('accessToken');
        
        if (!PLACE_ID || !accessToken) {
          setError('로그인이 필요합니다.');
          return;
        }

        const placeId = parseInt(PLACE_ID, 10);
        const checklistId = Number(id);

        if (!checklistId) {
          setError('잘못된 체크리스트 ID입니다.');
          return;
        }

        console.log('Debug - Fetching cleaning data for:', { placeId, checklistId });

        const response = await useCalendarApi.getCleanings(placeId, checklistId);
        console.log('Debug - Cleaning data response:', response.data);

        // API 응답 데이터를 CleaningData 형식으로 변환
        const apiData = response.data?.data;
        if (!apiData) {
          setError('청소 정보를 찾을 수 없습니다.');
          return;
        }

        const cleaningData: CleaningData = {
          cleaningId: apiData.cleaningId || checklistId,
          dutyName: apiData.dutyName || apiData.title || '청소',
          membersName: apiData.membersName || apiData.members || [],
          needPhoto: apiData.needPhoto || false,
          repeatType: apiData.repeatType || 'WEEKLY',
          repeatDays: apiData.repeatDays || [],
          dates: apiData.dates || []
        };
        
        setCleaningData(cleaningData);
      } catch (err: unknown) {
        console.error('Error fetching cleaning data:', err);
        if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response && err.response.status === 403) {
          setError('권한이 없습니다. 다시 로그인해주세요.');
        } else {
          setError('데이터를 불러오는 데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCleaningData();
  }, [id]);


  
  const memberNames = React.useMemo(() => {
    return cleaningData?.membersName || [];
  }, [cleaningData]);

  const firstRow = memberNames.slice(0, VISIBLE_COUNT);
  const rest = memberNames.length > VISIBLE_COUNT ? memberNames.slice(VISIBLE_COUNT) : [];
  const hasMore = memberNames.length > VISIBLE_COUNT;

  const monthOptions = React.useMemo(
    () => Array.from({ length: 6 }, (_, i) => dayjs().add(i, 'month').startOf('month')),
    []
  );

  const monthValue = dayjs(activeStartDate).format('YYYY-MM');
  const onChangeMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = dayjs(e.target.value).startOf('month').toDate();
    setActiveStartDate(next);
  };

  const tileClassName = ({ date, view, activeStartDate }: { date: Date; view: string; activeStartDate: Date }) => {
    if (view !== 'month') return '';

    const isSameMonth =
      activeStartDate.getMonth() === date.getMonth() &&
      activeStartDate.getFullYear() === date.getFullYear();

    const base =
      ' !w-[36px] !h-[36px] !my-[9px] flex items-center justify-center text-base text-center';

    if (!isSameMonth) return base + ' text-[#8e8e8e]';

    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    
    if (cleaningData?.dates.includes(formattedDate)) {
        return base + ' !bg-blue-500 !text-white !rounded-full';
    }

    return base + ' text-black';
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }
  
  if (!cleaningData) {
    return <div>청소 데이터를 찾을 수 없습니다.</div>;
  }

  const weekDaysInKorean = {
    'SUNDAY': '일',
    'MONDAY': '월',
    'TUESDAY': '화',
    'WEDNESDAY': '수',
    'THURSDAY': '목',
    'FRIDAY': '금',
    'SATURDAY': '토'
  };
  const koreanDays = cleaningData.repeatDays.map(day => weekDaysInKorean[day]).join(', ');

  return (
    <div>
      <Header title="청소 정보" />

      <div className="flex flex-col px-5 py-4 gap-8">
        <div className="flex justify-between mt-10">
          <span className="text-[16px] font-semibold">청소 이름</span>
          <span className="text-[#8E8E8E] text-[16px] font-normal">{cleaningData.dutyName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[16px] font-semibold">당번</span>
          <span className="text-[#8E8E8E] text-[16px] font-normal">{cleaningData.dutyName}</span>
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
          <span className="text-[#8E8E8E] text-[16px] font-normal">{cleaningData.needPhoto ? '사진 인증' : '인증 없음'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[16px] font-semibold">청소 주기</span>
          <span className="text-[#8E8E8E] text-[16px] font-normal">{koreanDays + '마다'}</span>
        </div>
      </div>

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
        <div className='flex flex-col items-end'>
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
          <div className="w-[353px] h-fit py-5 mt-4 bg-stone-50 rounded-2xl shadow-[0px_0px_8px_0px_rgba(0,0,0,0.05)] mx-auto">
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