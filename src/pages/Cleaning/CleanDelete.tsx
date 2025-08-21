import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import CTAButton from '../../components/button/CTAButton';
import PopUpCard from '../../components/PopUp/PopUpCard';

import useCleaningApi from '../../hooks/useCleaningApi';
import Header from '../../components/HeaderBar';

const CleanDelete = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { cleaningId, cleaningName, placeId } = location.state || {};

  const [isModalOpen4, setIsModalOpen4] = useState(false);

  const deleteHandle = () => {
    setIsModalOpen4(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await useCleaningApi.deleteCleaning(placeId, cleaningId);
      console.log(res.data);
      navigate('/cleanuplist', { state: { data: { placeId } } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='flex flex-col mt-[52px] px-5 gap-5'>
      <Header title='청소 삭제하기' showBackButton={true} />

      <div className='flex flex-col gap-3'>
        <p className='text-lg font-normal leading-relaxed'>청소 이름</p>
        <input
          type='text'
          placeholder='바닥 쓸기'
          className='h-14 px-3 py-3.5 w-[353px] bg-stone-50 rounded-lg justify-start items-center text-base font-normal'
          value={cleaningName || name || ''}
          onChange={(e) => setName(e.target.value)}
          disabled={true}
        ></input>
      </div>

      <PopUpCard
        isOpen={isModalOpen4}
        onRequestClose={() => setIsModalOpen4(false)}
        title={
          <>
            <p className='font-normal text-center'>
              정말 <span className='font-semibold'>"{cleaningName}"</span>{' '}
              청소를
              <br />
              <span className='text-blue-500'>삭제</span>할까요?
              <br />
            </p>
          </>
        }
        descript={''}
        input={false}
        placeholder=''
        first='아니오'
        second='네'
        onFirstClick={() => {
          setIsModalOpen4(false);
        }}
        onSecondClick={confirmDelete}
      />

      <CTAButton
        variant={'red'}
        style={{ marginBottom: '40px', cursor: 'pointer' }}
        onClick={deleteHandle}
      >
        삭제하기
      </CTAButton>
    </div>
  );
};

export default CleanDelete;
