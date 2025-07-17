import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import CTAButton from '../components/button/CTAButton';

import onBoarding1 from '../assets/onBoarding/onBoardingImg_1.svg';
import onBoarding2 from '../assets/onBoarding/onBoardingImg_2.svg';
import onBoarding3 from '../assets/onBoarding/onBoardingImg_3.svg';
import onBoarding4 from '../assets/onBoarding/onBoardingImg_4.svg';
import onBoarding5 from '../assets/onBoarding/onBoardingImg_5.svg';

const onboardingData = [
  { img: onBoarding1 },
  { img: onBoarding2 },
  { img: onBoarding3 },
  { img: onBoarding4 },
  { img: onBoarding5 },
];

const Z_OnBoarding = () => {
  const navigate = useNavigate();
  const paginationRef = useRef<HTMLDivElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate('/login');
  };

  useEffect(() => {
    if (
      swiperInstance &&
      paginationRef.current &&
      typeof swiperInstance.params.pagination === 'object'
    ) {
      swiperInstance.params.pagination.el = paginationRef.current;
      swiperInstance.pagination.init();
      swiperInstance.pagination.update();
    }
  }, [swiperInstance]);

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10'>
      {/* 슬라이드 */}
      <Swiper
        modules={[Pagination, Autoplay]}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        speed={500}
        className='w-full max-w-md'
      >
        {onboardingData.map((item, index) => (
          <SwiperSlide key={index}>
            <img
              src={item.img}
              alt={`onboarding-${index}`}
              className='w-full max-w-[392px] h-[610px] object-cover mx-auto overflow-hidden'
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ 여기! 이미지와 버튼 사이에 고정된 dot */}
      <div
        ref={paginationRef}
        className='swiper-pagination mt-1 mb-1 flex justify-center gap-2 !static'
      />

      {/* 버튼 */}
      <CTAButton onClick={handleSkip}>
        {currentIndex === onboardingData.length - 1
          ? '당번 시작하기'
          : '건너뛰기'}
      </CTAButton>
    </div>
  );
};

export default Z_OnBoarding;
