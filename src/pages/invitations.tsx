import Loader from '@/components/common/loader';
import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
import ChatInvitationCard from '@/components/invitations/chat_invitation_card';
import ProjectInvitationCard from '@/components/invitations/project_invitation_card';
import { SERVER_ERROR } from '@/config/errors';
import { INVITATION_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { invitationsTabSelector, setInvitationsTab } from '@/slices/feedSlice';
import { userSelector } from '@/slices/userSlice';
import { Invitation } from '@/types';
import Protect from '@/utils/protect';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Invitations = () => {
  const active = useSelector(invitationsTabSelector);
  const [projectInvitations, setProjectInvitations] = useState<Invitation[]>([]);
  const [groupChatInvitations, setGroupChatInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector(userSelector);

  const fetchInvitations = async () => {
    setLoading(true);
    const URL = `${INVITATION_URL}/me`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const invitationData = res.data.invitations;
      setProjectInvitations(
        invitationData.filter((invitation: Invitation) => invitation.projectID && invitation.projectID != '')
      );
      setGroupChatInvitations(
        invitationData.filter((invitation: Invitation) => invitation.chatID && invitation.chatID != '')
      );
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);
  return (
    <BaseWrapper>
      <Sidebar index={5} />
      <MainWrapper>
        <div className={`w-full max-lg:w-full flex flex-col gap-4 transition-ease-out-500 py-base_padding`}>
          <TabMenu items={['Projects', 'Group Chats']} active={active} setReduxState={setInvitationsTab} />
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className={`${active === 0 ? 'block' : 'hidden'}`}>
                <div className="w-full flex flex-col gap-6 p-2">
                  {projectInvitations.length > 0 ? (
                    <div className="w-[720px] max-md:w-full max-md:px-4 mx-auto flex flex-col gap-4">
                      {projectInvitations.map(invitation => {
                        return (
                          <ProjectInvitationCard
                            key={invitation.id}
                            invitation={invitation}
                            setInvitations={setProjectInvitations}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div>No Invitations found</div>
                  )}
                </div>
              </div>
              {/* <div className={`${active === 1 ? 'block' : 'hidden'}`}></div> */}
              <div className={`${active === 1 ? 'block' : 'hidden'} `}>
                <div className="w-full flex flex-col gap-6 p-2">
                  {groupChatInvitations.length > 0 ? (
                    <div className="w-[720px] max-md:w-full max-md:px-4 mx-auto flex flex-col gap-4">
                      {groupChatInvitations.map(invitation => {
                        return (
                          <ChatInvitationCard
                            key={invitation.id}
                            invitation={invitation}
                            setInvitations={setGroupChatInvitations}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div>No Invitations found</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Protect(Invitations);
