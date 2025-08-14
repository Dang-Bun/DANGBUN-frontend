import type { Duty } from '../Test/duty'

const d1 = '2025-08-14';
const d2 = '2025-08-15';

export const initialDuties: Duty[] = [
  {
    id: 101,
    name: '로비 청소',
    iconKey: 'DISH_BLUE',
    tasks: [
      { id: 1,  title: '창문 닦기',      dueTime: '20:20', members: ['김효정','박한나','이민준','최유리'], isCamera: false, isChecked: false, date: d1 },
      { id: 2,  title: '바닥 닦기',      dueTime: '20:20', members: ['박한나'],                           isCamera: true,  isChecked: false, date: d1 },
      { id: 3,  title: '거미줄 제거',    dueTime: '21:00', members: ['김효정'],                           isCamera: false, isChecked: false, date: d2 },
      { id: 4,  title: '소파 청소',      dueTime: '21:00', members: ['이민준','최유리'],                 isCamera: true,  isChecked: false, date: d2 },
    ],
  },
  {
    id: 102,
    name: '탕비실 청소',
    iconKey: 'BUCKET_PINK',
    tasks: [
      { id: 5,  title: '싱크대 청소',    dueTime: '20:20', members: ['멤버 전체'],                       isCamera: false, isChecked: false, date: d2 },
      { id: 6,  title: '냉장고 정리',    dueTime: '20:20', members: ['박한나','김효정'],                 isCamera: false, isChecked: false, date: d1 },
      { id: 7,  title: '전자레인지 닦기', dueTime: '20:20', members: ['이민준'],                         isCamera: false, isChecked: false, date: d2 },
      { id: 8,  title: '바닥 쓸기',      dueTime: '20:20', members: ['최유리'],                           isCamera: false, isChecked: false, date: d2 },
    ],
  },
  {
    id: 103,
    name: '창고 정리',
    iconKey: 'BRUSH_PINK',
    tasks: [
      { id: 9,  title: '상품 박스 정리',  dueTime: '20:20', members: ['멤버 전체'],                      isCamera: false, isChecked: false, date: d1 },
      { id: 10, title: '재고 라벨링',    dueTime: '20:20', members: ['멤버 전체'],                       isCamera: false, isChecked: false, date: d1 },
      { id: 11, title: '바닥 쓸기',      dueTime: '20:20', members: ['이민준'],                          isCamera: false, isChecked: false, date: d2 },
      { id: 12, title: '폐기물 분리',    dueTime: '20:20', members: ['최유리'],                          isCamera: false, isChecked: false, date: d2 },
    ],
  },
];