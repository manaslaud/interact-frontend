import React, { useState, useEffect } from 'react';
import { Post, PostBookmark } from '@/types';
import Cookies from 'js-cookie';
import deleteHandler from '@/handlers/delete_handler';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getHandler from '@/handlers/get_handler';
import { useDispatch, useSelector } from 'react-redux';
import { setLikes, setPostBookmarks, userSelector } from '@/slices/userSlice';
// import clickedOnSharePost from './clickedOnShare_post';
import BookmarkSimple from '@phosphor-icons/react/dist/icons/BookmarkSimple';
import Gear from '@phosphor-icons/react/dist/icons/Gear';
import Export from '@phosphor-icons/react/dist/icons/Export';
import Heart from '@phosphor-icons/react/dist/icons/Heart';
import ChatTeardrop from '@phosphor-icons/react/dist/icons/ChatTeardrop';
import BookmarkPost from '../../sections/lowers/bookmark_post';
import { BOOKMARK_URL, POST_URL } from '@/config/routes';
import Semaphore from '@/utils/semaphore';
import { configSelector, setUpdateBookmark, setUpdatingLikes } from '@/slices/configSlice';
import { ChatCircleText, HeartStraight, Repeat } from '@phosphor-icons/react';
import RePost from './repost';

interface Props {
  post: Post;
}

interface bookMarkStatus {
  isBookmarked: boolean;
  postItemID: string;
  bookmarkID: string;
}

const LowerPost = ({ post }: Props) => {
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(post.noLikes);
  const [bookmarkStatus, setBookmarkStatus] = useState<bookMarkStatus>({
    isBookmarked: false,
    postItemID: '',
    bookmarkID: '',
  });
  const [clickedOnShare, setClickedOnShare] = useState(false);
  const [clickedOnBookmark, setClickedOnBookmark] = useState(false);
  const [clickedOnRePost, setClickedOnRePost] = useState(false);
  const [mutex, setMutex] = useState(false);

  const likes = useSelector(userSelector).likes;
  const bookmarks = useSelector(userSelector).postBookmarks;

  const userID = Cookies.get('id');

  const dispatch = useDispatch();

  const updatingLikes = useSelector(configSelector).updatingLikes;

  const semaphore = new Semaphore(updatingLikes, setUpdatingLikes);

  const setBookmark = (isBookmarked: boolean, postItemID: string, bookmarkID: string) => {
    setBookmarkStatus({
      isBookmarked,
      postItemID,
      bookmarkID,
    });
  };

  function removePostItemFromBookmark(
    bookmarks: PostBookmark[],
    bookmarkId: string,
    postItemId: string
  ): PostBookmark[] {
    const updatedBookmarks = bookmarks.map(bookmark => {
      if (bookmark.id === bookmarkId) {
        const updatedPostItems = bookmark.postItems.filter(item => item.id !== postItemId);
        return { ...bookmark, postItems: updatedPostItems };
      }
      return bookmark;
    });

    return updatedBookmarks;
  }

  useEffect(() => {
    if (likes.includes(post.id)) setLiked(true);
    bookmarks.forEach(bookmarksObj => {
      if (bookmarksObj.postItems)
        bookmarksObj.postItems.forEach(postItem => {
          if (postItem.postID == post.id) setBookmark(true, postItem.id, bookmarksObj.id);
        });
    });
  }, []);

  const likeHandler = async () => {
    await semaphore.acquire();

    if (liked) setNumLikes(prev => prev - 1);
    else setNumLikes(prev => prev + 1);

    setLiked(prev => !prev);

    const URL = `${POST_URL}/like/${post.id}`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      const newLikes: string[] = [...likes];
      if (liked) {
        newLikes.splice(newLikes.indexOf(post.id), 1);
      } else {
        newLikes.push(post.id);
      }
      dispatch(setLikes(newLikes));
    } else {
      if (liked) setNumLikes(prev => prev + 1);
      else setNumLikes(prev => prev - 1);
      setLiked(prev => !prev);
    }

    semaphore.release();
  };

  const removeBookmarkItemHandler = async () => {
    if (mutex) return;
    setMutex(true);
    setBookmark(false, bookmarkStatus.postItemID, bookmarkStatus.bookmarkID);

    const URL = `${BOOKMARK_URL}/post/item/${bookmarkStatus.postItemID}`;
    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      const updatedBookmarks = removePostItemFromBookmark(
        bookmarks,
        bookmarkStatus.bookmarkID,
        bookmarkStatus.postItemID
      );
      dispatch(setPostBookmarks(updatedBookmarks));
      setBookmark(false, '', '');
      dispatch(setUpdateBookmark(true));
    } else {
      setBookmark(true, bookmarkStatus.postItemID, bookmarkStatus.bookmarkID);
    }
    setMutex(false);
  };

  return (
    <>
      {/* {clickedOnShare ? <clickedOnSharePost id={post.id} setShow={setClickedOnShare} /> : <></>} */}
      {clickedOnBookmark ? (
        <BookmarkPost setShow={setClickedOnBookmark} post={post} setBookmark={setBookmark} />
      ) : (
        <></>
      )}
      {clickedOnRePost ? <RePost setShow={setClickedOnRePost} post={post} /> : <></>}
      <div className="w-full flex justify-between">
        <div className="flex gap-3 max-md:gap-3">
          <HeartStraight
            onClick={likeHandler}
            className="cursor-pointer max-md:w-6 max-md:h-6"
            size={24}
            weight={liked ? 'fill' : 'regular'}
          />
          {/* <div onClick={likeHandler} className="flex items-center gap-2">
          </div> */}
          <ChatCircleText className="cursor-pointer max-md:w-6 max-md:h-6" size={24} weight="regular" />
          {/* <Link className="flex items-center gap-2" href={`/explore/post/comments/${post.id}`}>
          </Link> */}
          {post.userID != userID ? (
            <Repeat
              onClick={() => {
                setClickedOnRePost(true);
              }}
              className="cursor-pointer max-md:w-6 max-md:h-6"
              size={24}
              weight="regular"
            />
          ) : (
            <></>
          )}

          {/* <div className="flex items-center gap-2" onClick={() => setClickedOnShare(true)}>
          </div> */}
          <Export className="cursor-pointer max-md:w-6 max-md:h-6" size={24} weight="regular" />
          <BookmarkSimple
            className="cursor-pointer max-md:w-6 max-md:h-6"
            onClick={() => {
              if (bookmarkStatus.isBookmarked) removeBookmarkItemHandler();
              else setClickedOnBookmark(prev => !prev);
            }}
            size={24}
            weight={bookmarkStatus.isBookmarked ? 'fill' : 'light'}
          />
        </div>

        <div className="relative flex gap-2">
          {/* {userID == post?.userID ? (
            <Gear
              className="cursor-pointer max-md:w-6 max-md:h-6"
              onClick={() => {
                router.push(`/workspace/post/edit/${post.id}`);
              }}
              size={24}
              weight="light"
            />
          ) : (
            <></>
          )} */}
        </div>
      </div>
      <div className="w-full flex items-center font-primary text-sm gap-2 text-[#ffffffb6]">
        <div>
          {numLikes} like{numLikes == 1 ? '' : 's'}
        </div>
        <div className="text-xs">•</div>
        <div>{post.noComments} comments</div>
      </div>
    </>
  );
};

export default LowerPost;
