import { useMemo } from 'react';

export type ProgressStatus = 'before' | 'in-progress' | 'done';
export type Mode = 'manager' | 'member';

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

export interface PageState {
  name: string;      
  percent: number; 
  status: ProgressStatus;
  total: number;
  done: number;
}

export interface UsePageProgressOpts {
  mode: Mode;                 
  currentUser?: string;       
  memberOverallUsesPlacePercent?: boolean;
}

const statusOf = (p: number): ProgressStatus =>
  p <= 0 ? 'before' : p >= 100 ? 'done' : 'in-progress';
 
export function usePagePRogress(
  activePage: number,
  duties: Duty[],
  {
    mode,
    currentUser,
    memberOverallUsesPlacePercent = true,
  }: UsePageProgressOpts
) {
  const placeAllTasks = useMemo(() => duties.flatMap(d => d.tasks), [duties]);

  const isMine = (t: Task) =>
    mode === 'manager'
      ? true
      : !!currentUser && (t.members.includes(currentUser) || t.members.includes('멤버 전체'));

  // 멤버는 내가 속한 당번만 노출, 매니저는 전부
  const scopedDuties = useMemo(() => {
    if (mode === 'manager') return duties;
    return duties.filter(d => d.tasks.some(isMine));
  }, [duties, mode, currentUser]);

  const totalPages = scopedDuties.length + 1;  
 
  const visibleTasks = useMemo(() => {
    if (activePage === 0) {
      const tasks = scopedDuties.flatMap(d => d.tasks);
      return mode === 'member' ? tasks.filter(isMine) : tasks;
    }
    const duty = scopedDuties[activePage - 1];
    return duty ? duty.tasks : [];
  }, [activePage, scopedDuties, mode, currentUser]);

  // 퍼센트 계산
  const percentBaseTasks = useMemo(() => {
    if (mode === 'member' && activePage === 0 && memberOverallUsesPlacePercent) {
      return placeAllTasks;  
    }
    if (activePage === 0) return scopedDuties.flatMap(d => d.tasks);  
    const duty = scopedDuties[activePage - 1];
    return duty ? duty.tasks : [];
  }, [mode, activePage, scopedDuties, placeAllTasks, memberOverallUsesPlacePercent]);

  const page: PageState = useMemo(() => {
    const total = percentBaseTasks.length || 0;
    const done = percentBaseTasks.filter(t => t.isChecked).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    const name = activePage === 0 ? '플레이스 전체' : (scopedDuties[activePage - 1]?.name ?? '');
    return { name, percent, status: statusOf(percent), total, done };
  }, [percentBaseTasks, activePage, scopedDuties]);

  const canToggle = (task: Task) => (mode === 'manager' ? true : isMine(task));

  return {
    visibleTasks,
    page,
    totalPages,
    placeAllTasks,
    canToggle,
    isMine,
  };
}
