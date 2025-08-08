import React from 'react';
import PopupCard from './PopUpCard';
import { useNavigate } from 'react-router-dom';

const RequestPopUp = ({
  isWithdrawalOpen,
  closeWithdrawal,
}: {
  isWithdrawalOpen: boolean;
  closeWithdrawal: () => void;
}) => {
  const [isModalOpen2, setIsModalOpen2] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <PopupCard
        isOpen={isWithdrawalOpen}
        onRequestClose={closeWithdrawal}
        title={
          <>
            <h2 className='font-normal'>
              정말 당번에서 <span className='font-bold'>탈퇴</span>
              하시나요?
            </h2>
          </>
        }
        descript={`당번에서 사용하고 저장한 정보는\n탈퇴 후 복구되지 않습니다.\n계속해서 탈퇴를 진행하시려면\n“사용자 이메일”을 입력하세요.`}
        input={true}
        placeholder='이메일 입력'
        first='취소'
        second='탈퇴'
        onFirstClick={closeWithdrawal}
        onSecondClick={(email) => {
          // 여기서 탈퇴 처리 로직 넣어도 됨
          // 예: await api.withdraw(email);
          closeWithdrawal(); // 현재 모달 닫고
          setIsModalOpen2(true); // 완료 모달 열기
        }}
      />

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
        onSecondClick={() => navigate('/login')}
      ></PopupCard>
    </div>
  );
};

export default RequestPopUp;
