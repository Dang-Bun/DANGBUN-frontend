import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

import SplashScreen from '../pages/SplashScreen';
import Z_onBoarding from '../pages/Z_onBoarding';
import LogIn from '../pages/LogIn';
import Join from '../pages/Join';
import CalendarPage from '../pages/CalendarPage';
import Notification from '../pages/Notification';
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
