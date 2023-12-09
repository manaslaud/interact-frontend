import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import React, { useEffect, useState } from 'react';
import { initialEvent } from '@/types/initials';
import { EVENT_PIC_URL, EVENT_URL, EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { GetServerSidePropsContext } from 'next/types';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import Image from 'next/image';
import WidthCheck from '@/utils/wrappers/widthCheck';
import { CalendarBlank, CursorClick, Eye, MapPin, Users } from '@phosphor-icons/react';
import EventCard from '@/components/explore/event_card';
import { Event } from '@/types';

interface Props {
  id: string;
}

const Event = ({ id }: Props) => {
  const [event, setEvent] = useState(initialEvent);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const getEvent = () => {
    const URL = `${EVENT_URL}/${id}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setEvent(res.data.event);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  const getSimilarEvents = () => {
    const URL = `${EXPLORE_URL}/events/similar/${id}?limit=10`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setSimilarEvents(res.data.events || []);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    // getEvent();
    // getSimilarEvents();
  }, []);

  return (
    <BaseWrapper title="Event">
      <Sidebar index={2} />
      <MainWrapper>
        <div className="w-full py-12 px-20 max-md:p-2 flex flex-col transition-ease-out-500 font-primary">
          {loading ? (
            <Loader />
          ) : (
            <div className="w-[70vw] max-md:w-full mx-auto flex flex-col gap-12">
              <div className="w-full h-108 relative flex justify-between max-md:flex-col items-end">
                <Image
                  width={10000}
                  height={10000}
                  src={`${EVENT_PIC_URL}/${event.coverPic}`}
                  alt=""
                  className="w-full h-full object-cover rounded-xl absolute top-0 -z-10"
                />
                <div className="w-full h-full rounded-xl bg-white bg-opacity-20 backdrop-blur-sm absolute top-0 -z-[5]"></div>
                <div className="w-1/2 max-md:w-full h-full px-4 py-12 flex flex-col justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="text-6xl max-md:text-2xl font-semibold">{event.title}</div>
                    <div className="text-2xl font-medium pl-1">{event.organization.title}</div>
                  </div>
                  <div className="text-sm">{event.tagline}</div>
                  <div className="flex items-center gap-1 font-medium">
                    <MapPin size={20} /> {event.location}
                  </div>
                </div>
                <div className="glassMorphism flex flex-col gap-4 p-4 rounded-br-xl rounded-tl-md">
                  <div className="flex items-center gap-2 font-medium">
                    <CalendarBlank weight="bold" /> 9.30PM Aug 20, 2023
                  </div>
                </div>
              </div>
              <div className="w-full flex max-md:flex-col gap-8">
                <div className="bg-white w-3/5 max-md:w-full border-[1px] rounded-md">
                  <div className="w-full p-4 border-b-[1px] font-medium">About this event</div>
                  <div className="p-4 whitespace-pre-wrap text-gray-600 text-sm">{event.description}</div>
                  <div className="w-full flex flex-wrap gap-2">Tags</div>
                  <div className="w-full flex gap-10 items-center justify-center flex-wrap p-6">
                    <div className="flex flex-col items-center gap-2">
                      <Eye size={24} />
                      <div className="flex flex-col text-center items-center">
                        <div> 157,353</div>
                        <div className="text-xs text-gray-500">Impressions</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <CursorClick size={24} />
                      <div className="flex flex-col text-center items-center">
                        <div> {event.noViews}</div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white w-2/5 max-md:w-full flex flex-col border-[1px] rounded-md">
                  <div className="w-full p-4 border-b-[1px] font-medium">About the Organization</div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4">
                <div className="font-medium text-gray-600 text-center">Similar Events</div>
                <div className="w-full flex gap-6 flex-wrap justify-around">
                  {similarEvents.map(e => (
                    <EventCard key={e.id} event={e} size={80} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Event;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  return {
    props: { id },
  };
}
