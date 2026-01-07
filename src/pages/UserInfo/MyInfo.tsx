import React, { useEffect, useState } from 'react';
import leftChevron from '../../assets/chevron/left_chevronImg.svg';
import CTAButton from '../../components/button/CTAButton';
import { useNavigate } from 'react-router-dom';
import api from '../../apis/axios';
import RequestPopUp from '../../components/PopUp/RequestPopUp';
import PopupCard from '../../components/PopUp/PopUpCard';
import Header from '../../components/HeaderBar';

const MyInfoPage = () => {
  const navigate = useNavigate();
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = React.useState(false);
  const [isModalOpen4, setIsModalOpen4] = React.useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const logoutUser = async () => {
    try {
      const res = await api.post('/users/logout');
      if (res.data.code === 20000) {
        console.log('✅ 로그아웃 성공');
      } else {
        console.warn('⚠️ 로그아웃 응답: ', res.data.message);
      }
    } catch (error) {
      console.error('❌ 로그아웃 실패: ', error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get('/users/me');
        const { name, email } = res.data.data;
        setUserInfo({ name, email });
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return (
    <>
      <div className='relative w-full bg-white flex flex-col py-3 px-4'>
        {/* 상단 헤더 */}
        <Header title='내 정보' showBackButton={true} />
        <div className='mb-[500px]'>
          {/* 이름 */}
          <div className='flex justify-between items-center pt-20'>
            <span className='text-[16px] font-semibold text-black'>이름</span>
            <span className='text-[16px] text-[#B7B7B7]'>
              {userInfo?.name || ''}
            </span>
          </div>

          {/* 이메일 */}
          <div className='flex justify-between items-center py-4'>
            <span className='text-[16px] font-semibold text-black'>이메일</span>
            <span className='text-[16px] text-[#B7B7B7]'>
              {userInfo?.email || ''}
            </span>
          </div>
        </div>

        {/* 하단 영역 */}
        <div className='flex flex-col gap-[26px]'>
          <span
            className='text-[14px] font-400 text-[#8e8e8e] cursor-pointer'
            onClick={() => setIsWithdrawalOpen(true)}
          >
            서비스 탈퇴
          </span>

          <CTAButton variant='blue' onClick={() => setIsModalOpen3(true)}>
            로그아웃
          </CTAButton>
        </div>
      </div>

      <RequestPopUp
        isWithdrawalOpen={isWithdrawalOpen}
        closeWithdrawal={() => setIsWithdrawalOpen(false)}
        userEmail={userInfo?.email}
      />

      <PopupCard
        isOpen={isModalOpen3}
        onRequestClose={() => setIsModalOpen3(false)}
        title={
          <span className='font-normal'>
            정말 당번에서 <span className='font-bold'>로그아웃</span>
            하시나요?
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => setIsModalOpen3(false)}
        onSecondClick={async () => {
          setIsModalOpen3(false);

          await logoutUser();

          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          setIsModalOpen4(true);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }}
      ></PopupCard>
      <PopupCard
        isOpen={isModalOpen4}
        onRequestClose={() => setIsModalOpen4(false)}
        title={
          <span className='font-normal'>
            <span className='font-bold'>로그아웃</span>이 완료 되었습니다.
          </span>
        }
        descript=''
        input={false}
        placeholder=''
      ></PopupCard>
    </>
  );
};

export default MyInfoPage;
