// src/pages/calendar/CalendarPage.tsx
import '../../styles/CalendarOverride.css';
import '../../styles/CalendarPage.css';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate } from 'react-router-dom';
import CalendarTaskCard from '../../components/calendar/CalendarTaskCard';
import DatePicker from '../../components/calendar/DatePicker';
import toggleUp from '../../assets/calendar/toggleUp.svg';
import toggle from '../../assets/home/toggleDown.svg';
import Header from '../../components/HeaderBar';
import BottomBar from '../../components/BottomBar';
import SwipeableRow from '../../components/calendar/SwipeableRow';
import CalendarSort from '../../components/calendar/CalendarSort';
import filter from '../../assets/calendar/filter.svg';
import FilterBottomSheet from '../../components/calendar/FilterBottomSheet';
import SelectBottom from '../../components/calendar/SelectBottom';
import PopUpCardDelete from '../../components/PopUp/PopUpCardDelete';
import DownloadPopUp from '../../components/calendar/DownloadPopUp';
import { useCalendarApi } from '../../hooks/useCalendarApi';

dayjs.locale('ko');

type Task = {
  id: number;
  title: string;
  isChecked: boolean;
  isCamera?: boolean;
  completedAt?: string | Date | null;
  completedBy?: string | null;
  date: string; // YYYY-MM-DD
};

type TaskItem = { dutyId: number; dutyName: string; task: Task };
type FilterValue = 'all' | 'done' | 'undone';

const toYMD = (d: Date | string) => dayjs(d).format('YYYY-MM-DD');

const DUMMY_CHECKLISTS = [
  {
    dutyId: 1,
    dutyName: '탕비실 청소 당번',
    task: {
      id: 1,
      title: '탕비실 청소 당번',
      isChecked: true,
      isCamera: true,
      completedAt: '2025-08-17T10:30:00Z',
      completedBy: '김효정',
      date: '2025-08-17',
    },
  },
  {
    dutyId: 2,
    dutyName: '화장실 청소 당번',
    task: {
      id: 2,
      title: '화장실 청소 당번',
      isChecked: false,
      isCamera: false,
      completedAt: null,
      completedBy: null,
      date: '2025-08-17',
    },
  },
  {
    dutyId: 3,
    dutyName: '복도 청소 당번',
    task: {
      id: 3,
      title: '복도 청소 당번',
      isChecked: true,
      isCamera: false,
      completedAt: '2025-08-16T15:45:00Z',
      completedBy: '박하나',
      date: '2025-08-16',
    },
  },
  {
    dutyId: 4,
    dutyName: '사무실 쓰레기통 비우기',
    task: {
      id: 4,
      title: '사무실 쓰레기통 비우기',
      isChecked: false,
      isCamera: false,
      completedAt: null,
      completedBy: null,
      date: '2025-08-16',
    },
  },
  {
    dutyId: 5,
    dutyName: '회의실 정리',
    task: {
      id: 5,
      title: '회의실 정리',
      isChecked: true,
      isCamera: true,
      completedAt: '2025-08-15T09:00:00Z',
      completedBy: '박원',
      date: '2025-08-15',
    },
  },
];

const DUMMY_PROGRESS = new Map([
  ['2025-08-15', 100],
  ['2025-08-16', 50],
  ['2025-08-17', 70],
]);

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [checklists, setChecklists] = useState<TaskItem[]>([]);
  const [progress, setProgress] = useState<Map<string, number>>(new Map());

  const today = new Date();
  const [activeStartDate, setActiveStartDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [sortBy, setSortBy] = useState<'alpha' | 'completed'>('alpha');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<FilterValue>('all');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [selectTask, setSelectTask] = useState<Task | null>(null);

  const PLACE_ID = 1; // 실제 환경에서는 동적으로 관리해야 합니다.

  const selectedYMD = useMemo(() => toYMD(selectedDate), [selectedDate]);

  useEffect(() => {
    // Dummy Data
    setChecklists(DUMMY_CHECKLISTS);
    setProgress(DUMMY_PROGRESS);

    // API Call
    // const fetchData = async () => {
    //   setLoading(true);
    //   setError(null);
    //   console.log('🏁 CalendarPage 데이터 로드 시작');
    //   try {
    //     const year = dayjs(activeStartDate).year();
    //     const month = dayjs(activeStartDate).month(); // 0-based

    //     console.log('📡 [checklists] GET /places/%s/calender/checklists?year=%s&month=%s', PLACE_ID, year, month + 1);
    //     const checklistsResponse = await useCalendarApi.getChecklistsByDate(PLACE_ID, {
    //       year,
    //       month: month + 1,
    //     });
    //     console.log('📥 [checklists] 응답:', checklistsResponse.data);

    //     console.log('📡 [progress] GET /places/%s/calender?year=%s&month=%s', PLACE_ID, year, month + 1);
    //     const progressResponse = await useCalendarApi.getProgress(PLACE_ID, {
    //       year,
    //       month: month + 1,
    //     });
    //     console.log('📥 [progress] 응답:', progressResponse.data);

    //     // checklists 상태 업데이트: API 응답을 TaskItem[] 형식으로 변환
    //     const receivedChecklists = checklistsResponse.data.data.checklists || [];
    //     const newChecklists = receivedChecklists.map((item) => ({
    //       dutyId: item.checklistId,
    //       dutyName: item.dutyName,
    //       task: {
    //         id: item.checklistId,
    //         title: item.dutyName,
    //         isChecked: item.isComplete,
    //         isCamera: item.needPhoto,
    //         completedAt: item.endTime,
    //         completedBy: item.memberName,
    //         date: selectedYMD,
    //       },
    //     }));
    //     setChecklists(newChecklists);
    //     console.log('✅ [checklists] 총 %s개 체크리스트 로드 완료', newChecklists.length);

    //     // progress 상태 업데이트
    //     const receivedProgress = progressResponse.data.data.dailyProgress || [];
    //     const progressMap = new Map();
    //     receivedProgress.forEach((item) => {
    //       progressMap.set(item.date, item.endPercent);
    //     });
    //     setProgress(progressMap);
    //     console.log('✅ [progress] 총 %s개 진행률 데이터 로드 완료', receivedProgress.length);

    //   } catch (err) {
    //     setError('데이터를 불러오는 데 실패했습니다.');
    //     console.error('❌ CalendarPage 데이터 로드 실패:', err);
    //   } finally {
    //     setLoading(false);
    //     console.log('✅ CalendarPage 로딩 종료');
    //   }
    // };

    // fetchData();
  }, [activeStartDate, PLACE_ID, selectedYMD]);

  // 날짜별 task 맵
  const allTasksByDate = useMemo(() => {
    const map = new Map<string, TaskItem[]>();
    checklists.forEach((item) => {
      const key = toYMD(item.task.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return map;
  }, [checklists]);

  const getTasksForDate = useCallback(
    (ymd: string): TaskItem[] => allTasksByDate.get(ymd) ?? [],
    [allTasksByDate]
  );

  const selectedDayItems = useMemo(
    () => getTasksForDate(selectedYMD),
    [getTasksForDate, selectedYMD]
  );

  // 정렬
  const sortedItems = useMemo(() => {
    const arr = [...selectedDayItems];
    if (sortBy === 'alpha') {
      return arr.sort((a, b) =>
        (a.task?.title || '').localeCompare(b.task?.title || '', 'ko-KR')
      );
    }
    const tsFromTask = (t: Task) => {
      const ca = t?.completedAt;
      if (!ca) return Number.POSITIVE_INFINITY;
      if (typeof ca === 'string') {
        const parsed = Date.parse(ca);
        return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
      }
      if (ca instanceof Date) return ca.getTime();
      return Number.POSITIVE_INFINITY;
    };
    const done = arr
      .filter((x) => !!x.task?.isChecked)
      .sort((a, b) => tsFromTask(a.task) - tsFromTask(b.task));
    const pending = arr.filter((x) => !x.task?.isChecked);
    return [...done, ...pending];
  }, [selectedDayItems, sortBy]);

  // 필터
  const displayedItems = useMemo(() => {
    if (filterValue === 'done') return sortedItems.filter((x) => !!x.task?.isChecked);
    if (filterValue === 'undone') return sortedItems.filter((x) => !x.task?.isChecked);
    return sortedItems;
  }, [sortedItems, filterValue]);

  // 캘린더 타일 스타일
  const tileClassName = useCallback(
    ({ date, view, activeStartDate: asd }: any) => {
      if (view !== 'month') return '';
      const isSameMonth =
        asd.getMonth() === date.getMonth() && asd.getFullYear() === date.getFullYear();
      const isSelected = dayjs(selectedDate).isSame(dayjs(date), 'date');
      return [
        '!w-[36px] !h-[36px] !my-[9px] flex items-center justify-center text-base text-center relative',
        isSelected ? 'font-bold text-[#4D83FD]' : isSameMonth ? 'text-black' : 'text-[#8e8e8e]',
      ].join(' ');
    },
    [selectedDate]
  );

  // 캘린더 타일 안쪽 원형 프로그레스
  const tileContent = useCallback(
    ({ date, view }: any) => {
      if (view !== 'month') return null;
      const ymd = toYMD(date);
      const progressValue = progress.get(ymd);
      if (progressValue === undefined) return <span className="text-base">{date.getDate()}</span>;

      const size = 36;
      const center = size / 2;
      const ringRadius = 16;
      const strokeWidth = 4;
      const circumference = 2 * Math.PI * ringRadius;
      const dashOffset = circumference * (1 - progressValue / 100);

      return (
        <div className="w-[36px] h-[36px] relative flex items-center justify-center">
          <svg width={size} height={size} className="absolute top-0 left-0">
            <g transform={`rotate(-90 ${center} ${center})`}>
              <circle cx={center} cy={center} r={ringRadius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
              <circle
                cx={center}
                cy={center}
                r={ringRadius}
                fill="none"
                stroke="#4D83FD"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.2s ease' }}
              />
            </g>
          </svg>
          <span className="text-base relative z-10">{date.getDate()}</span>
        </div>
      );
    },
    [progress]
  );

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const curY = activeStartDate.getFullYear();
    const curM = activeStartDate.getMonth();
    const tgtY = date.getFullYear();
    const tgtM = date.getMonth();
    if (curY !== tgtY || curM !== tgtM) setActiveStartDate(new Date(tgtY, tgtM, 1));
  };

  const handleActiveStartDateChange = ({ activeStartDate: d }: any) => {
    if (d) setActiveStartDate(d);
  };

  const sortLabel = sortBy === 'alpha' ? '가나다 순' : '완료 시간 순';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="캘린더" />
      <div className="flex flex-col flex-1 min-h-0 mt-12 px-5 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-[16px] font-semibold cursor-pointer flex items-center gap-1"
            onClick={() => setIsDatePickerOpen(true)}
            aria-label="날짜 선택 열기"
          >
            {dayjs(activeStartDate).format('YYYY년 M월')}
            <img
              src={toggleUp}
              alt="토글"
              className={`w-3 h-2 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <div className="relative mx-auto mt-4 w-[353px] bg-[#4D83FD] rounded-[24px] p-2">
          <div className="bg-white rounded-[20px] p-2">
            <Calendar
              className="w-full"
              onClickDay={handleDayClick}
              onActiveStartDateChange={handleActiveStartDateChange}
              tileClassName={tileClassName}
              tileContent={tileContent}
              activeStartDate={activeStartDate}
              formatDay={() => ''}
              showNeighboringMonth
              prevLabel={null}
              prev2Label={null}
              nextLabel={null}
              next2Label={null}
              navigationLabel={() => null}
              locale="ko-KR"
              calendarType="gregory"
            />
          </div>
        </div>

        <div className="flex flex-col mt-8 flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-end">
              <span className="font-semibold text-[12px] text-[#4D83FD]">청소 목록</span>
              <img src={filter} alt="필터" className="cursor-pointer" onClick={() => setIsFilterOpen(true)} />
            </div>
            <div className="relative flex items-center">
              <span className="text-[12px] text-[#797C82] mr-1">{sortLabel}</span>
              <img
                src={toggle}
                alt="정렬 열기"
                onClick={() => setMemberPopUp((v) => !v)}
                className="w-[20px] h-[20px] cursor-pointer"
              />
              {memberPopUp && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50">
                  <CalendarSort
                    onSelect={(type) => {
                      setSortBy(type);
                      setMemberPopUp(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col py-3 gap-4 overflow-y-auto pb-24">
            {displayedItems.map(({ dutyName, task }) => (
              <SwipeableRow
                key={task.id}
                onToggle={() => {
                  setChecklists((prevChecklists) => {
                    const newChecklists = prevChecklists.map((item) => {
                      if (item.task.id === task.id) {
                        return {
                          ...item,
                          task: {
                            ...item.task,
                            isChecked: !item.task.isChecked,
                            completedAt: !item.task.isChecked ? dayjs().toISOString() : null,
                            completedBy: !item.task.isChecked ? '현재 사용자' : null,
                          },
                        };
                      }
                      return item;
                    });
                    return newChecklists;
                  });
                }}
              >
                <div onClick={() => { navigate(`/calendar/${task.id}`); }}>
                  <CalendarTaskCard
                  title={task.title}
                  dangbun={dutyName}
                  isChecked={task.isChecked}
                  isCamera={task.isCamera}
                  completedAt={task.completedAt}
                  completedBy={task.completedBy}
                  onMenuClick={() => {
                    setSelectTask(task);
                    setIsSelectOpen(true);
                  }}
                /></div>
              </SwipeableRow>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <BottomBar />
      </div>

      {isFilterOpen && (
        <FilterBottomSheet
          selected={filterValue}
          onSelect={(v) => {
            setFilterValue(v);
            setIsFilterOpen(false);
          }}
        />
      )}

      {isSelectOpen && selectTask && (
        <SelectBottom
          onViewPhoto={() => {
            setIsSelectOpen(false);
            setIsPhotoOpen(true);
          }}
          onOpenInfo={() => {
            setIsSelectOpen(false);
            navigate('/clean/info');
          }}
          onDelete={() => {
            setIsSelectOpen(false);
            setIsDeleteOpen(true);
          }}
        />
      )}

      <PopUpCardDelete
        isOpen={isDeleteOpen}
        onRequestClose={() => setIsDeleteOpen(false)}
        title={
          <span>
            청소 목록을 <span className="text-[#4D83FD]">삭제</span>하시겠습니까?
          </span>
        }
        descript="해당 청소를 체크리스트에서 완전히 삭제합니다."
        first="취소"
        second="확인"
        userEmail=""
        onFirstClick={() => setIsDeleteOpen(false)}
        onSecondClick={() => {
          if (selectTask) {
            setChecklists((prev) =>
              prev.filter((item) => item.task.id !== selectTask.id)
            );
          }
          setIsDeleteOpen(false);
        }}
      />

      <DownloadPopUp isOpen={isPhotoOpen} onRequestClose={() => setIsPhotoOpen(false)} />

      <DatePicker
        isOpen={isDatePickerOpen}
        initialYear={activeStartDate.getFullYear()}
        initialMonth={activeStartDate.getMonth() + 1}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={(y, m) => {
          const first = new Date(y, m - 1, 1);
          setActiveStartDate(first);
          setSelectedDate(first);
          setIsDatePickerOpen(false);
        }}
      />
    </div>
  );
};
export default CalendarPage;