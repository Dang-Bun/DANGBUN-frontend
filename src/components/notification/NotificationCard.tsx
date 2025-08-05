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
    <div className={`relative w-[353px] h-[124px] p-[12px] flex flex-col align-baseline gap-[8px] rounded-[8px] ${bgColor}`}>
        <img src={imgSrc} alt="Chip img" className='w-[61px] h-[28px]' />
        <p className={` text-base font-semibold ${textColor} px-[10px] `}>{title}</p>
        <p className='text-xs text-[#848484] px-[10px]'>{descript}</p>
        <span className="absolute top-[12px] right-[16px] text-[12px] text-[#797C82]">
            {timeAgo}
        </span>
    </div>
  )
}

export default NotificationCard