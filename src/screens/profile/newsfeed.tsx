import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Poll } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PollCard from '@/components/organization/poll_card';

interface Props {
  orgID: string;
}

const NewsFeed = ({ orgID }: Props) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  const getPolls = () => {
    const URL = `${ORG_URL}/${orgID}/polls`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setPolls(res.data.polls || []);
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
    getPolls();
  }, []);

  return (
    <div className="w-4/5 mx-auto pb-base_padding flex flex-col gap-4">
      <PollCard />
      <PollCard />
    </div>
  );
};

export default NewsFeed;
