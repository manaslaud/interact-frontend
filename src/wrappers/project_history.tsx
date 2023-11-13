import { ProjectHistory } from '@/types';
import getDisplayTime from '@/utils/get_display_time';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  history: ProjectHistory;
}

const ProjectHistoryWrapper: React.FC<WrapperProps> = ({ children, history }) => {
  return (
    <div className="w-full flex items-center justify-between gap-4 p-3 dark:text-white hover:bg-primary_comp dark:hover:bg-[#ae8abd39] rounded-xl font-primary transition-ease-200">
      <div className="flex items-center gap-3">{children}</div>
      <div className="text-xxs">{getDisplayTime(history.createdAt, false)}</div>
    </div>
  );
};

export default ProjectHistoryWrapper;
