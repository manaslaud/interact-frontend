import ProjectCard from '@/components/explore/project_card';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL, PROJECT_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState, useEffect } from 'react';
import ProjectView from '@/sections/explore/project_view';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const [fadeInProjectView, setFadeInProjectView] = useState(true);

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

  const fetchProject = async (id: string | null) => {
    setLoading(true);
    const URL = `${EXPLORE_URL}/projects/${id}`;

    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setProjects([res.data.project] || []);

      if (res.data.project) {
        setClickedProjectIndex(0);
        setClickedOnProject(true);
      }

      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    const pid = new URLSearchParams(window.location.search).get('pid');
    if (pid && pid != '') fetchProject(pid);
    else fetchProjects(new URLSearchParams(window.location.search).get('search'));
  }, [window.location.search]);

  return (
    <div className="w-full px-2">
      {loading ? (
        <Loader />
      ) : (
        <>
          {projects.length > 0 ? (
            <div className="w-full grid grid-cols-4 max-md:grid-cols-1 gap-1 max-md:gap-6 justify-items-center py-4 gap-y-5">
              {clickedOnProject ? (
                <ProjectView
                  projectSlugs={projects.map(project => project.slug)}
                  clickedProjectIndex={clickedProjectIndex}
                  setClickedProjectIndex={setClickedProjectIndex}
                  setClickedOnProject={setClickedOnProject}
                  fadeIn={fadeInProjectView}
                  setFadeIn={setFadeInProjectView}
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
