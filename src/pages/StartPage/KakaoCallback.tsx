import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserApi } from '../../hooks/useUserApi';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      const code = searchParams.get('code');

      if (!code) {
        alert('카카오 로그인에 실패했습니다.');
        navigate('/login');
        return;
      }

      try {
        // 백엔드로 인증 코드 전송
        const res = await useUserApi.kakaoLogin({ code });

        const tokenData = res.data?.data;

        if (!tokenData || !tokenData.accessToken || !tokenData.refreshToken) {
          throw new Error('토큰을 받아오지 못했습니다.');
        }

        const { accessToken, refreshToken } = tokenData;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        navigate('/MyPlace');
      } catch (e) {
        console.error('카카오 로그인 실패: ', e);
        alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    handleKakaoLogin();
  }, [searchParams, navigate]);

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-lg font-medium'>로그인 중...</div>
        <div className='text-sm text-gray-500 mt-2'>잠시만 기다려주세요</div>
      </div>
    </div>
  );
};

export default KakaoCallback;
