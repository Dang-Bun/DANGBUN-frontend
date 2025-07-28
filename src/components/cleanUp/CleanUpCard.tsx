import React from 'react';
import { useState } from 'react';
import c1 from '../../assets/cleanIcon/sweepImg_1.svg';
import c2 from '../../assets/cleanIcon/cleanerImg.svg';
import c3 from '../../assets/cleanIcon/toiletImg.svg';
import c4 from '../../assets/cleanIcon/cupWashingImg.svg';
import c5 from '../../assets/cleanIcon/trashImg_2.svg';
import c6 from '../../assets/cleanIcon/moppingImg_3.svg';
import c7 from '../../assets/cleanIcon/polishImg.svg';
import c8 from '../../assets/cleanIcon/sprayerImg.svg';
import line from '../../assets/cleanUpList/Line.svg';
import up from '../../assets/cleanUpList/BlackUp.svg';
import down from '../../assets/cleanUpList/BlackDown.svg';
import CleanUpCardSpec from './CleanUpCardSpec';

const CleanUpCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex flex-col gap-4'>
      <button
        className='flex flex-row w-[353px] h-9 justify-between items-center pr-[7px] cursor-pointer'
        onClick={() => setOpen(!open)}
      >
        <div className='flex flex-row items-center gap-1'>
          <img src={c1} alt='icon' className='w-9 h-9' />
          <p className='text-zinc-600 text-sm font-normal leading-tight'>
            탕비실 청소 당번
          </p>
        </div>
        {open ? <img src={up} alt='close' /> : <img src={down} alt='open' />}
      </button>
      {open ? (
        <div className='flex flex-col gap-3'>
          <CleanUpCardSpec />
          <CleanUpCardSpec />
          <CleanUpCardSpec />
        </div>
      ) : (
        <></>
      )}
      <img src={line} alt='line' className='w-[352px]' />
      <button
        className='flex flex-row w-[353px] h-9 justify-between items-center pr-[7px] cursor-pointer'
        onClick={() => setOpen(!open)}
      >
        <div className='flex flex-row items-center gap-1'>
          <img src={c1} alt='icon' className='w-9 h-9' />
          <p className='text-zinc-600 text-sm font-normal leading-tight'>
            탕비실 청소 당번
          </p>
        </div>
        {open ? <img src={up} alt='close' /> : <img src={down} alt='open' />}
      </button>
      {open ? (
        <div className='flex flex-col gap-3'>
          <CleanUpCardSpec />
          <CleanUpCardSpec />
          <CleanUpCardSpec />
        </div>
      ) : (
        <></>
      )}
      <img src={line} alt='line' className='w-[352px]' />
    </div>
  );
};

export default CleanUpCard;
