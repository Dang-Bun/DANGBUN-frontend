import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDutyStore, useRole, type Mode } from '../../stores/useDutyStore';

const MemberHome = React.lazy(() => import('../F/MemberHome'));
const ManagerHome = React.lazy(() => import('../F/ManagerHome'));

const Home: React.FC = () => {
  const { state } = useLocation() as { state?: { role?: Mode; placeId?: number; placeName?: string } };
  const role = useRole();
  const setRole = useDutyStore((s) => s.setRole);
  const setPlace = useDutyStore((s) => s.setPlace);

  useEffect(() => {
    if (state?.role) setRole(state.role);
    if (state?.placeId || state?.placeName) setPlace(state?.placeId, state?.placeName ?? '');
  }, [state, setRole, setPlace]);

  return (
    <Suspense fallback={<div className="p-6">로딩중…</div>}>
      {role === 'manager' ? <ManagerHome /> : <MemberHome />}
    </Suspense>
  );
};

export default Home;
