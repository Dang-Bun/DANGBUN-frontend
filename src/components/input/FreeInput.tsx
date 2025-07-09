import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fontSize?: number; // px 단위
  height?: number; // px 단위
  maxWidth?: number; // px 단위
}

const Input: React.FC<InputProps> = ({
  fontSize,
  height,
  maxWidth,
  ...props
}) => {
  const inlineStyle: React.CSSProperties = {
    fontSize: fontSize ? `${fontSize}px` : undefined,
    height: height ? `${height}px` : undefined,
    maxWidth: maxWidth ? `${maxWidth}px` : undefined,
  };
  const base =
    ' w-full max-w-[353px] h-[56px] px-[12px] py-[14px] rounded-[8px] border-0 bg-[#f9f9f9] text-[#8e8e8e] text-[16px] font-400 leading-[140%] box-border placeholder-[#999] focus:outline-none focus:bg-[#eee]';

  return <input className={base} style={inlineStyle} {...props} />;
};

export default Input;
