import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  const base =
    ' w-full max-w-[353px] h-[56px] px-[12px] py-[14px] rounded-[8px] border-0 bg-[#f9f9f9] text-[#8e8e8e] text-[16px] font-400 leading-[140%] box-border placeholder-[#999] focus:outline-none focus:bg-[#eee]';

  return <input className={base} {...props} />;
};

export default Input;
