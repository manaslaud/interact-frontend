import getHandler from '@/handlers/getHandler';
import { configSelector, setLastFetchedUnreadInvitations } from '@/slices/configSlice';
import { setUnreadInvitations } from '@/slices/feedSlice';
import Toaster from '@/helpers/toaster';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const useUnreadInvitationsFetcher = () => {
  const dispatch = useDispatch();

  const config = useSelector(configSelector);

  const fetchUnreadInvitations = () => {
    if (moment().utc().diff(config.lastFetchedUnreadInvitations, 'minute') < 2) return;
    const URL = `/invitations/unread`;
    getHandler(URL, 1)
      .then(res => {
        if (res.statusCode === 200) {
          const count: number = res.data.count;
          dispatch(setUnreadInvitations(count));
          dispatch(setLastFetchedUnreadInvitations(new Date().toUTCString()));
        } else Toaster.error(res.data.message);
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  return fetchUnreadInvitations;
};

export default useUnreadInvitationsFetcher;
