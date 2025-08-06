import React from 'react';
import BottomBar from '../../components/BottomBar';
import PlaceName from '../../assets/setting/PlaceName.svg';

const Setting = () => {
  return (
    <div>
      <div>
        <img src={PlaceName} alt='플레이스 이름' />
        <div>설정</div>
      </div>
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div>
        <BottomBar />
      </div>
    </div>
  );
};

export default Setting;
