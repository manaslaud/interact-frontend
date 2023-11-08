import { Project, Task } from '@/types';
import React, { useState } from 'react';
import { APPLICATION_RESUME_URL, APPLICATION_URL, TASK_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Image from 'next/image';
import getIcon from '@/utils/get_icon';
import Link from 'next/link';
import { ArrowArcLeft, CalendarX, CheckSquare, Gear, ListChecks, Trash } from '@phosphor-icons/react';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import router from 'next/router';
import getDomainName from '@/utils/get_domain_name';
import socketService from '@/config/ws';
import { SERVER_ERROR } from '@/config/errors';
import moment from 'moment';
import EditTask from './edit_task';
import deleteHandler from '@/handlers/delete_handler';
import ConfirmDelete from '@/components/common/confirm_delete';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import patchHandler from '@/handlers/patch_handler';

interface Props {
  task: Task;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  setFilteredTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  project: Project;
}

const TaskView = ({ task, setShow, setTasks, setFilteredTasks, project }: Props) => {
  const [clickedOnEditTask, setClickedOnEditTask] = useState(false);
  const [clickedOnDeleteTask, setClickedOnDeleteTask] = useState(false);

  const getUserRole = (userID: string) => {
    var role = '';
    if (project.userID == userID) role = 'Owner';
    else
      project.memberships.forEach(m => {
        if (m.userID == userID) role = m.role;
      });
    return role;
  };

  const user = useSelector(userSelector);

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting the task...');

    const URL = `${TASK_URL}/${task.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setTasks) setTasks(prev => prev.filter(t => t.id != task.id));
      if (setFilteredTasks) setFilteredTasks(prev => prev.filter(t => t.id != task.id));
      setShow(false);
      Toaster.stopLoad(toaster, 'Task Deleted', 1);
    } else {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  const isAssignedUser = (userID: string) => {
    var check = false;
    task.users.forEach(user => {
      if (user.id == userID) {
        check = true;
        return;
      }
    });
    return check;
  };

  const toggleComplete = async () => {
    const toaster = Toaster.startLoad(task.isCompleted ? 'Marking Incomplete' : 'Marking Completed');

    const URL = `${TASK_URL}/completed/${task.id}`;

    const res = await patchHandler(URL, { isCompleted: !task.isCompleted });

    if (res.statusCode === 200) {
      if (setTasks)
        setTasks(prev =>
          prev.map(t => {
            if (t.id == task.id) return { ...t, isCompleted: !task.isCompleted };
            else return t;
          })
        );
      if (setFilteredTasks)
        setFilteredTasks(prev =>
          prev.map(t => {
            if (t.id == task.id) return { ...t, isCompleted: !task.isCompleted };
            else return t;
          })
        );
      setShow(false);
      Toaster.stopLoad(toaster, task.isCompleted ? 'Task Marked Incomplete' : 'Task Completed', 1);
    } else {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  return (
    <>
      {clickedOnEditTask ? (
        <EditTask
          project={project}
          task={task}
          setShow={setClickedOnEditTask}
          setTasks={setTasks}
          setFilteredTasks={setFilteredTasks}
        />
      ) : (
        <></>
      )}
      {clickedOnDeleteTask ? <ConfirmDelete setShow={setClickedOnDeleteTask} handleDelete={handleDelete} /> : <></>}
      {task.isCompleted ? (
        <div className="absolute flex gap-1 items-center px-2 py-1 rounded-xl text-xs bg-[#bffbbe] max-md:fixed top-[168px] max-md:top-navbar right-14 max-md:right-0 z-[11]">
          Task Completed
          <CheckSquare weight="bold" size={16} />
        </div>
      ) : moment(task.deadline).isBefore(moment()) ? (
        <div className="absolute flex gap-1 items-center px-2 py-1 rounded-xl text-xs bg-[#fbbebe] max-md:fixed top-[168px] max-md:top-navbar right-14 max-md:right-0 z-[11]">
          Deadline Passed
          <CalendarX weight="bold" size={16} />
        </div>
      ) : (
        <></>
      )}

      <div className="sticky bg-white max-md:fixed top-[158px] max-md:top-navbar max-md:right-0 w-[640px] max-md:w-full max-h-[80vh] max-md:max-h-screen max-md:h-base max-md:z-50 max-md:backdrop-blur-2xl max-md:backdrop-brightness-90 overflow-y-auto flex flex-col gap-8 p-8 pt-4 font-primary dark:text-white border-[1px] max-md:border-0 border-primary_btn  dark:border-dark_primary_btn rounded-lg max-md:rounded-none max-md:animate-fade_third z-10">
        <div className="w-full flex flex-col gap-2 max-md:gap-8">
          <ArrowArcLeft
            className="cursor-pointer"
            size={24}
            onClick={() => {
              setShow(false);
            }}
          />
          <div className="w-full flex justify-between items-center">
            <div className="text-4xl font-semibold">{task.title}</div>
            {project.userID == user.id || user.managerProjects.includes(project.id) ? (
              <div className="flex gap-2">
                <Gear onClick={() => setClickedOnEditTask(true)} className="cursor-pointer" size={32} />
                <Trash onClick={() => setClickedOnDeleteTask(true)} className="cursor-pointer" size={32} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="text-lg">{task.description}</div>
          <div className="w-full flex flex-wrap gap-2">
            {task.tags.map(tag => {
              return (
                <div key={tag} className="text-xs border-black border-[1px] px-2 py-1 rounded-lg">
                  {tag}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div>Deadline:</div>
          <div className="font-semibold">{moment(task.deadline).format('DD-MMM-YY')}</div>
          <div className="text-xs">({moment(task.deadline).fromNow()})</div>
        </div>
        {task.users.length > 0 ? (
          <div className="w-full flex flex-col gap-2">
            <div className="text-xl font-medium">Assigned To</div>
            <div className="w-full flex flex-wrap justify-between gap-2">
              {task.users.map(user => {
                return (
                  <div key={user.id} className="w-1/2 flex gap-4 border-[1px] border-gray-900 rounded-lg p-2">
                    <Image
                      crossOrigin="anonymous"
                      width={10000}
                      height={10000}
                      alt={'User Pic'}
                      src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                      className={'rounded-full w-16 h-16'}
                    />
                    <div className="grow">
                      <div className="text-xl font-medium">{user.name}</div>
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-gray-600">@{user.username}</div>
                        <div className="text-sm font-medium">{getUserRole(user.id)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {project.userID == user.id || user.managerProjects.includes(project.id) ? (
              <div
                onClick={() => setClickedOnEditTask(true)}
                className="w-full text-base bg-gray-100 rounded-xl p-4 hover:scale-105 cursor-pointer transition-ease-300"
              >
                <span className="text-xl max-md:text-lg text-gradient font-semibold">Your task is lonely! </span> and
                looking for a buddy. Don&apos;t leave it hanging, assign it to a team member and let the magic begin! 🚀
              </div>
            ) : (
              <></>
            )}
          </>
        )}

        {task.subTasks.length > 0 ? (
          <div>
            <div className="text-xl font-medium">Subtasks</div>
            <div></div>
          </div>
        ) : (
          <>
            {isAssignedUser(user.id) && !task.isCompleted ? (
              <div
                onClick={() => setClickedOnEditTask(true)}
                className="w-full text-base bg-gray-100 rounded-xl p-4 hover:scale-105 cursor-pointer transition-ease-300"
              >
                <span className="text-xl max-md:text-lg text-gradient font-semibold">Divide and conquer! </span> Big
                tasks can be daunting! Break them down into bite-sized subtasks for smoother sailing. 📋
              </div>
            ) : (
              <></>
            )}
          </>
        )}

        {isAssignedUser(user.id) ? (
          task.isCompleted ? (
            <div className="w-full flex justify-center gap-2 border-t-[1px] pt-4 border-[#34343479]">
              <div className="w-fit text-xl font-semibold text-gradient">Not Completed?</div>
              <span
                onClick={toggleComplete}
                className="text-lg cursor-pointer hover-underline-animation after:bg-dark_primary_btn"
              >
                Mark incomplete
              </span>
            </div>
          ) : (
            <div className="w-full text-center flex flex-col gap-2 border-t-[1px] pt-4 border-[#34343479]">
              <div
                onClick={toggleComplete}
                className="w-fit mx-auto text-xl text-gradient font-semibold hover-underline-animation after:bg-dark_primary_btn cursor-pointer"
              >
                Mark Completed
              </div>
            </div>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default TaskView;
