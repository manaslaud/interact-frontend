import ProjectCard from '@/components/explore/project_card';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState, useEffect } from 'react';
import ProjectView from '../../sections/explore/project_view';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';

interface Props {
  projects: Project[];
}

const Projects = ({ projects }: Props) => {
  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const navbarOpen = useSelector(navbarOpenSelector);

  return (
    <div className="w-full flex flex-col gap-12 px-2 pb-8">
      {projects.length > 0 ? (
        <div
          className={`w-fit grid ${
            navbarOpen ? 'grid-cols-2 gap-6' : 'grid-cols-3 gap-8'
          } max-md:grid-cols-1 mx-auto max-md:gap-6 max-md:px-4 max-md:justify-items-center transition-ease-out-500`}
        >
          {clickedOnProject ? (
            <ProjectView
              projectSlugs={projects.map(project => project.slug)}
              clickedProjectIndex={clickedProjectIndex}
              setClickedProjectIndex={setClickedProjectIndex}
              setClickedOnProject={setClickedOnProject}
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
        </div>
      ) : (
        <div>No projects found</div>
      )}
    </div>
  );
};

export default Projects;
