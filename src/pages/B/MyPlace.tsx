// src/pages/MyPlace.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CTAButton from '../../components/button/CTAButton';
import threebar from '../../assets/nav/threebar.svg';
import nothingPlace from '../../assets/placeIcon/nothingPlaceImg.svg';
import api from '../../apis/axios';

// 아이콘들
import buildingImg from '../../assets/placeIcon/buildingImg.svg';
import cinemaImg from '../../assets/placeIcon/cinemaImg.svg';
import dormitoryImg from '../../assets/placeIcon/dormitoryImg.svg';
import gymImg from '../../assets/placeIcon/gymImg.svg';
import officeImg from '../../assets/placeIcon/officeImg.svg';
import restaurantImg from '../../assets/placeIcon/restaurantImg.svg';
import schoolImg from '../../assets/placeIcon/schoolImg.svg';
import cafeSmallImg from '../../assets/placeIcon/cafeSmallImg.svg';
import homeImg from '../../assets/placeIcon/homeImg.svg';

type Category =
  | 'CAFE'
  | 'RESTAURANT'
  | 'THEATER'
  | 'DORMITORY'
  | 'BUILDING'
  | 'OFFICE'
  | 'SCHOOL'
  | 'GYM'
  | 'ETC';

type Place = {
  placeId: number;
  name: string;
  category: Category;
  categoryName: string;
  totalCleaning: number; // 전체
  endCleaning: number; // 완료
  role: '매니저' | '멤버';
  notifyNumber: number; // 새로운 알림 개수
};

const categoryIcon: Record<Category, string> = {
  CAFE: cafeSmallImg,
  RESTAURANT: restaurantImg,
  THEATER: cinemaImg,
  DORMITORY: dormitoryImg,
  BUILDING: buildingImg,
  OFFICE: officeImg,
  SCHOOL: schoolImg,
  GYM: gymImg,
  ETC: homeImg,
};

const MyPlace: React.FC = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 남은 청소 건수 합계
  const remainingCount = useMemo(
    () =>
      places.reduce(
        (acc, p) =>
          acc + Math.max((p.totalCleaning || 0) - (p.endCleaning || 0), 0),
        0
      ),
    [places]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('📡 /places API 호출 시도');
        const res = await api.get('/places', { withCredentials: true });

        console.log('📥 응답 데이터:', res.data);

        // axios 응답은 res.data에 바로 데이터가 있음
        const list: Place[] = res.data?.data?.places ?? [];

        if (mounted) {
          setPlaces(list);
        }
      } catch (e: any) {
        console.error('❌ API 호출 실패:', e);
        if (mounted) {
          setError(e?.message ?? '알 수 없는 오류');
        }
      } finally {
        if (mounted) {
          console.log('✅ 로딩 종료');
          setLoading(false);
        }
      }
    })();

    return () => {
      console.log('🛑 컴포넌트 언마운트됨');
      mounted = false;
    };
  }, []);

  const handleAdd = () => navigate('/addPlace');

  // 상단 바
  const Header = (
    <div className='relative flex w-full h-[50px] items-center mt-[72px] mb-4 px-4'>
      <div className='flex w-full text-[20px] justify-center'>내 플레이스</div>
      <img
        src={threebar}
        alt='목록'
        className='absolute right-0 cursor-pointer'
        onClick={() => navigate('/myInfo')}
      />
    </div>
  );

  if (loading) {
    return (
      <div className='px-4'>
        {Header}
        <div className='animate-pulse space-y-3'>
          <div className='h-9 w-3/4 mx-auto rounded-full bg-gray-100' />
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-[88px] rounded-xl bg-gray-100' />
          ))}
        </div>
      </div>
    );
  }

  // 빈 상태 (기존 화면 유지)
  if (!places.length) {
    return (
      <div>
        {Header}
        <div className='w-full flex justify-center my-[60px] mt-[212px] mb-[229px]'>
          <img src={nothingPlace} alt='플레이스 없음' />
        </div>
        <div className='flex justify-center px-4'>
          <CTAButton onClick={handleAdd}>플레이스 추가</CTAButton>
        </div>
      </div>
    );
  }

  return (
    <div className='px-4'>
      {Header}

      {/* 남은 청소 안내 배지 */}
      <div className='w-full flex justify-center mb-3'>
        <div className='inline-flex w-[250px] h-[31px] flex justify-center items-center rounded-full bg-white border border-blue text-black text-[12px]'>
          오늘 남은 청소는 총{' '}
          <span className='mx-1 font-normal text-blue'>{remainingCount}건</span>
          이에요.
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className='space-y-3'>
        {places.map((p) => (
          <button
            key={p.placeId}
            className='w-full h-[117px] bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 text-left cursor-pointer'
            onClick={() =>
              navigate(`/home`, {
                state: {
                  role: p.role,
                  placeId: p.placeId,
                },
              })
            }
          >
            {/* 아이콘 원 */}
            <div
              className={`relative w-[76px] h-[76px] flex items-center justify-center ${p.role === null ? 'opacity-50' : ''}`}
            >
              <div className='absolute inset-0 bg-[#EAF0FF] rounded-full' />
              <img
                src={categoryIcon[p.category]}
                alt={p.categoryName}
                className='relative z-10 w-[60%] h-[60%]'
              />
            </div>

            {/* 중앙 텍스트 */}
            <div className='flex-1'>
              <div className='text-[16px] font-semibold'>{p.name}</div>
              {p.role === null ? (
                <div className='text-sm text-gray-6'>
                  완료된 청소
                  <span> / </span>
                </div>
              ) : (
                <div className='text-sm text-black'>
                  <span>완료된 청소 </span>
                  <span className='text-blue-600 font-semibold'>
                    {p.endCleaning ?? 0}
                  </span>
                  <span>/{p.totalCleaning ?? 0}</span>
                </div>
              )}
            </div>

            {/* 우측 라벨 영역 */}
            {p.role === null ? (
              <div className='flex flex-col h-full items-end gap-2 justify-between'>
                {p.notifyNumber >= 0 && (
                  <div className='flex items-center text-xs text-gray-6'>
                    <span className='mr-1'>수락 대기 중</span>
                  </div>
                )}
                <div
                  className={`flex px-3 h-6 w-[66px] rounded-[4px] text-xs font-medium justify-center items-center bg-[#f9f9f9] text-gray-6`}
                >
                  맴버
                </div>
              </div>
            ) : (
              <div className='flex flex-col h-full items-end gap-2 justify-between'>
                {p.notifyNumber >= 0 && (
                  <div className='flex items-center text-xs text-blue-600'>
                    <span className='mr-1'>새로운 알림</span>
                    <span className='inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-[11px]'>
                      {p.notifyNumber}
                    </span>
                  </div>
                )}
                <div
                  className={`flex px-3 h-6 w-[66px] rounded-[4px] text-xs font-medium justify-center items-center ${
                    p.role === '매니저'
                      ? 'bg-blue-8 text-blue-600'
                      : 'bg-green-1 text-green-2'
                  }`}
                >
                  {p.role}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 하단 CTA */}
      <div className='absolute bottom-0 w-full mt-8 mb-8'>
        <CTAButton onClick={handleAdd}>플레이스 추가</CTAButton>
      </div>
    </div>
  );
};

export default MyPlace;
