import Loader from '@/components/common/loader';
import UserCard from '@/components/explore/user_card';
import { SERVER_ERROR } from '@/config/errors';
import { CONNECTION_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { User } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  type: string; // followers or following
  user: User;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Connections = ({ type, user, setShow }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    const URL = `${CONNECTION_URL}/${type}/${user.id}?page=${page}&limit=${10}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const newUsers = res.data.users || [];
      const addedUsers = [...users, ...newUsers];
      if (addedUsers.length === users.length) setHasMore(false);
      setUsers(res.data.users);
      setPage(prev => prev + 1);

      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);
  return (
    <>
      <div className="w-2/5 max-md:w-5/6 h-108 fixed overflow-y-auto backdrop-blur-lg bg-[#ffe1fc22] max-md:bg-[#2a192eea] text-white z-30 translate-x-1/2 -translate-y-1/4 top-64 right-1/2 flex flex-col font-primary p-4 gap-6 rounded-xl animate-fade_third">
        <div className="w-full text-center text-gradient font-semibold text-2xl capitalize">
          {type} of {user.name}
        </div>
        <>
          {!users || users.length === 0 ? (
            <></>
          ) : (
            <InfiniteScroll
              className="px-4 max-md:px-2 flex flex-col gap-2"
              dataLength={users.length}
              next={fetchUsers}
              hasMore={hasMore}
              loader={<Loader />}
            >
              {users.map(user => {
                return <UserCard key={user.id} user={user} />;
              })}
            </InfiniteScroll>
          )}
        </>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen max-md:h-base fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default Connections;
