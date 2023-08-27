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
  const [loading, setLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

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
    const URL = `/notifications?page=${page}&limit=${10}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const newNotifications: Notification[] = res.data.notifications;
          const updatedUnreadNotificationIDs: string[] = [];
          newNotifications.forEach(notification => {
            if (!notification.isRead)
              if (!updatedUnreadNotificationIDs.includes(notification.id)) {
                updatedUnreadNotificationIDs.push(notification.id);
              }
          });
          markRead(updatedUnreadNotificationIDs);

          const addedNotifications = [...notifications, ...newNotifications];
          if (addedNotifications.length === notifications.length) setHasMore(false);
          setNotifications(addedNotifications);
          setLoading(false);
          setPage(prev => prev + 1);
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
      <div className="w-96 h-108 max-md:w-full overflow-y-auto absolute top-[50px] max-md:top-[40px] max-md:h-[95vh] right-5 max-md:right-0 flex flex-col items-center bg-white z-20">
        {loading ? (
          <Loader />
        ) : (
          <>
            {notifications.length === 0 ? (
              <div className="w-full flex flex-col items-center gap-2 py-24 cursor-default text-center">
                <div className="font-Helvetica text-2xl">
                  Looks like you&apos;re as popular as a rainy day on a picnic.
                </div>
                <div className="font-sans text-lg text-center">
                  Explore the wonders of our platform and who knows, maybe someone will notice you and shower you with
                  notifications soon!
                </div>
              </div>
            ) : (
              <InfiniteScroll //! Not working
                dataLength={notifications.length}
                next={getNotifications}
                hasMore={hasMore}
                loader={<Loader />}
                className="w-full h-full flex flex-col gap-2"
              >
                {notifications.map((notification, index) => {
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
              </InfiniteScroll>
            )}
          </>
        )}
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third"
      ></div>
    </>
  );
};

export default Notifications;
