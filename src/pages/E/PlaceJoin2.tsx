import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GradRollCard from '../../components/place/GradRollCard';
import CTAButton from '../../components/button/CTAButton';
import PopupCard from '../../components/PopUp/PopUpCard';

type RoleType =
  | 'cafe'
  | 'building'
  | 'cinema'
  | 'dormitory'
  | 'gym'
  | 'office'
  | 'restaurant'
  | 'school'
  | 'plus';

const PlaceJoin2 = () => {
  const location = useLocation();
  const { code } = location.state || {};
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalOpenCopy, setIsModalOpenCopy] = React.useState(false);

  const handleNext = () => {
    navigate('/B001', {
      //B001로 이동.
      state: {
        //code: code,
      },
    });
  };

  return (
    <div className='flex flex-col mx-auto items-center justify-center'>
      <div className='flex flex-col w-full h-[693px]  items-center justify-center gap-5'>
        <div className='flex flex-col items-center justify-center gap-3'>
          <div className='flex flex-row items-center justify-center gap-2'>
            <h1 className='bg-gradient-to-b from-[#fb66ff] to-[#5488fd] text-2xl font-semibold leading-loose text-transparent bg-clip-text'>
              {/* {placeName} */}
              메가박스
            </h1>
            <h1 className='text-2xl font-semibold leading-loose'>
              {' '}
              참여 신청 완료!
            </h1>
          </div>
        </div>

        <div>
          <GradRollCard role={/*role as RoleType*/ 'cinema' as RoleType} />
          <img />
        </div>

        <p className='text-neutral-400 text-sm font-normal leading-tight items-center text-center'>
          매니저님께서 사용자님의 참여 신청을 수락하면 <br /> 플레이스에 정식
          참여할거에요.
        </p>
      </div>

      <PopupCard
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title={
          <>
            <h2 className='font-normal text-center'>
              정말
              <span className='font-bold'>asdfas</span>참여를 <br />
              <span className='text-blue-500 text-base font-semibold leading-snug'>
                취소
              </span>
              할까요?
            </h2>
          </>
        }
        descript='입력한 정보는 저장되지 않습니다.'
        input={false}
        first='아니오'
        second='네'
        onFirstClick={() => {
          setIsModalOpen(false);
          handleNext();
        }}
        onSecondClick={() => {
          setIsModalOpen(false);
          setIsModalOpenCopy(true);
        }}
      />
      <PopupCard
        isOpen={isModalOpenCopy}
        onRequestClose={() => setIsModalOpenCopy(false)}
        title={
          <>
            <h2 className='font-normal text-center'>
              <span className='font-bold'>&quot{}&quot</span>
              <br /> 참여취소가 완료 되었습니다.
            </h2>
          </>
        }
        descript=''
        input={false}
        placeholder=''
        second='확인'
        onSecondClick={handleNext}
      />

      <CTAButton style={{ position: 'fixed', bottom: '103px' }}>완료</CTAButton>
      <CTAButton
        style={{ position: 'fixed', bottom: '39px' }}
        variant='thickGray'
        disabled={false}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        참여 취소
      </CTAButton>
    </div>
  );
};
export default PlaceJoin2;
