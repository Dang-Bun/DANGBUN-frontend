import React, { useState } from 'react';
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

  const pathname = location.pathname.replace(/\/+$/, '') || '/';

  const isCalendar =
    pathname === '/calendar' || pathname.startsWith('/calendar/');
  const isHome = pathname.startsWith('/home/');
  const isSetting = pathname.startsWith('/setting/');

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full h-[83px] bg-white z-50 border-t border-[#F6F6F6] flex justify-center items-center gap-[112px]">
      <button 
        type="button" 
        onClick={() => {
          const placeId = localStorage.getItem('placeId');
          if (placeId) {
            navigate('/calendar', { state: { placeId: Number(placeId) } });
          } else {
            navigate('/calendar');
          }
        }}
      >
        <img src={isCalendar ? CalendarPressed : Calendar} alt="캘린더" />
      </button>

      <button
        type='button'
        onClick={() => {
          const placeName = localStorage.getItem('placeName');
          const placeIcon = localStorage.getItem('placeIcon');
          const state = { 
            role, 
            placeId: placeId ? Number(placeId) : undefined,
            placeName,
            placeIcon
          };
          
          if (role === '매니저'|| role === 'manager') {
            navigate('/home/manager', { state });
          } else {
            navigate('/home/member', { state });
          }
        }}
      >
        <img src={isHome ? HomePressed : Home} alt='홈' />
      </button>

      <button
        type='button'
        onClick={() => {
          if (role === '매니저' || role === 'manager') {
            navigate('/setting/manager');
          } else {
            navigate('/setting/member');
          }
        }}
      >
        <img src={isSetting ? SettingPressed : Setting} alt='설정' />
      </button>
    </div>
  );
};

export default BottomBar;
