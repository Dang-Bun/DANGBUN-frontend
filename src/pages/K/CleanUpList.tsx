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
import { useLocation, useNavigate } from 'react-router-dom';

import { useDutyApi } from '../../hooks/useDutyApi';
import { useMemberApi } from '../../hooks/useMemberApi';

const CleanUpList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const placeId = location.state?.data?.placeId;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [dangbunList, setDangbunList] = useState<DutyItem[]>([]);
  const [members, setMembers] = useState<string[]>([]);

  const [clickedMembers, setClickedMembers] = useState<string[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<string[]>([]);

  const headerRef = useRef<HTMLDivElement>(null);
  const [contentMargin, setContentMargin] = useState(0);

  interface DutyItem {
    dutyId: number;
    name: string;
    icon: string;
  }

  useLayoutEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    setContentMargin(headerHeight);
  });

  useEffect(() => {
    const geteffect = async () => {
      try {
        console.log(location.state);
        const [dutyres, memberRes] = await Promise.all([
          useDutyApi.list(placeId),
          useMemberApi.list(placeId),
        ]);
        console.log('dutylist: ', dutyres.data);
        console.log('memberlist: ', memberRes.data);

        setDangbunList(
          Array.isArray(dutyres.data?.data)
            ? dutyres.data.data.map((d: any) => ({
                dutyId: d.dutyId,
                name: d.name,
                icon: d.icon,
              }))
            : []
        );
        setMembers(
          Array.isArray(memberRes.data?.data?.members)
            ? memberRes.data.data.members.map((m: any) => m.name)
            : []
        );
      } catch (e) {
        console.error(e);
        setDangbunList([]);
      }
    };
    geteffect();
  }, [placeId]);

  const handleAdd = () => {
    navigate('/cleanadd', { state: { placeId: placeId } });
  };

  return (
    <div className='flex flex-col w-[393px] px-5 '>
      <div ref={headerRef} className='fixed w-[353px] bg-[#fff]'>
        <Header
          title='청소 관리'
          rightElement={<img src={grayPlus} alt='추가' />}
          showBackButton={true}
          onRightClick={handleAdd}
        />
        <div className='flex flex-row justify-between mt-[52px] mb-3'>
          <p className='text-black text-sm font-normal leading-tight'>
            총 {dangbunList.length}개
          </p>
          <button
            className='flex flex-row gap-1 justify-center items-center cursor-pointer'
            onClick={() => navigate('/undangbun', { state: { placeId } })}
          >
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

      {dangbunList.length === 0 ? (
        <div
          className='flex flex-col overflow-y-auto items-center justify-center gap-5 h-[832px]'
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
          {dangbunList.map((duty, index) => (
            <CleanUpCard
              key={duty.dutyId ?? index}
              title={duty.name}
              icon={duty.icon}
              placeId={placeId}
              dutyId={duty.dutyId}
              members={members}
            />
          ))}
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
