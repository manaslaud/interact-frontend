import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import React, { useEffect, useState } from 'react';
import { initialEvent } from '@/types/initials';
import { EVENT_PIC_URL, EXPLORE_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { GetServerSidePropsContext } from 'next/types';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import Image from 'next/image';
import WidthCheck from '@/utils/wrappers/widthCheck';
import { ArrowUpRight, Buildings, CalendarBlank, CursorClick, Eye, MapPin, Ticket, Users } from '@phosphor-icons/react';
import EventCard from '@/components/explore/event_card';
import { Event } from '@/types';
import Link from 'next/link';
import moment from 'moment';
import getIcon from '@/utils/funcs/get_icon';
import getDomainName from '@/utils/funcs/get_domain_name';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import OrgSidebar from '@/components/common/org_sidebar';

interface Props {
  id: string;
}

const Event = ({ id }: Props) => {
  const [event, setEvent] = useState(initialEvent);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector(userSelector);

  const getEvent = () => {
    const URL = `${EXPLORE_URL}/events/${id}`;
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
    getEvent();
    getSimilarEvents();
  }, []);

  return (
    <BaseWrapper title="Event">
      {user.isOrganization ? <OrgSidebar index={1} /> : <Sidebar index={2} />}
      <MainWrapper>
        <div className="w-full py-12 px-20 max-md:p-2 flex flex-col transition-ease-out-500 font-primary">
          {loading ? (
            <Loader />
          ) : (
            <div className="w-[70vw] max-md:w-full mx-auto flex flex-col gap-12">
              <div className="w-full h-108 relative flex justify-between max-md:flex-col">
                <Image
                  width={10000}
                  height={10000}
                  src={`${EVENT_PIC_URL}/${event.coverPic}`}
                  alt=""
                  className="w-full h-full object-cover rounded-xl absolute top-0 -z-10"
                />
                <div className="w-full h-full rounded-xl bg-white bg-opacity-20 backdrop-blur-sm absolute top-0 -z-[5]"></div>
                <div className="w-1/2 max-md:w-full h-full p-8 flex flex-col justify-between">
                  <div className="w-full flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="text-6xl max-md:text-2xl font-semibold">{event.title}</div>
                      <Link href={`/explore`} className="text-2xl font-medium pl-1">
                        {event.organization.title}
                      </Link>
                    </div>
                    <div className="text-sm">{event.tagline}</div>
                  </div>

                  <div className="flex items-center gap-1 font-medium">
                    <MapPin size={20} /> {event.location}
                  </div>
                </div>
                <div className="w-1/2 h-full flex-center">
                  <div className="glassMorphism flex flex-col gap-4 p-6 rounded-xl">
                    <div className="flex items-center gap-2 text-xl font-medium">
                      <CalendarBlank weight="bold" /> Event Dates
                    </div>
                    <div className="w-full h-full flex gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs">FROM</div>
                        <div>{moment(event.startTime).format('hh:mmA MMM DD, YYYY')}</div>
                      </div>
                      <div className="w-[1px] h-12 border-r-[1px] border-dashed border-primary_black border-opacity-50"></div>
                      <div className="flex flex-col gap-1">
                        <div className="text-xs">TO</div>
                        <div>{moment(event.endTime).format('hh:mmA MMM DD, YYYY')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex max-md:flex-col gap-8">
                <div className="bg-white w-3/5 max-md:w-full border-[1px] rounded-md">
                  <div className="w-full p-4 border-b-[1px] font-medium">About the event</div>
                  <div className="p-4 whitespace-pre-wrap text-gray-600 text-sm">{event.description}</div>

                  {event.tags && event.tags.length > 0 ? (
                    <div className="w-full flex flex-col gap-2 p-4">
                      <div className="font-medium">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                          <div
                            key={tag}
                            className="flex-center px-2 py-1 border-[1px] border-dashed border-gray-400
        text-xs rounded-lg cursor-default"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="w-full flex gap-4 items-center justify-center flex-wrap p-6">
                    <div className="flex flex-col items-center gap-2 p-4 cursor-default">
                      <Eye size={24} />
                      <div className="flex flex-col text-center items-center">
                        <div> 157,353</div>
                        <div className="text-xs text-gray-500">Impressions</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 cursor-default">
                      <CursorClick size={24} />
                      <div className="flex flex-col text-center items-center">
                        <div> {event.noViews}</div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                    </div>
                    {event.links && event.links.length > 0 ? (
                      event.links.map((link, index) => (
                        <Link
                          href={link}
                          target="_blank"
                          key={index}
                          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:shadow-xl transition-ease-300"
                        >
                          {getIcon(getDomainName(link), 32, 'light')}
                          <div className="text-xs text-gray-500">{getDomainName(link)}</div>
                        </Link>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="bg-white w-2/5 max-md:w-full flex flex-col border-[1px] rounded-md">
                  <div className="w-full flex items-center gap-1 p-4 border-b-[1px] font-medium">
                    About the Organization <Buildings />
                  </div>
                  <div className="w-full flex flex-col gap-2 p-4">
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex gap-2">
                        <Image
                          width={10000}
                          height={10000}
                          src={`${USER_PROFILE_PIC_URL}/${event.organization.user.coverPic}`}
                          alt=""
                          className="w-14 h-14 rounded-full"
                        />
                        <Link href={`/explore`} className="w-[calc(100%-56px)] flex justify-between gap-2 flex-wrap">
                          <div className="">
                            <div className="font-semibold text-2xl">{event.organization.title}</div>
                            <div className="text-sm text-gray-500">@{event.organization.user.username}</div>
                          </div>
                          <ArrowUpRight size={24} />
                        </Link>
                      </div>
                      <div className="text-sm">{event.organization.user.tagline}</div>
                    </div>
                    <div className="text-sm">{event.organization.user.bio}</div>
                    <div className="w-full flex gap-4 items-center justify-center flex-wrap p-6">
                      <div className="flex flex-col items-center gap-2 p-4 cursor-default">
                        <CursorClick size={24} />
                        <div className="flex flex-col text-center items-center">
                          <div>157,353</div>
                          <div className="text-xs text-gray-500">Views</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-4 cursor-default">
                        <Ticket size={24} />
                        <div className="flex flex-col text-center items-center">
                          <div>242</div>
                          <div className="text-xs text-gray-500">Total Events</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-4 cursor-default">
                        <Users size={24} />
                        <div className="flex flex-col text-center items-center">
                          <div>242</div>
                          <div className="text-xs text-gray-500">Members</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full text-sm text-center font-medium text-gray-500">
                      On Interact Since {moment(event.organization.createdAt).format('MMM, YYYY')}
                    </div>
                  </div>
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
