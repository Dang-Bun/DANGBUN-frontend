import React from 'react';
import CTAButton from './components/button/CTAButton';
import FreeButton from './components/button/FreeButton';
import Input from './components/input/Input';
import FreeInput from './components/input/FreeInput';
import PopUpButton from './components/button/PopupButton';

function App() {
  return (
    <>
      <CTAButton>로그인</CTAButton>
      <FreeButton variant='blue' maxWidth={158} height={50} fontSize={16}>
        인증번호 재전송
      </FreeButton>
      <PopUpButton>네</PopUpButton>
      <Input placeholder='이메일을 입력하세요.' />
      <FreeInput
        placeholder='이메일'
        maxWidth={174}
        height={50}
        fontSize={16}
      />
    </>
  );
}

export default App;
