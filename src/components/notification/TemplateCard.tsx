import React from 'react'
import sweepImg_1 from '../../assets/cleanIcon/sweepImg_1.svg';
import newMemberImg from '../../assets/notificationIcon/newMemberImg.svg';
import speakerImg from '../../assets/notificationIcon/speakerImg.svg';

interface TemplateCardProps {
  type : 'clean' | 'newMember' | 'update'
  selected?: boolean;
  onClick? : () => void;
}

const typeToText : Record<TemplateCardProps['type'], string> = {
  clean : '미완료된 청소를 진행해주세요.',
  newMember : '새로운 멤버가 참여했어요.',
  update:'청소 목록 변동사항을 전달해주세요.',
};

const typeToImg : Record<TemplateCardProps['type'], string> = {
  clean : sweepImg_1,
  newMember : newMemberImg,
  update : speakerImg,
};

const TemplateCard = ({ type, selected = false, onClick }: TemplateCardProps) =>{
  
  const bgColor = 
    selected 
      ? 'bg-[#E0EAFF]' : 'bg-[#F9F9F9]';
  const text = typeToText[type];
  const icon = typeToImg[type];

  return (
    <div 
    onClick={onClick}
    className={`w-[353px] h-[56px] rounded-xl flex ${bgColor} flex px-[16px] items-center gap-[10px]`}>
      <img src={icon} alt="아이콘" className='w-[32px] h-[32px]'/>
      <p className='text-base'>{text}</p>
    </div>
  )
}

export default TemplateCard
