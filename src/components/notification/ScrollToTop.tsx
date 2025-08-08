import React from 'react';
import { useEffect, useState } from 'react';
import ToTop from '../../assets/notificationIcon/ToTop.svg'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div>
         {isVisible && (
        <button
          onClick={scrollToTop}
          className='w-[50px] h-[50px] rounded-full flex justify-center items-center bg-[#F9F9F9] fixed bottom-8 right-8 z-50'
        >
          <img className='w-[24px] h-[24px]'src={ToTop} alt="상단 이동 화살표" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
