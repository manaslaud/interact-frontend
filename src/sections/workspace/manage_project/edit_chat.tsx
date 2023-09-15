import React, { useState } from 'react';
import { CaretRight, Pen, Plus, X } from '@phosphor-icons/react';
import { GROUP_ADMIN } from '@/config/constants';
import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import { MESSAGING_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { GroupChat, GroupChatMembership, Project } from '@/types';
import { initialGroupChatMembership } from '@/types/initials';
import EditMembership from './edit_chat_membership';
import AddChatMembers from './add_chat_members';
import { SERVER_ERROR } from '@/config/errors';
import Toaster from '@/utils/toaster';
import patchHandler from '@/handlers/patch_handler';
import deleteHandler from '@/handlers/delete_handler';
import { useDispatch, useSelector } from 'react-redux';
import { setChats, userSelector } from '@/slices/userSlice';
import { setCurrentGroupChatID } from '@/slices/messagingSlice';

interface Props {
  chat: GroupChat;
  project: Project;
  setStateChats: React.Dispatch<React.SetStateAction<GroupChat[]>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditChat = ({ chat, project, setStateChats, setShow }: Props) => {
  const [clickedOnEditMembership, setClickedOnEditMembership] = useState(false);
  const [clickedEditUserMembership, setClickedEditUserMembership] = useState(initialGroupChatMembership);
  const [clickedOnAddMembers, setClickedOnAddMembers] = useState(false);

  const [clickedOnEdit, setClickedOnEdit] = useState(false);

  const [title, setTitle] = useState(chat.title);
  const [description, setDescription] = useState(chat.description);

  const [mutex, setMutex] = useState(false);

  const chats = useSelector(userSelector).chats;

  const dispatch = useDispatch();

  const handleEdit = async () => {
    if (title.trim() == '') {
      Toaster.error('Title cannot be empty');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing Group Details');

    const URL = `${MESSAGING_URL}/group/project/${chat.id}`;

    const formData = {
      title,
      description,
    };

    const res = await patchHandler(URL, formData);
    if (res.statusCode === 200) {
      setStateChats(prev =>
        prev.map(c => {
          if (c.id == chat.id) return { ...c, title, description };
          else return c;
        })
      );
      setClickedOnEdit(false);
      Toaster.stopLoad(toaster, 'Group Details Edited!', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
        console.log(res);
      }
    }

    setMutex(false);
  };

  const handleDelete = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Leaving Group');

    const URL = `${MESSAGING_URL}/group/project/${chat.id}`;

    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      setStateChats(prev => prev.filter(c => c.id != chat.id));
      if (chats.includes(chat.id)) dispatch(setChats(chats.filter(chatID => chatID != chat.id)));
      Toaster.stopLoad(toaster, 'Group Deleted', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
        console.log(res);
      }
    }

    setMutex(false);
  };

  return (
    <div className="sticky max-md:fixed top-[158px] max-md:top-navbar max-md:right-0 w-[45%] max-md:w-full max-h-[80vh] max-md:max-h-screen max-md:h-base max-md:z-50 max-md:backdrop-blur-2xl max-md:backdrop-brightness-90 overflow-y-auto flex flex-col gap-6 max-md:gap-8 p-6 font-primary text-white border-[1px] max-md:border-0 border-primary_btn rounded-lg max-md:rounded-none max-md:animate-fade_third z-10">
      {clickedOnEditMembership ? (
        <EditMembership
          membership={clickedEditUserMembership}
          setShow={setClickedOnEditMembership}
          setChats={setStateChats}
        />
      ) : (
        <></>
      )}
      {clickedOnAddMembers ? (
        <AddChatMembers setShow={setClickedOnAddMembers} chat={chat} project={project} setChats={setStateChats} />
      ) : (
        <></>
      )}
      <div className={`w-full rounded-md flex ${clickedOnEdit ? 'items-start' : 'items-center'} gap-4`}>
        {clickedOnEdit ? (
          <>
            <div className="rounded-full w-14 h-14 bg-primary_comp_hover"></div>
            <div className={`grow flex flex-col ${clickedOnEdit ? 'pt-1' : 'items-center'}`}>
              <div className="w-full flex items-center justify-between pr-2">
                <input
                  type="text"
                  className="text-2xl font-medium bg-transparent focus:outline-none"
                  autoFocus={true}
                  maxLength={25}
                  value={title}
                  onChange={el => setTitle(el.target.value)}
                />
                <div className="flex gap-2">
                  <CaretRight onClick={handleEdit} className="cursor-pointer" color="white" size={24} />
                  <X onClick={() => setClickedOnEdit(false)} className="cursor-pointer" color="white" size={24} />
                </div>
              </div>

              <textarea
                className="text-sm bg-transparent focus:outline-none min-h-[64px] max-h-36"
                maxLength={250}
                autoFocus={true}
                value={description}
                onChange={el => setDescription(el.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full w-14 h-14 bg-primary_comp_hover"></div>
            <div className="grow flex flex-col">
              <div className="w-full flex items-center justify-between pr-2">
                <div className="text-2xl font-medium">{chat.title}</div>
                <Pen onClick={() => setClickedOnEdit(true)} className="cursor-pointer" color="white" size={24} />
              </div>

              <div className="text-sm">{chat.description}</div>
            </div>
          </>
        )}
      </div>

      <div className="w-full  rounded-md flex flex-col gap-4 p-4">
        <div className="text-xl font-semibold">
          {chat.memberships.length} Participant{chat.memberships.length == 1 ? '' : 's'}
        </div>
        <div className="w-full flex flex-col gap-1">
          <div
            onClick={() => setClickedOnAddMembers(true)}
            className="w-full h-12 p-4 bg-primary_comp_hover rounded-md flex items-center justify-between cursor-pointer"
          >
            <div className="">Add Members</div>
            <Plus color="white" size={24} />
          </div>
          {chat.memberships.map(m => {
            return (
              <div key={m.id} className="w-full p-4 bg-primary_comp_hover rounded-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href={`/explore/user/${m.user.username}`} className="rounded-full">
                    <Image
                      crossOrigin="anonymous"
                      width={10000}
                      height={10000}
                      alt={'User Pic'}
                      src={`${USER_PROFILE_PIC_URL}/${m.user.profilePic}`}
                      className="rounded-full w-12 h-12 bg-primary_comp_hover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link href={`/explore/user/${m.user.username}`} className="text-lg font-medium">
                      {m.user.name}
                    </Link>
                    <div className="text-sm">{m.role}</div>
                  </div>
                </div>
                <Pen
                  onClick={() => {
                    setClickedEditUserMembership(m);
                    setClickedOnEditMembership(true);
                  }}
                  className="cursor-pointer"
                  color="white"
                  size={18}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center opacity-75 text-sm">
        Created By{' '}
        <Link href={`/explore/user/${chat.user.username}`} className="font-semibold underline underline-offset-2">
          {chat.user.name}
        </Link>{' '}
        on {moment(chat.createdAt).format('DD MMM YYYY')}
      </div>

      <div
        onClick={handleDelete}
        className="w-full py-4 text-center bg-primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active text-[#ea333e] rounded-lg cursor-pointer transition-ease-300"
      >
        Delete Group
      </div>
    </div>
  );
};

export default EditChat;
