import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mode = 'manager' | 'member';
export type DutyIconKey =
  | 'FLOOR_BLUE' | 'CLEANER_PINK' | 'BUCKET_PINK' | 'TOILET_PINK'
  | 'TRASH_BLUE' | 'DISH_BLUE' | 'BRUSH_PINK' | 'SPRAY_BLUE';

export interface Task {
  id: number;
  title: string;
  dueTime: string;
  members: string[];
  isCamera: boolean;
  isChecked: boolean;
  completedAt?: string;
  completedBy?: string;
}
export interface Duty {
  id: number;
  name: string;
  tasks: Task[];
}

type State = {
  role: Mode;
  placeId?: number;
  placeName: string;
  placeIconKey?: 'BUILDING' | 'CAFE' | 'CINEMA' | 'DORMITORY' | 'GYM' | 'HOME';
  currentUser: string;
  duties: Duty[];

  setRole: (role: Mode) => void;
  setPlace: (id: number | undefined, name: string) => void;
  setPlaceIconKey: (key?: State['placeIconKey']) => void;
  setUser: (name: string) => void;
  setDuties: (duties: Duty[]) => void;
  toggleTask: (taskId: number, by?: string) => void;
};

export const useDutyStore = create<State>()(
  persist(
    (set, get) => ({
      role: 'manager',
      placeId: undefined,
      placeName: '영화관',
      placeIconKey: 'CINEMA',
      currentUser: localStorage.getItem('userName') || 'userName',
      duties: [],

      setRole: (role) => set({ role }),
      setPlace: (id, name) => set({ placeId: id, placeName: name }),
      setPlaceIconKey: (key) => set({ placeIconKey: key }),
      setUser: (name) => set({ currentUser: name }),
      setDuties: (duties) => set({ duties }),

      toggleTask: (taskId, by) =>
        set((s) => ({
          duties: s.duties.map((d) => ({
            ...d,
            tasks: d.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    isChecked: !t.isChecked,
                    completedAt: !t.isChecked ? new Date().toTimeString().slice(0, 5) : undefined,
                    completedBy: !t.isChecked ? (by ?? s.currentUser) : undefined,
                  }
                : t
            ),
          })),
        })),
    }),
    { name: 'duty-store' }
  )
);

export const usePlacePercent = () =>
  useDutyStore((s) => {
    const all = s.duties.flatMap((d) => d.tasks);
    const total = all.length;
    const done = all.filter((t) => t.isChecked).length;
    return total ? Math.round((done / total) * 100) : 0;
  });

export const usePlaceIconKey = () => useDutyStore((s) => s.placeIconKey);
export const useRole = () => useDutyStore((s) => s.role);
