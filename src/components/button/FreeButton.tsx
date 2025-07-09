import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'thickGray' | 'gray';
  fontSize?: number; // px 단위
  height?: number; // px 단위
  maxWidth?: number; // px 단위
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
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

  return (
    <button
      className={classNames(styles.button, styles[variant])}
      style={inlineStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
