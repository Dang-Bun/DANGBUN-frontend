import React from 'react';
import { useState, useEffect } from 'react';
import BottomBar from '../../components/BottomBar';
import PlaceName from '../../assets/setting/PlaceName.svg';
import Manager from '../../assets/placeIcon/managerImg.svg';
import Member from '../../assets/placeIcon/memberImg.svg';
import white_right_chevron from '../../assets/chevron/white_right_chevron.svg';
import blue_right_chevron from '../../assets/chevron/blue_right_chevron.svg';
import Sweep from '../../assets/cleanIcon/sweepImg_2.svg';
import NameTag from '../../assets/setting/NameTag.svg';
import Cinema from '../../assets/placeIcon/cinemaImg.svg';
import send_notification from '../../assets/setting/send_notifivation.svg';
import danger_zone from '../../assets/setting/danger_zone.svg';
import { useNavigate } from 'react-router-dom';
import { useMemberApi } from '../../hooks/useMemberApi';
import { usePlaceApi } from '../../hooks/usePlaceApi';

type MemberInfoResp = {
  member: {
    name: string;
    role: '매니저' | '멤버'; // ← 서버에서 한글로 옴
    information?: Record<string, any>; // {"이메일": "...", "전화번호": "..."}
  };
  duties: { dutyId: number; dutyName: string }[];
};

const SettingManager = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [memberId, setMemberId] = useState('');
  const placeId = Number(localStorage.getItem('placeId'));

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<MemberInfoResp | null>(null);
  const [selectedDutyNames, setSelectedDutyNames] = useState<
    Array<string | null>
  >([]);

  //맴버 정보 불러오기
  useEffect(() => {
    if (!placeId) return;

    (async () => {
      try {
        const res = await useMemberApi.me(placeId); // ✅ API 호출
        // 응답 구조에 따라 name 키가 다를 수 있으니 안전하게 파싱
        const payload = res?.data?.data;
        const Id = payload?.memberId ?? '';
        const memberName =
          payload?.name ?? payload?.memberName ?? payload?.userName ?? '';

        setMemberId(Id);
        setName(memberName); // ✅ 문자열로 세팅
        // console.log('내 멤버 정보:', payload);
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    })();
  }, [placeId]);

  //플레이스 이름 불러오기
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

  //당번 정보 불러오기
  useEffect(() => {
    if (!placeId || !memberId) return;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await useMemberApi.get(placeId, memberId);
        const body: MemberInfoResp = res?.data?.data;
        setData(body ?? null);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message ?? e?.message ?? '멤버 정보 불러오기 실패'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [placeId, memberId]);
  useEffect(() => {
    if (!data) return;
    const Name = (data.duties ?? []).map((d) => d.dutyName);
    // 최소 1행은 보이도록
    setSelectedDutyNames(Name.length ? Name : [null]);
  }, [data]);

  return (
    <div className='flex flex-col justify-between pt-3 px-4'>
      {/* 상단 */}
      <div>
        {/* 플레이스 이름 & 설정 */}
        <div className='relative flex items-center mb-4'>
          <div
            className='flex flex-row bg-[#6982bc] rounded-[8px] py-[7px] px-[13px]'
            onClick={() => {
              navigate('/myPlace');
            }}
          >
            <img src={PlaceName} alt='플레이스 이름' />
            <span className='text-white text-[12px] font-normal pl-2'>
              {placeName}
            </span>
          </div>
          <div className='absolute left-[47%] mx-auto text-[20px] font-400'>
            설정
          </div>
        </div>

        {/* 유저 정보 카드 */}
        <div className='bg-[#81a9ff] rounded-xl p-4 mb-6'>
          <div
            className='flex items-center mb-4'
            onClick={() =>
              navigate('/managerInfomember', {
                state: {
                  memberId: memberId,
                },
              })
            }
          >
            <div className='text-[14px] font-medium text-white'>
              {name} 님의 정보
            </div>
            <img src={white_right_chevron} alt='>' /> {/* 우측 화살표 */}
          </div>
          <div className='flex flex-col items-center'>
            <div className='relative w-[100px] h-[100px] flex items-center justify-center'>
              <div className='absolute inset-0 bg-[#e0eaff66] rounded-full z-0' />
              <img
                src={Manager}
                alt='프로필 이미지'
                className='mb-2 w-[52px] h-[62.03px] z-10'
              />
            </div>
            <div className='text-[12px] text-[#4d83fd] font-semibold bg-white px-3 py-1 rounded-full mb-2'>
              매니저
            </div>
            <button className='w-[287px] bg-[#4d83fd] text-white rounded-[8px] mt-[16px] px-6 py-2 text-sm flex items-center justify-center gap-4'>
              <span className='text-[12px]'>당번</span>
              <div className='w-px h-4 bg-white' />
              <span className='text-[12px]'>{selectedDutyNames[0]}</span>
            </button>
          </div>
        </div>
        <div className='bg-white rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm h-[103px]'>
          {/* 당번 관리 */}
          <div
            className='flex flex-col items-center flex-1 cursor-pointer'
            onClick={() => navigate('/management/manager')}
          >
            <img src={NameTag} alt='당번 관리' />
            <div className='text-sm mt-1'>당번 관리</div>
          </div>

          {/* 구분선 */}
          <div className='w-px h-[40px] bg-[#D9E4FF] mx-2' />

          {/* 청소 관리 */}
          <div
            className='flex flex-col items-center flex-1 cursor-pointer'
            onClick={() =>
              navigate('/cleanuplist', { state: { data: { placeId } } })
            }
          >
            <img src={Sweep} alt='청소 관리' className='w-[24px] h-[32.39px]' />
            <div className='text-sm mt-1'>청소 관리</div>
          </div>

          {/* 구분선 */}
          <div className='w-px h-[40px] bg-[#D9E4FF] mx-2' />

          {/* 멤버 목록 */}
          <div
            className='flex flex-col items-center flex-1 cursor-pointer'
            onClick={() => navigate('/memberlist')}
          >
            <img
              src={Member}
              alt='멤버 목록'
              className='w-[32.29px] h-[28px]'
            />
            <div className='text-sm mt-1'>멤버 목록</div>
          </div>
        </div>

        {/* 하단 메뉴들 */}
        <div className='flex flex-col gap-[12px]'>
          <div
            className='bg-white rounded-xl p-4 flex justify-between items-center shadow-sm h-[56px] cursor-pointer'
            onClick={() => navigate('/placedetailed')}
          >
            <div className='flex items-center gap-3'>
              <div className='relative w-[34px] h-[34px] flex items-center justify-center'>
                <div className='absolute inset-0 bg-[#D4E0FD] rounded-full z-0' />
                <img
                  src={Cinema}
                  alt='플레이스 세부 설정'
                  className='w-[15.24px] h-[16.59px] z-10'
                />
              </div>
              <span className='text-sm'>플레이스 세부 설정</span>
            </div>
            <img src={blue_right_chevron} alt='>' />
          </div>

          <div
            className='bg-white rounded-xl p-4 flex justify-between items-center shadow-sm h-[56px] cursor-pointer'
            onClick={() => navigate(`/${placeId}/alarm/create`)}
          >
            <div className='flex items-center gap-3'>
              <div className='relative w-[34px] h-[34px] flex items-center justify-center'>
                <div className='absolute inset-0 bg-[#D4E0FD] rounded-full z-0' />
                <img
                  src={send_notification}
                  alt='알림 보내기'
                  className='z-10'
                />
              </div>
              <span className='text-sm'>알림 보내기</span>
            </div>
            <img src={blue_right_chevron} alt='>' />
          </div>
          <div
            className='bg-white rounded-xl p-4 flex justify-between items-center shadow-sm h-[56px] cursor-pointer'
            onClick={() => navigate('/dangerzone/manager')}
          >
            <div className='flex items-center gap-3'>
              <div className='relative w-[34px] h-[34px] flex items-center justify-center'>
                <div className='absolute inset-0 bg-[#D4E0FD] rounded-full z-0' />
                <img src={danger_zone} alt='danger zone' className='z-10' />
              </div>
              <span className='text-sm'>Danger zone</span>
            </div>
            <img src={blue_right_chevron} alt='>' />
          </div>
        </div>
      </div>

      {/* 바텀바 */}
      <div className='w-full'>
        <BottomBar />
      </div>
    </div>
  );
};

export default SettingManager;
