import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Calendar from '../assets/nav/calendar.svg';
import CalendarPressed from '../assets/nav/calendarPressed.svg';
import Home from '../assets/nav/home.svg';
import HomePressed from '../assets/nav/homePressed.svg';
import Setting from '../assets/nav/set.svg';
import SettingPressed from '../assets/nav/settingPressed.svg';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role] = useState<string | null>(() => localStorage.getItem('role'));
  const [placeId] = useState<string | null>(() =>
    localStorage.getItem('placeId')
  );

  return (
    <div className='fixed bottom-0 left-0 right-0 w-full h-[83px] bg-white z-50 border-t border-[#F6F6F6] flex justify-center items-center gap-[112px]'>
      <div onClick={() => navigate('/calendar')}>
        <img
          src={location.pathname === '/calendar' ? CalendarPressed : Calendar}
          alt='캘린더'
        />
      </div>
      <div onClick={() => navigate('/home', { state: { role, placeId } })}>
        <img
          src={location.pathname === '/home' ? HomePressed : Home}
          alt='홈'
        />
      </div>
      <div
        onClick={() => {
          if (role === '매니저') {
            navigate('/setting/manager');
          } else {
            navigate('/setting/member');
          }
        }}
      >
        <img
          src={
            location.pathname === '/setting/manager' ||
            location.pathname === '/setting/member'
              ? SettingPressed
              : Setting
          }
          alt='설정'
        />
      </div>
    </div>
  );
};

export default BottomBar;
