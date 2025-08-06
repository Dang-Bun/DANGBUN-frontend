import React from 'react';
import { useState, useEffect } from 'react';
import { useJoinForm } from '../../hooks/B/useJoinForm';
import left_chevron from '../../assets/chevron/left_chevronImg.svg';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/input/Input';
import FreeInput from '../../components/input/FreeInput';
import CTAButton from '../../components/button/CTAButton';
import FreeButton from '../../components/button/FreeButton';
import Dropdown from '../../components/input/Dropdown';
import api from '../../apis/axios';
import classNames from 'classnames';

const Join = () => {
  const navigate = useNavigate();
  const {
    name,
    setName,
    emailId,
    setEmailId,
    emailDomain,
    setEmailDomain,
    isCustomDomain,
    customDomain,
    setCustomDomain,
    handleDomainSelect,
    verificationCode,
    setVerificationCode,
    password,
    setPassword,
    isFormFilled,
    isEmailFilled,
  } = useJoinForm();
  const [isRequested, setIsRequested] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRequestVerification = () => {
    setIsRequested(true);
    setTimeLeft(180); // 3분
    // TODO: 실제 인증번호 요청 API 호출
  };

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // 이메일 인증 요청 함수
  const handleRequestAuthCode = async () => {
    const email = `${emailId}@${isCustomDomain ? customDomain : emailDomain}`;

    try {
      const response = await api.post('/api/users/auth-code', {
        email,
      });

      if (response.data.code === 20000) {
        alert('✅ 인증번호가 전송되었습니다!');
      } else {
        alert(`⚠️ 실패: ${response.data.message}`);
      }
    } catch (error: any) {
      alert(`❌ 에러 발생: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleGoback = () => {
    navigate('/login');
  };

  const handleJoinComplete = () => {
    navigate('/joinComplete');
  };

  return (
    <>
      <div className='w-full max-w-[393px] min-h-screen mx-auto px-4 py-6 flex flex-col gap-6'>
        <div className='relative flex items-center mb-[48px]'>
          <img
            src={left_chevron}
            alt='뒤로가기'
            className='absolute left-0 cursor-pointer'
            onClick={handleGoback}
          />
          <div className='mx-auto text-[20px] font-medium'>회원가입</div>
        </div>
        <div>
          <div className='flex flex-col mb-[18px]'>
            <div className='text-[16px] font-medium'>이름</div>
            <Input
              placeholder='이름을 입력하세요'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='mb-[24px]'>
            <div className='flex flex-col mb-[12px]'>
              <div className='text-[16px] font-medium mb-[8px]'>이메일</div>
              <div className='flex gap-2 items-center'>
                <FreeInput
                  placeholder='이메일'
                  maxWidth={174}
                  height={50}
                  fontSize={16}
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                ></FreeInput>
                <div>@</div>
                {isCustomDomain ? (
                  <FreeInput
                    placeholder='직접입력'
                    maxWidth={158}
                    height={50}
                    fontSize={16}
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                ) : (
                  <Dropdown
                    options={[
                      '직접입력',
                      'naver.com',
                      'gmail.com',
                      'daum.net',
                      'nate.com',
                    ]}
                    onSelect={handleDomainSelect}
                  />
                )}
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              {/* 인증번호 입력 + 타이머 */}
              <div className='relative w-[187px]'>
                <FreeInput
                  placeholder='인증번호 입력'
                  maxWidth={187}
                  height={50}
                  fontSize={16}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                {isRequested && timeLeft > 0 && (
                  <span
                    className={classNames(
                      'absolute top-1/2 right-3 -translate-y-1/2 text-[16px] text-gray-400 font-sans pointer-events-none',
                      { 'text-[#d32f2f]': timeLeft <= 60 }
                    )}
                  >
                    {formatTime(timeLeft)}
                  </span>
                )}
              </div>

              {/* 인증번호 요청 버튼 */}
              <FreeButton
                variant={isEmailFilled ? 'blue' : 'thickGray'}
                maxWidth={158}
                height={50}
                fontSize={16}
                onClick={() => {
                  handleRequestAuthCode();
                  handleRequestVerification();
                }}
              >
                {isRequested ? '인증번호 재요청' : '인증번호 요청'}
              </FreeButton>
            </div>
          </div>
          <div>
            <div className='text-[16px] font-medium mb-[8px]'>
              비밀번호를 입력해 주세요.
            </div>
            <Input
              placeholder='비밀번호를 입력하세요.'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='text-[12px] text-gray-6 mt-[2px]'>
              8~20자 영문, 숫자의 조합으로 입력해 주세요.
            </div>
          </div>
        </div>
        <div className='w-full mt-[229px]'>
          <CTAButton
            variant={isFormFilled ? 'blue' : 'thickGray'}
            onClick={handleJoinComplete}
          >
            회원가입 완료
          </CTAButton>
        </div>
      </div>
    </>
  );
};

export default Join;
