import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import left_chevron from '../../assets/chevron/left_chevronImg.svg';
import CTAButton from '../../components/button/CTAButton';

import { usePlaceApi } from '../../hooks/usePlaceApi';

const hours = Array.from({ length: 24 }, (_, i) => i); // 0~23
const minutes = Array.from({ length: 60 }, (_, i) => i); // 0~59
const pad2 = (n) => String(n).padStart(2, '0');

export default function PlaceDetailed() {
  const navigate = useNavigate();
  const placeId = Number(localStorage.getItem('placeId'));
  // 화면 표시용 상태
  const [start, setStart] = useState({ h: 0, m: 0 });
  const [end, setEnd] = useState({ h: 0, m: 0, day: '당일' });

  // 모달 상태
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('start');
  const [tempH, setTempH] = useState(0);
  const [tempM, setTempM] = useState(0);
  const [tempDay, setTempDay] = useState('당일');

  const exampleText = useMemo(() => {
    return `06/27일 00:00에 시작한 체크리스트는\n06/27일 23:59에 종료됩니다.`;
  }, []);

  useEffect(() => {
    const placeId = Number(localStorage.getItem('placeId'));
    const fetchTimeSettings = async () => {
      try {
        const res = await usePlaceApi.getTime(placeId);
        if (res.data.code === 20000) {
          const { startTime, endTime, isToday } = res.data.data;
          setStart({
            h: Number(startTime.split(':')[0]),
            m: Number(startTime.split(':')[1]),
          });
          setEnd({
            h: Number(endTime.split(':')[0]),
            m: Number(endTime.split(':')[1]),
            day: isToday ? '당일' : '다음날',
          });
          console.log('시간 불러오기 성공');
        }
      } catch (err) {
        console.error('시간 불러오기 실패', err);
      }
    };
    fetchTimeSettings();
  }, []);

  const saveTime = async (nextStart: typeof start, nextEnd: typeof end) => {
    const placeId = Number(localStorage.getItem('placeId'));
    const payload = {
      startTime: `${pad2(nextStart.h)}:${pad2(nextStart.m)}`,
      endTime: `${pad2(nextEnd.h)}:${pad2(nextEnd.m)}`,
      isToday: nextEnd.day === '당일',
    };
    try {
      const res = await usePlaceApi.updatePlaceTime(placeId, payload);
      if (res.data.code === 20000) console.log('시간 저장 성공');
      else console.log(`저장 실패: ${res.data.message}`);
    } catch (err) {
      console.error('저장 API 실패', err);
    }
  };

  const applyAndSave = async () => {
    let nextStart = start;
    let nextEnd = end;

    if (mode === 'start') {
      nextStart = { h: tempH, m: tempM };
    } else {
      nextEnd = { h: tempH, m: tempM, day: tempDay };
    }

    // UI 상태 업데이트
    setStart(nextStart);
    setEnd(nextEnd);
    setOpen(false);

    // 같은 값으로 바로 API 저장
    await saveTime(nextStart, nextEnd);
  };

  const openModal = (which) => {
    setMode(which);
    if (which === 'start') {
      setTempH(start.h);
      setTempM(start.m);
    } else {
      setTempH(end.h);
      setTempM(end.m);
      setTempDay(end.day);
    }
    setOpen(true);
  };

  return (
    <div className='w-full bg-white mx-auto pt-3 px-4'>
      {/* 헤더 */}
      <div className='relative flex items-center mb-6'>
        <button className='absolute left-0'>
          <img
            src={left_chevron}
            alt='뒤로가기'
            className='cursor: pointer'
            onClick={() => navigate('/setting/manager')}
          />
        </button>
        <div className='mx-auto font-normal text-[20px]'>플레이스 관리</div>
      </div>

      {/* 섹션 타이틀 */}
      <div className='text-[16px] font-normal mb-4'>
        체크리스트 시작/종료 시간
      </div>

      {/* 시작 시간 카드 */}
      <div>
        <div className='flex flex-col w-full h-[114px] bg-[#F6F6F6] rounded-[8px] gap-3 pt-[22px] pl-[16px]'>
          {/* 파란 pill 라벨 */}
          <div className='w-[92px] h-[28px]  flex bg-blue text-white text-[16px] font-normal px-4 py-1 rounded-full items-center justify-center'>
            시작시간
          </div>

          {/* 시간 입력 모형 */}
          <div className='flex items-center gap-[12px]'>
            {/* 시 박스 */}
            <div
              className='w-[77px] h-[36px] rounded-[8px] bg-white border border-gray-200 flex items-center justify-center cursor-pointer'
              onClick={() => {
                openModal('start');
                setMode('start');
                setTempH(start.h);
                setTempM(start.m);
              }}
            >
              <span className='text-blue font-normal text-[20px]'>
                {pad2(start.h)}
              </span>
            </div>

            {/* 세로 콜론 (·  ·) */}
            <div className='flex flex-col items-center justify-center h-[40px]'>
              <span className='w-[4px] h-[4px] rounded-full bg-blue-500 mb-[8px]' />
              <span className='w-[4px] h-[4px] rounded-full bg-blue-500' />
            </div>

            {/* 분 박스 */}
            <div
              className='w-[77px] h-[36px] rounded-[8px] bg-white border border-gray-200 flex items-center justify-center cursor-pointer'
              onClick={() => {
                openModal('start');
                setMode('start');
                setTempH(start.h);
                setTempM(start.m);
              }}
            >
              <span className='text-blue font-normal text-[20px]'>
                {pad2(start.m)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 종료 시간 카드 */}
      <div>
        <div className='flex flex-col w-full h-[114px] bg-[#F6F6F6] rounded-[8px] gap-3 pt-[22px] pl-[16px] mt-[8px]'>
          {/* 파란 pill 라벨 */}
          <div className='w-[92px] h-[28px] flex bg-blue text-white text-[16px] font-normal px-4 py-1 rounded-full items-center justify-center cursor-pointer'>
            종료시간
          </div>

          {/* 시간 입력 모형 */}
          <div className='flex items-center gap-[12px]'>
            {/* 시 박스 */}
            <div
              className='w-[77px] h-[36px] rounded-[8px] bg-white border border-gray-200 flex items-center justify-center cursor-pointer'
              onClick={() => {
                openModal('end');
                setMode('end');
                setTempH(end.h);
                setTempM(end.m);
                setTempDay(end.day);
              }}
            >
              <span className='text-blue font-normal text-[20px]'>
                {pad2(end.h)}
              </span>
            </div>

            {/* 세로 콜론 (·  ·) */}
            <div className='flex flex-col items-center justify-center h-[40px]'>
              <span className='w-[4px] h-[4px] rounded-full bg-blue-500 mb-[8px]' />
              <span className='w-[4px] h-[4px] rounded-full bg-blue-500' />
            </div>

            {/* 분 박스 */}
            <div
              className='w-[77px] h-[36px] rounded-[8px] bg-white border border-gray-200 flex items-center justify-center'
              onClick={() => {
                openModal('end');
                setMode('end');
                setTempH(end.h);
                setTempM(end.m);
                setTempDay(end.day);
              }}
            >
              <span className='text-blue font-normal text-[20px]'>
                {pad2(end.m)}
              </span>
            </div>
            <select
              value={end.day}
              onChange={(e) => setEnd({ ...end, day: e.target.value })}
              className='w-[77px] h-[36px] rounded-[8px] bg-white border border-gray-200 text-sm font-medium text-blue-500 px-2 focus:outline-none'
            >
              <option value='당일'>당일</option>
              <option value='다음날'>다음날</option>
            </select>
          </div>
        </div>
      </div>

      {/* 예시 문구 */}
      <div className='flex w-full h-[69px] bg-[#F9F9F9] rounded-[8px] gap-3 pt-[22px] pl-[16px] mt-[8px]'>
        <div className='w-[37px] h-[17px] flex items-center justify-center rounded-full border border-[#bdbdbd] bg-[#ffffff] text-[#bdbdbd] text-[12px]'>
          예시
        </div>
        <div className='text-[12px] font-normal text-[#bdbdbd] whitespace-pre-line'>
          {exampleText}
        </div>
      </div>

      {/* ===== 시간 설정 Modal (Bottom Sheet) ===== */}
      {open && (
        <>
          {/* Dim */}
          <div
            className='fixed inset-0 bg-black/40 z-40'
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div className='fixed inset-x-0 bottom-0 z-50'>
            <div className='mx-auto w-full max-w-[393px] rounded-t-2xl bg-white p-4 shadow-xl'>
              {/* 상단 핸들바 */}
              <div className='mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-200' />

              {/* 제목 */}
              <div className='text-base font-normal mb-3'>시간 설정</div>

              {/* 모드 토글 pill */}
              <div className='flex mb-4'>
                {mode === 'start' && (
                  <button className='px-3 h-7 rounded-full bg-blue text-white'>
                    시작시간
                  </button>
                )}

                {mode === 'end' && (
                  <button className='px-3 h-7 rounded-full bg-blue text-white'>
                    종료시간
                  </button>
                )}
              </div>

              {/* 픽커 영역 */}
              <div className='flex items-center justify-center gap-4'>
                {/* 시 */}
                <PickerColumn
                  values={hours}
                  value={tempH}
                  onChange={setTempH}
                />
                {/* 파란 점 콜론 */}
                <div className='flex flex-col items-center justify-center h-[160px]'>
                  <span className='w-[4px] h-[4px] rounded-full bg-blue mb-[8px]' />
                  <span className='w-[4px] h-[4px] rounded-full bg-blue' />
                </div>
                {/* 분 */}
                <PickerColumn
                  values={minutes}
                  value={tempM}
                  onChange={setTempM}
                />
              </div>

              {/* 안내 */}
              <div className='text-xs text-gray-400 mt-4 text-center'>
                종료 시간은 시작 시간보다 빠를 수 없습니다.
              </div>

              <div className='mt-4'>
                <CTAButton
                  variant={
                    isConfirmEnabled({
                      mode,
                      start,
                      end,
                      tempH,
                      tempM,
                      tempDay,
                    })
                      ? 'blue'
                      : 'thickGray'
                  }
                  onClick={applyAndSave}
                >
                  저장
                </CTAButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function isConfirmEnabled({ mode, start, end, tempH, tempM, tempDay }) {
  if (mode === 'start' && tempDay === '당일') {
    const startTotal = tempH * 60 + tempM;
    const endTotal = end.h * 60 + end.m;

    return endTotal > startTotal;
  }

  const startTotal = start.h * 60 + start.m;
  const endTotal = tempH * 60 + tempM;

  if (tempDay === '당일') return endTotal > startTotal;
  // 다음날이면 언제든 OK
  return true;
}

type PickerColumnProps = {
  values: number[];
  value: number;
  onChange: (v: number) => void;
};

/** 휠 느낌 컬럼 */
function PickerColumn({ values, value, onChange }: PickerColumnProps) {
  return (
    <div className='relative w-[167px] h-[160px] overflow-y-auto rounded-lg px-2 py-2 no-scrollbar'>
      <ul className='space-y-1'>
        {values.map((v) => {
          const active = v === value;
          return (
            <li key={v}>
              <button
                className={`w-full h-8 rounded-md text-sm transition-colors ${
                  active ? 'bg-[#dedede] text-gray' : 'text-gray'
                }`}
                onClick={() => onChange(v)}
              >
                {pad2(v)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
