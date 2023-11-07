import { Project, Task } from '@/types';
import React, { useState } from 'react';
import { APPLICATION_RESUME_URL, APPLICATION_URL, TASK_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Image from 'next/image';
import getIcon from '@/utils/get_icon';
import Link from 'next/link';
import { ArrowArcLeft, Gear } from '@phosphor-icons/react';
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
    if (project.userID == userID) role == 'Owner';
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

      <div className="sticky max-md:fixed top-[158px] max-md:top-navbar max-md:right-0 w-[55%] max-md:w-full max-h-[70vh] max-md:max-h-screen max-md:h-base max-md:z-50 max-md:backdrop-blur-2xl max-md:backdrop-brightness-90 overflow-y-auto flex flex-col gap-8 p-8 font-primary dark:text-white border-[1px] max-md:border-0 border-primary_btn  dark:border-dark_primary_btn rounded-lg max-md:rounded-none max-md:animate-fade_third z-10">
        <div className="w-full flex flex-col gap-10 max-md:gap-8">
          <ArrowArcLeft
            className="cursor-pointer md:hidden"
            size={24}
            onClick={() => {
              setShow(false);
            }}
          />
          <div className="w-full flex justify-between items-center">
            <div className="">{task.title}</div>
            {project.userID == user.id || user.managerProjects.includes(project.id) ? (
              <Gear onClick={() => setClickedOnEditTask(true)} />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          <div>{task.description}</div>
          <div>
            {task.tags.map(tag => {
              return <div key={tag}>{tag}</div>;
            })}
          </div>
        </div>
        <div>
          <div>Deadline:</div>
          <div> {moment(task.deadline).format('DD-MMM-YY')}</div>
        </div>
        <div>
          <div>Assigned To:</div>
          <div className="w-full flex flex-wrap justify-between gap-2">
            {task.users.map(user => {
              return (
                <div key={user.id} className="w-1/2 flex border-[1px] border-gray-900 rounded-lg p-2">
                  <Image
                    crossOrigin="anonymous"
                    width={10000}
                    height={10000}
                    alt={'User Pic'}
                    src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                    className={'rounded-full w-12 h-12'}
                  />
                  <div className="grow flex flex-col gap-2">
                    <div>{user.name}</div>
                    <div>{getUserRole(user.id)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div>Subtasks</div>
          <div></div>
        </div>
        {isAssignedUser(user.id) ? <div>Mark Completed</div> : <></>}
        {project.userID == user.id || user.managerProjects.includes(project.id) ? (
          <div onClick={() => setClickedOnDeleteTask(true)}>Delete Task</div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default TaskView;
