// src/pages/calendar/CalendarPage.tsx
import '../../styles/CalendarOverride.css';
import '../../styles/CalendarPage.css';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate, useLocation } from 'react-router-dom';
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

// 실제 API 사용
import useCalendarApi from '../../hooks/useCalendarApi';
import { useChecklistApi } from '../../hooks/useChecklistApi';

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

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [checklists, setChecklists] = useState<TaskItem[]>([]);
  const [progress, setProgress] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const selectedYMD = useMemo(() => toYMD(selectedDate), [selectedDate]);
  const dateStr = dayjs(selectedDate).format('YYYY-MM-DD');

  // API 데이터 로드
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // localStorage에서 placeId 가져오기
      const PLACE_ID = localStorage.getItem('placeId');
      const accessToken = localStorage.getItem('accessToken');

      console.log('🔍 [Calendar] API 요청 준비');
      console.log('   📍 placeId:', PLACE_ID);
      console.log('   🔑 accessToken 존재:', !!accessToken);

      if (!PLACE_ID || !accessToken) {
        setError('로그인이 필요합니다.');
        return;
      }

      const placeId = Number(PLACE_ID);

      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth() + 1;

      console.log('📡 [Calendar] API 요청 파라미터');
      console.log('   📍 placeId:', placeId);
      console.log('   📅 year:', year, 'month:', month);
      console.log(
        '   📅 selectedDate:',
        dayjs(selectedDate).format('YYYY-MM-DD')
      );

      // 체크리스트 데이터 로드
      const checklistResponse = await useCalendarApi.getChecklistsByDate(
        placeId,
        dateStr
      );

      console.log('Debug - Checklist response:', checklistResponse.data);

      // 프로그레스 데이터 로드
      const progressResponse = await useCalendarApi.getProgress(placeId, {
        year: year,
        month: month,
      });

      console.log('Debug - Progress response:', progressResponse.data);

      // 체크리스트 데이터 파싱
      const checklistData =
        checklistResponse.data?.data?.checklists ||
        checklistResponse.data?.checklists ||
        [];
      console.log('Debug - Raw checklist data:', checklistData);

      const parsedChecklists: TaskItem[] = checklistData.map(
        (item: Record<string, unknown>) => ({
          dutyId: item.checklistId as number,
          dutyName: item.dutyName as string,
          task: {
            id: item.checklistId as number,
            title: item.dutyName as string,
            isChecked: item.isComplete as boolean,
            isCamera: item.needPhoto as boolean,
            completedAt: item.endTime
              ? `${item.date}T${item.endTime}:00Z`
              : null,
            completedBy: item.memberName as string,
            date: item.date as string,
          },
        })
      );
      setChecklists(parsedChecklists);

      // 프로그레스 데이터를 체크리스트 데이터에서 계산 - 역할에 따라 다르게
      const progressMap = new Map<string, number>();

      // 날짜별로 체크리스트 그룹화
      const tasksByDate = new Map<string, TaskItem[]>();
      parsedChecklists.forEach((item) => {
        const date = item.task.date;
        if (!tasksByDate.has(date)) {
          tasksByDate.set(date, []);
        }
        tasksByDate.get(date)!.push(item);
      });

      // 각 날짜별 완료율 계산
      tasksByDate.forEach((tasks, date) => {
        const total = tasks.length;
        const completed = tasks.filter((task) => task.task.isChecked).length;
        const percentage =
          total > 0 ? Math.round((completed / total) * 100) : 0;
        progressMap.set(date, percentage);
        console.log(
          `Debug - Calculated progress for ${date}: ${completed}/${total} = ${percentage}%`
        );
      });

      // API에서 받은 progress 데이터도 병합 (우선순위: API > 계산)
      const progressData =
        progressResponse.data?.data?.dailyProgress ||
        progressResponse.data?.dailyProgress ||
        [];
      console.log('Debug - Raw progress data from API:', progressData);

      progressData.forEach((item: Record<string, unknown>) => {
        if (item.date && item.endPercent !== undefined) {
          const date = item.date as string;
          const percent = item.endPercent as number;
          progressMap.set(date, percent);
          console.log(
            `Debug - Overriding progress for ${date}: ${percent}% (from API)`
          );
        }
      });

      console.log(
        'Debug - Final progress map:',
        Array.from(progressMap.entries())
      );
      setProgress(progressMap);
    } catch (err: unknown) {
      console.error('❌ [Calendar] API 오류 발생:', err);

      // 403 에러 처리
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'status' in err.response &&
        err.response.status === 403
      ) {
        const errorResponse = err as Record<string, unknown>;
        const response = errorResponse.response as
          | Record<string, unknown>
          | undefined;
        console.error('403 Forbidden - Response data:', response?.data);
        console.error('403 Forbidden - Headers:', response?.headers);
        const config = errorResponse.config as
          | Record<string, unknown>
          | undefined;
        console.error('403 Forbidden - Request URL:', config?.url);
        console.error('403 Forbidden - Request method:', config?.method);
        console.error('403 Forbidden - Authorization header:', config?.headers);

        setError('권한이 없습니다. 다시 로그인해주세요.');
        // 토큰이 만료되었을 가능성이 높으므로 localStorage에서 토큰 제거
        localStorage.removeItem('accessToken');
      } else {
        console.error('❌ [Calendar] 일반 오류:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [activeStartDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 체크리스트 토글 함수
  const handleToggleChecklist = useCallback(
    async (taskId: number) => {
      try {
        const PLACE_ID = localStorage.getItem('placeId');
        if (!PLACE_ID) return;

        const placeId = parseInt(PLACE_ID, 10);
        await useCalendarApi.completeChecklist(placeId, taskId);

        // 성공 시 데이터 다시 로드
        await loadData();
      } catch (err) {
        console.error('체크리스트 토글 실패:', err);
        setError('체크리스트 상태 변경에 실패했습니다.');
      }
    },
    [loadData]
  );

  // 체크리스트 삭제 함수
  const handleDeleteChecklist = useCallback(async () => {
    if (!selectTask) return;

    try {
      const PLACE_ID = localStorage.getItem('placeId');
      if (!PLACE_ID) return;

      const placeId = parseInt(PLACE_ID, 10);
      console.log(
        `[Delete] Deleting checklist ${selectTask.id} from place ${placeId}`
      );

      await useCalendarApi.deleteChecklist(placeId, selectTask.id);

      // 성공 시 데이터 다시 로드
      await loadData();
      setIsDeleteOpen(false);

      // 성공 메시지 (선택사항)
      console.log(`✅ [Calendar] 체크리스트 삭제 완료: ${selectTask.id}`);
    } catch (err) {
      console.error('❌ [Calendar] 체크리스트 삭제 실패:', err);
      setError('체크리스트 삭제에 실패했습니다.');
    }
  }, [selectTask, loadData]);

  // 날짜별 task 맵
  const allTasksByDate = useMemo(() => {
    const map = new Map<string, TaskItem[]>();
    checklists.forEach((item) => {
      const key = item.task.date;
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
    if (filterValue === 'done')
      return sortedItems.filter((x) => !!x.task?.isChecked);
    if (filterValue === 'undone')
      return sortedItems.filter((x) => !x.task?.isChecked);
    return sortedItems;
  }, [sortedItems, filterValue]);

  // 캘린더 타일 스타일
  const tileClassName = useCallback(
    ({
      date,
      view,
      activeStartDate: asd,
    }: {
      date: Date;
      view: string;
      activeStartDate: Date;
    }) => {
      if (view !== 'month') return '';
      const isSameMonth =
        asd.getMonth() === date.getMonth() &&
        asd.getFullYear() === date.getFullYear();
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

  // 캘린더 타일 안쪽 원형 프로그레스
  const tileContent = useCallback(
    ({ date, view }: { date: Date; view: string }) => {
      if (view !== 'month') return null;
      const ymd = toYMD(date);
      const progressValue = progress.get(ymd);

      // 디버깅: progress 값 확인
      if (progressValue !== undefined) {
        console.log(`📊 [Calendar] ${ymd} 프로그레스: ${progressValue}%`);
      }

      if (progressValue === undefined)
        return <span className='text-base'>{date.getDate()}</span>;

      const size = 36;
      const center = size / 2;
      const ringRadius = 16;
      const strokeWidth = 4;
      const circumference = 2 * Math.PI * ringRadius;
      const dashOffset = circumference * (1 - progressValue / 100);

      return (
        <div className='w-[36px] h-[36px] relative flex items-center justify-center'>
          <svg width={size} height={size} className='absolute top-0 left-0'>
            <g transform={`rotate(-90 ${center} ${center})`}>
              <circle
                cx={center}
                cy={center}
                r={ringRadius}
                fill='none'
                stroke='#E5E7EB'
                strokeWidth={strokeWidth}
              />
              <circle
                cx={center}
                cy={center}
                r={ringRadius}
                fill='none'
                stroke='#4D83FD'
                strokeWidth={strokeWidth}
                strokeLinecap='round'
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.2s ease' }}
              />
            </g>
          </svg>
          <span className='text-base relative z-10'>{date.getDate()}</span>
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
    if (curY !== tgtY || curM !== tgtM)
      setActiveStartDate(new Date(tgtY, tgtM, 1));
  };

  const handleActiveStartDateChange = ({
    activeStartDate: d,
  }: {
    activeStartDate: Date;
  }) => {
    if (d) setActiveStartDate(d);
  };

  const sortLabel = sortBy === 'alpha' ? '가나다 순' : '완료 시간 순';

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Header title='캘린더' />
        <div className='flex flex-col flex-1 min-h-0 mt-12 py-4 px-5'>
          <div className='flex flex-col items-center justify-center flex-1'>
            <p className='text-red-500 text-center mb-4'>{error}</p>
            <div className='flex gap-2'>
              <button
                onClick={loadData}
                className='px-4 py-2 bg-[#4D83FD] text-white rounded-lg'
              >
                다시 시도
              </button>
              {error.includes('로그인') && (
                <button
                  onClick={() => navigate('/login')}
                  className='px-4 py-2 bg-gray-500 text-white rounded-lg'
                >
                  로그인 페이지로 이동
                </button>
              )}
            </div>
          </div>
        </div>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header title='캘린더' />
      <div className='flex flex-col flex-1 min-h-0 mt-12 py-4'>
        <div className='flex items-center justify-between px-5'>
          <button
            type='button'
            className='text-[16px] font-semibold cursor-pointer flex items-center gap-1'
            onClick={() => setIsDatePickerOpen(true)}
            aria-label='날짜 선택 열기'
          >
            {dayjs(activeStartDate).format('YYYY년 M월')}
            <img
              src={toggleUp}
              alt='토글'
              className={`w-3 h-2 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <div className='relative mt-4 w-full bg-[#4D83FD] rounded-r-[24px] p-2'>
          <div className='bg-white rounded-[20px] p-2 ml-5 max-w-[353px]'>
            <Calendar
              className='w-full'
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
              locale='ko-KR'
              calendarType='gregory'
            />
          </div>
        </div>

        <div className='flex flex-col mt-8 flex-1 min-h-0 px-5'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-1 items-end'>
              <span className='font-semibold text-[12px] text-[#4D83FD]'>
                청소 목록
              </span>
              <img
                src={filter}
                alt='필터'
                className='cursor-pointer'
                onClick={() => setIsFilterOpen(true)}
              />
            </div>
            <div className='relative flex items-center'>
              <span className='text-[12px] text-[#797C82] mr-1'>
                {sortLabel}
              </span>
              <img
                src={toggle}
                alt='정렬 열기'
                onClick={() => setMemberPopUp((v) => !v)}
                className='w-[20px] h-[20px] cursor-pointer'
              />
              {memberPopUp && (
                <div className='absolute right-0 top-[calc(100%+8px)] z-50'>
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

          <div className='flex flex-col py-3 gap-4 overflow-y-auto pb-24'>
            {loading ? (
              <div className='flex justify-center py-8'>
                <p>로딩 중...</p>
              </div>
            ) : displayedItems.length === 0 ? (
              <div className='flex justify-center py-8'>
                <p className='text-gray-500'>
                  해당 날짜에 청소 일정이 없습니다.
                </p>
              </div>
            ) : (
              displayedItems.map(({ dutyName, task }) => (
                <SwipeableRow
                  key={task.id}
                  // disabled={!isManager}
                  onToggle={() => handleToggleChecklist(task.id)}
                >
                  <div>
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
                    />
                  </div>
                </SwipeableRow>
              ))
            )}
          </div>
        </div>
      </div>

      <div className='flex-shrink-0'>
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
            const checklistId = selectTask.id;
            console.log(
              'Debug - Opening cleaning info for checklistId:',
              checklistId
            );
            navigate(`/calendar/${checklistId}`, {
              state: {
                placeId:
                  state?.placeId ?? Number(localStorage.getItem('placeId')),
                checklistId: checklistId,
                taskTitle: selectTask.title,
                dutyName:
                  displayedItems.find((item) => item.task.id === selectTask.id)
                    ?.dutyName || '',
              },
            });
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
            청소 목록을 <span className='text-[#4D83FD]'>삭제</span>
            하시겠습니까?
          </span>
        }
        descript='해당 청소를 체크리스트에서 완전히 삭제합니다.'
        first='취소'
        second='확인'
        userEmail=''
        onFirstClick={() => setIsDeleteOpen(false)}
        onSecondClick={handleDeleteChecklist}
      />

      <DownloadPopUp
        isOpen={isPhotoOpen}
        onRequestClose={() => setIsPhotoOpen(false)}
        hasPhoto={selectTask?.isCamera || false}
        taskTitle={selectTask?.title || '청소'}
        dutyName={
          displayedItems.find((item) => item.task.id === selectTask?.id)
            ?.dutyName || '당번'
        }
        photoUrl={
          selectTask?.isCamera
            ? 'https://via.placeholder.com/264x196/4D83FD/FFFFFF?text=청소+사진'
            : undefined
        }
        completedAt={selectTask?.completedAt || null}
      />

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
