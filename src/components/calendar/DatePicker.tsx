import React, { useEffect, useState } from "react";
import Picker from "react-mobile-picker";
import closeIcon from "../../assets/closeIcon.svg";

interface ISelections {
  year: number[];
  month: number[];
  [key: string]: number[];
}

interface DatePickerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApply?: (year: number, month: number) => void;
  initialYear?: number;
  initialMonth?: number;
}

export default function DatePicker({
  isOpen = true,
  onClose,
  onApply,
  initialYear,
  initialMonth,
}: DatePickerProps) {
  const [value, setValue] = useState({
    year: initialYear ?? new Date().getFullYear(),
    month: initialMonth ?? new Date().getMonth() + 1,
  });

  useEffect(() => {
    if (isOpen) {
      setValue({
        year: initialYear ?? new Date().getFullYear(),
        month: initialMonth ?? new Date().getMonth() + 1,
      });
    }
  }, [isOpen, initialYear, initialMonth]);

  const selections: ISelections = {
    year: Array.from({ length: 9 }, (_, i) => 2021 + i),
    month: Array.from({ length: 12 }, (_, i) => i + 1),
  };

  if (!isOpen) return null;

  return (
    <>
       <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[24px] shadow-[0_-8px_24px_rgba(0,0,0,0.15)]"
      >
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <p className="text-base font-medium text-gray-800">날짜 설정</p>
          <img src={closeIcon} alt="닫기" className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>

        <div className="px-5 pb-5">
          <Picker
            value={value}
            onChange={setValue}
            wheelMode="normal"
            className="custom-picker flex justify-between gap-2 pb-2"
          >
            {Object.keys(selections).map((key) => (
              <Picker.Column key={key} name={key}>
                {selections[key].map((option) => (
                  <Picker.Item key={option} value={option}>
                    {({ selected }) => (
                      <div
                        className={[
                          "text-center px-4 py-2 my-1 rounded-[8px] text-sm transition-colors",
                          selected ? "text-black font-semibold bg-[#F6F6F6]" : "font-normal text-[#797C82]",
                        ].join(" ")}
                        style={{ whiteSpace: "nowrap", display: "inline-block", lineHeight: "normal" }}
                      >
                        {key === "year" ? `${option}년` : `${String(option).padStart(2, "0")}월`}
                      </div>
                    )}
                  </Picker.Item>
                ))}
              </Picker.Column>
            ))}
          </Picker>

          <button
            className="w-full h-11 rounded-[12px] bg-blue-600 text-white font-semibold mt-2 mb-[calc(env(safe-area-inset-bottom,0))]"
            onClick={() => onApply?.(value.year, value.month)}
          >
            완료
          </button>
        </div>
      </div>
    </>
  );
}
