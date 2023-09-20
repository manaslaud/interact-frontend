import CommentBox from '@/components/common/comment_box';
import { PROJECT_PIC_URL } from '@/config/routes';
import { Project } from '@/types';
import { HeartStraight, CircleDashed } from '@phosphor-icons/react';
import Image from 'next/image';
import React, { useEffect } from 'react';

interface Props {
  project: Project;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setNoComments: React.Dispatch<React.SetStateAction<number>>;
}

const CommentProject = ({ project, setShow, setNoComments }: Props) => {
  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  return (
    <>
      <div className="w-[80%] h-[90%] max-md:w-5/6 max-md:overflow-y-auto fixed backdrop-blur-xl text-white bg-[#ffe1fc22] z-30 translate-x-1/2 -translate-y-1/4 top-56 right-1/2 flex items-center max-md:flex-col font-primary p-8 max-md:p-4 gap-2 border-2 border-primary_btn rounded-xl">
        <div className="w-1/3 max-md:w-full h-fit pb-8">
          <div className={`w-full h-96 rounded-lg relative cursor-default`}>
            <Image
              crossOrigin="anonymous"
              className="w-full h-full rounded-lg object-cover absolute top-0 left-0 "
              src={`${PROJECT_PIC_URL}/${project.coverPic}`}
              alt="Project Cover"
              width={10000}
              height={10000}
            />
            <div className="w-full glassMorphism text-white rounded-b-lg font-primary absolute bottom-0 right-0 flex flex-col px-4 py-2">
              <div className="text-xl">{project.title}</div>
              <div className="w-full flex items-center justify-between">
                <div className="text-sm">{project.user.name}</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    <HeartStraight size={16} />
                    <div>{project.noLikes}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <CircleDashed size={16} />
                    <div>{project.totalNoViews}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/3 max-md:w-full h-full max-md:h-fit">
          <CommentBox item={project} type="project" setNoComments={setNoComments} />
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default CommentProject;
