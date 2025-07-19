import React from 'react';
import PopupCard from './PopUpCard';

const RequestPopUp = () => {
  const [isModalOpen1, setIsModalOpen1] = React.useState(false);
  const [isModalOpen2, setIsModalOpen2] = React.useState(false);
  const [isModalOpen3, setIsModalOpen3] = React.useState(false);
  const [isModalOpen4, setIsModalOpen4] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen1(true)}>열기1</button>
      <button onClick={() => setIsModalOpen2(true)}>열기2</button>
      <button onClick={() => setIsModalOpen3(true)}>열기3</button>
      <button onClick={() => setIsModalOpen4(true)}>열기4</button>

      <PopupCard
        isOpen={isModalOpen1}
        onRequestClose={() => setIsModalOpen1(false)}
        title={
          <>
            <h2 className='font-normal'>
              정말 당번에서 <span className='font-bold'>탈퇴</span>
              하시나요?
            </h2>
          </>
        }
        descript='당번에서 사용하고 저장한 정보는
탈퇴 후 복구되지 않습니다. 
계속해서 탈퇴를 진행하시려면 
“사용자 이메일”을 입력하세요.'
        input={true}
        placeholder='이메일 입력'
        first='취소'
        second='탈퇴'
      ></PopupCard>
      <PopupCard
        isOpen={isModalOpen2}
        onRequestClose={() => setIsModalOpen2(false)}
        title={
          <>
            <h2 className='font-normal'>
              <span className='font-bold'>탈퇴</span>가 완료 되었습니다.
            </h2>
          </>
        }
        descript=''
        input={false}
        placeholder=''
        second='확인'
      ></PopupCard>
      <PopupCard
        isOpen={isModalOpen3}
        onRequestClose={() => setIsModalOpen3(false)}
        title={
          <>
            <h2 className='font-normal'>
              정말 당번에서 <span className='font-bold'>로그아웃</span>
              하시나요?
            </h2>
          </>
        }
        descript=''
        input={false}
        placeholder=''
        first='아니오'
        second='네'
      ></PopupCard>
      <PopupCard
        isOpen={isModalOpen4}
        onRequestClose={() => setIsModalOpen4(false)}
        title={
          <>
            <h2 className='font-normal'>
              <span className='font-bold'>로그아웃</span>이 완료 되었습니다.
            </h2>
          </>
        }
        descript=''
        input={false}
        placeholder=''
      ></PopupCard>
    </div>
  );
};

export default RequestPopUp;
