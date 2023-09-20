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
import Welcome from '@/components/notifications/welcome';
import ChatRequest from '@/components/notifications/chatRequest';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Notifications = ({ setShow }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    // if (totalUnreadNotification == 0) return;
    setLoading(true);
    // const URL = `/notifications/unread`;
    const URL = `/notifications`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const notificationsData: Notification[] = res.data.notifications;
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
      <div className="w-96 bg-[#200c1944] font-primary max-md:w-full max-h-[480px] max-md:max-h-none max-md:h-screen overflow-y-auto fixed top-[72px] max-md:top-0 right-4 max-md:right-0 rounded-2xl max-md:rounded-none backdrop-blur-lg backdrop flex flex-col items-center p-2 z-50 animate-fade_third">
        <div className="w-full flex flex-col gap-2 max-md:gap-4 p-4 pb-2">
          <div className="w-full flex items-center justify-between">
            <div className="w-fit text-start text-2xl max-md:text-3xl font-bold text-gradient">Notification Center</div>
            <div onClick={() => setShow(false)} className="text-xl text-white cursor-pointer md:hidden">
              X
            </div>
          </div>

          <div className="w-full h-[1px] bg-primary_btn"></div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            {notifications.length === 0 ? (
              <div className="w-full font-primary flex-center text-white py-4 cursor-default text-center">
                No new notifications :)
              </div>
            ) : (
              <div className="w-full">
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
        {/* <div className="text-white font-primary text-xs hover:underline cursor-pointer my-2">view all</div> */}
      </div>
      <div
        onClick={() => setShow(false)}
        className="backdrop-brightness-75 w-screen h-screen fixed top-0 left-0 z-30 animate-fade_third"
      ></div>
    </>
  );
};

export default Notifications;
