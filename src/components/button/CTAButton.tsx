import React from 'react';
import styles from './Button.module.css';
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
  return (
    <button
      className={classNames(styles.CTAsize, styles.button, styles[variant])}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
