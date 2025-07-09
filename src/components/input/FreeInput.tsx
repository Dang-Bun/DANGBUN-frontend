import React from 'react';
import styles from './Input.module.css';

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

  return <input className={styles.input} style={inlineStyle} {...props} />;
};

export default Input;
