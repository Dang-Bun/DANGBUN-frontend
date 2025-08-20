import React from 'react';
import { useRef, useEffect, useState } from 'react';
import HeaderBar from '../../components/HeaderBar';
import BlackDown from '../../assets/cleanUpList/BlackDown.svg';
import BlackUp from '../../assets/cleanUpList/BlackUp.svg';

import '../../styles/CalendarOverride.css';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';

interface CleanItem {
  cleaningname: string;
  dutyname: string;
  members: string[];
  needphoto: boolean;
  repeattype: string;
  repeatdays: string[];
  detaildates: string[];
}

interface CleanInfoProps {
  data: CleanItem;
}

const CleanInfo: React.FC<CleanInfoProps> = () => {
  //data
  const data: CleanItem = {
    cleaningname: '바닥 쓸기',
    dutyname: '탕비실 청소 당번',
    members: ['김효정', '박완', '박한나', '김도현', '최준서'],
    needphoto: true,
    repeattype: '매주 요일마다',
    repeatdays: ['화', '금'],
    detaildates: ['2025-08-01', '2025-08-05'],
  };
  const {
    cleaningname,
    dutyname,
    members,
    needphoto,
    repeattype,
    repeatdays,
    detaildates,
  } = data;

  const membersContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expanded2, setExpanded2] = useState(false);

  useEffect(() => {
    const el = membersContainerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        const lineHeight = 28;
        if (el.scrollHeight > lineHeight) {
          setIsOverflowing(true);
        }
      });
    }
  }, []);

  //calendar

  const [selectedDates, setSelectedDates] = useState<Date[]>(
    detaildates.map((d) => new Date(d))
  );

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const monthOptions = Array.from({ length: 6 }, (_, i) =>
    dayjs(today).add(i, 'month').toDate()
  );

  return (
    <div className='flex justify-center px-5'>
      <HeaderBar title='청소 정보' showBackButton={true} />
      <div className='flex flex-col mt-[52px] w-[353px] gap-8'>
        <div className='flex flex-row justify-between items-center'>
          <span className='text-base font-semibold'>청소 이름</span>
          <p className='text-base font-normal text-neutral-400'>
            {cleaningname}
          </p>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <span className='text-base font-semibold'>당번</span>
          <p className='text-base font-normal  text-neutral-400'>{dutyname}</p>
        </div>
        <div className='flex flex-row justify-between items-start'>
          <span className='text-base font-semibold mt-1.5'>담당 멤버</span>
          <div className='flex flex-row'>
            <div
              ref={membersContainerRef}
              className={`flex flex-wrap gap-2 max-w-[210px] items-center overflow-hidden transition-all duration-300 mt-1 ${
                expanded ? 'max-h-full' : 'max-h-7'
              }`}
            >
              {' '}
              {members.map((name, index) => (
                <div
                  key={index}
                  className={`h-7 px-[14px] py-[5px] rounded-lg text-white text-xs font-semibold leading-snug  bg-[#00dc7b] }`}
                >
                  {name}
                </div>
              ))}
            </div>
            {isOverflowing && (
              <button
                className='w-9 h-9 flex items-center justify-center cursor-pointer'
                onClick={() => setExpanded(!expanded)}
              >
                <img src={expanded ? BlackUp : BlackDown} alt='이름 열기' />
              </button>
            )}
          </div>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <span className='text-base font-semibold'>인증 방법</span>
          <p className='text-base font-normal  text-neutral-400'>
            {needphoto ? '사진 인증' : '없음'}
          </p>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <span className='text-base font-semibold'>청소 주기</span>
          <p className='text-base font-normal  text-neutral-400'>
            {repeattype === '매주 요일마다'
              ? `매주 ${repeatdays.join(`, `)}마다`
              : repeattype}
          </p>
        </div>
        <div>
          <div className='flex flex-row justify-between items-center'>
            <span className='text-base font-semibold'>세부 날짜 보기</span>
            <button
              className='w-9 h-9 flex items-center justify-center cursor-pointer'
              onClick={() => setExpanded2(!expanded2)}
            >
              <img src={expanded2 ? BlackUp : BlackDown} alt='세부 날짜 열기' />
            </button>
          </div>

          <div className={`${expanded2 ? '' : 'hidden'}`}>
            <div className={`w-[353px] flex flex-row justify-end`}>
              <select
                id='monthSelect'
                value={dayjs(selectedMonth).format('YYYY-MM')}
                onChange={(e) =>
                  setSelectedMonth(dayjs(e.target.value).toDate())
                }
                className='text-zinc-500 text-base font-normal'
              >
                {monthOptions.map((month) => (
                  <option
                    key={dayjs(month).format('YYYY-MM')}
                    value={dayjs(month).format('YYYY-MM')}
                  >
                    {dayjs(month).format('YYYY년 M월')}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-[353px] h-fit py-5 flex justify-center items-center mt-4 bg-stone-50 rounded-2xl shadow-[0px_0px_8px_0px_rgba(0,0,0,0.05)'>
              <Calendar
                className='w-80'
                tileClassName={({ date, view, activeStartDate }) => {
                  if (view === 'month') {
                    const isSameMonth =
                      activeStartDate.getMonth() === date.getMonth() &&
                      activeStartDate.getFullYear() === date.getFullYear();

                    const isSelected = selectedDates.some(
                      (d) => d.toDateString() === date.toDateString()
                    );
                    return [
                      '  !w-[10px] !h-[36px] !my-[9px] text-base text-center ',
                      isSelected
                        ? 'bg-blue-500 text-white rounded-full'
                        : isSameMonth
                          ? 'text-black'
                          : 'text-[#8e8e8e]',
                    ].join('');
                  }
                  return '';
                }}
                activeStartDate={selectedMonth}
                formatDay={(_, date) => date.getDate().toString()}
                showNeighboringMonth={true}
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
        </div>
      </div>
    </div>
  );
};

export default CleanInfo;
