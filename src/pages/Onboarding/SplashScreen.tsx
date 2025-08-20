import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import splashImg from '../../assets/Icon.svg';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className='w-full h-full min-h-screen bg-[#4D83FD] flex justify-center items-center flex-col'>
      <img
        src={splashImg}
        alt='splash'
        className='w-[118.11px] h-[118.11px] object-contain'
      />
      <p className='text-[40px] text-[#FFFFFF] leading-tight'>당번</p>
    </div>
  );
};

export default SplashScreen;
