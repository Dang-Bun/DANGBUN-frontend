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
import Notification from '../pages/G/Notification';
import NotificationDetail from '../pages/G/NotificationDetail';
import NotificationCreate from '../pages/G/NotificationCreate';
import PlaceMake1 from '../pages/D/PlaceMake1';
import PlaceMake2 from '../pages/D/PlaceMake2';
import PlaceMake3 from '../pages/D/PlaceMake3';
import PlaceJoin1 from '../pages/E/PlaceJoin1';
import PlaceJoin2 from '../pages/E/PlaceJoin2';
import SettingManager from '../pages/I/SettingManager';
import SettingMember from '../pages/I/SettingMember';
import ManagementManager from '../pages/J/ManagementManager';
import ManagementMember from '../pages/J/ManagementMember';
import DutyMember from '../pages/J/DutyMember';
import CreateDangbun from '../pages/J/CreateDangbun';
import DutyManagement from '../pages/J/DutyManagement';
import ModifyDuty from '../pages/J/ModifyDuty';
import AddClean from '../pages/J/AddClean';
import CleanUpList from '../pages/K/CleanUpList';
import CleanUpCard from '../components/cleanUp/CleanUpCard';
import CleanAdd from '../pages/K/CleanAdd';
import CleanEdit from '../pages/K/CleanEdit';
import UnDangbun from '../pages/K/UnDangbun';
import CleanInfo from '../pages/K/CleanInfo';
import ManagerInfo from '../pages/L/ManagerInfo';
import MemberConfirm from '../pages/L/MemberConfirm';
import MemberList from '../pages/L/MemberList';
import EnterCode from '../pages/L/EnterCode';
import PlaceDetailed from '../pages/M/PlaceDetailed';
import DangerZoneManager from '../pages/N/DangerZoneManager';
import DangerZoneMember from '../pages/N/DangerZoneMember';
import CalendarPage from '../pages/H/CalendarPage';
import Home from '../pages/F/Home';
import ManagerHome from '../pages/F/ManagerHome';
import MemberHome from '../pages/F/MemberHome';
import ManagerOverview from '../pages/F/ManagerOverview';
import CalendarDetail from '../pages/H/CalendarDetail';

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
    path: '/calendar/content',
    element: <CalendarDetail />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/home/manager',
    element: <ManagerHome />,
  },
  {
    path: '/home/manager/overview',
    element: <ManagerOverview />,
  },
  {
    path: '/home/member',
    element: <MemberHome />,
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
    path: '/setting/manager',
    element: <SettingManager />,
  },
  {
    path: '/setting/member',
    element: <SettingMember />,
  },
  {
    path: '/management/manager',
    element: <ManagementManager />,
  },
  {
    path: '/management/member',
    element: <ManagementMember />,
  },
  {
    path: '/management/member/duty',
    element: <DutyMember />,
  },
  {
    path: '/management/manager/create',
    element: <CreateDangbun />,
  },
  {
    path: '/management/manager/duty',
    element: <DutyManagement />,
  },
  {
    path: '/management/manager/duty/modify',
    element: <ModifyDuty />,
  },
  {
    path: '/management/manager/duty/addclean',
    element: <AddClean />,
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
    path: '/placedetailed',
    element: <PlaceDetailed />,
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
  {
    path: '/memberlist/entercode',
    element: <EnterCode />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
