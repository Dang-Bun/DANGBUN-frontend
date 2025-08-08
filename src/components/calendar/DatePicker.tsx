import React, { useState } from "react";
import Picker from "react-mobile-picker";
import closeIcon from "../../assets/closeIcon.svg";

interface ISelections {
  year: number[];
  month: number[];
  [key: string]: number[];
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

export default function CustomDatePicker() {
  const [value, setValue] = useState({
    year: currentYear,
    month: currentMonth,
  });

  const [selections] = useState<ISelections>({
    year: Array.from({ length: 9 }, (_, i) => 2021 + i),
    month: Array.from({ length: 12 }, (_, i) => i + 1),
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-[393px] gap-[24px] rounded-[24px] shadow-md px-[20px] pt-[27px] pb-[72px] flex flex-col justify-start items-center relative bg-white">
        <div className="w-full flex justify-between items-center mb-4 px-[24px]">
          <p className="text-base font-medium text-gray-800">날짜 설정</p>
          <img src={closeIcon} alt="닫기 버튼" className="w-6 h-6 cursor-pointer" />
        </div>

        <Picker
          value={value}
          onChange={setValue}
          wheelMode="normal"
          className="custom-picker relative z-20 flex justify-between gap-2 pb-6"
        >
          {Object.keys(selections).map((key) => (
            <Picker.Column key={key} name={key}>
              {selections[key].map((option) => (
                <Picker.Item key={option} value={option}>
                  {({ selected }) => (
                    <div
                      className={`
                        text-center
                        px-4 py-2 my-1
                        rounded-[8px] text-sm
                        transition-colors duration-150
                        ${selected ? "text-black font-semibold bg-[#F6F6F6]" : "font-normal text-[#797C82]"}
                      `}
                      style={{
                        whiteSpace: "nowrap",
                        display: "inline-block",
                        lineHeight: "normal",
                      }}
                    >
                      {key === "year"
                        ? `${option}년`
                        : `${String(option).padStart(2, "0")}월`}
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          ))}
        </Picker>
      </div>
    </div>
  );
}
