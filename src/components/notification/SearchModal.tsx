import React, { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import grayBar from '../../assets/grayBar.svg';
import SearchIcon from '../../assets/notificationIcon/SearchIcon.svg';
import MemberIcon from '../../assets/notificationIcon/MemberIcon.svg';

export type SearchHandler = {
  show: () => void;
  hide: () => void;
};

type Props = {
  onSelectMember: (name: string) => void;
};

const SearchModal = forwardRef<SearchHandler, Props>(({ onSelectMember }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['백상희', '김도현', '최준서']);
  const members = ['백상희', '김도현', '최준서'];
  const filteredMembers = members.filter((member) =>
    member.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(-500);

  const startY = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      setPosition(0);
    },
    hide: () => setPosition(-500),
  }));

  const handleRemoveSearch = (index: number) => {
    const newSearches = [...recentSearches];
    newSearches.splice(index, 1);
    setRecentSearches(newSearches);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (startY.current !== null) {
      const dy = e.clientY - startY.current;
      setPosition(dy);
    }
  };

  const handleMouseUp = () => {
    startY.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-xl z-50 rounded-t-xl"
      style={{
        top: `${position}px`,
        transition: 'top 0.5s ease-in-out',
        display: visible ? 'block' : 'none',
      }}
    >
      <div
        className="w-full flex justify-center cursor-pointer pt-4"
        onMouseDown={handleMouseDown}
      >
        <img src={grayBar} alt="드래그바" className="w-[36px] h-[4px]" />
      </div>

      <div className="px-[18px] py-[20px] bg-white rounded-[24px] flex flex-col items-center justify-center">
        <div className="flex flex-col gap-[20px] p-[18px]">
          <div className="w-[353px] h-[36px] rounded-[8px] flex items-center bg-[#F9F9F9] px-[8px]">
            <img className="p-[10px]" src={SearchIcon} alt="검색 아이콘" />
            <input
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-[#333] w-full"
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold pb-[13px]">최근 검색</p>
            <div className="flex gap-[10px] flex-wrap">
              {recentSearches.map((label, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#F6F6F6] px-3 py-1 rounded-full text-sm"
                >
                  {label}
                  <button onClick={() => handleRemoveSearch(index)} className="ml-2">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold pb-[13px]">검색 결과</p>
            {filteredMembers.map((member, index) => (
              <div key={index}>
                <div className="w-[353px] h-[1px] bg-[#DEDEDE]"></div>
                <div
                  className="flex py-[15px] gap-[12px] cursor-pointer"
                  onClick={() => {
                    onSelectMember(member);
                    setVisible(false); // 선택 후 모달 닫기
                  }}
                >
                  <img src={MemberIcon} alt="멤버 프로필" />
                  <p>{member}</p>
                </div>
              </div>
            ))}
            <div className="w-[353px] h-[1px] bg-[#DEDEDE]"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

SearchModal.displayName = 'SearchModal';

export default SearchModal;
