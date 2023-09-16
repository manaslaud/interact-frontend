import { Membership, Project } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import { MEMBERSHIP_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import { Pen } from '@phosphor-icons/react';
import moment from 'moment';
import EditCollaborator from '@/sections/workspace/manage_project/edit_collaborator';
import { PROJECT_MANAGER } from '@/config/constants';
import patchHandler from '@/handlers/patch_handler';
import Toaster from '@/utils/toaster';
import { title } from 'process';
import deleteHandler from '@/handlers/delete_handler';

interface Props {
  membership: Membership;
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
}

const CollaboratorCard = ({ membership, project, setProject }: Props) => {
  const user = useSelector(userSelector);
  const [clickedOnEditCollaborator, setClickedOnEditCollaborator] = useState(false);

  const handleRemove = async () => {
    const toaster = Toaster.startLoad('Removing Collaborator...');

    const URL = `${MEMBERSHIP_URL}/${membership.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setProject)
        setProject(prev => {
          return {
            ...prev,
            memberships: prev.memberships.filter(m => m.id != membership.id),
          };
        });
      Toaster.stopLoad(toaster, 'Collaborator Removed', 1);
    } else {
      Toaster.stopLoad(toaster, 'Internal Server Error.', 0);
      console.log(res);
    }
  };
  return (
    <>
      {clickedOnEditCollaborator ? (
        <EditCollaborator
          membership={membership}
          project={project}
          setShow={setClickedOnEditCollaborator}
          setProject={setProject}
        />
      ) : (
        <></>
      )}
      <div className="w-full font-primary text-white border-[1px] border-primary_btn rounded-md flex justify-start gap-6 p-6 transition-ease-300">
        <Image
          crossOrigin="anonymous"
          width={10000}
          height={10000}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
          className={'rounded-full w-16 h-16'}
        />
        <div className="grow flex flex-col gap-2 pt-1">
          <div className="w-full flex items-center justify-between">
            <div className="text-2xl font-semibold">{membership.user.name}</div>
            {project.userID == user.id ? (
              <Pen onClick={() => setClickedOnEditCollaborator(true)} className="cursor-pointer" size={24} />
            ) : (
              <>
                {membership.role != PROJECT_MANAGER && user.managerProjects.includes(project.id) ? (
                  <Pen onClick={() => setClickedOnEditCollaborator(true)} className="cursor-pointer" size={24} />
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
          <div className="font-medium">{membership.title}</div>
          <div className="font-medium">{membership.role}</div>
          <div className="w-full flex items-center justify-between text-sm max-md:text-xs">
            <div className="text-gray-400">Joined {moment(membership.createdAt).format('DD MMM YYYY')}</div>
            {project.userID == user.id || user.managerProjects.includes(project.id) ? (
              <div onClick={handleRemove} className="text-primary_danger cursor-pointer">
                Remove Collaborator
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollaboratorCard;
