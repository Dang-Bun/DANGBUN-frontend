import React from 'react';
import { useState } from 'react';
import left_Chevron from '../../assets/chevron/left_chevronImg.svg';
import CTAButton from '../../components/button/CTAButton';
import SelectableRoleCard from './../../components/place/SelectableRollCard';
import type { RoleType } from '../../components/place/SelectableRollCard';
import { useNavigate } from 'react-router-dom';

const AddPlace = () => {
  const [selected, setSelected] = useState<'manager' | 'member' | null>(null);
  const navigate = useNavigate();

  return (
    <div>
      <div className='mt-[68px] pl-[12px]'>
        <img
          src={left_Chevron}
          alt='뒤로가기'
          onClick={() => navigate('/myPlace')}
        />
      </div>
      <div className='text-[20px] font-normal pl-[20px] mt-[13px] mb-[42px]'>
        어떤 목적으로 사용하시나요?
      </div>
      <div>
        <div>
          <div className='text-blue font-semibold text-center mb-[16px]'>
            “신규 플레이스를 만들고 관리하고 싶어요.”
          </div>
          <SelectableRoleCard
            role={'manager' as RoleType}
            selected={selected === 'manager'}
            onClick={() =>
              setSelected((prev) => (prev === 'manager' ? null : 'manager'))
            }
          />
        </div>
        <div className='mt-[53px]'>
          <div className='text-blue font-semibold text-center mb-[16px]'>
            “기존 플레이스에 참여할 거에요.”
          </div>
          <SelectableRoleCard
            role='member'
            selected={selected === 'member'}
            onClick={() =>
              setSelected((prev) => (prev === 'member' ? null : 'member'))
            }
          />
        </div>
      </div>
      <div className='flex justify-center mt-[50px]'>
        <CTAButton
          variant={selected ? 'blue' : 'thickGray'}
          onClick={
            selected === 'manager'
              ? () => navigate('/placemake1')
              : () => navigate('/PlaceJoin1')
          }
        >
          다음
        </CTAButton>
      </div>
    </div>
  );
};

export default AddPlace;
