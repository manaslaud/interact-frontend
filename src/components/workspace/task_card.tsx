import { Task } from '@/types';
import Users from '@phosphor-icons/react/dist/icons/Users';
import moment from 'moment';
import React from 'react';

interface Props {
  task: Task;
  clickedTask?: Task;
  setClickedOnTask?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedTask?: React.Dispatch<React.SetStateAction<Task>>;
}

const TaskCard = ({ task, clickedTask, setClickedOnTask, setClickedTask }: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedTask) setClickedTask(task);
        if (setClickedOnTask) setClickedOnTask(true);
      }}
      className={`w-full ${
        task.id == clickedTask?.id ? 'bg-white' : 'hover:bg-gray-100'
      } flex flex-col gap-2 rounded-lg p-4 border-gray-800 border-dotted border-2 cursor-pointer transition-ease-300`}
    >
      <div className="w-full flex justify-between items-center">
        <div className="font-semibold text-xl">{task.title}</div>
        <div className="flex items-center gap-2">
          <Users size={32} weight="duotone" />
          <div>{task.users.length}</div>
        </div>
      </div>

      <div className="text-sm text-gray-600">{task.description}</div>
      <div className="flex gap-2 text-sm">
        <div>Deadline: </div>
        <div> {moment(task.deadline).format('DD-MMM-YY')}</div>
      </div>
    </div>
  );
};

export default TaskCard;
