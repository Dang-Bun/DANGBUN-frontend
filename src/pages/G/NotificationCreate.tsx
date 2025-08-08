import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../../components/notification/TemplateCard';
import TemplateButton from '../../components/notification/TemplateButton';
import Header from '../../components/HeaderBar';
import plusButton from '../../assets/notificationIcon/plusButton.svg';
import SearchModal from '../../components/notification/SearchModal';
import type { SearchHandler } from '../../components/notification/SearchModal';
import MemberPopUp from '../../components/notification/MemberPopUp';
import WritingChip from '../../components/notification/WritingChip';
import CTAButton from '../../components/button/CTAButton'
import Toast from '../../components/PopUp/TostPopUp';

const NotificationCreate = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<'template' | 'write'>('template');
  const [customContent, setCustomContent] = useState('');
  const [memberPopUp, setMemberPopUp] = useState(false);
  const [showDangbunList, setShowDangbunList] = useState(false);
  const [selectedDangbunId, setSelectedDangbunId] = useState<number | null>(null);
  const [selectedTemplateType, setSelectedTemplateType] = useState<'clean' | 'newMember' | 'update' | null>(null);
  const [dangbunSelections, setDangbunSelections] = useState<Record<number, string[]>>({});
  const [manualMembers, setManualMembers] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [dangbunMembers] = useState<Record<number, string[]>>({
    1: ['멤버A'],
    2: ['멤버1', '멤버2', '멤버3'],
    3: ['멤버X'],
    4: ['멤버Y', '멤버Z'],
    5: [],
  });

  const searchModalRef = useRef<SearchHandler>(null);

  const handleMemberSelect = (type: 'dangbun' | 'member') => {
    setMemberPopUp(false);
    if (type === 'member') {
      searchModalRef.current?.show();
    } else if (type === 'dangbun') {
      setShowDangbunList(true);
    }
  };

  const handleAddManualMember = (name: string) => {
    setManualMembers((prev) => (prev.includes(name) ? prev : [...prev, name]));
  };

  const ReadyToSubmit = (
    (Object.keys(dangbunSelections).length > 0 || manualMembers.length > 0) &&
    (
      (selectedCard === 'template' && selectedTemplateType !== null) ||
      (selectedCard === 'write' && customContent.trim() !== '')
    )
  );

  const handleTransmit=()=>{
    if(!ReadyToSubmit) return;
    setShowToast(true);

    setTimeout(() => {
        setShowToast(false);
        navigate('/alarm', { state: { tab: 'transmit' } });
      }, 1500); 
  }

  return (
    <div>
      <Header title="알림 작성" />
      <div className="px-[20px] pt-[68px]">
        {/*to*/}
       <div className="flex items-center gap-[8px]">
          <p className="text-base font-semibold">To:</p>

          <p className="text-sm font-medium">
            {[
              ...Object.entries(dangbunSelections).map(
                ([id, members]) => `당번 ${id} (${members.join(', ')})`
              ),
              ...manualMembers,
            ].join(', ')}
          </p>

          <div className="relative ml-2">
            <img
              src={plusButton}
              alt="멤버/당번 추가 버튼"
              onClick={() => setMemberPopUp(!memberPopUp)}
              className="w-[20px] h-[20px] cursor-pointer"
            />
            {memberPopUp && (
              <div className="absolute left-0 z-50">
                <MemberPopUp onSelect={handleMemberSelect} />
              </div>
            )}
          </div>
        </div>

        {showDangbunList && (
          <div className="overflow-x-auto whitespace-nowrap hide-scrollbar mt-3">
            {[1, 2, 3, 4, 5].map((id) => (
              <div
                key={id}
                onClick={() => {
                  const members = dangbunMembers[id] || [];
                  setDangbunSelections((prev) => ({ ...prev, [id]: members }));
                  setSelectedDangbunId(id);
                }}
                className="inline-block mr-2 cursor-pointer"
              >
                <WritingChip
                  label={`당번 ${id}`}
                  type="dangbun"
                  selected={selectedDangbunId === id}
                />
              </div>
            ))}
          </div>
        )}

        {selectedDangbunId && (
          <div className="flex flex-wrap gap-2 mt-3">
            {dangbunMembers[selectedDangbunId]?.map((memberName) => {
              const selected = dangbunSelections[selectedDangbunId]?.includes(memberName);
              return (
                <div
                  key={memberName}
                  className="cursor-pointer"
                  onClick={() => {
                    setDangbunSelections((prev) => {
                      const current = prev[selectedDangbunId] || [];
                      const updated = current.includes(memberName)
                        ? current.filter((name) => name !== memberName)
                        : [...current, memberName];

                      return {
                        ...prev,
                        [selectedDangbunId]: updated,
                      };
                    });
                  }}
                >
                  <WritingChip
                    label={memberName}
                    type="member"
                    selected={selected}
                  />
                </div>
              );
            })}
          </div>
        )}


        <div>
          <p className="text-base font-semibold py-[12px]">어떤 내용을 보내시나요?</p>
          <div className="flex gap-[8px]">
            <div onClick={() => setSelectedCard('template')}>
              <TemplateButton label="템플릿" selected={selectedCard === 'template'} />
            </div>
            <div onClick={() => setSelectedCard('write')}>
              <TemplateButton label="직접 입력" selected={selectedCard === 'write'} />
            </div>
          </div>

          {selectedCard === 'template' && (
            <div className="flex flex-col gap-[8px] mt-4">
              <TemplateCard type="clean" selected={selectedTemplateType === 'clean'} onClick={() => setSelectedTemplateType('clean')} />
              <TemplateCard type="newMember" selected={selectedTemplateType === 'newMember'} onClick={() => setSelectedTemplateType('newMember')} />
              <TemplateCard type="update" selected={selectedTemplateType === 'update'} onClick={() => setSelectedTemplateType('update')} />
            </div>
          )}

          {selectedCard === 'write' && (
            <div className="relative w-full mt-4">
              <textarea
                placeholder="알림 내용을 작성해주세요"
                className={`w-[353px] h-[325px] bg-[#F9F9F9] font-normal text-sm py-[24px] px-[21px] rounded-[16px] outline-none resize-none ${customContent.trim() === '' ? 'text-[#797C82]' : 'text-black'}`}
                rows={6}
                maxLength={1000}
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
              />
              <p className="text-sm text-right text-[#797C82] absolute bottom-[16px] right-[22px]">
                {customContent.length} / 1000
              </p>
            </div>
          )}
        </div>
              
        <CTAButton
          variant={ReadyToSubmit ? 'blue' : 'thickGray'}
          disabled={!ReadyToSubmit}
          style={{ position: 'fixed', bottom: '36px' }}
          onClick={handleTransmit}
        >
          전송
        </CTAButton>
        <SearchModal ref={searchModalRef} onSelectMember={handleAddManualMember} />
       <Toast message="알림이 성공적으로 전송되었습니다." visible={showToast} />
    </div>
  </div>
  );
};

export default NotificationCreate;