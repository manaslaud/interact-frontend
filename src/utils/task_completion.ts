import { Task } from '@/types';

const getCompletionPercentage = (task: Task) => {
  var percentage = 0;
  if (task.isCompleted) percentage = 100;
  else {
    percentage = 0;
  }
  return percentage;
};

export default getCompletionPercentage;
