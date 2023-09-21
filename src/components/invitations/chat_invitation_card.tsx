import { Invitation } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import { INVITATION_URL, PROJECT_PIC_URL } from '@/config/routes';
import moment from 'moment';
import Link from 'next/link';
import Toaster from '@/utils/toaster';
import { VERIFICATION_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setChats, setMemberProjects, userSelector } from '@/slices/userSlice';

interface Props {
  invitation: Invitation;
  setInvitations?: React.Dispatch<React.SetStateAction<Invitation[]>>;
}

const ChatInvitationCard = ({ invitation, setInvitations }: Props) => {
  const [mutex, setMutex] = useState(false);

  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const handleAccept = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Accepting Invitation...');
    const URL = `${INVITATION_URL}/accept/${invitation.id}`;

    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      if (setInvitations)
        setInvitations(prev =>
          prev.map(i => {
            if (i.id == invitation.id) return { ...invitation, status: 1 };
            return i;
          })
        );
      dispatch(setChats([...user.chats, invitation.chatID]));
      //TODO add chat to socket chats
      Toaster.stopLoad(toaster, 'Invitation Accepted', 1);
    } else {
      if (res.data.message) {
        if (res.data.message == VERIFICATION_ERROR) {
          Toaster.stopLoad(toaster, VERIFICATION_ERROR, 0);
          router.push('/verification');
        } else Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        console.log(res);
      }
    }

    setMutex(false);
  };

  const handleReject = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Rejecting Invitation...');
    const URL = `${INVITATION_URL}/reject/${invitation.id}`;

    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      if (setInvitations)
        setInvitations(prev =>
          prev.map(i => {
            if (i.id == invitation.id) return { ...invitation, status: -1 };
            return i;
          })
        );
      Toaster.stopLoad(toaster, 'Invitation Rejected', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        console.log(res);
      }
    }

    setMutex(false);
  };

  return (
    <div className="w-full font-primary dark:text-white border-[1px] dark:border-dark_primary_btn rounded-md flex max-md:flex-col items-center justify-start gap-6 p-6 transition-ease-300">
      <div className="rounded-full w-32 h-32 dark:bg-dark_primary_comp_hover"> </div>

      <div className="grow flex max-md:flex-col max-md:text-center max-md:gap-4 items-center justify-between">
        <div className="grow flex flex-col gap-2">
          <div className="text-3xl font-semibold text-gradient">{invitation.chat.title}</div>
          <div className="font-medium line-clamp-2">{invitation.chat.description}</div>
          <div className="text-xs">Invited {moment(invitation.createdAt).format('DD MMM YYYY')}</div>
        </div>
        {invitation.status == 0 ? (
          <div className="flex gap-4">
            <div
              onClick={handleAccept}
              className="w-24 h-10 font-semibold border-[1px] dark:border-dark_primary_btn shadow-xl dark:text-white dark:bg-dark_primary_comp hover:dark:bg-dark_primary_comp_hover active:dark:bg-dark_primary_comp_active flex-center rounded-lg transition-ease-300 cursor-pointer"
            >
              Accept
            </div>
            <div
              onClick={handleReject}
              className="w-24 h-10 font-semibold border-[1px] dark:border-dark_primary_btn shadow-xl dark:text-white dark:bg-dark_primary_comp hover:dark:bg-dark_primary_comp_hover active:dark:bg-dark_primary_comp_active flex-center rounded-lg transition-ease-300 cursor-pointer"
            >
              Reject
            </div>
          </div>
        ) : (
          <div className="w-24 h-10 font-semibold border-[1px] dark:border-dark_primary_btn shadow-xl dark:text-white dark:bg-dark_primary_comp_hover flex-center rounded-lg cursor-default">
            {invitation.status == 1 ? 'Accepted' : 'Rejected'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInvitationCard;
