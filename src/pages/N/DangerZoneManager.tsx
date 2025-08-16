import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePlaceApi } from '../../hooks/usePlaceApi';
import { useMemberApi } from '../../hooks/useMemberApi';

import CTAButton from '../../components/button/CTAButton';
import FreeButton from '../../components/button/FreeButton';
import PopUpCardDanger from '../../components/PopUp/PopUpCardDanger';

import left_chevron from '../../assets/chevron/left_chevronImg.svg';
import bottom_chevron from '../../assets/chevron/bottom_chevronImg.svg';
import top_chevron from '../../assets/chevron/top_chevron.svg';
import profile from '../../assets/setting/profile.svg';

type MemberItem = {
  memberId: number;
  role: '매니저' | '멤버';
  name: string;
  dutyName?: string[];
};

const DangerZoneManager = () => {
  const [isListCollapsed, setIsListCollapsed] = useState(true);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [dPlaceModalOpen1, setdPlaceModalOpen1] = React.useState(false);
  const [dPlaceModalOpen2, setdPlaceModalOpen2] = React.useState(false);
  const [dMemberModalOpen1, setdMemberModalOpen1] = React.useState(false);
  const [dMemberModalOpen2, setdMemberModalOpen2] = React.useState(false);
  const [placeName, setPlaceName] = useState('');

  const navigate = useNavigate();

  const [members, setMembers] = useState<MemberItem[]>([]);
  const [memberId, setMemberId] = useState(0);

  const placeId = Number(localStorage.getItem('placeId'));

  useEffect(() => {
    const fetchPlaceInfo = async () => {
      try {
        const res = await usePlaceApi.placeSearch(placeId);
        if (res.data.code === 20000) {
          setPlaceName(res.data.data.placeName); // API 응답 구조에 맞게 수정
        } else {
          console.warn(`⚠️ 플레이스 정보 불러오기 실패: ${res.data.message}`);
        }
      } catch (error: any) {
        console.error('❌ 플레이스 정보 API 호출 실패:', error);
      }
    };

    if (placeId) {
      fetchPlaceInfo();
    }
  }, [placeId]);

  useEffect(() => {
    if (!placeId) return;

    (async () => {
      try {
        const res = await useMemberApi.list(placeId);
        const apiMembers: MemberItem[] = res?.data?.data?.members ?? [];
        setMembers(apiMembers);
      } catch (err: any) {
        console.error('❌ 멤버 목록 불러오기 실패:', err);
        alert(
          err?.response?.data?.message ??
            err?.message ??
            '멤버 목록 불러오기 실패'
        );
      }
    })();
  }, [placeId]);

  const toggleList = () => {
    setIsListCollapsed(!isListCollapsed);
  };

  const saveInfo = (name: string, memberId: number) => {
    setSelectedMember(name);
    setMemberId(memberId);
    setdMemberModalOpen1(true);
  };

  const handleExpel = () => {
    (async () => {
      try {
        const res = await useMemberApi.expel(placeId, memberId);
        if (res.data.code === 20000) {
          setdMemberModalOpen1(false);
          setdMemberModalOpen2(true);
        } else {
          alert(`❌ 삭제 실패: ${res.data.message}`);
        }
      } catch (error: any) {
        alert(`⚠️ API 에러: ${error.response?.data?.message || error.message}`);
      }
    })();
  };

  return (
    <div className='mt-[68px]'>
      <div className='pl-[12px]'>
        <img
          src={left_chevron}
          alt='뒤로가기'
          onClick={() => navigate('/setting/manager')}
          className='cursor-pointer mb-[19px]'
        />
      </div>

      {/* 2. 헤더 + 목록 접기 버튼 */}
      <div className='flex justify-between items-center mb-[30px]'>
        <h2 className='text-[16px] font-normal pl-[20px]'>멤버 추방하기</h2>
        <div
          onClick={toggleList}
          className='flex flex-row gap-[12px] text-[16px] font-normal text-[#8e8e8e]'
        >
          {isListCollapsed ? '목록 열기' : '목록 접기'}
          <img
            src={isListCollapsed ? bottom_chevron : top_chevron}
            alt='화살표'
          />
        </div>
      </div>

      {/* 3. 멤버 목록 */}
      {!isListCollapsed && (
        <ul className='space-y-2'>
          {members
            .filter((m) => m.role !== '매니저') // 매니저 제외
            .map((member) => (
              <li
                key={member.memberId}
                className='flex justify-between items-center pb-[16px] pr-[12px]'
              >
                <div className='flex items-center gap-[20px] text-[16px] font-semibold pl-[30px]'>
                  <img src={profile} alt='프로필' />
                  <span>{member.name}</span>
                </div>
                <FreeButton
                  variant='red'
                  fontSize={14}
                  maxWidth={76}
                  height={40}
                  onClick={() => saveInfo(member.name, member.memberId)}
                >
                  추방
                </FreeButton>
              </li>
            ))}
        </ul>
      )}

      {/* 5. 구분선 */}
      <hr className='my-6 border-gray-300' />

      {/* 6. 플레이스 삭제 */}
      <div className='flex justify-center cursor-pointer'>
        <CTAButton variant='red' onClick={() => setdPlaceModalOpen1(true)}>
          플레이스 삭제
        </CTAButton>
      </div>

      {/* 플레이스 삭제 모달 */}
      <PopUpCardDanger
        isOpen={dPlaceModalOpen1}
        onRequestClose={() => setdPlaceModalOpen1(false)}
        title={
          <span className='font-normal'>
            정말 플레이스를 삭제 하시겠습니까?
          </span>
        }
        descript={`해당 플레이스의 모든 정보는 복구할 수 없습니다.\n삭제 신청 후 7일 뒤에 플레이스가 완전히 삭제되며,\n신청과 동시에 멤버 모두에게 알림이 전송됩니다.\n계속하시려면 “플레이스 이름”을 입력해주세요.`}
        input={true}
        placeholder='플레이스 이름 입력'
        first='취소'
        second='삭제'
        placeName={placeName}
        onFirstClick={() => setdPlaceModalOpen1(false)}
        onSecondClick={async () => {
          try {
            const res = await usePlaceApi.placeDelete(placeId, placeName || '');
            if (res.data.code === 20000) {
              setdPlaceModalOpen1(false);
              setdPlaceModalOpen2(true);
            } else {
              alert(`❌ 삭제 실패: ${res.data.message}`);
            }
          } catch (error: any) {
            alert(
              `⚠️ API 에러: ${error.response?.data?.message || error.message}`
            );
          }
        }}
      ></PopUpCardDanger>
      <PopUpCardDanger
        isOpen={dPlaceModalOpen2}
        onRequestClose={() => setdPlaceModalOpen2(false)}
        title={
          <span className='font-normal'>
            <span className='font-bold'>삭제</span>가 완료 되었습니다.
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        second='확인'
        onSecondClick={() => {
          navigate('/myPlace');
        }}
      ></PopUpCardDanger>

      {/* 맴버 추방 모달 */}
      <PopUpCardDanger
        isOpen={dMemberModalOpen1}
        onRequestClose={() => setdMemberModalOpen1(false)}
        title={
          <span className='font-normal'>
            해당 맴버를 <span className='font-bold'>추방</span>하시겠습니까?
          </span>
        }
        descript={`계속하시려면 “멤버 이름”을 입력해주세요.`}
        input={true}
        placeholder='맴버 이름 입력'
        first='취소'
        second='추방'
        memberName={selectedMember}
        onFirstClick={() => setdMemberModalOpen1(false)}
        onSecondClick={handleExpel}
      ></PopUpCardDanger>
      <PopUpCardDanger
        isOpen={dMemberModalOpen2}
        onRequestClose={() => setdMemberModalOpen2(false)}
        title={
          <span className='font-normal'>
            <span className='font-bold'>추방</span>이 완료 되었습니다.
          </span>
        }
        descript=''
        input={false}
        placeholder=''
        second='확인'
        onSecondClick={() => {
          setdMemberModalOpen2(false);
        }}
      ></PopUpCardDanger>
    </div>
  );
};

export default DangerZoneManager;
