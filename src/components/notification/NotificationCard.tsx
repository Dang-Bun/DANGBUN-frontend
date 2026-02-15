// src/components/notification/NotificationCard.tsx

import React from 'react';
import ManagerGray from '../../assets/notificationIcon/ManagerGray.svg';
import MemberGray from '../../assets/notificationIcon/MemberGray.svg';
import ManagerChip from '../../assets/notificationIcon/ManagerChip.svg';
import MemberChip from '../../assets/notificationIcon/MemberChip.svg';

interface NotiChiptProps {
  type: 'member' | 'manager';
  read?: boolean;
  title: string;
  descript: string;
  timeAgo: string;
  onClick?: () => void;
}

const formatTimeAgo = (timeAgo: string): string => {
  // 이미 포맷된 문자열이면 그대로 반환
  if (
    timeAgo.includes('전') ||
    timeAgo.includes('/') ||
    timeAgo === '방금 전'
  ) {
    return timeAgo;
  }

  // ISO 문자열이나 날짜 문자열인 경우 처리
  try {
    const now = new Date();
    const date = new Date(timeAgo);

    if (isNaN(date.getTime())) {
      return '방금 전';
    }

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return '방금 전';
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
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.warn('날짜 파싱 실패:', timeAgo, error);
    return '방금 전';
  }
};

const NotificationCard = ({
  type,
  read = false,
  title,
  descript,
  timeAgo,
  onClick,
}: NotiChiptProps) => {
  const MAX_TITLE_LENGTH = 20;
  const MAX_DESCRIPT_LENGTH = 60; // 두 줄 정도 표시되도록 설정

  const truncatedTitle =
    title.length > MAX_TITLE_LENGTH
      ? title.substring(0, MAX_TITLE_LENGTH) + '...'
      : title;

  const truncatedDescript =
    descript.length > MAX_DESCRIPT_LENGTH
      ? descript.substring(0, MAX_DESCRIPT_LENGTH) + '...'
      : descript;
  let imgSrc = '';
  if (read) {
    if (type === 'member') {
      imgSrc = MemberGray;
    } else {
      imgSrc = ManagerGray;
    }
  } else {
    if (type === 'member') {
      imgSrc = MemberChip;
    } else {
      imgSrc = ManagerChip;
    }
  }

  const bgColor = read ? 'bg-[#DEDEDE]' : 'bg-[#F9F9F9]';

  const textColor = read ? 'text-[#797C82]' : 'text-[#000000]';
  return (
    <button
      onClick={onClick}
      className={`relative w-[353px] h-full p-[12px] flex flex-col align-baseline rounded-[8px] ${bgColor}`}
    >
      <img src={imgSrc} alt='Chip img' className='w-[61px] h-fit mb-2' />
      <div className='gap-2 flex flex-col items-start'>
        <p
          className={` text-base font-semibold ${textColor} px-[10px] text-left`}
        >
          {truncatedTitle}
        </p>
        <p className='text-xs text-[#848484] px-[10px] text-left'>
          {truncatedDescript}
        </p>
      </div>
      <span className='absolute top-[12px] right-[16px] text-[12px] text-[#797C82]'>
        {formatTimeAgo(timeAgo)}
      </span>
    </button>
  );
};

export default NotificationCard;
