/* 컴포넌트 구현 확인용 페이지 */

import React, { useState } from 'react';
import WritingChip from '../../components/notification/WritingChip';
import TemplateButton from '../../components/notification/TemplateButton';
import closeIcon from '../../assets/closeIcon.svg';
import RecentSearch from '../../components/notification/RecentSearch';
import MemberPopUp from '../../components/notification/MemberPopUp';
import TemplateCard from '../../components/notification/TemplateCard';
import NotificationTab from '../../components/notification/NotificationTab';
import NotificationCard from '../../components/notification/NotificationCard';

const Notification = () => {
  const [selectedTab, setSelectedTab] = useState<'transmit' | 'inbox'>('inbox');

  return (
    <div>
      <div>
        <div>
          <WritingChip label='멤버 1' type='member' selected />
          <WritingChip label='멤버 2' type='member' />
          <WritingChip label='당번 1' type='dangbun' selected />
          <WritingChip label='당번 2' type='dangbun' />
          <WritingChip label='준서가 당번!' type='dangbun' />
          <WritingChip label='상희가 당번!' type='dangbun' selected />
        </div>
        <WritingChip label='도현이가 당번!' type='dangbun' />
        <TemplateButton label='템플릿' selected />
        <TemplateButton label='직접 입력' selected />
        <TemplateButton label='템플릿' />
        <TemplateButton label='직접 입력' />
        <RecentSearch label='백상희' />
        <RecentSearch label='백상희' deleted />
      </div>
      <MemberPopUp></MemberPopUp>
      <TemplateCard type='clean'></TemplateCard>
      <TemplateCard type='newMember'></TemplateCard>
      <TemplateCard type='update'></TemplateCard>
      <TemplateCard type='clean' selected></TemplateCard>
      <TemplateCard type='newMember' selected></TemplateCard>
      <TemplateCard type='update' selected></TemplateCard>
      <img src={closeIcon} alt='닫기' />
      <NotificationTab
        selectedTab={selectedTab}
        onChange={(type) => setSelectedTab(type)}
      ></NotificationTab>
      <br />
      <NotificationCard
        type='member'
        read={false}
        title='미완료된 청소 빠르게 진행해주세요.'
        descript='날씨가 굉장히 덥고 중일 습도는 80%를 넘길 예정입니다. 비가 올 때는 창문을 닫고 빗물받이, 우산꽂이, 우산털이를 준비해줍니다...'
        timeAgo='1시간전'
      />
      <br></br>
      <NotificationCard
        type='member'
        read={true}
        title='미완료된 청소 빠르게 진행해주세요.'
        descript='날씨가 굉장히 덥고 중일 습도는 80%를 넘길 예정입니다. 비가 올 때는 창문을 닫고 빗물받이, 우산꽂이, 우산털이를 준비해줍니다...'
        timeAgo='1일 전'
      />
    </div>
  );
};
export default Notification;
