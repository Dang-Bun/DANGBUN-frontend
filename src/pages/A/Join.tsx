import React from 'react';
import { useEmailForm } from '../../hooks/useEmailForm';
import left_chevron from '../../assets/chevron/left_chevronImg.svg';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/input/Input';
import FreeInput from '../../components/input/FreeInput';
import CTAButton from '../../components/button/CTAButton';
import FreeButton from '../../components/button/FreeButton';
import Dropdown from '../../components/input/Dropdown';

const Join = () => {
  const navigate = useNavigate();
  const {
    emailId,
    setEmailId,
    isCustomDomain,
    handleDomainSelect,
    emailDomain,
    customDomain,
    setCustomDomain,
    isEmailFilled,
  } = useEmailForm();

  const handleGoback = () => {
    navigate('/login');
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
            <Input placeholder='이름을 입력하세요' />
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
              <FreeInput
                placeholder='인증번호 입력'
                maxWidth={187}
                height={50}
                fontSize={16}
              />
              <FreeButton
                variant={isEmailFilled ? 'blue' : 'thickGray'}
                maxWidth={158}
                height={50}
                fontSize={16}
              >
                인증번호 요청
              </FreeButton>
            </div>
          </div>
          <div>
            <div className='text-[16px] font-medium mb-[8px]'>
              비밀번호를 입력해 주세요.
            </div>
            <Input placeholder='비밀번호를 입력하세요.' type='password' />
            <div className='text-[12px] text-gray-6 mt-[2px]'>
              8~20자 영문, 숫자의 조합으로 입력해 주세요.
            </div>
          </div>
        </div>
        <div className='fixed bottom-0 w-full mb-[25px]'>
          <CTAButton variant='thickGray'>회원가입 완료</CTAButton>
        </div>
      </div>
    </>
  );
};

export default Join;
