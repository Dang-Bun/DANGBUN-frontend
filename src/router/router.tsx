import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Z_onBoarding from '../pages/Z_onBoarding';
import StartPage from '../pages/StartPage';

const Router = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const value = localStorage.getItem('hasSeenOnboarding');
    setHasSeenOnboarding(value === 'true');
  }, []);

  if (hasSeenOnboarding === null) {
    // 아직 localStorage 값 확인 안 된 경우 (로딩 중 화면)
    return <div className='w-full h-screen bg-white' />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Navigate
              to={hasSeenOnboarding ? '/start' : '/onboarding'}
              replace
            />
          }
        />
        <Route path='/onboarding' element={<Z_onBoarding />} />
        <Route path='/start' element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
