import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Opening } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';

export const Openings = () => {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loading, setLoading] = useState(true);

  const search = new URLSearchParams(window.location.search).get('search');

  const fetchOpenings = async () => {
    setLoading(true);
    const URL = `${EXPLORE_URL}/openings/recommended${search && search != '' ? '?search=' + search : ''}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setOpenings(res.data.openings);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchOpenings();
  }, [search]);

  return <div>Openings</div>;
};
