import ProjectCard from '@/components/explore/project_card';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/explore/searchbar';
import ProjectView from './project_view';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const router = useRouter();
  const { search } = router.query;

  const fetchProjects = async () => {
    setLoading(true);
    const URL = `${EXPLORE_URL}/projects/recently_added${search && search != '' ? '?search=' + search : ''}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setProjects(res.data.projects);
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
    <>
      <SearchBar />
      {loading ? (
        <Loader />
      ) : (
        <>
          {projects.length > 0 ? (
            <div className="w-full flex flex-wrap justify-evenly">
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
    </>
  );
};

export default Projects;
