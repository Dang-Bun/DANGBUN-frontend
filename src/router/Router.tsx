import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';

import SplashScreen from '../pages/Z/SplashScreen';
import Z_onBoarding from '../pages/Z/Z_onBoarding';
import LogIn from '../pages/A/LogIn';
import Join from '../pages/A/Join';
import FindPassword from '../pages/A/FindPassword';
import JoinComplete from '../pages/B/JoinComplete';
import MyPlace from '../pages/B/MyPlace';
import AddPlace from '../pages/B/AddPlace';
import MyInfo from '../pages/C/MyInfo';
import CalendarPage from '../pages/H/CalendarPage';
import Notification from '../pages/G/Notification';
import NotificationDetail from '../pages/G/NotificationDetail';
import NotificationCreate from '../pages/G/NotificationCreate';
import PlaceMake1 from '../pages/D/PlaceMake1';
import PlaceMake2 from '../pages/D/PlaceMake2';
import PlaceMake3 from '../pages/D/PlaceMake3';
import PlaceJoin1 from '../pages/E/PlaceJoin1';
import PlaceJoin2 from '../pages/E/PlaceJoin2';
import Setting from '../pages/I/Setting';
import CleanUpList from '../pages/K/CleanUpList';
import CleanUpCard from '../components/cleanUp/CleanUpCard';
import CleanAdd from '../pages/K/CleanAdd';
import CleanEdit from '../pages/K/CleanEdit';
import UnDangbun from '../pages/K/UnDangbun';
import CleanInfo from '../pages/K/CleanInfo';
import DangerZoneManager from '../pages/N/DangerZoneManager';
import DangerZoneMember from '../pages/N/DangerZoneMember';
import MemberList from '../pages/L/MemberList';
import MemberConfirm from '../pages/L/MemberConfirm';
import ManagerInfo from '../pages/L/ManagerInfo';

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
    path: '/findPassWord',
    element: <FindPassword />,
  },
  {
    path: '/join',
    element: <Join />,
  },
  {
    path: '/joinComplete',
    element: <JoinComplete />,
  },
  {
    path: '/myPlace',
    element: <MyPlace />,
  },
  {
    path: '/addPlace',
    element: <AddPlace />,
  },
  {
    path: '/myInfo',
    element: <MyInfo />,
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
    path: '/alarm/:id',
    element: <NotificationDetail />,
  },
  {
    path: '/alarm/create',
    element: <NotificationCreate />,
  },
  {
    path: 'placemake1',
    element: <PlaceMake1 />,
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
    path: '/setting',
    element: <Setting />,
  },
  {
    path: '/cleanuplist',
    element: <CleanUpList />,
  },
  {
    path: '/cleanupcard',
    element: <CleanUpCard />,
  },
  {
    path: '/cleanadd',
    element: <CleanAdd />,
  },
  {
    path: '/cleanedit',
    element: <CleanEdit />,
  },
  {
    path: '/undangbun',
    element: <UnDangbun />,
  },
  {
    path: '/cleaninfo',
    element: <CleanInfo data={undefined} />,
  },
  {
    path: '/dangerzone/manager',
    element: <DangerZoneManager />,
  },
  {
    path: '/dangerzone/member',
    element: <DangerZoneMember />,
  },
  {
    path: '/memberlist',
    element: <MemberList />,
  },
  {
    path: '/memberconfirm',
    element: <MemberConfirm />,
  },
  {
    path: '/managerinfo',
    element: <ManagerInfo />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
