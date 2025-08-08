import React from 'react';
import ReactDOM from 'react-dom';

interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast = ({ message, visible }: ToastProps) => {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 px-[12px] py-[20px] w-[276px] h-[45px]  bg-[#4B4B4B] text-[#F9F9F9] text-sm rounded-[16px] z-50 flex justify-center items-center">
      {message}
    </div>,
    document.body
  );
};

export default Toast;
