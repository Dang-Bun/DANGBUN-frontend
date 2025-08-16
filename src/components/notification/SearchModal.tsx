import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import grayBar from '../../assets/grayBar.svg';
import SearchIcon from '../../assets/notificationIcon/SearchIcon.svg';
import MemberIcon from '../../assets/notificationIcon/MemberIcon.svg';
import useNotificationApi from '../../hooks/useNotificationApi';

export type SearchHandler = {
  show: () => void;
  hide: () => void;
};

type Person = { id: number; name: string };

type Props = {
  placeId: number;
  onSelectMember: (person: { id: number; name: string }) => void;
};

const SearchModal = forwardRef<SearchHandler, Props>(({ placeId, onSelectMember }, ref) => {
  const [visible, setVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      void loadRecents();
      if (searchTerm.trim()) void doSearch(searchTerm.trim());
      else setResults([]);
    },
    hide: () => setVisible(false),
  }));

  const loadRecents = async () => {
    try {
      const res = await useNotificationApi.recentRecipientSearches(placeId, { size: 10 });
      const arr = res?.data?.data ?? [];
      const names: string[] = Array.isArray(arr) ? arr.map((x: any) => String(x.query ?? x.name ?? x)) : [];
      setRecent(names);
    } catch {
      /* ignore */
    }
  };

  const doSearch = async (q: string) => {
    if (!q) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const res = await useNotificationApi.searchRecipients(placeId, { q, page: 0, size: 20 });
      const raw = res?.data?.data ?? [];
      const list: Person[] = Array.isArray(raw)
        ? raw.map((r: any) => ({ id: Number(r.id ?? r.memberId), name: String(r.name ?? r.memberName) }))
        : [];
      setResults(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const h = setTimeout(() => {
      if (visible) void doSearch(searchTerm.trim());
    }, 250);
    return () => clearTimeout(h);
  }, [visible, searchTerm]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="bg-white rounded-t-xl shadow-xl">
        {/* 회색바 클릭 시 닫힘 */}
        <button
          type="button"
          className="w-full flex justify-center pt-4 cursor-pointer"
          onClick={() => setVisible(false)}
        >
          <img src={grayBar} alt="닫기" className="w-[36px] h-[4px]" />
        </button>

        <div className="px-[18px] py-[20px] bg-white rounded-[24px] flex flex-col items-center justify-center">
          <div className="flex flex-col gap-[20px] p-[18px]">
            <div className="w-[353px] h-[36px] rounded-[8px] flex items-center bg-[#F9F9F9] px-[8px]">
              <img className="p-[10px]" src={SearchIcon} alt="검색 아이콘" />
              <input
                type="text"
                placeholder="검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void doSearch(searchTerm.trim());
                }}
                className="bg-transparent outline-none text-[#333] w-full"
              />
            </div>

            {recent.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold pb-[13px]">최근 검색</p>
                <div className="flex gap-[10px] flex-wrap">
                  {recent.map((label, idx) => (
                    <button
                      key={`${label}-${idx}`}
                      className="flex items-center bg-[#F6F6F6] px-3 py-1 rounded-full text-sm"
                      onClick={() => setSearchTerm(label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 w-full">
              <p className="text-sm font-semibold pb-[13px]">검색 결과</p>

              {loading && <p className="text-sm text-gray-500">불러오는 중…</p>}
              {!loading && results.length === 0 && searchTerm.trim() && (
                <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
              )}

              {results.map((member) => (
                <div key={member.id}>
                  <div className="w-[353px] h-[1px] bg-[#DEDEDE]" />
                  <button
                    className="w-full flex py-[15px] gap-[12px] cursor-pointer items-center text-left"
                    onClick={() => {
                      onSelectMember({ id: member.id, name: member.name });
                      setVisible(false);
                    }}
                  >
                    <img src={MemberIcon} alt="멤버 프로필" />
                    <p>{member.name}</p>
                  </button>
                </div>
              ))}
              <div className="w-[353px] h-[1px] bg-[#DEDEDE]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SearchModal.displayName = 'SearchModal';
export default SearchModal;
