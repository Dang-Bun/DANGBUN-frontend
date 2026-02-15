import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyCleanMarker } from '../Cleaning/CleanUpList';
import CTAButton from '../../components/button/CTAButton';
import { useCleaningApi } from '../../hooks/useCleaningApi';
import { useDutyApi } from '../../hooks/useDutyApi';
import { useLocation } from 'react-router-dom';
import Header from '../../components/HeaderBar';

type Cleaning = {
  cleaningId: number;
  cleaningName: string;
};

export default function AddClean() {
  const navigate = useNavigate();
  const location = useLocation();
  const placeId = Number(localStorage.getItem('placeId'));

  const [list, setList] = useState<Cleaning[]>([
    {
      cleaningId: 1,
      cleaningName: '바닥 닦기',
    },
    { cleaningId: 2, cleaningName: '창문 닦기' },
  ]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { dutyId } = (location.state as { dutyId: number } | undefined) ?? {};

  // 목록 가져오기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await useCleaningApi.getUnassignedCleanings(placeId);
        // 응답: { code, message, data: [{ cleaningName }, ...] }
        const items: Cleaning[] = res.data?.data ?? [];
        if (mounted) setList(items);
      } catch (e: any) {
        if (mounted)
          setError(e?.response?.data?.message || e?.message || '불러오기 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [placeId]);

  // 선택 토글
  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectedCount = useMemo(() => selected.size, [selected]);

  const handleAdd = async () => {
    try {
      const cleaningIds = list
        .filter((item) => selected.has(item.cleaningName))
        .map((item) => item.cleaningId);

      if (cleaningIds.length === 0) return;

      await useDutyApi.addCleaning(placeId, dutyId, { cleaningIds });
      navigate(-1);
    } catch (err) {
      console.error('미지정 청소 추가 실패:', err);
      alert('청소 추가에 실패했습니다.');
    }
  };

  return (
    <div className='w-full min-h-screen bg-white mx-auto pt-3'>
      <Header title='미지정 청소 추가' showBackButton={true} />
      {/* 본문 */}
      <div className='px-4 mt-13'>
        {loading && (
          <div className='text-center text-gray-500 py-10'>불러오는 중…</div>
        )}
        {error && <div className='text-center text-red-500 py-10'>{error}</div>}

        {!loading && !error && list.length === 0 && (
          <EmptyCleanMarker contentMargin={0} />
        )}

        <ul className='space-y-3'>
          {list.map((item) => {
            const checked = selected.has(item.cleaningName);
            return (
              <li
                key={item.cleaningName}
                className='bg-[#F6F6F6] rounded-[10px] px-4 py-4 flex items-center justify-between'
                onClick={() => toggle(item.cleaningName)}
              >
                <span className='text-[16px]'>{item.cleaningName}</span>

                {/* 체크원 */}
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition
                    ${checked ? 'bg-blue border-blue text-white' : 'border-gray-300 text-transparent'}`}
                >
                  <svg viewBox='0 0 24 24' className='w-5 h-5'>
                    <path
                      d='M20 6L9 17l-5-5'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 하단 버튼 */}
      <div className='fixed left-0 right-0 bottom-0 mx-auto max-w-[393px] px-4 pb-6 pt-4 bg-white'>
        <CTAButton
          variant={selectedCount > 0 ? 'blue' : 'thickGray'}
          onClick={handleAdd}
          disabled={selectedCount === 0}
        >
          추가
        </CTAButton>
      </div>
    </div>
  );
}
