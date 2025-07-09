import React from 'react';
import styles from './Input.module.css';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return <input className={styles.input} {...props} />;
};

export default Input;
