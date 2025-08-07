import React, { useState } from 'react';
import grayBar from '../../assets/grayBar.svg';
import RecentSearch from './RecentSearch';
import SearchIcon from '../../assets/notificationIcon/SearchIcon.svg';
import MemberIcon from '../../assets/notificationIcon/MemberIcon.svg';

const SearchModal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState(['백상희', '김도현', '최준서']);

  // 멤버 리스트
  const members = ['백상희', '김도현', '최준서'];
  const filteredMembers = members.filter((member) =>
    member.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 최근 검색어 추가 (중복 제거 + 최대 6개 유지)
  const handleAddSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((v) => v !== trimmed)];
      return updated.slice(0, 6); 
    });

    setSearchTerm('');
  };

  // 삭제
  const handleDeleteSearch = (labelToRemove: string) => {
    setRecentSearches((prev) => prev.filter((label) => label !== labelToRemove));
  };

  // 검색어 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSearch();
    }
  };

  return (
    <div className='px-[18px] py-[20px] bg-white rounded-[24px] flex flex-col items-center justify-center'>
      <img src={grayBar} alt="바" />
      <div className='flex flex-col gap-[20px] p-[18px]'>

        {/* 검색창 */}
        <div className='w-[353px] h-[36px] rounded-[8px] flex items-center bg-[#F9F9F9] px-[8px]'>
          <img className='p-[10px]' src={SearchIcon} alt="검색 아이콘" />
          <input
            type='text'
            placeholder='검색'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className='bg-transparent outline-none text-[#333] w-full'
          />
        </div>

        {/* 최근 검색 */}
        <div>
          <p className='pb-[13px] px-[5px]'>최근 검색</p>
          <div className='flex gap-[10px] flex-wrap'>
            {recentSearches.map((label, index) => (
              <RecentSearch
                key={index}
                label={label}
                onDelete={() => handleDeleteSearch(label)}
              />
            ))}
          </div>

          {/* 멤버 리스트 */}
          <div className='mt-[21px]'>
            {filteredMembers.map((member, index) => (
              <div key={index}>
                <div className='w-[353px] h-[1px] bg-[#DEDEDE]'></div>
                <div className='flex py-[15px] gap-[12px]'>
                  <img src={MemberIcon} alt="멤버 프로필" />
                  <p>{member}</p>
                </div>
              </div>
            ))}
            <div className='w-[353px] h-[1px] bg-[#DEDEDE]'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
