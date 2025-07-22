import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

import SplashScreen from '../pages/SplashScreen';
import Z_onBoarding from '../pages/Z_onBoarding';
import StartPage from '../pages/StartPage';
import CalendarPage from '../pages/CalendarPage';
import Notification from '../pages/Notification';

import SelectableRoleCard from '../components/place/PlaceRollCard';
import PlaceRollCard from '../components/place/PlaceRollCard';
import RequestPopUp from '../components/PopUp/RequestPopUp';
import PlaceMake1 from '../pages/D/PlaceMake1';
import PlaceMake2 from '../pages/D/PlaceMake2';

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
    path: 'rollcard',
    element: (
      <div>
        <SelectableRoleCard role='cafe' selected={false} onClick={() => {}} />
        <PlaceRollCard role='cafe' selected={false} onClick={() => {}} />
      </div>
    ),
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
