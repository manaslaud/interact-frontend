import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { initialOrganization } from '@/types/initials';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import { ArrowArcLeft, Chats, Plus } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { currentOrgIDSelector } from '@/slices/orgSlice';
import OrgSidebar from '@/components/common/org_sidebar';
import { userSelector } from '@/slices/userSlice';
import InvitationCard from '@/components/organization/invitation_card';
import AddMembers from '@/sections/organization/members/add_members';
import MemberCard from '@/components/organization/member_card';

const Members = () => {
  const [organization, setOrganization] = useState(initialOrganization);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const currentOrgID = useSelector(currentOrgIDSelector);

  const fetchData = async () => {
    const URL = `${ORG_URL}/${currentOrgID}/membership`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setOrganization(res.data.organization);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [clickedOnAddCollaborator, setClickedOnAddCollaborator] = useState(false);
  const [clickedOnInvitations, setClickedOnInvitations] = useState(false);
  const user = useSelector(userSelector);

  return (
    <BaseWrapper title="Manage Project">
      <OrgSidebar index={6} />
      <MainWrapper>
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex justify-between p-base_padding">
            <div className="flex gap-3">
              {/* <ArrowArcLeft
            onClick={() => router.back()}
            className="w-10 h-10 p-2 dark:bg-dark_primary_comp_hover rounded-full cursor-pointer"
            size={40}
          /> */}
              <div className="text-6xl font-semibold dark:text-white font-primary">Members</div>
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="w-[50vw] max-lg:w-screen mx-auto flex flex-col gap-8">
                {clickedOnAddCollaborator ? (
                  <>
                    {organization.userID == user.id || user.managerProjects.includes(organization.id) ? (
                      <AddMembers
                        setShow={setClickedOnAddCollaborator}
                        organization={organization}
                        setOrganization={setOrganization}
                      />
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
                <div className="w-taskbar max-lg:w-[95%] h-taskbar mx-auto flex gap-2 font-primary text-gray-200 text-lg">
                  <div
                    onClick={() => setClickedOnAddCollaborator(true)}
                    className="w-4/5 max-lg:w-2/3 h-full text-gray-400 dark:text-gray-200 bg-white dark:bg-gradient-to-l dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end px-4 max-lg:px-2 py-3 rounded-lg cursor-pointer border-gray-300 border-[1px] dark:border-0 shadow-md hover:shadow-lg transition-ease-300 dark:hover:shadow-outer dark:shadow-outer flex justify-between items-center"
                  >
                    <div className="pl-2 max-lg:text-sm">Add Collaborators</div>
                    <Plus
                      size={36}
                      className="dark:text-gray-200 max-lg:w-8 max-lg:h-8 flex-center rounded-full hover:bg-primary_comp_hover dark:hover:bg-[#e9e9e933] p-2 transition-ease-300"
                      weight="regular"
                    />
                  </div>
                  <div
                    onClick={() => setClickedOnInvitations(prev => !prev)}
                    className={`w-1/5 max-lg:w-1/3  h-full max-lg:text-sm text-gray-400 dark:text-gray-200 ${
                      clickedOnInvitations
                        ? 'bg-primary_comp_hover dark:bg-white text-primary_text dark:text-white'
                        : 'bg-white'
                    }  dark:bg-gradient-to-l dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end px-4 max-lg:px-2 py-3 rounded-lg cursor-pointer border-gray-300 border-[1px] dark:border-0 shadow-md hover:shadow-lg transition-ease-300 dark:hover:shadow-outer dark:shadow-outer flex justify-between items-center`}
                  >
                    <div
                      className={`w-full h-full rounded-lg ${
                        clickedOnInvitations ? 'dark:bg-[#0E0C2A59] dark:shadow-inner' : ''
                      } flex-center transition-ease-200`}
                    >
                      Invitations
                    </div>
                  </div>
                </div>

                {clickedOnInvitations ? (
                  <>
                    {organization.invitations ? (
                      <div className="w-full flex flex-col gap-2 max-lg:px-4 pb-4">
                        {organization.invitations.map(invitation => {
                          return (
                            <InvitationCard key={invitation.id} invitation={invitation} organization={organization} />
                          );
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    {organization.memberships ? (
                      <div className="w-full flex flex-col gap-2 max-lg:px-4 pb-4">
                        {organization.memberships.map(membership => {
                          return <MemberCard key={membership.id} membership={membership} organization={organization} />;
                        })}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Members;
