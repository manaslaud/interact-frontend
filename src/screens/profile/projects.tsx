import ProjectCard from '@/components/explore/project_card';
import { Project } from '@/types';
import React, { useState } from 'react';
import ProjectView from '../../sections/explore/project_view';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';
import NewProject from '@/sections/workspace/new_project';

interface Props {
  projects: Project[];
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
  displayOnProfile?: boolean;
}

const Projects = ({ projects, setProjects, displayOnProfile = false }: Props) => {
  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);
  const [clickedOnNewProject, setClickedOnNewProject] = useState(false);

  const [fadeInProject, setFadeInProject] = useState(true);

  const navbarOpen = useSelector(navbarOpenSelector);

  return (
    <div className="w-full flex flex-col gap-12 px-2 pb-8">
      <div
        className={`w-fit grid ${
          navbarOpen ? 'grid-cols-2 gap-6' : 'grid-cols-3 gap-8'
        } max-md:grid-cols-1 mx-auto max-md:gap-6 max-md:px-4 max-md:justify-items-center transition-ease-out-500`}
      >
        {displayOnProfile ? (
          <>
            {clickedOnNewProject ? <NewProject setShow={setClickedOnNewProject} setProjects={setProjects} /> : <></>}
            <div
              onClick={() => setClickedOnNewProject(true)}
              className={`w-64 h-64 backdrop-blur-lg dark:text-white bg-[#ffe1fc22] border-[1px] dark:border-dark_primary_btn rounded-lg relative group cursor-pointer flex-center flex-col gap-2 hover:bg-[#ffe1fc10] transition-ease-300`}
            >
              <div className="font-medium text-2xl"> Add Project</div>
              <div className="text-xs">New Project, Who Dis?</div>
            </div>
          </>
        ) : (
          <></>
        )}
        {projects.length > 0 ? (
          <>
            {clickedOnProject ? (
              <ProjectView
                projectSlugs={projects.map(project => project.slug)}
                clickedProjectIndex={clickedProjectIndex}
                setClickedProjectIndex={setClickedProjectIndex}
                setClickedOnProject={setClickedOnProject}
                fadeIn={fadeInProject}
                setFadeIn={setFadeInProject}
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
                  size={64}
                  setClickedOnProject={setClickedOnProject}
                  setClickedProjectIndex={setClickedProjectIndex}
                />
              );
            })}
          </>
        ) : (
          <div>No projects found</div>
        )}
      </div>
    </div>
  );
};

export default Projects;
