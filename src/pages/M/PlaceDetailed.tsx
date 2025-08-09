// src/pages/PlaceDetailed.jsx
import React, { useMemo, useState } from 'react';

const hours = Array.from({ length: 24 }, (_, i) => i); // 0~23
const minutes = Array.from({ length: 60 }, (_, i) => i); // 0~59
const pad2 = (n) => String(n).padStart(2, '0');

export default function PlaceDetailed() {
  // 화면 표시용 상태
  const [start, setStart] = useState({ h: 0, m: 0 });
  const [end, setEnd] = useState({ h: 0, m: 0, day: '당일' }); // day: '당일' | '다음날'

  // 모달 상태
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('start'); // 'start' | 'end'
  const [tempH, setTempH] = useState(0);
  const [tempM, setTempM] = useState(0);
  const [tempDay, setTempDay] = useState('당일');

  const exampleText = useMemo(() => {
    // 예시 문구 (단순 표현)
    return `예시) 06/27일 00:00에 시작한 체크리스트는 06/27일 23:59에 종료됩니다.`;
  }, []);

  const openModal = (which) => {
    setMode(which);
    if (which === 'start') {
      setTempH(start.h);
      setTempM(start.m);
      setTempDay('당일');
    } else {
      setTempH(end.h);
      setTempM(end.m);
      setTempDay(end.day);
    }
    setOpen(true);
  };

  const applyModal = () => {
    if (mode === 'start') {
      setStart({ h: tempH, m: tempM });
    } else {
      setEnd({ h: tempH, m: tempM, day: tempDay });
    }
    setOpen(false);
  };

  return (
    <div className='w-full max-w-[393px] min-h-screen bg-white mx-auto px-4 py-6'>
      {/* 헤더 */}
      <div className='relative flex items-center mb-6'>
        <button className='absolute left-0'>
          <img src='/icons/left_chevron.svg' alt='뒤로가기' />
        </button>
        <div className='mx-auto text-lg font-medium'>플레이스 관리</div>
      </div>

      {/* 섹션 타이틀 */}
      <div className='text-base font-medium mb-4'>
        체크리스트 시작/종료 시간
      </div>

      {/* 시작 시간 카드 */}
      <div className='mb-4'>
        <div className='text-[oklch(var(--color-blue, _))] text-sm font-medium mb-2'>
          시작시간
        </div>
        <button
          onClick={() => openModal('start')}
          className='w-full h-[50px] bg-[#F6F8FA] rounded-lg text-lg font-semibold text-gray-700 flex items-center justify-center'
        >
          {pad2(start.h)} <span className='mx-2'>:</span> {pad2(start.m)}
        </button>
      </div>

      {/* 종료 시간 카드 */}
      <div className='mb-4'>
        <div className='text-[oklch(var(--color-blue, _))] text-sm font-medium mb-2'>
          종료시간
        </div>
        <button
          onClick={() => openModal('end')}
          className='w-full h-[50px] bg-[#F6F8FA] rounded-lg px-4 text-lg font-semibold text-gray-700 flex items-center justify-between'
        >
          <span>
            {pad2(end.h)} <span className='mx-2'>:</span> {pad2(end.m)}
          </span>
          <span className='text-sm font-medium'>{end.day} ▾</span>
        </button>
      </div>

      {/* 예시 문구 */}
      <div className='mt-4 text-xs text-gray-500'>{exampleText}</div>

      {/* ===== 시간 설정 Modal (Bottom Sheet) ===== */}
      {open && (
        <>
          {/* Dimmed */}
          <div
            className='fixed inset-0 bg-black/40 z-40'
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div className='fixed inset-x-0 bottom-0 z-50'>
            <div className='mx-auto w-full max-w-[393px] rounded-t-2xl bg-white p-4 shadow-xl'>
              {/* Modal Header */}
              <div className='text-base font-semibold mb-3'>시간 설정</div>

              {/* 모드 탭 (시작/종료 라벨) */}
              <div className='flex gap-2 text-sm mb-3'>
                <button
                  className={`px-3 py-1 rounded-full ${
                    mode === 'start'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => {
                    setMode('start');
                    setTempH(start.h);
                    setTempM(start.m);
                    setTempDay('당일');
                  }}
                >
                  시작시간
                </button>
                <button
                  className={`px-3 py-1 rounded-full ${
                    mode === 'end'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => {
                    setMode('end');
                    setTempH(end.h);
                    setTempM(end.m);
                    setTempDay(end.day);
                  }}
                >
                  종료시간
                </button>
              </div>

              {/* Picker 영역 */}
              <div className='flex items-center justify-center gap-4'>
                {/* 시 */}
                <PickerColumn
                  values={hours}
                  value={tempH}
                  onChange={setTempH}
                />
                <span className='text-lg font-semibold'>:</span>
                {/* 분 */}
                <PickerColumn
                  values={minutes}
                  value={tempM}
                  onChange={setTempM}
                />
                {/* 종료시간일 때만 당일/다음날 */}
                {mode === 'end' && (
                  <select
                    className='ml-3 border rounded-md px-2 py-1 text-sm'
                    value={tempDay}
                    onChange={(e) => setTempDay(e.target.value)}
                  >
                    <option>당일</option>
                    <option>다음날</option>
                  </select>
                )}
              </div>

              {/* 안내 텍스트 (선택 제한 등 필요시) */}
              <div className='text-xs text-gray-400 mt-3'>
                ※ 종료 시간은 시작 시간보다 빠를 수 없습니다. (예: 다음날 선택)
              </div>

              {/* 확인 버튼 */}
              <div className='mt-4'>
                <button
                  className='w-full h-12 rounded-xl bg-blue-500 text-white font-semibold'
                  onClick={applyModal}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** 간단한 스크롤 선택 컬럼 (휠 느낌) */
function PickerColumn({ values, value, onChange }) {
  return (
    <div className='w-[72px] h-[160px] overflow-y-auto rounded-md bg-[#F6F8FA] px-2 py-2'>
      <ul className='space-y-1'>
        {values.map((v) => {
          const active = v === value;
          return (
            <li key={v}>
              <button
                className={`w-full h-8 rounded-md text-sm ${
                  active ? 'bg-white shadow-sm font-semibold' : 'text-gray-600'
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
