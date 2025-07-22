import React from 'react';
import GradRollCard from '../../components/place/GradRollCard';
import CTAButton from '../../components/button/CTAButton';
import PopupCard from '../../components/PopUp/PopUpCard';
import PopupCode from '../../components/PopUp/PopUpCode';

interface PlaceMake3Props {
  theme: string;
  name: string;
}

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

const PlaceMake3: React.FC<PlaceMake3Props> = ({ theme, name }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalOpenCopy, setIsModalOpenCopy] = React.useState(false);

  return (
    <div className='flex flex-col w-full h-screen items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-5'>
        <div className='flex flex-col items-center justify-center gap-3'>
          <div className='flex flex-row items-center justify-center gap-2'>
            <h1 className='bg-gradient-to-b from-[#fb66ff] to-[#5488fd] text-2xl font-semibold leading-loose text-transparent bg-clip-text'>
              {name}
            </h1>
            <h1 className='text-2xl font-semibold leading-loose'>생성 완료!</h1>
          </div>
          <p className='text-neutral-400 text-sm font-normal leading-tight'>
            초대링크를 생성하고, 함께할 멤버들에게 보내보아요!
          </p>
        </div>

        <div>
          <GradRollCard role={theme as RoleType} />
          <img />
        </div>
        <button
          className='w-40 h-9 bg-stone-50 rounded-2xl shadow-[0px_0px_8px_0px_rgba(0,0,0,0.05)] text-center text-neutral-400 text-base font-semibold leading-snug cursor-pointer'
          onClick={() => setIsModalOpen(true)}
        >
          참여코드 생성
        </button>
      </div>

      <PopupCode
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title={
          <>
            <h2 className='font-normal'>
              <span className='font-bold'>참여코드</span>가 생성되었습니다.
            </h2>
          </>
        }
        descript='참여코드를 통해 멤버들을 플레이스에 초대할 수 있어요.'
        input={true}
        first='복사하기'
        second='공유하기'
        onFirstClick={() => {
          navigator.clipboard.writeText('참여코드 내용'); // 참여코드 복사!
          setIsModalOpenCopy(true);
          setIsModalOpen(false);
          setTimeout(() => {
            setIsModalOpenCopy(false);
          }, 1500);
        }}
        onSecondClick={() => {
          if (navigator.share) {
            navigator
              .share({ title: '참여코드 공유', text: '참여코드 내용' })
              .then(() => setIsModalOpen(false))
              .catch(() => setIsModalOpen(false));
          } else {
            alert(
              '공유 기능을 지원하지 않는 브라우저입니다. 참여코드를 복사하여 공유해주세요.'
            );
            setIsModalOpen(false);
          }
        }}
        code='AQ3536'
      />
      <PopupCard
        isOpen={isModalOpenCopy}
        onRequestClose={() => setIsModalOpenCopy(false)}
        title={
          <>
            <h2 className='font-normal'>
              <span className='font-bold'>복사</span>가 완료 되었습니다.
            </h2>
          </>
        }
        descript=''
        input={false}
        placeholder=''
      />

      <CTAButton style={{ position: 'fixed', bottom: '42px' }}>
        플레이스로 이동
      </CTAButton>
    </div>
  );
};
export default PlaceMake3;
