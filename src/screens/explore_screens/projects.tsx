import ProjectCard from '@/components/explore/project_card';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/explore/searchbar';
import ProjectView from '../../sections/explore_sections/project_view';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const navbarOpen = useSelector(navbarOpenSelector);

  const search = new URLSearchParams(window.location.search).get('search');

  const fetchProjects = async () => {
    setLoading(true);
    const URL = `${EXPLORE_URL}/projects/recommended${search && search != '' ? '?search=' + search : ''}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setProjects(res.data.projects || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search]);

  return (
    <div className="w-full px-2">
      <SearchBar initialValue={search && search != '' ? search : ''} />
      {loading ? (
        <Loader />
      ) : (
        <>
          {projects.length > 0 ? (
            <div className={`w-full grid ${navbarOpen ? 'grid-cols-4' : 'grid-cols-5'} gap-2 justify-items-center`}>
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
                    setClickedOnProject={setClickedOnProject}
                    setClickedProjectIndex={setClickedProjectIndex}
                  />
                );
              })}
              {projects.map((project, index) => {
                return (
                  <ProjectCard
                    key={project.id}
                    index={index}
                    project={project}
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

export default Projects;
