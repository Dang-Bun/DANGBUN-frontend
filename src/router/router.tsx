import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from '../pages/SplashScreen';
import Z_onBoarding from '../pages/Z_onBoarding';
import StartPage from '../pages/StartPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 무조건 처음엔 Splash 보여줌 */}
        <Route path='/' element={<SplashScreen />} />
        <Route path='/onboarding' element={<Z_onBoarding />} />
        <Route path='/start' element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
