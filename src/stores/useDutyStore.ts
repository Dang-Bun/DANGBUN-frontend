import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Duty } from '../stores/Test/duty';

export type Mode = 'manager' | 'member';
export type PlaceIconKey =
  | 'BUILDING'
  | 'CAFE'
  | 'CINEMA'
  | 'DORMITORY'
  | 'GYM'
  | 'HOME';

type State = {
  role: Mode;
  placeId?: number;
  placeName: string;
  placeIconKey?: PlaceIconKey;
  currentUser: string;
  duties: Duty[];

  setRole: (role: Mode) => void;
  setPlace: (id: number | undefined, name: string) => void;
  setPlaceIconKey: (key?: PlaceIconKey) => void;
  setUser: (name: string) => void;
  setDuties: (duties: Duty[]) => void;

  seedIfEmpty: (seed: Duty[]) => void;
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

      seedIfEmpty: (seed) => {
        const s = get();
        if (!s.duties || s.duties.length === 0) set({ duties: seed });
      },

      toggleTask: (taskId, by) =>
        set((s) => ({
          duties: s.duties.map((d) => ({
            ...d,
            tasks: d.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    isChecked: !t.isChecked,
                    completedAt: !t.isChecked
                      ? new Date().toTimeString().slice(0, 5)
                      : undefined,
                    completedBy: !t.isChecked
                      ? (by ?? s.currentUser)
                      : undefined,
                  }
                : t
            ),
          })),
        })),
    }),
    { name: 'duty-store' }
  )
);

export const useRole = () => useDutyStore((s) => s.role);
export const usePlaceIconKey = () => useDutyStore((s) => s.placeIconKey);
export const useDuties = () => useDutyStore((s) => s.duties);
export const useCurrentUser = () => useDutyStore((s) => s.currentUser);

export const usePlacePercent = () =>
  useDutyStore((s) => {
    const all = s.duties.flatMap((d) => d.tasks);
    const total = all.length;
    const done = all.filter((t) => t.isChecked).length;
    return total ? Math.round((done / total) * 100) : 0;
  });
