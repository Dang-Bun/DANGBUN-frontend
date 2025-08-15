import React, { useState, useEffect } from 'react';
import HeaderBar from '../../components/HeaderBar';
import cleanUpImg from '../../assets/cleanUpList/cleanUp.svg';
import CleanUpCard from '../../components/cleanUp/CleanUpCard';
import BottomBar from '../../components/BottomBar';
import { useLocation, useNavigate } from 'react-router-dom';
import useCleaningApi from '../../hooks/useCleaningApi';

const UnDangbun = () => {
  const [undangbunList, setUndangbunList] = useState<string[]>([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const placeId = state as number | undefined;

  useEffect(() => {
    if (placeId == null) return;
    const fetchunassigned = async () => {
      try {
        const res = await useCleaningApi.cleaningUnAssigned(placeId);
        console.log(res.data);
        setUndangbunList(res.data?.cleaningName ?? []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchunassigned();
  }, [placeId]);

  return (
    <div>
      <HeaderBar title='당번 미지정 청소' />

      {undangbunList.length === 0 ? (
        <div className='flex flex-col h-[852px] overflow-y-auto items-center justify-center gap-5 pt-[52px]'>
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
        <div className='flex flex-col overflow-y-auto items-center justify-start mt-[52px] gap-2'>
          {undangbunList.map((name, index) => (
            <button
              key={index}
              className='flex flex-row cursor-pointer'
              onClick={() => {
                navigate('/cleanedit', { state: { name: name } });
              }}
            >
              <div className='w-[9px] h-[52px] bg-zinc-200 rounded-tl-lg rounded-bl-lg' />
              <div className='flex flex-col w-[344px] h-[52px] px-3 py-0 bg-[#f9f9f9] rounded-lg justify-center items-start'>
                <div className='flex flex-col justify-center items-start gap-1.5'>
                  <p className='text-black text-base font-normal leading-snug'>
                    {name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <BottomBar />
    </div>
  );
};

export default UnDangbun;
