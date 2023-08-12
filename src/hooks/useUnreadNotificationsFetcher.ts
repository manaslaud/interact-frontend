import getHandler from '@/handlers/getHandler';
import { configSelector, setLastFetchedUnreadNotifications } from '@/slices/configSlice';
import { setUnreadNotifications } from '@/slices/feedSlice';
import Toaster from '@/helpers/toaster';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const useUnreadNotificationsFetcher = () => {
  const dispatch = useDispatch();

  const config = useSelector(configSelector);

  const fetchUnreadNotifications = () => {
    if (moment().utc().diff(config.lastFetchedUnreadNotifications, 'seconds') < 30) return;
    const URL = `/notifications/unread`;
    getHandler(URL, 1)
      .then(res => {
        if (res.statusCode === 200) {
          const count: number = res.data.count;
          dispatch(setUnreadNotifications(count));
          dispatch(setLastFetchedUnreadNotifications(new Date().toUTCString()));
        } else Toaster.error(res.data.message);
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  return fetchUnreadNotifications;
};

export default useUnreadNotificationsFetcher;
