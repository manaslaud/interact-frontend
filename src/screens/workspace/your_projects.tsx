import Loader from '@/components/common/loader';
import ProjectCard from '@/components/workspace/project_card';
import { WORKSPACE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import ProjectView from '@/sections/workspace/project_view';
import NewProject from '@/sections/workspace/new_project';
import { Plus } from '@phosphor-icons/react';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';

const YourProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const [clickedOnNewProject, setClickedOnNewProject] = useState(false);

  const [fadeIn, setFadeIn] = useState(true);

  const user = useSelector(userSelector);

  const getProjects = () => {
    setLoading(true);
    const URL = `${WORKSPACE_URL}/my`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          let projectsData = res.data.projects || [];
          projectsData = projectsData.map((project: Project) => {
            return { ...project, user };
          });
          setProjects(projectsData);
          const projectSlug = new URLSearchParams(window.location.search).get('project');
          if (projectSlug && projectSlug != '') {
            projectsData.forEach((project: Project, index: number) => {
              if (project.slug == projectSlug) {
                setClickedOnProject(true);
                setClickedProjectIndex(index);
              }
            });
          }
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message);
          else {
            Toaster.error('Internal Server Error');
            console.log(res);
          }
        }
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  useEffect(() => {
    getProjects();
  }, []);
  return (
    <div className="w-full px-2">
      {clickedOnNewProject ? <NewProject setShow={setClickedOnNewProject} setProjects={setProjects} /> : <></>}

      <div
        onClick={() => setClickedOnNewProject(true)}
        className="w-taskbar max-md:w-taskbar_md h-taskbar mx-auto text-gray-400 dark:text-gray-200 bg-white dark:bg-gradient-to-l dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer shadow-md border-gray-300 border-[1px] dark:border-0 dark:shadow-outer flex justify-between items-center"
      >
        <div className="font-primary dark:text-gray-200 text-lg pl-2">Create a new project</div>
        <Plus
          size={36}
          className="flex-center rounded-full hover:bg-primary_comp_hover dark:hover:bg-[#e9e9e933] p-2 transition-ease-300"
          weight="regular"
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {projects.length > 0 ? (
            <div className="w-full grid grid-cols-4 max-md:grid-cols-1 gap-1 max-md:gap-6 justify-items-center py-8 gap-y-5">
              {clickedOnProject ? (
                <ProjectView
                  projectSlugs={projects.map(project => project.slug)}
                  clickedProjectIndex={clickedProjectIndex}
                  setClickedProjectIndex={setClickedProjectIndex}
                  setClickedOnProject={setClickedOnProject}
                  fadeIn={fadeIn}
                  setFadeIn={setFadeIn}
                  setProjects={setProjects}
                />
              ) : (
                <></>
              )}
              {projects.map((project, index) => {
                return (
                  <ProjectCard
                    key={project.id}
                    index={index}
                    project={project}
                    setProjects={setProjects}
                    setClickedOnProject={setClickedOnProject}
                    setClickedProjectIndex={setClickedProjectIndex}
                  />
                );
              })}
            </div>
          ) : (
            <div>No projects found</div>
          )}
        </>
      )}
    </div>
  );
};

export default YourProjects;
