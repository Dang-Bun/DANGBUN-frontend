import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import GrayPlus from '../../assets/header/GrayPlus.svg';
import ReactSwitch from 'react-switch';
import '../../styles/CalendarOverride.css';
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

const CleanEdit = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  //switch
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const pictureChange = (nextChecked: boolean) => {
    setChecked1(nextChecked);
  };
  const cleanChange = (nextChecked: boolean) => {
    setChecked2(nextChecked);
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
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    if (selectedCycle === '매일') {
      const dates = Array.from(
        { length: daysInMonth },
        (_, i) => new Date(year, month, i + 1)
      );
      setSelectedDates(dates);
    } else if (selectedCycle === '매주 요일마다') {
      const dates = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, month, i + 1);
        return selectedDays.includes(getDayName(date.getDay())) ? date : null;
      }).filter((d): d is Date => d !== null);
      setSelectedDates(dates);
    } else if (selectedCycle === '매달 첫 날') {
      setSelectedDates([new Date(year, month, 1)]);
    } else if (selectedCycle === '매달 마지막 날') {
      setSelectedDates([new Date(year, month, daysInMonth)]);
    }
    function getDayName(dayNumber: number): string {
      return ['일', '월', '화', '수', '목', '금', '토'][dayNumber];
    }
  }, [selectedCycle, selectedMonth, selectedDays]);

  //dangbun

  const [dangbun, setDangbun] = useState('');
  const [open, setOpen] = useState(false);
  const [clickedMembers, setClickedMembers] = useState<string[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<string[]>([
    '박완',
    '전예영',
    '박한나',
    '김도현',
    '백상희',
    '최준서',
  ]);

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);

  const confirmHandle = () => {
    setIsModalOpen2(true);
  };

  const deleteHandle = () => {
    setIsModalOpen1(true);
  };

  return (
    <div className='flex flex-col mt-[52px] px-5 gap-5'>
      <div className='fixed top-0 left-0 right-0 h-[52px] bg-white z-50 flex items-center justify-center '>
        <button
          onClick={() => setIsModalOpen3(true)}
          className='absolute left-4 cursor-pointer'
          aria-label='뒤로가기'
        >
          <img src={arrowBack} alt='뒤로가기' className='w-5 h-5' />
        </button>
      </div>

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
                  className='hidden'
                />
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-5 cursor-pointer ${selectedCycle === option ? 'border-gray-300' : 'border-gray-300'} `}
                >
                  {selectedCycle === option && (
                    <span className='flex items-center justify-center  w-3.5 h-3.5 bg-blue-500 rounded-full' />
                  )}
                </span>
                <span className='flex text-zinc-600 text-base font-normal leading-snug text-center justify-center items-center'>
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
            onClickDay={handleDateClick}
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
        <DangbunList onChange={(value) => setDangbun(value)} />
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
            <h2 className='font-normal text-center'>
              정말 <span className='font-semibold'>"{name}"</span> 청소를
              <br />
              <span className='text-blue-500'>삭제</span>할까요?
              <br />
            </h2>
          </>
        }
        descript=''
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setIsModalOpen1(false)}
        onSecondClick={() => {}} //삭제 API 연결
      />

      <PopUpCard
        isOpen={isModalOpen2}
        onRequestClose={() => setIsModalOpen2(false)}
        title={
          <>
            <h2 className='font-normal text-center'>
              이대로 <span className='font-semibold'>"{name}"</span> 청소를
              <br />
              <span className='text-blue-500'>수정</span>할까요?
              <br />
            </h2>
          </>
        }
        descript={<>이후에도 내용 수정이 가능합니다.</>}
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setIsModalOpen2(false)}
        onSecondClick={() => {}} //수정 API 연결
      />

      <PopUpCard
        isOpen={isModalOpen3}
        onRequestClose={() => setIsModalOpen3(false)}
        title={
          <>
            <h2 className='font-normal text-center'>
              <span className='font-semibold'>청소 생성</span>이 완료되지
              않았습니다.
              <br /> 정말 나가시겠습니까?
            </h2>
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
      <div>
        <CTAButton
          variant={name ? 'blue' : 'gray'}
          style={{ marginBottom: '8px', cursor: name ? 'pointer' : 'default' }}
          onClick={name ? confirmHandle : () => {}}
        >
          완료
        </CTAButton>

        <CTAButton
          variant={'gray'}
          style={{ marginBottom: '40px', cursor: 'pointer' }}
          onClick={deleteHandle}
        >
          삭제하기
        </CTAButton>
      </div>
    </div>
  );
};

export default CleanEdit;
