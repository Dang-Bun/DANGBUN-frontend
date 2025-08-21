import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FLOOR_BLUE from '../../assets/cleanIcon/sweepImg_2.svg';
import CLEANER_PINK from '../../assets/cleanIcon/cleanerImg.svg';
import BUCKET_PINK from '../../assets/cleanIcon/moppingImg_3.svg';
import TOILET_PINK from '../../assets/cleanIcon/toiletImg.svg';
import TRASH_BLUE from '../../assets/cleanIcon/trashImg_2.svg';
import DISH_BLUE from '../../assets/cleanIcon/cupWashingImg.svg';
import BRUSH_PINK from '../../assets/cleanIcon/polishImg.svg';
import SPRAY_BLUE from '../../assets/cleanIcon/sprayerImg.svg';
import line from '../../assets/cleanUpList/Line.svg';
import up from '../../assets/cleanUpList/BlackUp.svg';
import down from '../../assets/cleanUpList/BlackDown.svg';
import plus from '../../assets/cleanUpList/GrayPlus.svg';

import searchIcon from '../../assets/cleanUpList/searchIcon.svg';
import grayCheck from '../../assets/cleanUpList/GrayCheck.svg';
import greenCheck from '../../assets/cleanUpList/GreenCheck.svg';
import BottomSheet from './BottomSheet';

import { useDutyApi } from '../../hooks/useDutyApi';
import { useMemberApi } from '../../hooks/useMemberApi';
import useCleaningApi from '../../hooks/useCleaningApi';

interface CleanUpCardProps {
  title: string;
  icon: string;
  dutyId: number;
  placeId: number;
  members: string[];
  fMembers: number[];
  onTotalCount?: (count: number) => void;
}

interface Cleaning {
  cleaningId: number;
  cleaningName: string;
  displayedNames: string[];
  memberCount: number;
}

const ICON_MAP: Record<string, string> = {
  FLOOR_BLUE: FLOOR_BLUE,
  CLEANER_PINK: CLEANER_PINK,
  BUCKET_PINK: BUCKET_PINK,
  TOILET_PINK: TOILET_PINK,
  TRASH_BLUE: TRASH_BLUE,
  DISH_BLUE: DISH_BLUE,
  BRUSH_PINK: BRUSH_PINK,
  SPRAY_BLUE: SPRAY_BLUE,
};

const CleanUpCard: React.FC<CleanUpCardProps> = ({
  title,
  icon,
  placeId,
  dutyId,
  members,
  fMembers,
  onTotalCount,
}) => {
  const [open, setOpen] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);
  const navigate = useNavigate();

  const [cleaningList, setCleaningList] = useState<Cleaning[]>([]);
  const [clickedMembers, setClickedMembers] = useState<string[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<string[]>([]);
  const [nameToId, setNameToId] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentCleaning, setCurrentCleaning] = useState(0);
  const [clickedCleaning, setClickedCleaning] = useState(0);
  const iconSrc = ICON_MAP[icon] ?? icon;

  const [dutyMembers, setDutyMembers] = useState<string[]>([]);
  const [clickedMembersMap, setClickedMembersMap] = useState<
    Record<number, string[]>
  >({});
  const handlePlus = (cleaning: Cleaning) => {
    const prev = clickedMembersMap[cleaning.cleaningId] || [];
    const combined = Array.from(new Set([...prev, ...cleaning.displayedNames]));

    setClickedMembersMap((prevMap) => ({
      ...prevMap,
      [cleaning.cleaningId]: combined,
    }));

    setClickedCleaning(cleaning.cleaningId);
    setOpen(true);
  };

  useEffect(() => {
    const fetchDutyMembers = async () => {
      try {
        const res = await useDutyApi.getMembers(placeId, dutyId);
        const arr = res.data.data;
        const names = Array.isArray(arr)
          ? arr
              .map((m: any) => m.name)
              .filter((v: any) => typeof v === 'string')
          : [];
        setDutyMembers(names);
      } catch (e) {
        console.error(e);
        setDutyMembers([]);
      }
    };
    fetchDutyMembers();
  }, [placeId, dutyId]);

  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await useDutyApi.getCleaningInfo(placeId, dutyId);
        if (!Array.isArray(res?.data?.data)) return;
        const list = Array.isArray(res?.data?.data)
          ? res.data.data.map((d: any) => ({
              cleaningId: d.cleaningId,
              cleaningName: d.cleaningName,
              displayedNames: d.displayedNames || [],
              memberCount: d.memberCount,
            }))
          : [];
        setCleaningList(list);

        const totalCount = list.length;
        if (onTotalCount) onTotalCount(totalCount);
      } catch (e) {
        console.error(e);
        setCleaningList([]);
      }
    };
    getEffect();
  }, [placeId, dutyId]);

  useEffect(() => {
    const fetchMemberMap = async () => {
      try {
        const res = await useMemberApi.list(placeId);
        const arr = res.data.data.members;

        const map: Record<string, number> = {};
        for (const it of arr) {
          const id = it.memberId;
          const nm = it.name;
          if (typeof id === 'number' && typeof nm === 'string') {
            map[nm] = id;
          }
        }
        setNameToId(map);
      } catch (e) {
        console.error(e);
        setNameToId({});
      }
    };
    fetchMemberMap();
  }, [placeId]);

  const handleEditMember = async (
    cleaningId: number,
    memberIds: number[],
    memberNames: string[]
  ) => {
    try {
      console.log(cleaningId);
      const data = {
        assignType: 'CUSTOM',
        cleaningId: cleaningId,
        memberIds: memberIds.length === 0 ? null : memberIds,
      };
      const res = useDutyApi.assignCleaningMembers(placeId, dutyId, data);
      console.log(res);

      setCleaningList((prev) =>
        prev.map((c) =>
          c.cleaningId === cleaningId
            ? { ...c, displayedNames: memberNames }
            : c
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  const filteredCleaningList =
    fMembers.length === 0
      ? cleaningList
      : cleaningList.filter((cleaning) =>
          cleaning.displayedNames.some((name) => {
            const memberId = nameToId[name];
            return memberId !== undefined && fMembers.includes(memberId);
          })
        );

  return (
    <div className='flex flex-col gap-4 '>
      <div className='w-[353px] border-gray-300 border-t ' />

      <div className='flex flex-col'>
        <button
          className='flex flex-row w-[353px] h-9 justify-between items-center pr-[7px] cursor-pointer'
          onClick={() => setSpecOpen(!specOpen)}
        >
          <div className='flex flex-row items-center gap-3'>
            <img src={iconSrc} alt='icon' className='w-9 h-9' />
            <p className='text-zinc-600 text-base font-normal leading-tight'>
              {title}
            </p>
          </div>
          {specOpen ? (
            <img src={up} alt='close' />
          ) : (
            <img src={down} alt='open' />
          )}
        </button>
      </div>

      {specOpen && (
        <div className='flex flex-col gap-3'>
          {filteredCleaningList.map((cleaning) => (
            <div key={cleaning.cleaningId}>
              <div
                className='flex flex-row w-[353px] rounded-lg shadow-[0px_0px_8px_0px_rgba(0,0,0,0.05)]'
                onClick={() => {
                  navigate('/cleandelete', {
                    state: {
                      cleaningId: cleaning.cleaningId,
                      cleaningName: cleaning.cleaningName,
                      placeId: placeId,
                    },
                  });
                }}
              >
                <div className='w-[9px] h-[73px] bg-zinc-200 rounded-tl-lg rounded-bl-lg'></div>
                <div className='flex flex-col w-[344px] h-[73px] px-3 py-0 bg-[#f9f9f9] rounded-tr-lg rounded-br-lg justify-center items-start'>
                  <div className='flex flex-col justify-center items-start gap-3'>
                    <p className='text-black text-base font-normal leading-snug'>
                      {cleaning.cleaningName}
                    </p>
                    <div className='flex flex-row gap-1 items-center'>
                      {cleaning.displayedNames.length === 0 ? (
                        <div className='flex h-5 px-2 bg-neutral-100 rounded-[300px] justify-center items-center'>
                          <p className='text-neutral-400 text-xs font-normal'>
                            담당 선택
                          </p>
                        </div>
                      ) : cleaning.displayedNames.length > 1 ? (
                        <div className='flex h-5 px-2 bg-[#EBFFF6] rounded-[300px] justify-center items-center'>
                          <p className='text-[#00DC7B] text-xs font-normal'>
                            멤버 {cleaning.displayedNames.length}명
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {cleaning.displayedNames.length === 0 ? (
                        <></>
                      ) : cleaning.displayedNames.length === 1 ? (
                        <p className='text-neutral-400 text-xs font-normal leading-tight'>
                          {cleaning.displayedNames[0]}
                        </p>
                      ) : cleaning.displayedNames.length === 2 ? (
                        <p className='text-neutral-400 text-xs font-normal leading-tight'>
                          {cleaning.displayedNames[0]},{' '}
                          {cleaning.displayedNames[1]}
                        </p>
                      ) : (
                        <p className='text-neutral-400 text-xs font-normal leading-tight'>
                          {cleaning.displayedNames[0]},{' '}
                          {cleaning.displayedNames[1]} 등
                        </p>
                      )}

                      <button
                        className='flex w-5 h-5 bg-neutral-100 rounded-[300px] justify-center items-center cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlus(cleaning);
                          setClickedCleaning(cleaning.cleaningId);
                        }}
                      >
                        <img
                          src={plus}
                          alt='추가하기'
                          className='pointer-events-none'
                        />
                      </button>
                    </div>
                  </div>
                </div>{' '}
              </div>{' '}
              <img src={line} alt='line' className='w-[352px]' />{' '}
            </div>
          ))}{' '}
        </div>
      )}

      <BottomSheet
        isOpen={open}
        onClose={() => {
          setOpen(false);

          const selectedNames = clickedMembersMap[clickedCleaning] || [];
          const selectedMemberIds = selectedNames
            .map((nm) => nameToId[nm])
            .filter((v): v is number => typeof v === 'number');

          handleEditMember(clickedCleaning, selectedMemberIds, selectedNames);
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
            {dutyMembers
              .filter((name) => name.includes(search))
              .map((name, index) => {
                const currentClicked = clickedMembersMap[clickedCleaning] || [];
                return (
                  <button
                    key={index}
                    className={`px-5 py-[7px] rounded-lg text-white text-base font-semibold leading-snug cursor-pointer ${currentClicked.includes(name) ? 'bg-[#00dc7b]' : 'bg-[#e5e5e5]'}`}
                    onClick={() => {
                      setClickedMembersMap((prevMap) => {
                        const current = prevMap[clickedCleaning] || [];
                        return {
                          ...prevMap,
                          [clickedCleaning]: current.includes(name)
                            ? current.filter((n) => n !== name)
                            : [...current, name],
                        };
                      });
                    }}
                  >
                    {name}
                  </button>
                );
              })}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default CleanUpCard;
