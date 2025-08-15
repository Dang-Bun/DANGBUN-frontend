// src/pages/calendar/CalendarPage.tsx
import '../../styles/CalendarOverride.css';
import '../../styles/CalendarPage.css';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate } from 'react-router-dom';
import CalendarTaskCard from '../../components/calendar/CalendarTaskCard';
import { useDutyStore, useRole, useCurrentUser, useDuties } from '../../stores/useDutyStore';
import { initialDuties } from '../../stores/Test/initialDuties';
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

dayjs.locale('ko');

type TaskItem = { dutyId: number; dutyName: string; task: any };
type FilterValue = 'all' | 'done' | 'undone';

const toYMD = (d: Date | string) => dayjs(d).format('YYYY-MM-DD');

const CalendarPage: React.FC = () => {
  const role = useRole();
  const currentUser = useCurrentUser();
  const seedIfEmpty = useDutyStore((s) => s.seedIfEmpty);
  const toggleTask = useDutyStore((s) => s.toggleTask);
  const duties = useDuties();
  const navigate = useNavigate();

  useEffect(() => {
    seedIfEmpty(initialDuties);
  }, [seedIfEmpty]);

  const today = new Date();
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [sortBy, setSortBy] = useState<'alpha' | 'completed'>('alpha');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<FilterValue>('all');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  const selectedYMD = useMemo(() => toYMD(selectedDate), [selectedDate]);

  const allTasksByDate = useMemo(() => {
    const map = new Map<string, TaskItem[]>();
    duties.forEach((duty) => {
      duty.tasks?.forEach((t: any) => {
        const key = toYMD(t.date);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push({ dutyId: duty.id, dutyName: duty.name, task: t });
      });
    });
    return map;
  }, [duties]);

  const myDutyIdsByDate = useMemo(() => {
    if (role === 'manager') return new Map<string, Set<number>>();
    const map = new Map<string, Set<number>>();
    duties.forEach((duty) => {
      duty.tasks?.forEach((t: any) => {
        const key = toYMD(t.date);
        const members: string[] = Array.isArray(t.members) ? t.members : [];
        const mine = members.includes(currentUser) || members.includes('멤버 전체');
        if (!mine) return;
        if (!map.has(key)) map.set(key, new Set<number>());
        map.get(key)!.add(duty.id);
      });
    });
    return map;
  }, [duties, role, currentUser]);

  const getTasksForDate = useCallback(
    (ymd: string): TaskItem[] => {
      const all = allTasksByDate.get(ymd) ?? [];
      if (role === 'manager') return all;
      const allowed = myDutyIdsByDate.get(ymd);
      if (!allowed || allowed.size === 0) return [];
      return all.filter((x) => allowed.has(x.dutyId));
    },
    [allTasksByDate, myDutyIdsByDate, role]
  );

  const selectedDayItems = useMemo(() => getTasksForDate(selectedYMD), [getTasksForDate, selectedYMD]);

  const sortedItems = useMemo(() => {
    const arr = [...selectedDayItems];
    if (sortBy === 'alpha') {
      return arr.sort((a, b) => (a.task?.title || '').localeCompare(b.task?.title || '', 'ko-KR'));
    }
    const tsFromTask = (t: any) => {
      const ca = t?.completedAt;
      if (!ca) return Number.POSITIVE_INFINITY;
      if (typeof ca === 'string') {
        const m = ca.match(/^(\d{1,2}):(\d{2})$/);
        if (m) {
          const d = new Date(selectedDate);
          d.setHours(Number(m[1]), Number(m[2]), 0, 0);
          return d.getTime();
        }
        const parsed = Date.parse(ca);
        return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
      }
      if (ca instanceof Date) return ca.getTime();
      const n = Number(ca);
      return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
    };
    const done = arr.filter((x) => !!x.task?.isChecked).sort((a, b) => tsFromTask(a.task) - tsFromTask(b.task));
    const pending = arr.filter((x) => !x.task?.isChecked);
    return [...done, ...pending];
  }, [selectedDayItems, sortBy, selectedDate]);

  const displayedItems = useMemo(() => {
    if (filterValue === 'done') return sortedItems.filter((x) => !!x.task?.isChecked);
    if (filterValue === 'undone') return sortedItems.filter((x) => !x.task?.isChecked);
    return sortedItems;
  }, [sortedItems, filterValue]);

  const datesProgress = useMemo(() => {
    const map = new Map<string, number>();
    allTasksByDate.forEach((_items, ymd) => {
      const tasks = getTasksForDate(ymd);
      if (tasks.length > 0) {
        const done = tasks.filter((x) => !!x.task?.isChecked).length;
        map.set(ymd, Math.round((done / tasks.length) * 100));
      }
    });
    return map;
  }, [allTasksByDate, getTasksForDate]);

  // 선택된 날짜는 글자만 굵게 + 파란색, 배경 없음
  const tileClassName = useCallback(
    ({ date, view, activeStartDate: asd }: any) => {
      if (view !== 'month') return '';
      const isSameMonth =
        asd.getMonth() === date.getMonth() && asd.getFullYear() === date.getFullYear();
      const isSelected = dayjs(selectedDate).isSame(dayjs(date), 'date');
      return [
        '!w-[36px] !h-[36px] !my-[9px] flex items-center justify-center text-base text-center relative',
        isSelected
          ? 'font-bold text-[#4D83FD]'
          : isSameMonth
          ? 'text-black'
          : 'text-[#8e8e8e]',
      ].join(' ');
    },
    [selectedDate]
  );
 
  const tileContent = useCallback(
    ({ date, view }: any) => {
      if (view !== 'month') return null;
      const ymd = toYMD(date);
      const progress = datesProgress.get(ymd);
      if (progress === undefined) return <span className="text-base">{date.getDate()}</span>;

      const size = 36;
      const center = size / 2;
      const ringRadius = 16;
      const strokeWidth = 4;  
      const circumference = 2 * Math.PI * ringRadius;
      const dashOffset = circumference * (1 - progress / 100);

      return (
        <div className="w-[36px] h-[36px] relative flex items-center justify-center">
          <svg width={size} height={size} className="absolute top-0 left-0">
            <g transform={`rotate(-90 ${center} ${center})`}>
              <circle
                cx={center}
                cy={center}
                r={ringRadius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
              />
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
    [datesProgress]
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
        <div className="relative mx-auto mt-4" style={{ width: '353px' }}>
          <div
            className="absolute rounded-[24px] bg-[#4D83FD]"
            style={{ left: '-48px', top: '-8px', width: '405px', height: 'calc(100% + 16px)' }}
          />
          <div className="relative bg-white rounded-[20px] p-2">
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
              <SwipeableRow key={task.id} onToggle={() => toggleTask(task.id, currentUser)}>
                <CalendarTaskCard
                  title={task.title}
                  dangbun={dutyName}
                  isChecked={task.isChecked}
                  isCamera={task.isCamera}
                  completedAt={task.completedAt}
                  completedBy={task.completedBy}
                  onMenuClick={() => setIsSelectOpen(true)}
                />
              </SwipeableRow>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <BottomBar />
      </div>
      {isFilterOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsFilterOpen(false)}>
          <div className="absolute inset-0" />
          <div className="fixed left-0 right-0 bottom-0" onClick={(e) => e.stopPropagation()}>
            <FilterBottomSheet
              selected={filterValue}
              onSelect={(v) => {
                setFilterValue(v);
                setIsFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}
      {isSelectOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsSelectOpen(false)}>
          <div className="absolute inset-0" />
          <div className="fixed left-0 right-0 bottom-0" onClick={(e) => e.stopPropagation()}>
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
          </div>
        </div>
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
          const anyStore = useDutyStore.getState() as any;
          if (anyStore.removeTask && selectTask) {
            anyStore.removeTask(selectTask.id);
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
