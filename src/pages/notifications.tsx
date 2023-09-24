import Loader from '@/components/common/loader';
import Sidebar from '@/components/common/sidebar';
import ApplicationUpdate from '@/components/notifications/applicationUpdate';
import ChatRequest from '@/components/notifications/chatRequest';
import Follow from '@/components/notifications/follow';
import Liked from '@/components/notifications/liked';
import UserAppliedToOpening from '@/components/notifications/userAppliedToOpening';
import Welcome from '@/components/notifications/welcome';
import { NOTIFICATION_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Protect from '@/utils/protect';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useEffect, useState } from 'react';
import { Notification } from '@/types';
import Comment from '@/components/notifications/comment';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    const URL = `${NOTIFICATION_URL}?page=${page}&limit=${10}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const notificationsData: Notification[] = res.data.notifications;
          const addedNotifications = [...notifications, ...notificationsData];
          if (addedNotifications.length === notifications.length) setHasMore(false);
          setNotifications(addedNotifications);
          setLoading(false);
          setPage(prev => prev + 1);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error('Internal Server Error', 'error_toaster');
            console.log(res);
          }
        }
      })
      .catch(err => {
        Toaster.error('Internal Server Error', 'error_toaster');
        console.log(err);
      });
  };
  return (
    <BaseWrapper title="Notifications">
      <Sidebar index={8} />
      <MainWrapper>
        <div className="w-full max-lg:w-full mx-auto flex flex-col gap-4 px-8 max-md:px-4 py-6 font-primary relative transition-ease-out-500">
          <div className="text-3xl font-extrabold text-gradient pl-2">Notifications</div>
          {loading ? (
            <Loader />
          ) : (
            <div className="w-full flex flex-col gap-2">
              {notifications.length === 0 ? (
                <div className="w-full font-primary flex-center dark:text-white py-4 cursor-default text-center">
                  No notifications :)
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={notifications.length}
                  next={getNotifications}
                  hasMore={hasMore}
                  loader={<Loader />}
                  className="flex flex-col gap-2"
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
            </div>
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Protect(Home);
