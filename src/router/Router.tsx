import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import RequireAuth from '../guards/RequireAuth';

import SplashScreen from '../pages/Onboarding/SplashScreen';
import Z_onBoarding from '../pages/Onboarding/Z_onBoarding';
import LogIn from '../pages/StartPage/LogIn';
import Join from '../pages/StartPage/Join';
import FindPassword from '../pages/StartPage/FindPassword';
import JoinComplete from '../pages/Place/JoinComplete';
import MyPlace from '../pages/Place/MyPlace';
import AddPlace from '../pages/Place/AddPlace';
import MyInfo from '../pages/UserInfo/MyInfo';
import Notification from '../pages/Notification/Notification';
import NotificationDetail from '../pages/Notification/NotificationDetail';
import NotificationCreate from '../pages/Notification/NotificationCreate';
import PlaceMake1 from '../pages/MakePlace/PlaceMake1';
import PlaceMake2 from '../pages/MakePlace/PlaceMake2';
import PlaceMake3 from '../pages/MakePlace/PlaceMake3';
import PlaceJoin1 from '../pages/JoinPlace/PlaceJoin1';
import PlaceJoin2 from '../pages/JoinPlace/PlaceJoin2';
import SettingManager from '../pages/Setting/SettingManager';
import SettingMember from '../pages/Setting/SettingMember';
import ManagementManager from '../pages/Dangbun/ManagementManager';
import ManagementMember from '../pages/Dangbun/ManagementMember';
import DutyMember from '../pages/Dangbun/DutyMember';
import CreateDangbun from '../pages/Dangbun/CreateDangbun';
import DutyManagement from '../pages/Dangbun/DutyManagement';
import ModifyDuty from '../pages/Dangbun/ModifyDuty';
import AddClean from '../pages/Dangbun/AddClean';
import CleanUpList from '../pages/Cleaning/CleanUpList';
import CleanAdd from '../pages/Cleaning/CleanAdd';
import CleanEdit from '../pages/Cleaning/CleanEdit';
import UnDangbun from '../pages/Cleaning/UnDangbun';
import CleanInfo from '../pages/Cleaning/CleanInfo';
import CleanUpList_Member from '../pages/Cleaning/CleanUpList_Member';
import UnDangbun_Member from '../pages/Cleaning/UnDangbun_Member';
import ManagerInfo from '../pages/Member/ManagerInfo';
import MemberConfirm from '../pages/Member/MemberConfirm';
import MemberList from '../pages/Member/MemberList';
import EnterCode from '../pages/Member/EnterCode';
import MemberList_Member from '../pages/Member/MemberList_Member';
import ManagerInfo_Member from '../pages/Member/ManagerInfo_Member';
import PlaceDetailed from '../pages/Time/PlaceDetailed';
import DangerZoneManager from '../pages/DangerZone/DangerZoneManager';
import DangerZoneMember from '../pages/DangerZone/DangerZoneMember';
import CalendarPage from '../pages/Calendar/CalendarPage';
import Home from '../pages/Home/Home';
import ManagerHome from '../pages/Home/ManagerHome';
import MemberHome from '../pages/Home/MemberHome';
import ManagerOverview from '../pages/Home/ManagerOverview';
import CalendarDetail from '../pages/Calendar/CalendarDetail';
import CleanDelete from '../pages/Cleaning/CleanDelete';

//test

const router = createBrowserRouter([
  // === 공개 라우트 ===
  { path: '/', element: <SplashScreen /> },
  { path: '/onboarding', element: <Z_onBoarding /> },
  { path: '/login', element: <LogIn /> },
  { path: '/findPassWord', element: <FindPassword /> },
  { path: '/join', element: <Join /> },
  { path: '/joinComplete', element: <JoinComplete /> },

  // === 로그인 필요(여기 아래 전부 보호됨) ===
  {
    element: <RequireAuth />,
    children: [
      { path: '/myPlace', element: <MyPlace /> },
      { path: '/addPlace', element: <AddPlace /> },
      { path: '/myInfo', element: <MyInfo /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/calendar/:id', element: <CalendarDetail /> },
      { path: '/home', element: <Home /> },
      { path: '/home/manager', element: <ManagerHome /> },
      { path: '/home/member', element: <MemberHome /> },
      { path: '/home/manager/overview', element: <ManagerOverview /> },

      // 알림(로그인만 필요)
      { path: '/:placeId/alarm', element: <Notification /> },
      { path: '/:placeId/alarm/:id', element: <NotificationDetail /> },
      { path: '/:placeId/alarm/create', element: <NotificationCreate /> },

      // 공용(로그인만)
      { path: '/memberlist', element: <MemberList /> },
      { path: '/memberlistmember', element: <MemberList_Member /> },
      { path: '/memberconfirm', element: <MemberConfirm /> },
      { path: '/memberlist/entercode', element: <EnterCode /> },
      { path: '/managerinfo', element: <ManagerInfo /> },
      { path: '/managerinfomember', element: <ManagerInfo_Member /> },

      //플레이스 생성
      { path: '/placemake1', element: <PlaceMake1 /> },
      { path: '/placemake2', element: <PlaceMake2 /> },
      { path: '/placemake3', element: <PlaceMake3 /> },
      { path: '/PlaceJoin1', element: <PlaceJoin1 /> },
      { path: '/PlaceJoin2', element: <PlaceJoin2 /> },

      // 청소(로그인만)
      { path: '/cleanuplist', element: <CleanUpList /> },
      { path: '/cleanuplistmember', element: <CleanUpList_Member /> },
      { path: '/cleanadd', element: <CleanAdd /> },
      { path: '/cleanedit', element: <CleanEdit /> },
      { path: '/undangbun', element: <UnDangbun /> },
      { path: '/undangbunmember', element: <UnDangbun_Member /> },
      { path: '/cleaninfo', element: <CleanInfo data={undefined} /> },
      { path: '/placedetailed', element: <PlaceDetailed /> },
      {
        path: '/cleandelete',
        element: <CleanDelete />,
      },

      // === 매니저 전용(여기 아래 전부 매니저만) ===

      { path: '/setting/manager', element: <SettingManager /> },
      { path: '/management/manager', element: <ManagementManager /> },
      { path: '/management/manager/create', element: <CreateDangbun /> },
      { path: '/management/manager/duty', element: <DutyManagement /> },
      { path: '/management/manager/duty/modify', element: <ModifyDuty /> },
      { path: '/management/manager/duty/addclean', element: <AddClean /> },
      { path: '/dangerzone/manager', element: <DangerZoneManager /> },

      // === 멤버 전용(필요하면) ===

      { path: '/setting/member', element: <SettingMember /> },
      { path: '/management/member', element: <ManagementMember /> },
      { path: '/management/member/duty', element: <DutyMember /> },
      { path: '/dangerzone/member', element: <DangerZoneMember /> },
    ],
  },

  // 404
  { path: '*', element: <div>Not Found</div> },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;
