import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemberApi } from '../../hooks/useMemberApi';

type Mode = 'member' | 'manager';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // MyPlace에서 넘어온 값(없을 수도 있음)
  const { state } = useLocation() as {
    state?: { placeId?: number; placeName?: string; placeIcon?: string; role?: string };
  };

  // ░░░ 1) 진입/state 로그
  useEffect(() => {
    console.log('➡️ [Home] 진입');
    console.log('   📨 받은 state:', state);
  }, [state]);

  // ░░░ 2) 컨텍스트 동기화(localStorage) + 로그
  useEffect(() => {
    console.log('🧩 [Home] 컨텍스트 동기화 시작');
    if (state?.placeId)   { localStorage.setItem('placeId', String(state.placeId));   console.log('   💾 placeId 저장:', state.placeId); }
    if (state?.placeName) { localStorage.setItem('placeName', state.placeName);       console.log('   💾 placeName 저장:', state.placeName); }
    if (state?.placeIcon) { localStorage.setItem('placeIcon', state.placeIcon);       console.log('   💾 placeIcon 저장:', state.placeIcon); }
    if (state?.role) {
      const norm =
        state.role === '매니저' ? 'manager' :
        state.role === '멤버'   ? 'member'  :
        String(state.role).toLowerCase();
      localStorage.setItem('role', norm);
      console.log('   💾 role 저장:', norm);
    }
    console.log('🧩 [Home] 컨텍스트 동기화 완료');
  }, [state]);

  // 동기화된 최종 값(없으면 localStorage fallback)
  const placeId    = useMemo(() => Number(state?.placeId ?? localStorage.getItem('placeId') ?? 0), [state?.placeId]);
  const placeName  = useMemo(() => state?.placeName ?? localStorage.getItem('placeName') ?? '플레이스', [state?.placeName]);
  const placeIcon  = useMemo(() => state?.placeIcon ?? localStorage.getItem('placeIcon') ?? 'ETC', [state?.placeIcon]);

  // 역할 결정
  const [role, setRole] = useState<Mode | null>(null);
  const [loading, setLoading] = useState(true);

  // ░░░ 3) 역할 결정 로직 + 로그 (state.role 우선 → 없으면 API → 없으면 member)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        console.log('🔎 [Home] 역할 결정 시작');

        // 3-1. MyPlace가 role을 넘긴 경우 그 값을 우선 사용
        if (state?.role) {
          const norm =
            state.role === '매니저' ? 'manager' :
            state.role === '멤버'   ? 'member'  :
            String(state.role).toLowerCase();
          const resolved: Mode = norm === 'manager' ? 'manager' : 'member';
          console.log('   🟢 state.role 사용:', resolved);
          if (mounted) setRole(resolved);
          return;
        }

        // 3-2. role이 없고 placeId도 없으면 기본 member
        if (!placeId) {
          console.log('   ⚠️ placeId 없음 → 기본 role=member');
          if (mounted) setRole('member');
          return;
        }

        // 3-3. API 조회로 보강
        console.log(`📡 [API] GET /places/${placeId}/members/me 호출`);
        const res = await useMemberApi.me(placeId);
        console.log('📥 [API] /me 응답:', res?.data);

        const raw = String(res?.data?.role ?? localStorage.getItem('role') ?? 'member').toLowerCase();
        const resolved: Mode = raw === 'manager' ? 'manager' : 'member';
        console.log('   ✅ 역할 판정:', resolved);
        if (mounted) setRole(resolved);
      } catch (e) {
        console.error('❌ [Home] 역할 조회 실패:', e);
        if (mounted) setRole('member');
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('🏁 [Home] 로딩 종료');
        }
      }
    })();

    return () => { mounted = false; console.log('🛑 [Home] 언마운트'); };
  }, [state?.role, placeId]);

  // ░░░ 4) 최종 리다이렉트 (필요한 값 함께 넘김)
  useEffect(() => {
    if (!loading && role) {
      const target = role === 'manager' ? '/home/manager' : '/home/member';
      console.log('➡️ [Home] redirect →', target, { placeId, placeName, placeIcon, role });
      navigate(target, {
        replace: true,
        state: { placeId, placeName, placeIcon, role },
      });
    }
  }, [loading, role, placeId, placeName, placeIcon, navigate]);


  return <div className="p-6">로딩중…</div>;
};

export default Home;
