import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, setFollowing } from '@/slices/userSlice';
import Cookies from 'js-cookie';
import Toaster from '@/utils/toaster';
import getHandler from '@/handlers/get_handler';
import { configSelector, setUpdatingFollowing } from '@/slices/configSlice';
import Semaphore from '@/utils/semaphore';
import { CONNECTION_URL } from '@/config/routes';
import socketService from '@/config/ws';

interface Props {
  setFollowerCount?: React.Dispatch<React.SetStateAction<number>>;
  toFollowID: string;
}

const FollowBtn = ({ toFollowID, setFollowerCount }: Props) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const following = useSelector(userSelector).following;
  const updatingFollowing = useSelector(configSelector).updatingFollowing;
  const dispatch = useDispatch();

  const userID = Cookies.get('id');

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
        socketService.sendNotification(toFollowID, 'New Follower.');
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
      Toaster.error(res.data.message);
    }

    semaphore.release();
  };

  return (
    <>
      {toFollowID !== userID ? (
        <div
          onClick={submitHandler}
          className={`${
            isFollowing ? 'w-20 border-2 border-[#60497e]' : 'w-16 bg-gray-800 text-white'
          } h-8 rounded-3xl flex justify-center items-center cursor-pointer text-sm transition-ease-150`}
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
