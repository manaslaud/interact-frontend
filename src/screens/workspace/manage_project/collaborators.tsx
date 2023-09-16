import { Project } from '@/types';
import { Plus } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import CollaboratorCard from '@/components/workspace/manage_project/collaborator_card';
import invitations from '@/pages/invitations';
import InvitationCard from '@/components/workspace/manage_project/invitation_card';
import AddCollaborators from '@/sections/workspace/manage_project/add_collaborators';

interface Props {
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
}

const Collaborators = ({ project, setProject }: Props) => {
  const [clickedOnAddCollaborator, setClickedOnAddCollaborator] = useState(false);
  const [clickedOnInvitations, setClickedOnInvitations] = useState(false);
  const user = useSelector(userSelector);
  return (
    <div className="w-[50vw] max-md:w-screen mx-auto flex flex-col gap-8">
      {clickedOnAddCollaborator ? (
        <>
          {project.userID == user.id || user.managerProjects.includes(project.id) ? (
            <AddCollaborators setShow={setClickedOnAddCollaborator} project={project} setProject={setProject} />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <div className="w-taskbar max-md:w-taskbar_md h-taskbar mx-auto flex gap-2 font-primary text-gray-200 text-lg">
        <div
          onClick={() => setClickedOnAddCollaborator(true)}
          className="w-4/5 h-full hover:to-primary_comp_hover bg-gradient-to-l from-primary_gradient_start to-primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer shadow-outer flex justify-between items-center"
        >
          <div className="flex gap-2 items-center pl-2">
            <div className="">Add Collaborators</div>
          </div>
          <Plus
            size={36}
            className="text-gray-200 flex-center rounded-full hover:bg-[#e9e9e933] p-2 transition-ease-300"
            weight="regular"
          />
        </div>
        <div
          onClick={() => setClickedOnInvitations(prev => !prev)}
          className="w-1/5 h-full hover:to-primary_comp_hover bg-gradient-to-l from-primary_gradient_start to-primary_gradient_end p-1 max-md:px-2 rounded-lg cursor-pointer shadow-outer flex-center"
        >
          <div
            className={`w-full h-full rounded-lg ${
              clickedOnInvitations ? 'bg-[#0E0C2A59] shadow-inner' : ''
            } flex-center transition-ease-200`}
          >
            Invitations
          </div>
        </div>
      </div>

      {clickedOnInvitations ? (
        <>
          {project.invitations ? (
            <div className="w-full flex flex-col gap-2 pb-8">
              {project.invitations.map(invitation => {
                return (
                  <InvitationCard
                    key={invitation.id}
                    invitation={invitation}
                    project={project}
                    setProject={setProject}
                  />
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          {project.memberships ? (
            <div className="w-full flex flex-col gap-2 pb-8">
              {project.memberships.map(membership => {
                return (
                  <CollaboratorCard
                    key={membership.id}
                    membership={membership}
                    project={project}
                    setProject={setProject}
                  />
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default Collaborators;
