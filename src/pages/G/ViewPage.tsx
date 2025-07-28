import React from 'react'
import HeaderBar from '../../components/HeaderBar'
import CreateNotificationIcon from '../../assets/notificationIcon/CreateNotificationIcon.svg'
import { useNavigate } from 'react-router-dom'

const ViewPage = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
    navigate('/alarm/create');
  };

    return (
    <HeaderBar title="예시페이지"
    rightElement={
        <button onClick={handleNavigate} className="w-9 h-9 flex items-center justify-center">
          <img src={CreateNotificationIcon} alt="알림 아이콘" className="w-5 h-5" />
        </button>
      }
/>
  )
}
export default ViewPage