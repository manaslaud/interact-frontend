import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import moment from 'moment';
import { Option, Organization, Poll } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { setVotedOptions, userSelector } from '@/slices/userSlice';
import patchHandler from '@/handlers/patch_handler';
import { SERVER_ERROR } from '@/config/errors';
import Toaster from '@/utils/toaster';
import { initialUser } from '@/types/initials';
import deleteHandler from '@/handlers/delete_handler';
import ConfirmDelete from '../common/confirm_delete';
import { ORG_SENIOR } from '@/config/constants';
import { ListChecks, Lock, LockOpen, RadioButton } from '@phosphor-icons/react';

interface Props {
  poll: Poll;
  organisation: Organization;
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
}

const PollCard = ({ poll, setPolls, organisation }: Props) => {
  const [clickedOnDelete, setClickedOnDelete] = useState(false);
  const user = useSelector(userSelector);

  const votedOptions = user.votedOptions || [];

  const dispatch = useDispatch();

  const userID = user.id;

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting Poll...');

    const URL = `${ORG_URL}/${poll.organizationID}/polls/${poll.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      setPolls(prev => prev.filter(p => p.id != poll.id));
      setClickedOnDelete(false);
      Toaster.stopLoad(toaster, 'Poll Deleted', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  const handleVoteOption = async (option: Option, setIsVoted: React.Dispatch<React.SetStateAction<boolean>>) => {
    const URL = `${ORG_URL}/${organisation.id}/polls/vote/${poll.id}/${option.id}`;

    const res = await patchHandler(URL, {});
    if (res.statusCode == 200) {
      setPolls(prev =>
        prev.map(p => {
          if (p.id == poll.id) {
            const newUser = initialUser;
            newUser.id = user.id;
            newUser.name = user.name;
            newUser.username = user.username;
            newUser.profilePic = user.profilePic;

            return {
              ...p,
              totalVotes: p.totalVotes + 1,
              options: p.options.map(o => {
                if (o.id == option.id) return { ...o, noVotes: o.noVotes + 1, votedBy: [...o.votedBy, newUser] };
                return o;
              }),
            };
          } else return p;
        })
      );
      dispatch(setVotedOptions([...votedOptions, option.id]));
      setIsVoted(true);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      }
    }
  };

  const handleUnVoteOption = async (option: Option, setIsVoted: React.Dispatch<React.SetStateAction<boolean>>) => {
    const URL = `${ORG_URL}/${organisation.id}/polls/unvote/${poll.id}/${option.id}`;

    const res = await patchHandler(URL, {});
    if (res.statusCode == 200) {
      setPolls(prev =>
        prev.map(p => {
          if (p.id == poll.id)
            return {
              ...p,
              totalVotes: p.totalVotes - 1,
              options: p.options.map(o => {
                if (o.id == option.id)
                  return { ...o, noVotes: o.noVotes - 1, votedBy: o.votedBy.filter(u => u.id != userID) };
                return o;
              }),
            };
          else return p;
        })
      );
      const newVotedOptions = [...votedOptions];
      newVotedOptions.splice(newVotedOptions.indexOf(option.id), 1);
      dispatch(setVotedOptions(newVotedOptions));
      setIsVoted(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      }
    }
  };

  interface OptionBarProps {
    option: Option;
    isVoted: boolean;
    setIsVoted: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const OptionBar = ({ option, isVoted, setIsVoted }: OptionBarProps) => {
    const [barWidth, setBarWidth] = useState(0);

    useEffect(() => {
      setBarWidth(poll.totalVotes == 0 ? 0 : (option.noVotes * 100) / poll.totalVotes);
    }, [poll, option]);

    return (
      <div
        onClick={() => {
          isVoted ? handleUnVoteOption(option, setIsVoted) : handleVoteOption(option, setIsVoted);
        }}
        className="w-full h-3 group max-md:hidden border-dark_primary_btn border-2 rounded-lg cursor-pointer"
      >
        <div
          style={{ width: `${barWidth}%` }}
          className={`h-full ${isVoted ? 'bg-[#9275b9]' : 'bg-[#e7d5ffba] group-hover:bg-[#cca5ffba]'} rounded-lg ${
            barWidth != 100 ? 'rounded-r-none' : ''
          } transition-ease-300`}
        ></div>
      </div>
    );
  };

  interface OptionProps {
    option: Option;
  }

  const Option = ({ option }: OptionProps) => {
    const [isVoted, setIsVoted] = useState(false);

    useEffect(() => {
      if (votedOptions.includes(option.id)) setIsVoted(true);
    }, [option]);

    return (
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex justify-between">
          <div>{option.content}</div>
          <div className="w-32 flex gap-1 relative">
            {option.votedBy
              ?.filter((u, index) => {
                return index >= 0 && index < 3;
              })
              .map((u, index) => {
                return (
                  <Image
                    key={index}
                    crossOrigin="anonymous"
                    width={50}
                    height={50}
                    alt={'User Pic'}
                    src={`${USER_PROFILE_PIC_URL}/${u.profilePic}`}
                    className={`w-6 h-6 rounded-full cursor-default absolute top-0 right-${index * 3}`}
                  />
                );
              })}
            {option.noVotes > 3 ? (
              <div className="bg-gray-100 flex-center border-[1px] border-primary_black text-xs text-medium w-6 h-6 rounded-full cursor-default absolute top-0 right-[36px]">
                +{option.noVotes - 3}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <OptionBar option={option} isVoted={isVoted} setIsVoted={setIsVoted} />
      </div>
    );
  };
  return (
    <>
      {clickedOnDelete ? <ConfirmDelete handleDelete={handleDelete} setShow={setClickedOnDelete} /> : <></>}
      <div className="w-full max-w-3xl mx-auto bg-white flex flex-col gap-4 p-4 border-[1px] border-gray-300 rounded-xl hover:shadow-xl transition-ease-300 z-[1]">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/default.jpg`}
              className="rounded-full w-10 h-10"
            />
            <div className="w-fit">
              <div className="text-xl font-semibold">{organisation.user.name}</div>
              <div className="text-xs">@{organisation.user.username}</div>
            </div>
          </div>
          <div className="text-gray-400 font-medium text-xs">{moment(poll.createdAt).fromNow()}</div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="text-xl font-medium">{poll.title}</div>
          <div className="text-sm">{poll.content}</div>
        </div>
        <div className="w-full flex flex-col gap-3">
          {poll.options?.map(option => (
            <Option key={option.id} option={option} />
          ))}
        </div>

        <div className="w-full flex flex-col gap-1">
          <div className="flex justify-end items-center gap-4 text-sm text-gray-400 font-medium">
            <div className="flex-center gap-1">
              {poll.isOpen ? (
                <>
                  <LockOpen /> <div>Open</div>
                </>
              ) : (
                <>
                  <Lock /> <div>Only for members</div>
                </>
              )}
            </div>
            <div className="flex-center gap-1">
              {poll.isMultiAnswer ? (
                <>
                  <ListChecks /> <div>Multiple Options</div>
                </>
              ) : (
                <>
                  <RadioButton /> <div>Single Option</div>
                </>
              )}
            </div>
          </div>{' '}
          <div className="w-full flex justify-between">
            <div className="text-sm text-gray-400 font-medium">
              {poll.totalVotes} Vote{poll.totalVotes != 1 ? 's' : ''}
            </div>

            {(user.isOrganization && user.id == organisation.userID) ||
            user.organizationMemberships
              .filter(m => m.role == ORG_SENIOR)
              .map(m => m.organizationID)
              .includes(organisation.id) ? (
              <div onClick={() => setClickedOnDelete(true)} className="text-sm text-primary_danger cursor-pointer">
                Delete
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

export default PollCard;
