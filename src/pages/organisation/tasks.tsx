import Loader from '@/components/common/loader';
import OrgSidebar from '@/components/common/org_sidebar';
import TaskCard from '@/components/workspace/task_card';
import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import NewTask from '@/sections/organization/tasks/new_task';
import TaskView from '@/sections/organization/tasks/task_view';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import { userSelector } from '@/slices/userSlice';
import { Task } from '@/types';
import { initialOrganization, initialProject } from '@/types/initials';
import Protect from '@/utils/protect';
import Toaster from '@/utils/toaster';
import WidthCheck from '@/utils/widthCheck';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState(initialOrganization);

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState(false);

  const [clickedOnTask, setClickedOnTask] = useState(false);
  const [clickedTaskID, setClickedTaskID] = useState(-1);

  const [clickedOnNewTask, setClickedOnNewTask] = useState(false);

  const user = useSelector(userSelector);

  const currentOrgID = useSelector(currentOrgIDSelector);

  const getTasks = () => {
    const URL = `${ORG_URL}/${currentOrgID}/tasks`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const taskData = res.data.tasks || [];
          setOrganization(res.data.organization);
          setTasks(taskData);
          setFilteredTasks(taskData);
          const tid = new URLSearchParams(window.location.search).get('tid');
          if (tid && tid != '') {
            taskData.forEach((task: Task, i: number) => {
              if (tid == task.id) {
                setClickedTaskID(i);
                setClickedOnTask(true);
              }
            });
          }

          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    getTasks();
  }, []);

  const filterAssigned = (status: boolean) => {
    setFilterStatus(status);
    if (status) {
      const assignedTasks: Task[] = [];
      tasks.forEach(task => {
        var check = false;
        task.users.forEach(user => {
          if (user.id == user.id) {
            check = true;
            return;
          }
        });
        if (check) {
          assignedTasks.push(task);
        }
      });
      setFilteredTasks(assignedTasks);
    } else setFilteredTasks(tasks);
  };

  return (
    <BaseWrapper title="Tasks">
      <OrgSidebar index={4} />
      <MainWrapper>
        {clickedOnNewTask ? (
          <NewTask
            setShow={setClickedOnNewTask}
            organization={organization}
            setTasks={setTasks}
            setFilteredTasks={setFilteredTasks}
          />
        ) : (
          <></>
        )}
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between p-base_padding">
            <div className="flex gap-3">
              {/* <ArrowArcLeft
            onClick={() => router.back()}
            className="w-10 h-10 p-2 dark:bg-dark_primary_comp_hover rounded-full cursor-pointer"
            size={40}
          /> */}
              <div className="text-6xl font-semibold dark:text-white font-primary">Tasks</div>
            </div>
            <div className="flex gap-8 items-center">
              <div
                onClick={() => setClickedOnNewTask(true)}
                className="text-xl text-gradient font-semibold hover-underline-animation after:bg-dark_primary_btn cursor-pointer"
              >
                <span className="max-md:hidden">Create a</span> New Task
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-6 px-2 py-2">
            {loading ? (
              <Loader />
            ) : (
              <>
                {filteredTasks.length > 0 ? (
                  <div className="flex justify-evenly px-4">
                    <div className={`${clickedOnTask ? 'w-[40%]' : 'w-[720px]'} max-lg:w-[720px] flex flex-col gap-4`}>
                      {filteredTasks.map((task, i) => {
                        return (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={i}
                            clickedTaskID={clickedTaskID}
                            clickedOnTask={clickedOnTask}
                            setClickedOnTask={setClickedOnTask}
                            setClickedTaskID={setClickedTaskID}
                          />
                        );
                      })}
                    </div>
                    {clickedOnTask ? (
                      <TaskView
                        taskID={clickedTaskID}
                        tasks={filteredTasks}
                        organization={organization}
                        setShow={setClickedOnTask}
                        setTasks={setTasks}
                        setFilteredTasks={setFilteredTasks}
                        setClickedTaskID={setClickedTaskID}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <div className="mx-auto font-medium text-xl mt-8">No Tasks found :)</div>
                )}
              </>
            )}
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Tasks;
