import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import cameraGray from "../../assets/home/cameraGray.svg";
import cameraDefault from "../../assets/home/cameraBlue.svg";
import kebab from "../../assets/calendar/kebab.svg";

type Props = {
  title: string;
  dangbun: string;
  isChecked: boolean;
  isCamera?: boolean;
  completedAt?: string | number | Date | null;
  completedBy?: string;
  onMenuClick?: () => void;
  className?: string;
};

function safeParseDate(value?: string | number | Date | null): Date | null {
  if (!value && value !== 0) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;

     const iso = s.includes("T") ? s : s.replace(" ", "T");
    let d = new Date(iso);
    if (!isNaN(d.getTime())) return d;

     const m = s.match(
      /^(\d{4})[./-](\d{1,2})[./-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
    );
    if (m) {
      const [, Y, Mo, D, H = "0", Mi = "0", Se = "0"] = m;
      d = new Date(
        Number(Y),
        Number(Mo) - 1,
        Number(D),
        Number(H),
        Number(Mi),
        Number(Se)
      );
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
}

const CalendarTaskCard: React.FC<Props> = ({
  title,
  dangbun,
  isChecked,
  isCamera = false,
  completedAt,
  onMenuClick,
  className = "",
}) => {
  const [localStamp, setLocalStamp] = useState<Date | null>(null);

  useEffect(() => {
    if (isChecked) {
      if (!safeParseDate(completedAt) && !localStamp) {
        setLocalStamp(new Date());
      }
    } else {
      if (localStamp) setLocalStamp(null);
    }
  }, [isChecked, completedAt, localStamp]);

  const bg = isChecked ? "bg-[#DEDEDE]" : "bg-[#F9F9F9]";
  const bar = isChecked ? "bg-[#8E8E8E]" : "bg-[#E1E4EA]";
  const titleColor = isChecked ? "text-[#5A5D62]" : "text-[#111827]";
  const subColor = "text-[#8E8E8E]";

  const finalDate = isChecked ? safeParseDate(completedAt) ?? localStamp : null;
  const timeText = finalDate ? ` / ${dayjs(finalDate).format("H:mm")}` : "";

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
          </div>
        </div>

        <button
          type="button"
          onClick={onMenuClick}
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
