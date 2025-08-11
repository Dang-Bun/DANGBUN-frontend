import React, { useState } from 'react';
import cameraGray from '../../assets/home/cameraGray.svg';
import cameraDefault from '../../assets/home/cameraBlue.svg';
import checkDefault from '../../assets/home/checkDefault.svg';
import checkDone from '../../assets/home/checkDone.svg';
import toggleUp from '../../assets/home/toggleUp.svg';
import toggleDown from '../../assets/home/toggleDown.svg';

interface TaskCardProps {
  title: string;
  dueTime: string;
  members: string[];
  isChecked: boolean;
  isCamera: boolean;
  onToggle: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  dueTime,
  members,
  isChecked,
  isCamera,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkedTime, setCheckedTime] = useState<string | null>(null);

  const handleCheck = () => {
    onToggle();
    if (!isChecked) {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      setCheckedTime(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
    } else {
      setCheckedTime(null); 
    }
  };

  const handleToggle = () => setIsExpanded((prev) => !prev);

  const memberSummary = () => {
    if (isExpanded) return members.join(', ');
    if (members.length <= 2) return members.join(', ');
    return `${members.slice(0, 2).join(', ')} 등`;
  };

  const calculateRemainingTime = () => {
    const currentTime = new Date();
    const dueTimeParts = dueTime.split(':');
    const dueHours = parseInt(dueTimeParts[0], 10);
    const dueMinutes = parseInt(dueTimeParts[1], 10);

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const dueMinutesTotal = dueHours * 60 + dueMinutes;

    const remainingMinutes = dueMinutesTotal - currentMinutes;
    const hoursRemaining = Math.floor(remainingMinutes / 60);

    return `${hoursRemaining}시간 남았습니다`;
  };

  return (
    <div
      className={`flex rounded-[8px] w-[353px] min-h-[73px] transition-colors ${
        isChecked ? 'bg-[#F1F3F6]' : 'bg-[#F9F9F9]'
      }`}
    >
      <div
        className={`w-[9px] h-auto rounded-l-[8px] ${isChecked ? 'bg-[#8E8E8E]' : 'bg-[#E1E4EA]'}`}
      />
      <div className="flex justify-between w-full p-3">
        <div className="flex">
          <img
            src={isChecked ? checkDone : checkDefault}
            alt="체크박스"
            className="w-5 h-5 mr-3 mt-1 cursor-pointer"
            onClick={handleCheck}
          />
          <div>
            <div className="flex items-center gap-1 mb-1">
              <p className={`text-[16px] ${isChecked ? 'text-[#5A5D62]' : 'text-[#111827]'}`}>
                {title}
              </p>
              {isCamera && (
                <img
                  src={isChecked ? cameraGray : cameraDefault}
                  alt="카메라"
                  className="w-[14px] h-[14px]"
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`inline-block whitespace-nowrap rounded-[300px] px-[7px] py-[2px] text-[11px] ${
                  isChecked ? 'bg-white text-[#8E8E8E]' : 'bg-[#EBFFF6] text-[#00DD7C]'
                }`}
              >
                멤버 {members.length}명
              </div>
              <p
                className={`text-[12px] leading-[18px] break-words ${
                  isChecked ? 'text-[#8E8E8E]' : 'text-[#8E8E8E]'
                }`}
              >
                {memberSummary()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div
            className={`text-[12px] whitespace-nowrap ${
              isChecked ? 'text-[#8E8E8E]' : 'text-[#8E8E8E]'
            }`}
          >
            {checkedTime ? checkedTime : calculateRemainingTime()}
          </div>
          <button className="w-5 h-5 mt-2" onClick={handleToggle}>
            <img src={isExpanded ? toggleUp : toggleDown} alt="토글 버튼" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
