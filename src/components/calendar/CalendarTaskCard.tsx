import React from "react";
import dayjs from "dayjs";
import cameraGray from "../../assets/home/cameraGray.svg";
import cameraDefault from "../../assets/home/cameraBlue.svg";
import kebab from "../../assets/calendar/kebab.svg";

type Props = {
  title: string;
  dangbun: string;
  isChecked: boolean;
  isCamera?: boolean;
  completedAt?: string | Date | null;
  completedBy?: string | null;
  onMenuClick?: () => void;
  className?: string;
};

const CalendarTaskCard: React.FC<Props> = ({
  title,
  dangbun,
  isChecked,
  isCamera = false,
  completedAt,
  completedBy,
  onMenuClick,
  className = "",
}) => {
  const bg = isChecked ? "bg-[#DEDEDE]" : "bg-[#F9F9F9]";
  const bar = isChecked ? "bg-[#8E8E8E]" : "bg-[#E1E4EA]";
  const titleColor = isChecked ? "text-[#5A5D62]" : "text-[#111827]";
  const subColor = "text-[#8E8E8E]";

  const timeText = completedAt ? ` / ${dayjs(completedAt).format("H:mm")}` : "";

  return (
    <div
      className={`flex w-full min-h-[56px] rounded-[8px] overflow-hidden ${bg} ${className}`}
      role="group"
    >
      <div className={`w-[9px] ${bar}`} />

      <div className="flex-1 px-4 py-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className={`text-[14px] leading-5 ${titleColor} truncate`}>
              {title}
            </p>
            {isCamera && (
              <img
                src={isChecked ? cameraGray : cameraDefault}
                alt="카메라 필요"
                className="w-[14px] h-[14px] shrink-0"
              />
            )}
          </div>
          <div className={`text-[12px] leading-[18px] ${subColor}`}>
            {dangbun}
            {timeText}
            {completedBy && (
              <>
                <span className="mx-1">/</span>
                <span>{completedBy}</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.();
          }}
          className="p-2 -mr-1 rounded focus:outline-none hover:opacity-90"
          aria-label="작업 메뉴 열기"
        >
          <img src={kebab} alt="" className="w-[16px] h-[16px]" />
        </button>
      </div>
    </div>
  );
};

export default CalendarTaskCard;