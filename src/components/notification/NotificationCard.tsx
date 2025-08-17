// src/components/notification/NotificationCard.tsx

import React from 'react'
import ManagerGray from '../../assets/notificationIcon/ManagerGray.svg';
import MemberGray from '../../assets/notificationIcon/MemberGray.svg';
import ManagerChip from '../../assets/notificationIcon/ManagerChip.svg';
import MemberChip from '../../assets/notificationIcon/MemberChip.svg';

interface NotiChiptProps {
    type : 'member' | 'manager';
    read? : boolean;
    title : string;
    descript : string;
    timeAgo : string;
    onClick?: () => void;
}

const formatTimeAgo = (isoString: string): string => {
    const now = new Date();
    const date = new Date(isoString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
        return "방금 전";
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}분 전`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}시간 전`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `${days}일 전`;
    }
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};


const NotificationCard = ({type, read=false, title, descript, timeAgo, onClick }:NotiChiptProps) => {
    let imgSrc = '';
    if(read){
        if(type ==='member'){
            imgSrc = MemberGray;
        }
        else {
            imgSrc = ManagerGray;
        }
    }
    else{
        if(type ==='member'){
            imgSrc = MemberChip;
        }
        else {
            imgSrc = ManagerChip;
        }
    }


    const bgColor =
        read 
        ? 'bg-[#DEDEDE]' 
        : 'bg-[#F9F9F9]';

    const textColor = 
        read
            ? 'text-[#797C82]' 
            : 'text-[#000000]'; 
    return (
      <button onClick={onClick} className={`relative w-[353px] h-[124px] p-[12px] flex flex-col align-baseline rounded-[8px] ${bgColor}`}>
        <img src={imgSrc} alt="Chip img" className='w-[61px] h-fit mb-2' />
        <div className='gap-2 flex flex-col items-start'>
            <p className={` text-base font-semibold ${textColor} px-[10px] `}>{title}</p>
            <p className='text-xs text-[#848484] px-[10px]'>{descript}</p>
        </div>
        <span className="absolute top-[12px] right-[16px] text-[12px] text-[#797C82]">
            {formatTimeAgo(timeAgo)}
        </span>
      </button>
    )
}

export default NotificationCard