import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

import Calendar from '../assets/nav/calendar.svg';
import CalendarPressed from '../assets/nav/calendarPressed.svg';
import Home from '../assets/nav/home.svg';
import HomePressed from '../assets/nav/homePressed.svg';
import Setting from '../assets/nav/set.svg';
import SettingPressed from '../assets/nav/settingPressed.svg';


const BottomBar = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    
    return(
        <div className=
            "sticky fixed bottom-0 left-0 right-0 w-full h-[83px] z-50 border-t border-[#F6F6F6] flex justify-center items-center gap-[112px]"
            >
            <div onClick={()=>navigate('/calendar')}>
                <img 
                 src={location.pathname==='/calendar' ? CalendarPressed : Calendar} 
                 alt ="캘린더" />
            </div>
            <div onClick={()=>navigate('/')}>
                <img 
                 src={location.pathname==='/' ? HomePressed : Home} 
                 alt ="홈" />
            </div>
            <div onClick={()=>navigate('/setting')}>
                <img 
                 src={location.pathname==='/setting' ? SettingPressed : Setting} 
                 alt ="설정" />
            </div>
        </div>
        
    )

}

export default BottomBar;