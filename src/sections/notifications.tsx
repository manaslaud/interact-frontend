import React, { useState, useEffect } from 'react';
import Loader from '@/components/common/loader';
import ApplicationUpdate from '@/components/notifications/applicationUpdate';
import Follow from '@/components/notifications/follow';
import Liked from '@/components/notifications/liked';
import UserAppliedToOpening from '@/components/notifications/userAppliedToOpening';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { Notification } from '@/types';
import Comment from '@/components/notifications/comment';
import InfiniteScroll from 'react-infinite-scroll-component';
import Welcome from '@/components/notifications/welcome';
import postHandler from '@/handlers/post_handler';
import { useDispatch, useSelector } from 'react-redux';
import { setUnreadNotifications, unreadNotificationsSelector } from '@/slices/feedSlice';
import { setLastFetchedUnreadNotifications } from '@/slices/configSlice';
import ChatRequest from '@/components/notifications/chatRequest';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Notifications = ({ setShow }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const totalUnreadNotification = useSelector(unreadNotificationsSelector);

  useEffect(() => {
    getNotifications();
  }, []);

  const markRead = (unreadNotifications: string[]) => {
    if (unreadNotifications.length == 0) return;
    const URL = `/notifications/unread`;
    postHandler(URL, { unreadNotifications })
      .then(res => {
        if (res.statusCode === 200) {
          const remainingUnreadNotifications = totalUnreadNotification - unreadNotifications.length;
          dispatch(setUnreadNotifications(remainingUnreadNotifications >= 0 ? remainingUnreadNotifications : 0));
          dispatch(setLastFetchedUnreadNotifications(new Date().toUTCString()));
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

  const getNotifications = () => {
    if (totalUnreadNotification == 0) return;
    setLoading(true);
    const URL = `/notifications/unread`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const notificationsData: Notification[] = res.data.notifications;
          const updatedUnreadNotificationIDs: string[] = [];
          notificationsData.forEach(notification => {
            if (!updatedUnreadNotificationIDs.includes(notification.id)) {
              updatedUnreadNotificationIDs.push(notification.id);
            }
          });
          markRead(updatedUnreadNotificationIDs);

          setNotifications(notificationsData);
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

  return (
    <>
      <div className="w-96 max-md:w-full max-h-[480px] max-md:max-h-none max-md:h-base_md overflow-y-auto absolute top-[72px] max-md:top-navbar right-4 max-md:right-0 rounded-2xl max-md:rounded-none backdrop-blur-lg flex flex-col items-center z-20 animate-fade_third">
        {loading ? (
          <Loader />
        ) : (
          <>
            {notifications.length === 0 ? (
              <div className="w-full font-primary flex-center text-white py-6 px-4 cursor-default text-center">
                No new notifications :)
              </div>
            ) : (
              <div className="w-full p-2">
                {notifications.map(notification => {
                  switch (notification.notificationType) {
                    case -1:
                      return <Welcome notification={notification} />;
                    case 0:
                      return <Follow notification={notification} />;
                    case 1:
                      return <Liked notification={notification} type={'post'} />;
                    case 2:
                      return <Comment notification={notification} type={'post'} />;
                    case 3:
                      return <Liked notification={notification} type={'project'} />;
                    case 4:
                      return <Comment notification={notification} type={'project'} />;
                    case 5:
                      return <UserAppliedToOpening notification={notification} />;
                    case 6:
                      return <ApplicationUpdate notification={notification} status={1} />;
                    case 7:
                      return <ApplicationUpdate notification={notification} status={0} />;
                    case 9:
                      return <ChatRequest notification={notification} />;
                    default:
                      return <></>;
                  }
                })}
              </div>
            )}
          </>
        )}
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop blur-lg backdrop-blur-xl w-screen h-screen fixed top-0 left-0 animate-fade_third"
      ></div>
    </>
  );
};

export default Notifications;
