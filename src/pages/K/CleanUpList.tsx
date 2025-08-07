import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';

import Header from '../../components/HeaderBar';
import grayPlus from '../../assets/header/GrayPlus.svg';
import grayRight from '../../assets/cleanUpList/grayRight.svg';
import cleanUpImg from '../../assets/cleanUpList/cleanUp.svg';
import searchIcon from '../../assets/cleanUpList/searchIcon.svg';
import grayCheck from '../../assets/cleanUpList/GrayCheck.svg';
import greenCheck from '../../assets/cleanUpList/GreenCheck.svg';

import BottomBar from '../../components/BottomBar';
import CleanUpCard from '../../components/cleanUp/CleanUpCard';
import BottomSheet from '../../components/cleanUp/BottomSheet';

import grayX from '../../assets/cleanUpList/GrayX.svg';
import DownImg from '../../assets/chevron/bottom_chevronImg.svg';
import refresh from '../../assets/cleanUpList/refresh.svg';

import { useCleaningApi } from '../../hooks/useCleaningApi';

const CleanUpList = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [clean, setClean] = useState<string[]>(['바닥 쓸기', '재고 채우기']);
  const [members, setMembers] = useState<string[]>([
    '박완',
    '전예영',
    '박한나',
    '김도현',
    '백상희',
    '최준서',
  ]);

  const [clickedMembers, setClickedMembers] = useState<string[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<string[]>([]);

  const headerRef = useRef<HTMLDivElement>(null);
  const [contentMargin, setContentMargin] = useState(0);

  useLayoutEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    setContentMargin(headerHeight);
  });

  const memberDuty = async () => {
    try {
      const res = await useCleaningApi.searchDuty();
      console.log(res.data);
    } catch (e) {
      console.error('fail:', e);
    }
  };

  return (
    <div className='flex flex-col w-[393px] px-5 '>
      <div ref={headerRef} className='fixed w-[353px] bg-[#fff]'>
        <Header
          title='청소 관리'
          rightElement={<img src={grayPlus} alt='추가' />}
          showBackButton={true}
        />
        <div className='flex flex-row justify-between mt-[52px] mb-3'>
          <p className='text-black text-sm font-normal leading-tight'>총 0개</p>
          <button className='flex flex-row gap-1 justify-center items-center'>
            <p className='text-[#BDBDBD] text-sm font-normal leading-tight'>
              당번 미지정 청소
            </p>
            <img src={grayRight} alt='당번 미지정 청소' />
          </button>
        </div>

        <button
          className='flex flex-row justify-center items-center w-fit mb-3 pt-1.5 pr-2 pb-1 pl-3 rounded-lg outline-1 outline-[#e5e5e5] cursor-pointer'
          onClick={() => {
            setOpen(true);
          }}
        >
          <p className='text-neutral-400 text-sm font-normal leading-tight'>
            {filteredMembers.length === 0
              ? '멤버'
              : `멤버 ${filteredMembers.length}`}
          </p>
          <img
            src={DownImg}
            alt='멤버 보기'
            className='w-5 h-5 px-[4.67px] py-[7px]'
          />
        </button>

        {filteredMembers.length !== 0 ? (
          <div className='flex flex-row w-[353px] mb-3 justify-between items-center'>
            <div className='flex flex-wrap gap-2 items-center'>
              {filteredMembers.map((name, index) => (
                <div key={index} className='flex flex-row w-fit'>
                  <p className='text-sm font-normal leading-tight text-[#00dc7b]'>
                    {name}
                  </p>
                  <button
                    className='cursor-pointer'
                    onClick={() => {
                      setClickedMembers(
                        filteredMembers.filter((m) => m !== name)
                      );
                      setFilteredMembers(
                        filteredMembers.filter((m) => m !== name)
                      );
                    }}
                  >
                    <img src={grayX} alt='X' />
                  </button>
                </div>
              ))}
            </div>
            <div className='flex flex-row gap-2'>
              <div className='w-0 h-4 origin-top-left rotate--90 outline-1 outline-offset-[-0.50px] outline-[#e5e5e5]' />
              <button className='cursor-pointer'>
                <img
                  src={refresh}
                  alt='새로고침'
                  className='h-4 w-4'
                  onClick={() => {
                    setClickedMembers([]);
                    setFilteredMembers([]);
                  }}
                />
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      {clean.length === 0 ? (
        <div
          className='flex flex-col overflow-y-auto items-center justify-center gap-5'
          style={{ paddingTop: contentMargin }}
        >
          <img src={cleanUpImg} alt='empty' />
          <div className='flex flex-col gap-[11px] items-center'>
            <p className='text-zinc-500 text-base font-semibold leading-snug'>
              저장된 청소가 없어요.
            </p>
            <p className='text-neutral-400 text-sm font-normal leading-tight text-center'>
              플레이스에 필요한 청소 목록을 추가해 <br /> 관리해보세요.
            </p>{' '}
          </div>
        </div>
      ) : (
        <div
          className='flex flex-col overflow-y-auto items-center justify-start'
          style={{ paddingTop: contentMargin }}
        >
          <CleanUpCard />
        </div>
      )}

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

      <BottomBar />
    </div>
  );
};

export default CleanUpList;
