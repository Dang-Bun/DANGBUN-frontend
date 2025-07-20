import React from 'react';
import left_chevron from '../assets/chevron/left_chevronImg.svg';
import { useNavigate } from 'react-router-dom';
import Input from '../components/input/Input';
import FreeInput from '../components/input/FreeInput';
import CTAButton from '../components/button/CTAButton';
import FreeButton from '../components/button/FreeButton';
import Dropdown from '../components/input/Dropdown';

const Join = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='w-full max-w-[393px] min-h-screen mx-auto px-4 py-6 flex flex-col gap-6'>
        <div className='flex items-center gap-2'>
          <img src={left_chevron} alt='뒤로가기' />
          <div className='text-[20px] font-medium mx-auto'>회원가입</div>
        </div>
        <div>
          <div className='flex flex-col gap-2'>
            <div className='text-[16px] font-medium'>이름</div>
            <Input placeholder='이름을 입력하세요' />
          </div>
          <div>
            <div className='flex flex-col gap-2'>
              <div className='text-[16px] font-medium'>이메일</div>
              <div className='flex gap-2 items-center'>
                <FreeInput
                  placeholder='이메일'
                  maxWidth={174}
                  height={50}
                  fontSize={16}
                ></FreeInput>
                <div>@</div>
                <Dropdown
                  options={['naver.com', 'gmail.com', 'daum.net', 'nate.com']}
                  placeholder='직접 입력'
                  onSelect={(val) => console.log('선택한 값:', val)}
                />
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
                variant='thickGray'
                maxWidth={158}
                height={50}
                fontSize={16}
              >
                인증번호 요청
              </FreeButton>
            </div>
          </div>
          <div>
            <div className='text-[16px] font-medium'>
              비밀번호를 입력해 주세요.
            </div>
            <Input placeholder='비밀번호를 입력하세요.' />
            <div className='text-[12px] text-gray-6'>
              8~20자 영문, 숫자의 조합으로 입력해 주세요.
            </div>
          </div>
        </div>
        <div>
          <CTAButton variant='thickGray'>회원가입 완료</CTAButton>
        </div>
      </div>
    </>
  );
};

export default Join;
