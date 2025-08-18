import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDutyApi } from '../../hooks/useDutyApi';

import BottomBar from '../../components/BottomBar';
import nothingDangbun from '../../assets/dangbun/nothingDangbun.svg';
import left_chevron from '../../assets/chevron/left_chevronImg.svg';

import dangbunFile from '../../assets/dangbun/DangbunFile.svg';
import cleanerImg from '../../assets/cleanIcon/cleanerImg.svg';
import cupWashingImg from '../../assets/cleanIcon/cupWashingImg.svg';
import moppingImg from '../../assets/cleanIcon/moppingImg_3.svg';
import polishImg from '../../assets/cleanIcon/polishImg.svg';
import sprayerImg from '../../assets/cleanIcon/sprayerImg.svg';
import sweepImg from '../../assets/cleanIcon/sweepImg_2.svg';
import toiletImg from '../../assets/cleanIcon/toiletImg.svg';
import trashImg from '../../assets/cleanIcon/trashImg_2.svg';

// iconName ↔ 이미지 매핑
const iconMap: Record<string, string> = {
  BUCKET_PINK: moppingImg,
  TRASH_BLUE: trashImg,
  CLEANER_PINK: cleanerImg,
  DISH_BLUE: cupWashingImg,
  BRUSH_PINK: polishImg,
  SPRAY_BLUE: sprayerImg,
  FLOOR_BLUE: sweepImg,
  TOILET_PINK: toiletImg,
};

interface Duty {
  dutyId: number;
  name: string;
  icon: string; // 서버에서 오는 필드
}

const ManagementMember = () => {
  const navigate = useNavigate();
  const [duties, setDuties] = useState<Duty[]>([]);
  const [loading, setLoading] = useState(true);

  const placeId = Number(localStorage.getItem('placeId'));

  useEffect(() => {
    const fetchDuties = async () => {
      try {
        const res = await useDutyApi.list(placeId);
        if (res.data.code === 20000) {
          const list = res.data.data ?? [];
          setDuties(list);
        } else {
          console.warn('⚠️ 당번 목록 불러오기 실패:', res.data.message);
        }
      } catch (err) {
        console.error('❌ 당번 목록 API 실패', err);
      } finally {
        setLoading(false);
      }
    };

    if (placeId) {
      fetchDuties();
    }
  }, [placeId]);

  const Header = (
    <div className='relative flex w-full h-[50px] items-center mt-[72px] mb-4 px-4'>
      <div className='absolute'>
        <img
          src={left_chevron}
          alt='뒤로가기'
          className='cursor-pointer'
          onClick={() => navigate('/setting/member')}
        />
      </div>
      <div className='flex w-full text-[20px] justify-center'>당번 목록</div>
    </div>
  );

  if (loading) {
    return (
      <div>
        {Header}
        <p className='text-center mt-20'>로딩 중...</p>
        <BottomBar />
      </div>
    );
  }

  return (
    <div>
      {Header}
      {duties.length === 0 ? (
        <div className='w-full flex justify-center my-[60px] mt-[212px] mb-[229px]'>
          <img src={nothingDangbun} alt='플레이스 없음' />
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 px-4'>
          {duties.map((duty) => (
            <div
              key={duty.dutyId}
              className='relative cursor-pointer w-[167px] h-[160px]'
              onClick={() =>
                navigate(`/management/member/duty`, {
                  state: {
                    dutyId: duty.dutyId,
                    iconUrl: iconMap[duty.icon],
                    name: duty.name,
                  },
                })
              }
            >
              {/* 배경 이미지 */}
              <img
                src={dangbunFile}
                alt='당번 파일'
                className='absolute w-full h-full'
              />

              {/* 배경 위 내용 */}
              <div className='absolute inset-0 flex items-start justify-between pt-[40px] pl-[10px]'>
                <span className='h-[25px] px-[3px] inline-flex items-center font-semibold text-[12px] text-white bg-blue rounded-[8px] whitespace-nowrap'>
                  {duty.name}
                </span>
                <img
                  src={iconMap[duty.icon]}
                  alt={duty.name}
                  className='absolute right-2 bottom-2 w-[80px] h-[80px]'
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <BottomBar />
    </div>
  );
};

export default ManagementMember;
