import { POST_PIC_URL, PROJECT_PIC_URL } from '@/config/routes';
import { ProjectBookmark } from '@/types';
import Image from 'next/image';
import React from 'react';

interface Props {
  bookmark: ProjectBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  setBookmark: React.Dispatch<React.SetStateAction<ProjectBookmark>>;
  handleDelete: (bookmarkID: string) => Promise<void>;
}

const ProjectBookmark = ({ bookmark, setClick, setBookmark, handleDelete }: Props) => {
  let count = 0;
  return (
    <div className="w-96 h-108 bg-white border-2">
      <div
        onClick={() => {
          setBookmark(bookmark);
          setClick(true);
        }}
        className="cursor-pointer"
      >
        {bookmark.projectItems.length == 0 ? (
          <div className="w-full h-96 bg-slate-400 grid grid-cols-2"></div>
        ) : bookmark.projectItems.length == 1 ? (
          <>
            {bookmark.projectItems[0].project.coverPic ? (
              <Image
                crossOrigin="anonymous"
                className="w-full h-96 object-cover"
                width={10000}
                height={10000}
                alt=""
                src={`${PROJECT_PIC_URL}/${bookmark.projectItems[0].project.coverPic}`}
              />
            ) : (
              <div className="w-full h-96 bg-slate-400 grid grid-cols-2"></div>
            )}
          </>
        ) : (
          <div className="w-full h-96 bg-slate-200 grid grid-cols-2">
            {bookmark.projectItems.map(projectItem => {
              if (count >= 4 || !projectItem.project.coverPic) {
                return <></>;
              }
              count++;
              return (
                <Image
                  key={projectItem.projectID}
                  crossOrigin="anonymous"
                  className="w-[180px] h-[180px] object-cover"
                  width={10000}
                  height={10000}
                  alt=""
                  src={`${PROJECT_PIC_URL}/${projectItem.project.coverPic}`}
                />
              );
            })}
            {[...Array(4 - count)].map((_, index) => (
              <div key={index} className="w-[180px] h-[180px] bg-slate-400"></div>
            ))}
          </div>
        )}
      </div>
      <div className="w-full text-center">{bookmark.title}</div>
      <div onClick={() => handleDelete(bookmark.id)}>delete Bookmark</div>
    </div>
  );
};

export default ProjectBookmark;
