import Loader from '@/components/common/loader';
import { WORKSPACE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Application } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const getApplications = () => {
    const URL = `${WORKSPACE_URL}/applications`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setApplications(res.data.application || []);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message);
          else {
            Toaster.error('Internal Server Error');
            console.log(res);
          }
        }
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  useEffect(() => {
    getApplications();
  }, []);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>{applications.length > 0 ? <div className="w-full"></div> : <div>No applications found</div>}</>
      )}
    </div>
  );
};

export default Applications;
