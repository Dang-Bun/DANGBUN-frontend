import React from 'react';
import { useState } from 'react';
import CTAButton from './components/button/CTAButton';
import FreeButton from './components/button/FreeButton';
import Input from './components/input/Input';
import FreeInput from './components/input/FreeInput';
import PopUpButton from './components/button/PopUpButton';
import PopUpInput from './components/input/PopUpInput';
import SelectableRoleCard from './components/place/SelectableRollCard';

function App() {
  const [selected, setSelected] = useState<'manager' | 'member' | null>(null);

  return (
    <>
      <CTAButton>로그인</CTAButton>
      <FreeButton variant='blue' maxWidth={158} height={50} fontSize={16}>
        인증번호 재전송
      </FreeButton>
      <PopUpButton>네</PopUpButton>
      <Input placeholder='이메일을 입력하세요.' />
      <FreeInput placeholder='이메일' maxWidth={74} height={50} fontSize={16} />
      <PopUpInput placeholder='이메일 입력'></PopUpInput>
      <SelectableRoleCard
        role='manager'
        selected={selected === 'manager'}
        onClick={() =>
          setSelected((prev) => (prev === 'manager' ? null : 'manager'))
        }
      />
      <SelectableRoleCard
        role='member'
        selected={selected === 'member'}
        onClick={() =>
          setSelected((prev) => (prev === 'member' ? null : 'member'))
        }
      />
    </>
  );
}

export default App;
