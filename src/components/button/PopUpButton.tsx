import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'thickGray' | 'gray';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'blue',
  children,
  ...props
}) => {
  const base =
    'w-full rounded-[8px] px-[12px] py-[10px] cursor-pointer transition-[background] duration-300 box-border border-0';

  const sizeClass = 'max-w-[126px] h-[36px] text-[12px] font-[400]';

  const variantClass = {
    blue: 'bg-[#4d83fd] text-[#fff] font-[Pretendard] font-medium leading-[140%]',
    thickGray: 'bg-[#bdbdbd] text-[#fff]',
    gray: 'bg-[#f6f6f6] text-[#8e8e8e] border-[1px] border-solid border-[#dedede]',
  }[variant];

  return (
    <button className={classNames(base, sizeClass, variantClass)} {...props}>
      {children}
    </button>
  );
};

export default Button;
