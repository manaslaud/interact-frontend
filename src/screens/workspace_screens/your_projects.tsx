import Loader from '@/components/common/loader';
import ProjectCard from '@/components/workspace/project_card';
import { WORKSPACE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import ProjectView from '../../sections/workspace_sections/project_view';
import NewProject from '@/sections/workspace_sections/new_project';

const YourProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const [clickedOnNewProject, setClickedOnNewProject] = useState(false);

  const getProjects = () => {
    setLoading(true);
    const URL = `${WORKSPACE_URL}/my`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setProjects(res.data.projects || []);
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
      {clickedOnNewProject ? (
        <NewProject setShow={setClickedOnNewProject} setProjects={setProjects} />
      ) : (
        <>
          <div onClick={() => setClickedOnNewProject(true)}>Create a new Project</div>
          {loading ? (
            <Loader />
          ) : (
            <>
              {projects.length > 0 ? (
                <div className="w-full grid grid-cols-4 gap-1 justify-items-center">
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
      )}
    </div>
  );
};

export default YourProjects;