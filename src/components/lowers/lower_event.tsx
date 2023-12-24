import { EVENT_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import CommentEvent from '@/sections/lowers/comment_event';
import { configSelector, setUpdatingLikes } from '@/slices/configSlice';
import { setLikes, userSelector } from '@/slices/userSlice';
import { Event } from '@/types';
import Semaphore from '@/utils/semaphore';
import { Eye, CursorClick, HeartStraight, ChatCircleText, Export } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignUp from '../common/signup_box';
import ShareEvent from '@/sections/lowers/share_event';

interface Props {
  event: Event;
}

const LowerEvent = ({ event }: Props) => {
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(event.noLikes);
  const [numComments, setNumComments] = useState(event.noComments);
  const [clickedOnComment, setClickedOnComment] = useState(false);
  const [clickedOnShare, setClickedOnShare] = useState(false);

  const [mutex, setMutex] = useState(false);

  const user = useSelector(userSelector);
  const likes = user.likes;

  const [noUserClick, setNoUserClick] = useState(false);

  useEffect(() => {
    if (likes.includes(event.id)) setLiked(true);
  }, [event.id]);

  const updatingLikes = useSelector(configSelector).updatingLikes;

  const semaphore = new Semaphore(updatingLikes, setUpdatingLikes);

  const dispatch = useDispatch();

  const likeHandler = async () => {
    await semaphore.acquire();

    setNumLikes(prev => (liked ? prev - 1 : prev + 1));
    setLiked(prev => !prev);

    const URL = `${EVENT_URL}/like/${event.id}`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      const newLikes: string[] = [...likes];
      if (liked) {
        newLikes.splice(newLikes.indexOf(event.id), 1);
      } else {
        newLikes.push(event.id);
      }
      //! Causing Re-render   dispatch(setLikes(newLikes));
    } else {
      setNumLikes(prev => (liked ? prev + 1 : prev - 1));
      setLiked(prev => !prev);
    }

    semaphore.release();
  };

  return (
    <>
      {noUserClick ? <SignUp setShow={setNoUserClick} /> : <></>}
      {clickedOnComment ? (
        <CommentEvent
          setShow={setClickedOnComment}
          event={event}
          numComments={numComments}
          setNoComments={setNumComments}
        />
      ) : (
        <></>
      )}
      {clickedOnShare ? <ShareEvent setShow={setClickedOnShare} event={event} /> : <></>}
      <div className="w-full flex gap-6 items-center justify-center flex-wrap p-6">
        <div className="flex flex-col items-center gap-2 p-4 cursor-default">
          <Eye size={24} />
          <div className="flex flex-col text-center items-center">
            <div>{event.noImpressions}</div>
            <div className="text-xs text-gray-500">Impressions</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 cursor-default">
          <CursorClick size={24} />
          <div className="flex flex-col text-center items-center">
            <div> {event.noViews}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
        </div>
        <div
          onClick={() => {
            if (user.id == '') setNoUserClick(true);
            else likeHandler();
          }}
          className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg hover:shadow-2xl transition-ease-300 cursor-pointer"
        >
          <HeartStraight size={24} weight={liked ? 'fill' : 'regular'} />
          <div className="flex flex-col text-center items-center">
            <div> {numLikes}</div>
            <div className="text-xs text-gray-500">Likes</div>
          </div>
        </div>
        <div
          onClick={() => {
            if (user.id == '') setNoUserClick(true);
            else setClickedOnComment(true);
          }}
          className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg hover:shadow-2xl transition-ease-300 cursor-pointer"
        >
          <ChatCircleText size={24} />
          <div className="flex flex-col text-center items-center">
            <div> {numComments}</div>
            <div className="text-xs text-gray-500">Comments</div>
          </div>
        </div>
        <div
          onClick={() => {
            if (user.id == '') setNoUserClick(true);
            else setClickedOnShare(true);
          }}
          className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg hover:shadow-2xl transition-ease-300 cursor-pointer"
        >
          <Export size={24} />
          <div className="flex flex-col text-center items-center">
            <div> {event.noShares}</div>
            <div className="text-xs text-gray-500">Shares</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LowerEvent;
