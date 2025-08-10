import React from 'react';
import CTAButton from '../../components/button/CTAButton';
import PlaceRollCard from '../../components/place/PlaceRollCard';
import { useNavigate } from 'react-router-dom';

const PlaceMake1 = () => {
  const navigate = useNavigate();
  const [plusRole, setPlusRole] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [text, setText] = React.useState('');

  const handleNext = () => {
    if (selectedRole && text) {
      navigate('/placemake2', {
        state: {
          placeName: text,
          role: selectedRole,
        },
      });
    }
  };

  return (
    <div className='w-[393px] h-[853px] flex flex-col items-center justify-center'>
      <div className='flex flex-col gap-[35px] mb-5'>
        <div className='flex flex-col items-start gap-4'>
          <h1 className='w-[353px] text-xl font-normal leading-7'>
            관리할 플레이스의 이름을 입력해주세요.
          </h1>
          <input
            type='text'
            placeholder='플레이스 이름 입력'
            className=' h-14 w-[353px] px-3 py-3.5 rounded-lg bg-neutral-100 text-black text-base font-normal'
            value={text}
            maxLength={20}
            onChange={(e) => setText(e.target.value)}
          ></input>
        </div>
        <div className='flex flex-col gap-1.5'>
          <h1 className='w-[353px] text-xl font-normal leading-7'>
            플레이스의 유형을 선택해주세요.
          </h1>
          <h2 className='text-neutral-400 text-xs font-normal'>
            *1가지 선택 가능
          </h2>
        </div>
      </div>
      <div className='grid grid-cols-3 grid-rows-3 gap-5 '>
        <PlaceRollCard
          role='CAFE'
          selected={selectedRole === 'CAFE'}
          onClick={() => setSelectedRole('CAFE')}
        />
        <PlaceRollCard
          role='RESTAURANT'
          selected={selectedRole === 'RESTAURANT'}
          onClick={() => setSelectedRole('RESTAURANT')}
        />
        <PlaceRollCard
          role='THEATER'
          selected={selectedRole === 'THEATER'}
          onClick={() => setSelectedRole('THEATER')}
        />
        <PlaceRollCard
          role='DORMITORY'
          selected={selectedRole === 'DORMITORY'}
          onClick={() => setSelectedRole('DORMITORY')}
        />
        <PlaceRollCard
          role='BUILDING'
          selected={selectedRole === 'BUILDING'}
          onClick={() => setSelectedRole('BUILDING')}
        />
        <PlaceRollCard
          role='OFFICE'
          selected={selectedRole === 'OFFICE'}
          onClick={() => setSelectedRole('OFFICE')}
        />
        <PlaceRollCard
          role='SCHOOL'
          selected={selectedRole === 'SCHOOL'}
          onClick={() => setSelectedRole('SCHOOL')}
        />
        <PlaceRollCard
          role='GYM'
          selected={selectedRole === 'GYM'}
          onClick={() => setSelectedRole('GYM')}
        />
        <PlaceRollCard
          role='ETC'
          selected={selectedRole === 'ETC'}
          onClick={() => setSelectedRole('ETC')}
          setPlusRole={setPlusRole}
        />
      </div>
      <CTAButton
        variant={
          (selectedRole !== 'ETC' && text) ||
          (selectedRole === 'ETC' && plusRole !== '' && text)
            ? 'blue'
            : 'thickGray'
        }
        onClick={handleNext}
      >
        다음
      </CTAButton>
    </div>
  );
};

export default PlaceMake1;
