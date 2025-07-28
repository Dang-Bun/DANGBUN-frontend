import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

import SplashScreen from '../pages/Z/SplashScreen';
import Z_onBoarding from '../pages/Z/Z_onBoarding';
//import StartPage from '../pages/StartPage';
import CalendarPage from '../pages/H/CalendarPage';
import Notification from '../pages/G/Notification';

import RequestPopUp from '../components/PopUp/RequestPopUp';
import PlaceMake1 from '../pages/D/PlaceMake1';
import PlaceMake2 from '../pages/D/PlaceMake2';
import PlaceMake3 from '../pages/D/PlaceMake3';
import LogIn from '../pages/A/LogIn';
import Join from '../pages/A/Join';
import PlaceJoin1 from '../pages/E/PlaceJoin1';
import PlaceJoin2 from '../pages/E/PlaceJoin2';
import CleanUpList from '../pages/K/CleanUpList';
import CleanUpCard from '../components/cleanUp/CleanUpCard';

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
    path: 'placemake1',
    element: <PlaceMake1 />, // Ensure PlaceMake1 is imported correctly
  },
  {
    path: 'placemake2',
    element: <PlaceMake2 />,
  },
  {
    path: 'placemake3',
    element: <PlaceMake3 />,
  },
  {
    path: 'PlaceJoin1',
    element: <PlaceJoin1 />,
  },
  {
    path: 'PlaceJoin2',
    element: <PlaceJoin2 />,
  },
  {
    path: '/popup',
    element: <RequestPopUp />,
  },
  {
    path: '/cleanuplist',
    element: <CleanUpList />,
  },
  {
    path: '/cleanupcard',
    element: <CleanUpCard />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
