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

  const fetchUsers = async (search: string | null) => {
    setLoading(true);
    const URL =
      search && search != ''
        ? `${EXPLORE_URL}/users/trending${'?search=' + search}`
        : `${EXPLORE_URL}/users/recommended`;
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
    fetchUsers(new URLSearchParams(window.location.search).get('search'));
  }, [window.location.search]);
  return (
    <div className="w-full flex flex-col gap-6 p-2">
      {loading ? (
        <Loader />
      ) : (
        <>
          {users.length > 0 ? (
            <div className="w-[720px] max-md:w-full max-md:px-4 mx-auto flex flex-col gap-4">
              {users.map(user => {
                return <UserCard key={user.id} user={user} />;
              })}
            </div>
          ) : (
            <div>No Users found</div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
