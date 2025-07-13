import React from 'react';
import { useState } from 'react';
import CTAButton from './components/button/CTAButton';
import FreeButton from './components/button/FreeButton';
import Input from './components/input/Input';
import FreeInput from './components/input/FreeInput';
import PopUpButton from './components/button/PopUpButton';
import PopUpInput from './components/input/PopUpInput';
import SelectableRoleCard from './components/place/SelectableRollCard';
import PlaceRollCard from './components/place/PlaceRollCard';

function App() {
  const [selected, setSelected] = useState<'manager' | 'member' | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<
    | 'cafe'
    | 'building'
    | 'cinema'
    | 'dormitory'
    | 'gym'
    | 'office'
    | 'restaurant'
    | 'school'
    | 'plus'
    | null
  >(null);

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
      <PlaceRollCard
        role='cinema'
        selected={selectedPlace === 'cinema'}
        onClick={() =>
          setSelectedPlace((prev) => (prev === 'cinema' ? null : 'cinema'))
        }
      />
      <PlaceRollCard
        role='cafe'
        selected={selectedPlace === 'cafe'}
        onClick={() =>
          setSelectedPlace((prev) => (prev === 'cafe' ? null : 'cafe'))
        }
      />
      <PlaceRollCard
        role='dormitory'
        selected={selectedPlace === 'dormitory'}
        onClick={() =>
          setSelectedPlace((prev) =>
            prev === 'dormitory' ? null : 'dormitory'
          )
        }
      />
      <PlaceRollCard
        role='plus'
        selected={selectedPlace === 'plus'}
        onClick={() =>
          setSelectedPlace((prev) => (prev === 'plus' ? null : 'plus'))
        }
      />
    </>
  );
}

export default App;
