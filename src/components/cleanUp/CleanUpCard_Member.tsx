import React, { useEffect } from 'react';
import { useState } from 'react';

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
import { useDutyApi } from '../../hooks/useDutyApi';
import { useMemberApi } from '../../hooks/useMemberApi';

interface CleanUpCardProps {
  title: string;
  icon: string;
  dutyId: number;
  placeId: number;
  members: string[];
  fMembers: number[];
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

const CleanUpCard_Member: React.FC<CleanUpCardProps> = ({
  title,
  icon,
  placeId,
  dutyId,
  members,
  fMembers,
}) => {
  const [specOpen, setSpecOpen] = useState(false);

  const [cleaningList, setCleaningList] = useState<Cleaning[]>([]);
  const [nameToId, setNameToId] = useState<Record<string, number>>({});
  const iconSrc = ICON_MAP[icon] ?? icon;

  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await useDutyApi.getCleaningInfo(placeId, dutyId);
        const list = Array.isArray(res?.data?.data)
          ? res.data.data.map((d: any) => ({
              cleaningId: d.cleaningId,
              cleaningName: d.cleaningName,
              displayedNames: d.displayedNames || [],
              memberCount: d.memberCount,
            }))
          : [];
        setCleaningList(list);
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
              <div className='flex flex-row w-[353px] rounded-lg shadow-[0px_0px_8px_0px_rgba(0,0,0,0.05)]'>
                <div className='w-[9px] h-[73px] bg-zinc-200 rounded-tl-lg rounded-bl-lg'></div>
                <div className='flex flex-col w-[344px] h-[73px] px-3 py-0 bg-[#f9f9f9] rounded-lg justify-center items-start'>
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
                    </div>
                  </div>
                </div>{' '}
              </div>{' '}
              <img src={line} alt='line' className='w-[352px]' />{' '}
            </div>
          ))}{' '}
        </div>
      )}
    </div>
  );
};

export default CleanUpCard_Member;
