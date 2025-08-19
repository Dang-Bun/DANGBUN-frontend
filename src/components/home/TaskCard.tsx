import React, { useMemo, useState } from 'react';
import cameraGray from '../../assets/home/cameraGray.svg';
import cameraDefault from '../../assets/home/cameraBlue.svg';
import checkDefault from '../../assets/home/checkDefault.svg';
import checkDone from '../../assets/home/checkDone.svg';
import checkDisabled from '../../assets/home/checkDisabled.svg';
import toggleUp from '../../assets/home/toggleUp.svg';
import toggleDown from '../../assets/home/toggleDown.svg';

interface TaskCardProps {
  title: string;
  dueTime?: string;        // API의 endTime을 그대로 받음 (옵션)
  members: string[];
  isChecked: boolean;
  isCamera: boolean;
  memberCount?: number;
  onToggle: () => void;
  completedAt?: string;    // API의 completeTime을 그대로 받음 (옵션)
  completedBy?: string;    // (선택) 있으면 표시하지 않고 보관만
  disabled?: boolean;
  onCameraClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  dueTime,
  members,
  isChecked,
  isCamera,
  onToggle,
  completedAt,
  // completedBy는 표시하지 않음 (API가 시간만 주므로 디자인 상 숨김)
  completedBy,
  disabled = false,
  onCameraClick,
  memberCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cleanedMembers = useMemo(
    () => (members || []).map((m) => (m || '').trim()).filter(Boolean),
    [members]
  );
  const isAllMembers = useMemo(
    () => cleanedMembers.some((m) => m === '멤버 전체'),
    [cleanedMembers]
  );
  const sortedMembers = useMemo(
    () => cleanedMembers.filter((m) => m !== '멤버 전체').sort((a, b) => a.localeCompare(b, 'ko-KR')),
    [cleanedMembers]
  );
  const showExpandButton = !isAllMembers && sortedMembers.length >= 2;

  const handleCheck = () => onToggle();
  const handleToggle = () => setIsExpanded((prev) => !prev);

  const effectiveMemberCount = useMemo(
    () => (typeof memberCount === 'number' ? memberCount : sortedMembers.length),
    [memberCount, sortedMembers.length]
  );
  const memberLabel = isAllMembers ? '멤버 전체' : `멤버 ${effectiveMemberCount}명`;
  const memberSummary = () => {
    if (isAllMembers) return '';
    if (sortedMembers.length === 0) return '';
    if (isExpanded) return sortedMembers.join(', ');
    if (sortedMembers.length === 1) return sortedMembers[0];
    return `${sortedMembers[0]}, ${sortedMembers[1]} 등`;
  };

  const calculateRemainingTime = () => {
    if (!dueTime) return ''; // endTime이 없으면 표시 생략
    const now = new Date();
    const [dh, dm] = dueTime.split(':').map((n) => parseInt(n, 10));
    if (Number.isNaN(dh) || Number.isNaN(dm)) return '';
    const cur = now.getHours() * 60 + now.getMinutes();
    const due = dh * 60 + dm;
    const diff = due - cur;
    const hours = Math.floor(diff / 60);
    const mins = Math.abs(diff % 60);
    // 과거 시간이면 "지남" 표기 (선택)
    if (diff < 0) return `${Math.abs(hours)}시간 ${mins}분 지났습니다`;
    if (hours === 0) return `${mins}분 남았습니다`;
    return `${hours}시간 ${mins}분 남았습니다`;
  };

  //  완료면 API의 completeTime 그대로, 아니면 endTime 기준 남은 시간
  const rightTopText = isChecked && completedAt ? completedAt : calculateRemainingTime();

  const isCheckboxDisabled = disabled && !isChecked;
  const checkboxIcon = isCheckboxDisabled ? checkDisabled : isChecked ? checkDone : checkDefault;

  return (
    <div
      className={`flex rounded-[8px] w-[353px] min-h-[73px] transition-colors ${
        isChecked ? 'bg-[#F1F3F6]' : 'bg-[#F9F9F9]'
      }`}
    >
      <div className={`w-[9px] h-auto rounded-l-[8px] ${isChecked ? 'bg-[#8E8E8E]' : 'bg-[#E1E4EA]'}`} />
      <div className="flex justify-between w-full p-3">
        <div className="flex">
          <img
            src={checkboxIcon}
            alt={isChecked ? '체크 완료' : isCheckboxDisabled ? '체크 비활성화' : '체크박스'}
            className="w-5 h-5 mr-3 mt-1 cursor-pointer"
            onClick={isCheckboxDisabled ? undefined : handleCheck}
            aria-disabled={isCheckboxDisabled}
            role="button"
          />
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className={`text-[16px] ${isChecked ? 'text-[#5A5D62]' : 'text-[#111827]'}`}>{title}</p>
              {isCamera && (
                <button
                  type="button"
                  onClick={onCameraClick}
                  className="w-[14px] h-[14px] shrink-0 cursor-pointer"
                  aria-label="사진 업로드"
                >
                  <img src={isChecked ? cameraGray : cameraDefault} alt="카메라" className="w-[14px] h-[14px]" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <div
                className={`inline-block whitespace-nowrap rounded-[300px] px-[7px] py-[2px] text-[11px] ${
                  isChecked ? 'bg-white text-[#8E8E8E]' : 'bg-[#EBFFF6] text-[#00DD7C]'
                }`}
              >
                {memberLabel}
              </div>
              {!isAllMembers && (
                <p className="text-[12px] leading-[18px] break-words text-[#8E8E8E]">{memberSummary()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between items-end">
          {/*  완료시 completeTime, 미완료시 endTime 남은시간 */}
          <div className="text-[12px] whitespace-nowrap text-[#8E8E8E]">{rightTopText}</div>
          {showExpandButton ? (
            <button className="w-5 h-5 mt-2" onClick={handleToggle} aria-label="멤버 전체 보기">
              <img src={isExpanded ? toggleUp : toggleDown} alt="토글 버튼" />
            </button>
          ) : (
            <div className="w-5 h-5 mt-2" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
