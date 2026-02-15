import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import grayBar from '../../assets/grayBar.svg';
import SearchIcon from '../../assets/notificationIcon/SearchIcon.svg';
import MemberIcon from '../../assets/notificationIcon/MemberIcon.svg';
import useNotificationApi from '../../hooks/useNotificationApi';

export type SearchHandler = { show: () => void; hide: () => void };
type Person = { id: number; name: string };
type Props = { placeId: number; onSelectMember: (p: Person) => void };

const hasJamo = (s: string) =>
  /[\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/.test(s);

const SearchModal = forwardRef<SearchHandler, Props>(
  ({ placeId, onSelectMember }, ref) => {
    const [visible, setVisible] = useState(false);
    const [term, setTerm] = useState('');
    const [rows, setRows] = useState<Person[]>([]);
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const composing = useRef(false);

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
        setRows([]);
        setMsg(null);
      },
      hide: () => setVisible(false),
    }));

    const run = async (raw: string) => {
      const searchname = raw.normalize('NFC').trim();
      setMsg(null);
      if (!Number.isFinite(placeId)) {
        setMsg('오류');
        setRows([]);
        return;
      }

      // 빈 값일 때는 전체 멤버를 가져오기 위해 빈 문자열로 검색
      if (hasJamo(searchname)) {
        setRows([]);
        return;
      }

      console.log('🔍 [SearchModal] 검색 시작:', { placeId, searchname });

      try {
        setLoading(true);
        const res = await useNotificationApi.searchRecipients(placeId, {
          searchname,
          size: 20,
        });
        console.log('📥 [SearchModal] API 응답:', res);

        const responseData = res?.data?.data ?? res?.data ?? {};
        console.log('📊 [SearchModal] 파싱된 데이터:', responseData);

        // API 응답이 {members: Array, hasNext: boolean} 형태로 오는 경우 처리
        const membersArray = responseData?.members ?? responseData;
        console.log('👥 [SearchModal] 멤버 배열:', membersArray);

        const list: Person[] = Array.isArray(membersArray)
          ? membersArray
              .map((r: any) => ({
                id: Number(r.id ?? r.memberId),
                name: String(r.name ?? r.memberName ?? ''),
              }))
              .filter((p) => Number.isFinite(p.id) && p.name)
          : [];

        console.log('👥 [SearchModal] 멤버 목록:', list);
        setRows(list);
        if (list.length === 0) setMsg('검색 결과가 없습니다.');
      } catch (e: any) {
        console.error('❌ [SearchModal] 검색 실패:', e);
        console.error('🔍 [SearchModal] 오류 상세:', {
          status: e?.response?.status,
          data: e?.response?.data,
          message: e?.message,
        });

        const st = e?.response?.status;
        setRows([]);
        setMsg(st ? `검색 실패(${st})` : '검색 실패');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      const t = setTimeout(() => {
        if (visible && !composing.current) {
          void run(term);
        }
      }, 250);
      return () => clearTimeout(t);
    }, [visible, term]);

    if (!visible) return null;

    return (
      <div
        className='fixed inset-0 z-50 bg-black/30 flex items-end justify-center'
        onClick={() => setVisible(false)}
      >
        <div
          className='w-full max-w-[393px] bg-white rounded-t-xl shadow-xl'
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type='button'
            className='w-full flex justify-center pt-4'
            onClick={() => setVisible(false)}
          >
            <img src={grayBar} alt='닫기' className='w-[36px] h-[4px]' />
          </button>

          <div className='px-[18px] py-[20px] flex flex-col items-center'>
            <div className='w-[353px] h-[36px] rounded-[8px] flex items-center bg-[#F9F9F9] px-[8px]'>
              <img className='p-[10px]' src={SearchIcon} alt='검색' />
              <input
                type='text'
                placeholder='검색'
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !composing.current) void run(term);
                }}
                onCompositionStart={() => {
                  composing.current = true;
                }}
                onCompositionEnd={(e) => {
                  composing.current = false;
                  const v = (e.target as HTMLInputElement).value;
                  setTerm(v);
                  // 조합이 끝난 후 약간의 지연을 두고 검색 실행
                  setTimeout(() => void run(v), 100);
                }}
                className='bg-transparent outline-none text-[#333] w-full'
              />
            </div>

            <div className='mt-6 w-full'>
              {loading && <p className='text-sm text-gray-500'>불러오는 중…</p>}
              {!loading && msg && (
                <p className='text-sm text-gray-500'>{msg}</p>
              )}

              {rows.map((m) => (
                <div key={m.id}>
                  <div className='w-[353px] h-[1px] bg-[#DEDEDE]' />
                  <button
                    className='w-full flex py-[15px] gap-[12px] items-center text-left'
                    onClick={() => {
                      onSelectMember(m);
                      setVisible(false);
                    }}
                  >
                    <img src={MemberIcon} alt='멤버' />
                    <p>{m.name}</p>
                  </button>
                </div>
              ))}
              {rows.length > 0 && (
                <div className='w-[353px] h-[1px] bg-[#DEDEDE]' />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SearchModal.displayName = 'SearchModal';
export default SearchModal;
