import { EXPLORE_URL } from '@/config/routes';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { ArrowDownLeft, ChartLineUp } from '@phosphor-icons/react';
import { SERVER_ERROR } from '@/config/errors';
import { User } from '@/types';
import { userSelector } from '@/slices/userSlice';
import UserCard from '@/components/explore/user_card';
import TrendingCardLoader from '@/components/loaders/feed_trending_card';

const TrendingCard = () => {
  const [searches, setSearches] = useState(['Something', 'Nothing', 'Interact', 'Pratham', 'Tech']);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const user = useSelector(userSelector);

  const fetchSearches = () => {
    const URL = `${EXPLORE_URL}/trending_searches`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const searchData: string[] = res.data.searches || [];
          setSearches(searchData.splice(0, 5));
          setLoading(false);
        } else if (res.status != -1) {
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

  const fetchProfiles = () => {
    const URL = `${EXPLORE_URL}/users/trending?limit=3&page=1`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const profileData: User[] = res.data.users || [];
          setProfiles(profileData.filter(u => u.id != user.id));
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

  useEffect(() => {
    fetchProfiles();
    fetchSearches();
  }, []);

  return (
    <>
      {loading ? (
        <TrendingCardLoader />
      ) : (
        <div
          className={`${
            open
              ? 'w-[24vw] h-[75vh] pb-4 gap-4 pt-4 px-4 top-[150px] overflow-y-auto'
              : 'w-[48px] h-[48px] pb-0 gap-0 pt-12 px-0 top-[90px] hover:shadow-lg'
          } shadow-md dark:shadow-none transition-ease-500 sticky overflow-y-hidden overflow-x-hidden font-primary flex flex-col dark:text-white bg-white dark:bg-[#84478023] backdrop-blur-md border-[1px] border-gray-300 dark:border-dark_primary_btn max-lg:hidden rounded-md`}
        >
          <ArrowDownLeft
            onClick={() => setOpen(prev => !prev)}
            className={`absolute ${
              open ? 'top-0 right-0' : 'top-2 right-2 rotate-180'
            } text-gray-500 dark:text-white transition-ease-500 cursor-pointer`}
            size={32}
          />
          <div
            className={`${
              open ? 'text-4xl opacity-100' : 'text-xxs opacity-0'
            } transition-ease-500 font-bold text-gradient`}
          >
            Trending Now
          </div>
          {searches && searches.length > 0 ? (
            <div
              className={`w-full ${
                open ? 'gap-2 mt-2 opacity-100' : 'gap-0 mt-0 opacity-0'
              } transition-ease-500 flex flex-wrap`}
            >
              {searches.map((str, i) => {
                return (
                  <Link
                    href={`/explore?search=${str}`}
                    key={i}
                    className={`w-fit flex items-center gap-2 bg-slate-100 dark:bg-[#ff9bff39] dark:border-dark_primary_btn dark:border-[1px] rounded-lg ${
                      open ? 'px-4 py-1' : 'px-0 py-0 text-xxs'
                    } transition-ease-500`}
                  >
                    <div>{str}</div>
                    {i < 3 ? <ChartLineUp /> : <></>}
                  </Link>
                );
              })}
            </div>
          ) : (
            <></>
          )}
          <div
            className={`${open ? 'text-2xl pt-4 mt-2 opacity-100' : 'text-xxs pt-0 mt-0 opacity-0'} ${
              profiles.length == 0 ? 'hidden' : ''
            } border-t-2 border-dashed transition-ease-500 font-medium`}
          >
            Profiles to Follow
          </div>
          <div className={`w-full flex flex-col gap-2 ${open ? 'opacity-100' : 'opacity-0'} transition-ease-300`}>
            {profiles.map(u => (
              <UserCard key={u.id} user={u} forTrending={true} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TrendingCard;
