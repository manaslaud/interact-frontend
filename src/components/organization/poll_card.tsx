import React, { useState } from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import moment from 'moment';
import { Option, Poll, User } from '@/types';

const PollCard = () => {
  const votedBy: User[] = [];

  const [poll, setPoll] = useState<Poll>({
    id: '123',
    title: '',
    content:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione, nobis? Quod odio quos, sit, facere maiores fugiat asperiores, deleniti unde expedita omnis ipsum officia eius distinctio impedit labore saepe. Officia doloribus magni aperiam perferendis repudiandae asperiores mollitia at tempora sed, consequatur incidunt maxime. Consequuntur suscipit repudiandae ea exercitationem quasi id nobis veritatis deleniti, ut obcaecati illo?',
    organizationID: '',
    organization: null,
    isMultiAnswer: true,
    totalVotes: 10,
    options: [
      { id: '1', content: 'Some Option 1', pollID: '123', votedBy: votedBy, noVotes: 1 },
      { id: '2', content: 'Some Option 2', pollID: '123', votedBy: votedBy, noVotes: 2 },
      { id: '3', content: 'Some Option 3', pollID: '123', votedBy: votedBy, noVotes: 3 },
      { id: '4', content: 'Some Option 4', pollID: '123', votedBy: votedBy, noVotes: 4 },
    ],
    createdAt: new Date(),
  });

  const handleClickOption = (option: Option) => {
    setPoll(prev => {
      return {
        ...prev,
        totalVotes: prev.totalVotes + 1,
        options: prev.options.map(o => {
          if (o.id == option.id) return { ...o, noVotes: o.noVotes + 1 };
          return o;
        }),
      };
    });
  };

  interface OptionProps {
    option: Option;
  }

  const OptionBar = ({ option }: OptionProps) => {
    const barWidth = (option.noVotes * 100) / poll.totalVotes;

    return (
      <div
        onClick={() => handleClickOption(option)}
        className="w-full h-3 max-md:hidden border-dark_primary_btn border-2 rounded-lg cursor-pointer"
      >
        <div
          style={{ width: `${barWidth}%` }}
          className={`h-full bg-dark_primary_btn rounded-lg ${barWidth != 100 ? 'rounded-r-none' : ''}`}
        ></div>
      </div>
    );
  };

  const Option = ({ option }: OptionProps) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex justify-between">
          <div>{option.content}</div>
          <div className="flex gap-1">
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/default.jpg`}
              className="rounded-full w-6 h-6"
            />
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/default.jpg`}
              className="rounded-full w-6 h-6"
            />
          </div>
        </div>
        <OptionBar option={option} />
      </div>
    );
  };
  return (
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
            <div className="text-xl font-semibold">{'Some Name'}</div>
            <div className="text-xs">@{'someusername'}</div>
          </div>
        </div>
        <div className="text-gray-400 font-medium text-xs">{moment().fromNow()}</div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="text-xl font-medium">{poll.title}</div>
        <div className="text-sm">{poll.content}</div>
      </div>

      <div className="w-full flex flex-col gap-3">
        {poll.options.map(option => (
          <Option key={option.id} option={option} />
        ))}
      </div>
      <div className="text-sm text-gray-400 font-medium">
        {poll.totalVotes} Vote{poll.totalVotes != 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default PollCard;
