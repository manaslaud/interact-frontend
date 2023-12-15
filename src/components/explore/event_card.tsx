import React from 'react';
import Image from 'next/image';
import { Event } from '@/types';
import Link from 'next/link';
import { EVENT_PIC_URL } from '@/config/routes';
import { Eye, PencilSimple, Trash } from '@phosphor-icons/react';
import moment from 'moment';

interface Props {
  event: Event;
  size?: number | string;
  org?: boolean;
  setClickedOnEditEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedEditEvent?: React.Dispatch<React.SetStateAction<Event>>;
  setClickedOnDeleteEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedDeleteEvent?: React.Dispatch<React.SetStateAction<Event>>;
}

const EventCard = ({
  event,
  size = 96,
  org = false,
  setClickedOnEditEvent,
  setClickedEditEvent,
  setClickedOnDeleteEvent,
  setClickedDeleteEvent,
}: Props) => {
  const variants = ['w-96', 'w-84', 'w-80', 'w-[22rem]'];
  return (
    <Link
      href={`/explore/event/${event.id}`}
      className={`w-${size} rounded-xl hover:shadow-xl transition-ease-out-500`}
    >
      <div className="relative group">
        <div className="flex gap-1 top-2 right-2 absolute bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">
          <Eye size={12} /> <div>{event.noImpressions}</div>
        </div>
        <Image
          width={10000}
          height={10000}
          src={`${EVENT_PIC_URL}/${event.coverPic}`}
          alt=""
          className={`w-full ${size == 96 ? 'h-56' : 'h-[218px]'} object-cover rounded-t-xl`}
        />
        {org ? (
          <div className="flex gap-2 absolute opacity-0 group-hover:opacity-100 top-2 right-2 transition-ease-300">
            <div
              onClick={el => {
                el.stopPropagation();
                el.preventDefault();
                if (setClickedEditEvent) setClickedEditEvent(event);
                if (setClickedOnEditEvent) setClickedOnEditEvent(true);
              }}
              className="bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg"
            >
              <PencilSimple size={18} />
            </div>
            <div
              onClick={el => {
                el.stopPropagation();
                el.preventDefault();
                if (setClickedDeleteEvent) setClickedDeleteEvent(event);
                if (setClickedOnDeleteEvent) setClickedOnDeleteEvent(true);
              }}
              className=" bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg "
            >
              <Trash size={18} />
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="absolute bottom-2 right-2 bg-white text-gray-500 text-xxs px-2 py-1 rounded-lg">
          {event.organization.title}
        </div>
      </div>
      <div className="w-full bg-white rounded-b-xl flex p-4">
        <div className="w-1/6 flex items-start justify-start mt-1">
          <div className="w-fit flex flex-col items-end">
            <div className={`w-fit ${size == 96 ? 'text-xs' : 'text-xxs'} uppercase transition-ease-out-500`}>
              {moment(event.startTime).format('MMM')}
            </div>
            <div className={`w-fit ${size == 96 ? 'text-3xl' : 'text-2xl'} font-semibold transition-ease-out-500`}>
              {moment(event.startTime).format('DD')}
            </div>
          </div>
        </div>
        <div className={`w-5/6 ${size == 96 ? 'h-20' : 'h-16'} flex flex-col gap-2 transition-ease-out-500`}>
          <div className="font-medium">{event.title}</div>
          <div className={`${size == 96 ? 'text-sm ' : 'text-xs'} text-gray-500 line-clamp-2 transition-ease-out-500`}>
            {event.tagline}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
