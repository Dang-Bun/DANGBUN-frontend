import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

import SplashScreen from '../pages/Z/SplashScreen';
import Z_onBoarding from '../pages/Z/Z_onBoarding';
import LogIn from '../pages/A/LogIn';
import Join from '../pages/A/Join';
import CalendarPage from '../pages/H/CalendarPage';
import Notification from '../pages/G/Notification';
import RequestPopUp from '../components/PopUp/RequestPopUp';

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
    path: '/login',
    element: <LogIn />,
  },
  {
    path: '/join',
    element: <Join />,
    path: '/login',
    element: <LogIn />,
  },
  {
    path: '/join',
    element: <Join />,
  },
  {
    path: '/calendar',
    element: <CalendarPage />,
  },
  {
    path: '/alarm',
    element: <Notification />,
  },
  {
    path: '/popup',
    element: <RequestPopUp />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
