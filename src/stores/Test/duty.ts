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
  date: string; 
}

export interface Duty {
  id: number;
  name: string;
  iconKey: DutyIconKey;
  tasks: Task[];
}
