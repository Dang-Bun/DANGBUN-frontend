import React, { useState } from 'react';
import icon from '../../assets/Icon_reverse.svg';
import CTAButton from '../../components/button/CTAButton';
import Input from '../../components/input/Input';
import KakaoLogInButton from '../../components/button/KakaoLogInButton';
import { useNavigate } from 'react-router-dom';

import { useUserApi } from '../../hooks/useUserApi';

const LogIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSign = async () => {
    try {
      const res = await useUserApi.login({
        email,
        password,
      });

      const tokenData = res.data?.data;

      // 토큰 데이터가 없는 경우 (로그인 실패 또는 서버 오류)
      if (!tokenData || !tokenData.accessToken || !tokenData.refreshToken) {
        throw new Error('accessToken 또는 refreshToken이 없습니다.');
      }

      const { accessToken, refreshToken } = tokenData;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      navigate('/MyPlace');
    } catch (e) {
      console.error('login fail: ', e);
      alert('로그인 실패! 아이디나 비밀번호를 확인해주세요');
    }
  };

  return (
    <div className='w-full pr-5 pl-5'>
      <div className='flex justify-center pb-[104px] pt-[120px]'>
        <img src={icon} alt='아이콘' />
      </div>
      <div className='w-full flex flex-col items-center'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSign();
          }}
          className='w-full flex flex-col items-center gap-[10px]'
        >
          <Input
            placeholder='이메일을 입력하세요.'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={35}
          />
          <Input
            placeholder='비밀번호를 입력하세요.'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
          />
          <CTAButton onClick={handleSign} type='submit'>
            로그인
          </CTAButton>
        </form>
        <div className='w-full flex flex-row justify-end mt-3 mb-9'>
          <div
            className='cursor-pointer text-sm font-normal'
            onClick={() => navigate('/join')}
          >
            회원 가입
          </div>
          <div className='text-sm font-normal'>&nbsp;|&nbsp;</div>
          <div
            className='text-sm font-normal pr-[9px]'
            onClick={() => {
              navigate('/findPassWord');
            }}
          >
            비밀번호 찾기
          </div>
        </div>
        <KakaoLogInButton />
      </div>
    </div>
  );
};

export default LogIn;
