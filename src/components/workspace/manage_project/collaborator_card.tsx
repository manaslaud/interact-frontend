import { Membership, Project } from '@/types';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import { Pen } from '@phosphor-icons/react';
import moment from 'moment';

interface Props {
  membership: Membership;
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
}

const CollaboratorCard = ({ membership, project, setProject }: Props) => {
  const user = useSelector(userSelector);
  return (
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
          {project.userID == user.id || user.managerProjects.includes(project.id) ? (
            <Pen className="cursor-pointer" size={24} />
          ) : (
            <></>
          )}
        </div>
        <div className="font-medium">{membership.title}</div>
        <div className="font-medium">{membership.role}</div>
        <div className="w-full flex items-center justify-between text-sm">
          <div className="text-gray-400">Joined {moment(membership.createdAt).format('DD MMM YYYY')}</div>
          {project.userID == user.id || user.managerProjects.includes(project.id) ? (
            <div className="text-[#ea333e] cursor-pointer">Remove Collaborator</div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorCard;
