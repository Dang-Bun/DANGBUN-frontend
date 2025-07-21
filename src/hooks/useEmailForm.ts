// src/hooks/useEmailForm.ts
import { useState } from 'react';

export const useEmailForm = () => {
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);

  const handleDomainSelect = (domain: string) => {
    if (domain === '직접입력') {
      setIsCustomDomain(true);
      setEmailDomain('');
    } else {
      setIsCustomDomain(false);
      setEmailDomain(domain);
    }
  };

  const isEmailFilled =
    emailId.trim() &&
    (!isCustomDomain ? emailDomain.trim() : customDomain.trim());

  const getFullEmail = () => {
    const domain = isCustomDomain ? customDomain : emailDomain;
    return emailId && domain ? `${emailId}@${domain}` : '';
  };

  return {
    emailId,
    setEmailId,
    emailDomain,
    customDomain,
    setCustomDomain,
    isCustomDomain,
    handleDomainSelect,
    isEmailFilled,
    getFullEmail,
  };
};
