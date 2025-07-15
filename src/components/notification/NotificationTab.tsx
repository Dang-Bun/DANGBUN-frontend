import React from 'react';


interface NotiTabProps {
  selectedTab: 'transmit' | 'inbox';
  onChange: (type: 'transmit' | 'inbox') => void;
}

const NotificationTab = ({ selectedTab, onChange }: NotiTabProps) => {
  return (
    
    <div className="w-[352px] h-[31px] bg-[#F9F9F9] rounded-[8px] flex p-[2px]">
      <button
        onClick={() => onChange('inbox')}
        className={`flex-1 rounded-[8px] text-sm font-medium transition ${
          selectedTab === 'inbox' 
          ? 'bg-[#4D83FD] text-white ' 
          : 'bg-[#F9F9F9] text-black'
        }`}
      >
        받은 알림
      </button>
      <button
        onClick={() => onChange('transmit')}
        className={`flex-1 rounded-[8px] text-sm font-medium transition ${
          selectedTab === 'transmit' 
          ? 'bg-[#4D83FD] text-white' 
          : 'bg-[#F9F9F9] text-black'
        }`}
      >
        보낸 알림
      </button>
    </div>
  );
};

export default NotificationTab;
