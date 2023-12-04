import { Membership, Organization, OrganizationMembership, Project } from '@/types';
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
import ConfirmDelete from '@/components/common/confirm_delete';
import { SERVER_ERROR } from '@/config/errors';
import EditMember from '@/sections/organization/members/edit_member';

interface Props {
  membership: OrganizationMembership;
  organization: Organization;
  setOrganization?: React.Dispatch<React.SetStateAction<Project>>;
}

const MemberCard = ({ membership, organization, setOrganization }: Props) => {
  const user = useSelector(userSelector);
  const [clickedOnEditCollaborator, setClickedOnEditCollaborator] = useState(false);
  const [clickedOnRemoveCollaborator, setClickedOnRemoveCollaborator] = useState(false);

  const handleRemove = async () => {
    const toaster = Toaster.startLoad('Removing Collaborator...');

    const URL = `${MEMBERSHIP_URL}/${membership.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setOrganization)
        setOrganization(prev => {
          return {
            ...prev,
            memberships: prev.memberships.filter(m => m.id != membership.id),
          };
        });
      setClickedOnRemoveCollaborator(false);
      Toaster.stopLoad(toaster, 'Collaborator Removed', 1);
    } else {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };
  return (
    <>
      {clickedOnEditCollaborator ? (
        <EditMember membership={membership} organization={organization} setShow={setClickedOnEditCollaborator} />
      ) : (
        <></>
      )}
      {clickedOnRemoveCollaborator ? (
        <ConfirmDelete setShow={setClickedOnRemoveCollaborator} handleDelete={handleRemove} title="Confirm Remove?" />
      ) : (
        <></>
      )}

      <div className="w-full font-primary dark:text-white bg-white dark:bg-transparent border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-md flex justify-start gap-6 p-6 transition-ease-300">
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
            {/* {project.userID == user.id ? (
              <Pen onClick={() => setClickedOnEditCollaborator(true)} className="cursor-pointer" size={24} />
            ) : (
              <>
                {membership.role != PROJECT_MANAGER && user.managerProjects.includes(project.id) ? (
                  <Pen onClick={() => setClickedOnEditCollaborator(true)} className="cursor-pointer" size={24} />
                ) : (
                  <></>
                )}
              </>
            )} */}
          </div>
          <div className="font-medium">{membership.title}</div>
          <div className="font-medium">{membership.role}</div>
          <div className="w-full flex items-center justify-between text-sm max-md:text-xs">
            <div className="text-gray-400">Joined {moment(membership.createdAt).format('DD MMM YYYY')}</div>
            {/* {project.userID == user.id || user.managerProjects.includes(project.id) ? (
              <div onClick={() => setClickedOnRemoveCollaborator(true)} className="text-primary_danger cursor-pointer">
                Remove Collaborator
              </div>
            ) : (
              <></>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberCard;
