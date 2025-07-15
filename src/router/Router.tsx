import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

import SplashScreen from '../pages/SplashScreen';
import Z_onBoarding from '../pages/Z_onBoarding';
import StartPage from '../pages/StartPage';
import CalendarPage from '../pages/CalendarPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashScreen />,
  },
  {
    path: '/onboarding',
    element: <Z_onBoarding />,
  },
  {
    path: '/start',
    element: <StartPage />,
  },
  {
    path: '/calendar',
    element: <CalendarPage />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
