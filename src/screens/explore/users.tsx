import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { User } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/common/loader';
import UserCard from '@/components/explore/user_card';
import NoSearch from '@/components/empty_fillers/search';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProfileCompletion from '@/sections/explore/profile_completion';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = async (search: string | null) => {
    const URL =
      search && search != ''
        ? `${EXPLORE_URL}/users/trending?${'search=' + search}`
        : `${EXPLORE_URL}/users/recommended?page=${page}&limit=${10}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      if (search && search != '') {
        setUsers(res.data.users || []);
        setHasMore(false);
      } else {
        const addedUsers = [...users, ...(res.data.users || [])];
        if (addedUsers.length === users.length) setHasMore(false);
        setUsers(addedUsers);
        setPage(prev => prev + 1);
      }
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else Toaster.error(SERVER_ERROR, 'error_toaster');
    }
  };

  useEffect(() => {
    setPage(1);
    fetchUsers(new URLSearchParams(window.location.search).get('search'));
  }, [window.location.search]);
  return (
    <div className="w-full flex flex-col gap-6 py-2">
      {loading ? (
        <Loader />
      ) : (
        <>
          {users.length > 0 ? (
            <InfiniteScroll
              className="w-[720px] max-md:w-full max-md:px-4 mx-auto flex flex-col items-center gap-2"
              dataLength={users.length}
              next={() => fetchUsers(new URLSearchParams(window.location.search).get('search'))}
              hasMore={hasMore}
              loader={<Loader />}
            >
              <ProfileCompletion />
              {users.map(user => {
                return <UserCard key={user.id} user={user} />;
              })}
            </InfiniteScroll>
          ) : (
            <NoSearch />
          )}
        </>
      )}
    </div>
  );
};

export default Users;
