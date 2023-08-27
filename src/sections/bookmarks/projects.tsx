import ProjectCard from '@/components/workspace/project_card';
import { ProjectBookmark } from '@/types';
import React, { useState } from 'react';
import ProjectView from '../../sections/workspace/project_view';

interface Props {
  bookmark: ProjectBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
}

const Projects = ({ bookmark, setClick }: Props) => {
  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  return (
    <div className="w-full px-2">
      <div onClick={() => setClick(false)}>Back</div>
      {bookmark.projectItems.length > 0 ? (
        <div className="w-full grid grid-cols-4 gap-1 justify-items-center">
          {clickedOnProject ? (
            <ProjectView
              projectSlugs={bookmark.projectItems.map(projectItem => projectItem.project.slug)}
              clickedProjectIndex={clickedProjectIndex}
              setClickedProjectIndex={setClickedProjectIndex}
              setClickedOnProject={setClickedOnProject}
            />
          ) : (
            <></>
          )}
          {bookmark.projectItems.map((projectItem, index) => {
            return (
              <ProjectCard
                key={projectItem.id}
                index={index}
                project={projectItem.project}
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
