import ProjectCard from '@/components/explore/project_card';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/explore/searchbar';
import ProjectView from '../../sections/explore/project_view';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const navbarOpen = useSelector(navbarOpenSelector);

  const initialSearch = new URLSearchParams(window.location.search).get('search');

  const fetchProjects = async (search: string | null) => {
    setLoading(true);
    const URL =
      search && search != ''
        ? `${EXPLORE_URL}/projects/trending${'?search=' + search}`
        : `${EXPLORE_URL}/projects/recommended`;
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
    fetchProjects(new URLSearchParams(window.location.search).get('search'));
  }, [window.location.search]);

  return (
    <div className="w-full flex flex-col gap-12 px-2 py-2">
      <SearchBar initialValue={initialSearch && initialSearch != '' ? initialSearch : ''} />
      {loading ? (
        <Loader />
      ) : (
        <>
          {projects.length > 0 ? (
            <div className={`w-full grid ${navbarOpen ? 'grid-cols-3 px-16 gap-16' : 'grid-cols-4 px-12 gap-12'} `}>
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
