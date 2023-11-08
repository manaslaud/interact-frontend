import { CONNECTION_URL } from '@/config/routes';
import socketService from '@/config/ws';
import getHandler from '@/handlers/get_handler';
import { configSelector, setUpdatingFollowing } from '@/slices/configSlice';
import { setFollowing, userSelector } from '@/slices/userSlice';
import Semaphore from '@/utils/semaphore';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  setFollowerCount?: React.Dispatch<React.SetStateAction<number>>;
  toFollowID: string;
  smaller?: boolean;
}

const FollowBtn = ({ toFollowID, setFollowerCount, smaller = false }: Props) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const following = useSelector(userSelector).following;
  const updatingFollowing = useSelector(configSelector).updatingFollowing;
  const dispatch = useDispatch();

  const user = useSelector(userSelector);

  useEffect(() => {
    if (following.includes(toFollowID)) setIsFollowing(true);
  }, [toFollowID]);

  const semaphore = new Semaphore(updatingFollowing, setUpdatingFollowing);

  const submitHandler = async () => {
    await semaphore.acquire();

    const newFollowing = [...following];
    if (setFollowerCount) {
      if (isFollowing) {
        setFollowerCount(prev => prev - 1);
      } else {
        setFollowerCount(prev => prev + 1);
      }
    }
    setIsFollowing(prev => !prev);

    const res = await getHandler(`${CONNECTION_URL}/${isFollowing ? 'un' : ''}follow/${toFollowID}`);
    if (res.statusCode === 200) {
      if (isFollowing) {
        newFollowing.splice(newFollowing.indexOf(toFollowID), 1);
      } else {
        newFollowing.push(toFollowID);
        socketService.sendNotification(toFollowID, `${user.name} started following you!`);
      }
      dispatch(setFollowing(newFollowing));
    } else {
      if (setFollowerCount) {
        if (isFollowing) {
          setFollowerCount(prev => prev + 1);
        } else {
          setFollowerCount(prev => prev - 1);
        }
      }
      setIsFollowing(prev => !prev);
      Toaster.error(res.data.message, 'error_toaster');
    }

    semaphore.release();
  };

  return (
    <>
      {toFollowID !== user.id ? (
        <div
          onClick={submitHandler}
          className={`${
            isFollowing
              ? 'w-20 border-2 border-primary_btn dark:border-dark_primary_btn'
              : 'w-16 bg-zinc-800 dark:bg-purple-950 text-white'
          } h-8 rounded-3xl flex justify-center items-center cursor-pointer ${
            smaller ? 'text-xs' : 'text-sm'
          } transition-ease-150`}
        >
          {isFollowing ? 'following' : 'follow'}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default FollowBtn;
