import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';

import '../../styles/CalendarOverride.css';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import GrayPlus from '../../assets/header/GrayPlus.svg';
import ReactSwitch from 'react-switch';
import DangbunList from '../../components/cleanUp/DangbunList';

import BlackDown from '../../assets/cleanUpList/BlackDown.svg';
import BlackUp from '../../assets/cleanUpList/BlackUp.svg';
import BottomSheet from '../../components/cleanUp/BottomSheet';
import searchIcon from '../../assets/cleanUpList/searchIcon.svg';
import grayCheck from '../../assets/cleanUpList/GrayCheck.svg';
import greenCheck from '../../assets/cleanUpList/GreenCheck.svg';

import CTAButton from '../../components/button/CTAButton';
import PopUpCard from '../../components/PopUp/PopUpCard';
import arrowBack from '../../assets/nav/arrowBack.svg';

import { useMemberApi } from '../../hooks/useMemberApi';
import useCleaningApi from '../../hooks/useCleaningApi';
import HeaderBar from '../../components/HeaderBar';
import useDutyApi from '../../hooks/useDutyApi';

const DAILY_MAP: Record<string, string> = {
  매일: 'DAILY',
  '매주 요일마다': 'WEEKLY',
  '매달 첫 날': 'MONTHLY_FIRST',
  '매달 마지막 날': 'MONTHLY_LAST',
  '': 'NONE',
};

const CleanAdd = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: { placeId?: number } };
  const placeId = location.state?.placeId;

  //switch
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const pictureChange = (nextChecked: boolean) => {
    setChecked1(nextChecked);
  };
  const cleanChange = (nextChecked: boolean) => {
    setChecked2(nextChecked);
    setSelectedCycle('');
  };

  //radio
  const [selectedCycle, setSelectedCycle] = useState<string>('매일');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const dayList = ['일', '월', '화', '수', '목', '금', '토'];
  const options = ['매일', '매주 요일마다', '매달 첫 날', '매달 마지막 날'];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  //calendar

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const handleDateClick = (date: Date) => {
    const already = selectedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    setSelectedDates((prev) =>
      already
        ? prev.filter((d) => d.toDateString() !== date.toDateString())
        : [...prev, date]
    );
  };

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const monthOptions = Array.from({ length: 6 }, (_, i) =>
    dayjs(today).add(i, 'month').toDate()
  );

  //radio~calendar

  useEffect(() => {
    const start = dayjs().startOf('day');
    const end = dayjs().add(5, 'month').endOf('month');

    if (selectedCycle === '매일') {
      const dates: Date[] = [];
      let cur = start.clone();
      while (cur.isBefore(end) || cur.isSame(end, 'day')) {
        dates.push(cur.toDate());
        cur = cur.add(1, 'day');
      }
      setSelectedDates(dates);
    } else if (selectedCycle === '매주 요일마다') {
      const dates: Date[] = [];
      let cur = start.clone();
      while (cur.isBefore(end) || cur.isSame(end, 'day')) {
        if (selectedDays.includes(getDayName(cur.day()))) {
          dates.push(cur.toDate());
        }
        cur = cur.add(1, 'day');
      }
      setSelectedDates(dates);
    } else if (selectedCycle === '매달 첫 날') {
      const dates: Date[] = [];
      for (let i = 0; i < 6; i++) {
        const d = dayjs().add(i, 'month').startOf('month');
        if (d.isBefore(start, 'day')) continue;
        dates.push(d.toDate());
      }
      setSelectedDates(dates);
    } else if (selectedCycle === '매달 마지막 날') {
      const dates: Date[] = [];
      for (let i = 0; i < 6; i++) {
        const d = dayjs().add(i, 'month').endOf('month');
        if (d.isBefore(start, 'day')) continue;
        dates.push(d.toDate());
      }
      setSelectedDates(dates);
    } else {
      setSelectedDates([]);
    }
    function getDayName(dayNumber: number): string {
      return ['일', '월', '화', '수', '목', '금', '토'][dayNumber];
    }
  }, [selectedCycle, selectedMonth, selectedDays]);

  //dangbun

  const [dangbun, setDangbun] = useState('');
  const [selectedDutyId, setSelectedDutyId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [clickedMembers, setClickedMembers] = useState<string[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);

  useEffect(() => {
    if (!placeId) return;
    const run = async () => {
      try {
        if (placeId && selectedDutyId) {
          const res = await useDutyApi.getMembers(placeId, selectedDutyId);
          const memberspay = res?.data?.data ?? [];
          const names = Array.isArray(memberspay)
            ? memberspay
                .map((m) => m?.name)
                .filter((v) => typeof v === 'string')
            : [];
          setMembers(names);
        } else {
          setMembers([]);
        }
      } catch (e) {
        console.error(e);
        setMembers([]);
      }
    };
    run();
  }, [placeId, selectedDutyId]);

  const confirmHandle = () => {
    if (dangbun.length === 0) {
      setIsModalOpen1(true);
    } else {
      setIsModalOpen2(true);
    }
  };

  const handleUnassignedChange = async () => {
    try {
      const data = {
        cleaningName: name,
        needPhoto: checked1,
        repeatType: DAILY_MAP[selectedCycle],
        repeatDays: selectedDays,
        detailDates: selectedDates.map((date) =>
          dayjs(date).format('YYYY-MM-DD')
        ),
      };
      console.log(data);
      const res = await useCleaningApi.createCleaning(Number(placeId), data);
      console.log(res.data.data);
      navigate('/cleanuplist', { state: { data: { placeId } } });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMake = async () => {
    try {
      const data = {
        cleaningName: name,
        dutyId: selectedDutyId,
        members: filteredMembers,
        needPhoto: checked1,
        repeatType: DAILY_MAP[selectedCycle],
        repeatDays: selectedDays,
        detailDates: selectedDates.map((date) =>
          dayjs(date).format('YYYY-MM-DD')
        ),
      };
      console.log(data);
      const res = await useCleaningApi.createCleaning(Number(placeId), data);
      console.log(res.data.data);
      navigate('/cleanuplist', { state: { data: { placeId } } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='flex flex-col mt-[52px] px-5 gap-5'>
      <HeaderBar title='' showBackButton={true} />

      <div className='flex flex-col gap-3'>
        <p className='text-lg font-normal leading-relaxed'>청소 이름</p>
        <input
          type='text'
          placeholder='바닥 쓸기'
          className='h-14 px-3 py-3.5 bg-stone-50 rounded-lg justify-start items-center text-base font-normal'
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>

      <div className='flex flex-row items-center justify-between'>
        <p className='text-lg font-normal leading-relaxed'>사진 인증</p>
        <ReactSwitch
          onChange={pictureChange}
          checked={checked1}
          onColor='#4d83fd'
          offColor='#dedede'
          uncheckedIcon={false}
          checkedIcon={false}
          handleDiameter={26}
          height={32}
          width={56}
        />
      </div>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-lg font-normal leading-relaxed'>비정기 청소</p>
        <ReactSwitch
          onChange={cleanChange}
          checked={checked2}
          onColor='#4d83fd'
          offColor='#dedede'
          uncheckedIcon={false}
          checkedIcon={false}
          handleDiameter={26}
          height={32}
          width={56}
        />
      </div>
      <div className='flex flex-col gap-[18px]'>
        <p className='text-lg font-normal leading-relaxed'>청소 주기</p>
        {options.map((option) => (
          <div key={option} className='flex flex-col w-[353px]'>
            <div className='flex flex-row justify-between'>
              <label className='flex flex-row gap-[14px]'>
                <input
                  type='radio'
                  name='cycle'
                  value={option}
                  checked={selectedCycle === option}
                  onChange={() => setSelectedCycle(option)}
                  disabled={checked2}
                  className='hidden'
                />
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-5 ${checked2 ? 'cursor-default' : 'cursor-pointer'}  ${selectedCycle === option ? 'border-gray-300' : 'border-gray-300'} `}
                >
                  {selectedCycle === option && (
                    <span className='flex items-center justify-center  w-3.5 h-3.5 bg-blue-500 rounded-full' />
                  )}
                </span>
                <span
                  className={`flex ${checked2 ? 'text-neutral-200' : 'text-zinc-600'} text-base font-normal leading-snug text-center justify-center items-center`}
                >
                  {option}
                </span>
              </label>
              {option === '매주 요일마다' && (
                <div>
                  <button>
                    <img
                      src={
                        selectedCycle === '매주 요일마다' ? BlackUp : BlackDown
                      }
                      alt='열고 닫기'
                    />
                  </button>
                </div>
              )}
            </div>

            {selectedCycle === '매주 요일마다' &&
              option === '매주 요일마다' && (
                <div className='flex flex-row gap-2.5 justify-end mt-[14.5px]'>
                  {dayList.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-9 h-11  rounded-2xl outline-1 justify-center items-center text-center text-base font-normal cursor-pointer ${isSelected ? 'bg-indigo-100 outline-blue-500 text-blue-500' : 'bg-neutral-100 outline-neutral-200 text-zinc-500 '}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
        ))}
      </div>
      <div>
        <div className='w-[353px] flex flex-row justify-between'>
          <p className='text-lg font-normal leading-relaxed'>세부 날짜 설정</p>
          <select
            id='monthSelect'
            value={dayjs(selectedMonth).format('YYYY-MM')}
            onChange={(e) => setSelectedMonth(dayjs(e.target.value).toDate())}
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
            onChange={(value) => handleDateClick(value as Date)}
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
      <div className='flex flex-col gap-3'>
        <p className='text-lg font-normal leading-relaxed'>당번 지정</p>
        <DangbunList
          placeId={placeId}
          onChange={(value) => {
            if (typeof value === 'string') {
              setDangbun(value);
              setSelectedDutyId(null);
            } else {
              setDangbun(value.dutyName);
              setSelectedDutyId(value.dutyId);
            }
          }}
        />
      </div>
      <div
        className={`flex flex-col gap-3 ${dangbun.length === 0 ? 'hidden' : ''}`}
      >
        <div className={`flex flex-row items-center justify-between`}>
          <p className='text-lg font-normal leading-relaxed'>담당 멤버</p>
          <button className='cursor-pointer' onClick={() => setOpen(true)}>
            <img src={GrayPlus} alt='추가하기' />
          </button>
        </div>
        <div className='flex flex-wrap gap-2 max-w-[353px]'>
          {filteredMembers
            .filter((name) => name.includes(search))
            .map((name, index) => (
              <div
                key={index}
                className={`px-5 py-[7px] rounded-lg text-white text-base font-semibold leading-snug cursor-pointer bg-[#00dc7b]`}
              >
                {name}
              </div>
            ))}
        </div>
      </div>

      <div className='h-20'></div>

      <BottomSheet
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setFilteredMembers(clickedMembers);
        }}
      >
        <div className='w-[353px] h-[348px]'>
          <div className='flex flex-col gap-[15px]'>
            <div className='flex relative items-center '>
              <img src={searchIcon} alt='SEARCH' className='absolute px-3' />
              <input
                value={inputValue}
                onChange={(e) => {
                  const v = e.target.value;
                  setInputValue(e.target.value);
                  if (v === '') {
                    setSearch('');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearch(inputValue);
                  }
                }}
                placeholder='검색'
                className='w-[353px] h-[41px] pl-[52px] bg-stone-50 rounded-[20.5px]'
              />
            </div>

            <div
              className={`${search.length == 0 ? 'flex' : 'hidden'} flex-row w-[353px] items-center justify-end gap-2 `}
            >
              <p className='text-zinc-500 text-base font-normal leading-snug'>
                전체 선택
              </p>
              <button
                className='w-6 h-6 cursor-pointer'
                onClick={() => {
                  if (members.length === clickedMembers.length)
                    setClickedMembers([]);
                  else setClickedMembers([...members]);
                }}
              >
                <img
                  src={
                    members.length === clickedMembers.length
                      ? greenCheck
                      : grayCheck
                  }
                  alt='graycheck'
                  className='w-6 h-6'
                />
              </button>
            </div>
          </div>
          <div className='flex flex-wrap gap-2 max-w-[353px] mt-5'>
            {members
              .filter((name) => name.includes(search))
              .map((name, index) => (
                <button
                  key={index}
                  className={`px-5 py-[7px] rounded-lg text-white text-base font-semibold leading-snug cursor-pointer ${clickedMembers.includes(name) ? 'bg-[#00dc7b]' : 'bg-[#e5e5e5]'}`}
                  onClick={() => {
                    setClickedMembers((prev) =>
                      prev.includes(name)
                        ? prev.filter((n) => n !== name)
                        : [...prev, name]
                    );
                  }}
                >
                  {name}
                </button>
              ))}
          </div>
        </div>
      </BottomSheet>

      <PopUpCard
        isOpen={isModalOpen1}
        onRequestClose={() => setIsModalOpen1(false)}
        title={
          <>
            <p className='font-normal text-center'>
              당번을 설정하지 않아 <br />
              <span className='text-blue-500'>당번 미지정 청소</span>로 임시
              저장 됩니다.
              <br />
              이대로 완료하시겠습니까?
            </p>
          </>
        }
        descript=''
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setIsModalOpen1(false)}
        onSecondClick={() => handleUnassignedChange()}
      />

      <PopUpCard
        isOpen={isModalOpen2}
        onRequestClose={() => setIsModalOpen2(false)}
        title={
          <>
            <p className='font-normal text-center'>
              이대로 <span className='font-semibold'>"{name}"</span> 청소를
              <br />
              <span className='text-blue-500'>생성</span>할까요?
              <br />
            </p>
          </>
        }
        descript={<>이후에도 내용 수정이 가능합니다.</>}
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setIsModalOpen2(false)}
        onSecondClick={handleMake}
      />

      <PopUpCard
        isOpen={isModalOpen3}
        onRequestClose={() => setIsModalOpen3(false)}
        title={
          <>
            <p className='font-normal text-center'>
              <span className='font-semibold'>청소 생성</span>이 완료되지
              않았습니다.
              <br /> 정말 나가시겠습니까?
            </p>
          </>
        }
        descript={<>작성중인 내용은 저장되지 않습니다.</>}
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setIsModalOpen3(false)}
        onSecondClick={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/');
        }}
      />

      <CTAButton
        variant={name ? 'blue' : 'gray'}
        style={{ marginBottom: '40px', cursor: name ? 'pointer' : 'default' }}
        onClick={name ? confirmHandle : () => {}}
      >
        완료
      </CTAButton>
    </div>
  );
};

export default CleanAdd;
