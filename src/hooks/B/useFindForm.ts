import { useState } from 'react';

export const useFindForm = () => {
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');

  const selectedDomain = isCustomDomain ? customDomain : emailDomain;

  const isEmailFilled = !!(emailId && selectedDomain);
  // 내부에 추가
  const isValidPassword = (pw: string): boolean => {
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return pwRegex.test(pw);
  };

  const isPasswordValid = isValidPassword(password);

  const isFormFilled = !!(
    emailId &&
    selectedDomain &&
    verificationCode &&
    isPasswordValid
  );

  const handleDomainSelect = (value: string) => {
    if (value === '직접입력') {
      setIsCustomDomain(true);
      setEmailDomain('');
    } else {
      setIsCustomDomain(false);
      setEmailDomain(value);
    }
  };

  return {
    emailId,
    setEmailId,
    customDomain,
    setCustomDomain,
    emailDomain,
    setEmailDomain,
    isCustomDomain,
    handleDomainSelect,
    verificationCode,
    setVerificationCode,
    password,
    setPassword,
    isFormFilled,
    isEmailFilled,
    isPasswordValid,
  };
};
