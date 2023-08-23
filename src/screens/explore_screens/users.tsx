import SearchBar from '@/components/explore/searchbar';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { User } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/common/loader';
import UserCard from '@/components/explore/user_card';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const search = new URLSearchParams(window.location.search).get('search');

  const fetchUsers = async () => {
    setLoading(true);
    const URL = `${EXPLORE_URL}/users/recommended${search && search != '' ? '?search=' + search : ''}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setUsers(res.data.users || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);
  return (
    <>
      <SearchBar initialValue={search && search != '' ? search : ''} />
      {loading ? (
        <Loader />
      ) : (
        <>
          {users.length > 0 ? (
            <div className="w-full px-16 flex flex-wrap justify-evenly">
              {users.map(user => {
                return <UserCard key={user.id} user={user} />;
              })}
            </div>
          ) : (
            <div>No Users found</div>
          )}
        </>
      )}
    </>
  );
};

export default Users;
