import { useState } from 'react';

export const useJoinForm = () => {
  const [name, setName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');

  const selectedDomain = isCustomDomain ? customDomain : emailDomain;

  const isEmailFilled = !!(emailId && selectedDomain);
  const isFormFilled = !!(
    name &&
    emailId &&
    selectedDomain &&
    verificationCode &&
    password
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
    name,
    setName,
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
  };
};
