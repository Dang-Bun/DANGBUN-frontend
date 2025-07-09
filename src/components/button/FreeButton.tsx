import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'thickGray' | 'gray';
  fontSize?: number; // px 단위
  height?: number; // px 단위
  maxWidth?: number; // px 단위
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'blue',
  fontSize,
  height,
  maxWidth,
  children,
  ...props
}) => {
  const inlineStyle: React.CSSProperties = {
    fontSize: fontSize ? `${fontSize}px` : undefined,
    height: height ? `${height}px` : undefined,
    maxWidth: maxWidth ? `${maxWidth}px` : undefined,
  };
  const base =
    'w-full rounded-[8px] px-[12px] py-[14px] cursor-pointer transition-[background] duration-300 box-border border-0';
  const variantClass = {
    blue: 'bg-[#4d83fd] text-[#fff] font-[Pretendard] font-medium leading-[140%]',
    thickGray: 'bg-[#bdbdbd] text-[#fff]',
    gray: 'bg-[#f6f6f6] text-[#8e8e8e] border-[1px] border-solid border-[#dedede]',
  }[variant];

  return (
    <button
      className={classNames(base, variantClass)}
      style={inlineStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
