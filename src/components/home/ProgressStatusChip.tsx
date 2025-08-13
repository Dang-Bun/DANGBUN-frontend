import React from 'react';
import clsx from 'clsx';

type Status = 'before' | 'in-progress' | 'done';

interface Props {
  percent: number;
  className?: string;
  size?: 'sm' | 'md';
  showPercentInProgress?: boolean;
}

const getStatus = (p: number): Status => (p <= 0 ? 'before' : p >= 100 ? 'done' : 'in-progress');

const ProgressStatusChip: React.FC<Props> = ({
  percent,
  className,
  size = 'md',
  showPercentInProgress = true,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const status = getStatus(clamped);

  const label =
    status === 'before'
      ? '진행 전'
      : status === 'done'
      ? '완료'
      : showPercentInProgress
      ? `진행 중 (${clamped}%)`
      : '진행 중';

  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 font-semibold select-none',
        size === 'sm' ? 'text-[12px]' : 'text-[14px]',
        {
          'bg-[#E5EAF3] text-[#6B7280]': status === 'before',
          'bg-[#4D83FD] text-white': status === 'in-progress',
          'bg-[#22C55E] text-white': status === 'done',
        },
        className
      )}
      aria-label={label}
      role="status"
    >
      {label}
    </div>
  );
};

export default ProgressStatusChip;
