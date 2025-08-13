import React, { useState } from 'react';
import Header from '../../components/HeaderBar';
import UserIcon from '../../assets/member/UserIcon.svg';

import grayPlus from '../../assets/header/GrayPlus.svg';
import DangbunList from '../../components/cleanUp/DangbunList';
import GreenUser from '../../assets/member/GreenUser.svg';

const ManagerInfo = () => {
  const [dangbun, setDangbun] = useState('');
  const [count, setCount] = useState(1);

  return (
    <div className='flex flex-col pt-[52px] px-5 justify-center items-center'>
      <Header title='' showBackButton={true} />
      <div className=' w-[345px] rounded-lg mb-[23px] '>
        <div className='flex flex-row h-11 px-3.5 items-center bg-blue-500 gap-3.5 rounded-tr-lg rounded-tl-lg'>
          <div className='w-7 h-7  bg-white rounded-full border-blue-500 flex items-center justify-center'>
            <img src={UserIcon} alt='매니저' />
          </div>
          <p className='text-white font-semibold'>박완</p>
        </div>
        <div className='flex flex-col px-4 py-[11px] bg-stone-50 rounded-br-lg rounded-bl-lg '>
          <div className='flex flex-row items-center justify-between'>
            <p className='text-blue-500 font-semibold'>직책</p>
            <div className='h-8 px-3 flex bg-indigo-100 rounded-lg justify-center items-center text-blue-500 text-sm font-semibold text-center'>
              매니저
            </div>
          </div>
          <div className='self-stretch h-0 opacity-50 outline-1 outline-offset-[-0.25px] outline-neutral-200 my-2.5'></div>
          <div className='flex flex-row items-center justify-between gap-[18px]'>
            <p className='text-zinc-500 font-semibold'>당번</p>
            <p className='text-base text-normal'>탕비실 청소 당번</p>
          </div>
          {}
        </div>
      </div>
      <div className=' w-[345px] rounded-lg mb-[23px] '>
        <div className='flex flex-row h-11 px-3.5 items-center bg-[#38be7b] gap-3.5 rounded-tr-lg rounded-tl-lg'>
          <div className='w-7 h-7  bg-white rounded-full border-blue-500 flex items-center justify-center'>
            <img src={GreenUser} alt='매니저' />
          </div>
          <p className='text-white font-semibold'>박완</p>
        </div>
        <div className='flex flex-col px-4 py-[11px] bg-stone-50 rounded-br-lg rounded-bl-lg '>
          <div className='flex flex-row items-center justify-between'>
            <p className='text-[#38be8b] font-semibold'>직책</p>
            <div className='h-8 px-3 flex bg-[#ebfff6] rounded-lg justify-center items-center text-[#00dc7b] text-sm font-semibold text-center'>
              멤버
            </div>
          </div>
          <div className='self-stretch h-0 opacity-50 outline-1 outline-offset-[-0.25px] outline-neutral-200 my-2.5'></div>
          <div className='flex flex-row items-center justify-between gap-[18px]'>
            <p className='text-zinc-500 font-semibold'>당번</p>
            <p className='text-base text-normal'>탕비실 청소 당번</p>
          </div>
          {}
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <p className='text-xl font-normal'>당번 설정</p>

        {Array.from({ length: count }, (_, index) => (
          <DangbunList key={index} onChange={(value) => setDangbun(value)} />
        ))}

        <div className='relative'>
          <button
            className=' cursor-pointer  h-14 w-[353px] rounded-lg outline-1 outline-dashed outline-offset-[-1px] outline-neutral-200'
            onClick={() => setCount(count + 1)}
          ></button>
          <img src={grayPlus} alt='추가' className='absolute top-3.5 left-40' />
        </div>
      </div>
    </div>
  );
};

export default ManagerInfo;
