import React from 'react';
import PopupCardDelete from './PopUpCardDelete';
import { useNavigate } from 'react-router-dom';
import { withdrawUser } from '../../apis/user';

const RequestPopUp = ({
  isWithdrawalOpen,
  closeWithdrawal,
  userEmail,
}: {
  isWithdrawalOpen: boolean;
  closeWithdrawal: () => void;
  userEmail: string;
}) => {
  const [isModalOpen2, setIsModalOpen2] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <PopupCardDelete
        isOpen={isWithdrawalOpen}
        onRequestClose={closeWithdrawal}
        title={
          <span className='font-normal'>
            정말 당번에서 <span className='font-bold'>탈퇴</span>
            하시나요?
          </span>
        }
        descript={`당번에서 사용하고 저장한 정보는\n탈퇴 후 복구되지 않습니다.\n계속해서 탈퇴를 진행하시려면\n“사용자 이메일”을 입력하세요.`}
        input={true}
        placeholder='이메일 입력'
        first='취소'
        second='탈퇴'
        userEmail={userEmail}
        onFirstClick={closeWithdrawal}
        onSecondClick={async (email) => {
          try {
            const response = await withdrawUser(email);

            if (response.data.code === 20000) {
              // 1. 토큰 삭제
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');

              // 2. 모달 전환
              closeWithdrawal();
              setIsModalOpen2(true);
              console.log(`탈퇴 성공!: $${response.data.message}`);
            } else {
              alert(`❗ 탈퇴 실패: ${response.data.message}`);
            }
          } catch (error: any) {
            alert(
              `❌ 탈퇴 요청 중 에러 발생: ${error.response?.data?.message || error.message}`
            );
          }
        }}
      />

      <PopupCardDelete
        isOpen={isModalOpen2}
        onRequestClose={() => setIsModalOpen2(false)}
        title={
          <span className='font-normal'>
            <span className='font-bold'>탈퇴</span>가 완료 되었습니다.
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        second='확인'
        onSecondClick={() => navigate('/login')}
      ></PopupCardDelete>
    </div>
  );
};

export default RequestPopUp;
