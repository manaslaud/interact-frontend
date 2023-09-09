import ProjectCard from '@/components/workspace/project_card';
import { ProjectBookmark } from '@/types';
import React, { useState } from 'react';
import ProjectView from '../../sections/workspace/project_view';
import { ArrowArcLeft } from '@phosphor-icons/react';

interface Props {
  bookmark: ProjectBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  fetchBookmarks?: () => void;
}

const Projects = ({ bookmark, setClick, fetchBookmarks }: Props) => {
  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  return (
    <div className="w-full px-2">
      <div className="flex items-center gap-2">
        <ArrowArcLeft
          onClick={() => {
            if (fetchBookmarks) fetchBookmarks();
            setClick(false);
          }}
          color="white"
          className="cursor-pointer"
          size={32}
        />
        <div className="font-medium text-xl cursor-default">{bookmark.title}</div>
      </div>
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
