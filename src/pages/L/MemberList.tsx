import React, { useState } from 'react';
import Header from '../../components/HeaderBar';
import rightArrow from '../../assets/member/GrayRight.svg';
import GrayLine from '../../assets/member/GrayLine.svg';
import BottomBar from '../../components/BottomBar';
import Envelop from '../../assets/member/Envelop.svg';
import whitearrow from '../../assets/member/whitearrow.svg';

const MemberList = () => {
  const [member, setMember] = useState([]);

  return (
    <div className='pt-[52px] px-5  '>
      <Header title='멤버 목록' showBackButton={true} />
      <button className='cursor-pointer'>
        <div className='flex flex-row w-96 h-24 py-4 px-[21px] bg-blue-500 rounded-lg items-center justify-between'>
          <div className='flex flex-row gap-[21px] items-center'>
            <div className='relative flex justify-center items-center bg-white w-14 h-14 rounded-full'>
              <img src={Envelop} alt='편지' className='absoulte ' />
              <div className=' absolute top-3 right-2 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-center text-white font-semibold text-[8px] leading-3 '>
                3
              </div>
            </div>
            <p className='text-white text-start text-sm font-normal'>
              <span className='text-sm font-semibold'>새로운 멤버</span>가{' '}
              <br />
              참여를 기다리고 있어요 !
            </p>
          </div>
          <img src={whitearrow} />
        </div>
      </button>

      <div className='flex flex-row gap-4.5'>
        <div className='flex w-[61px] h-7 my-4  bg-indigo-100 rounded-lg justify-center items-center text-sm text-blue-500 font-semibold '>
          매니저
        </div>
        <div>
          <div className='flex flex-row justify-between items-center w-[271px] my-4   '>
            <p className='text-base font-semibold'>박완</p>
            <button className='flex flex-row items-center justify-center gap-4.5 cursor-pointer'>
              <p className='text-zinc-500 font-stretch-normal text-sm '>
                화장실 청소 당번
              </p>
              <img src={rightArrow} alt='더보기' className='w-1.5 h-3' />
            </button>
          </div>
          <img src={GrayLine} alt='구분선' />
        </div>
      </div>

      <div className='flex flex-row gap-4.5'>
        <div className='flex w-[61px] h-7 my-4 bg-[#ebfff6] rounded-lg justify-center items-center text-sm text-[#00dc7b] font-semibold '>
          멤버
        </div>
        <div>
          <div className='flex flex-row justify-between items-center w-[271px] my-4  '>
            <p className='text-base font-semibold'>김효정</p>
            <button className='flex flex-row items-center justify-center gap-4.5 cursor-pointer'>
              <p className='text-zinc-500 font-stretch-normal text-sm '>
                홀청소 당번
              </p>
              <img src={rightArrow} alt='더보기' className='w-1.5 h-3' />
            </button>
          </div>
          <img src={GrayLine} alt='구분선' />
          <div className='flex flex-row justify-between items-center w-[271px] my-4  '>
            <p className='text-base font-semibold'>김효정</p>
            <button className='flex flex-row items-center justify-center gap-4.5 cursor-pointer'>
              <p className='text-zinc-500 font-stretch-normal text-sm '>
                홀청소 당번
              </p>
              <img src={rightArrow} alt='더보기' className='w-1.5 h-3' />
            </button>
          </div>
          <img src={GrayLine} alt='구분선' />
          <div className='flex flex-row justify-between items-center w-[271px] my-4  '>
            <p className='text-base font-semibold'>김효정</p>
            <button className='flex flex-row items-center justify-center gap-4.5 cursor-pointer'>
              <p className='text-zinc-500 font-stretch-normal text-sm '>
                홀청소 당번
              </p>
              <img src={rightArrow} alt='더보기' className='w-1.5 h-3' />
            </button>
          </div>
          <img src={GrayLine} alt='구분선' />
        </div>
      </div>

      <BottomBar />
    </div>
  );
};

export default MemberList;
