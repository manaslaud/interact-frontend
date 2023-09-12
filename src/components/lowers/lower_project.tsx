import React, { useState, useEffect } from 'react';
import { Project, ProjectBookmark } from '@/types';
import Cookies from 'js-cookie';
import deleteHandler from '@/handlers/delete_handler';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getHandler from '@/handlers/get_handler';
import { useDispatch, useSelector } from 'react-redux';
import { setLikes, setProjectBookmarks, userSelector } from '@/slices/userSlice';
// import clickedOnSharePost from './clickedOnShare_project';
import BookmarkSimple from '@phosphor-icons/react/dist/icons/BookmarkSimple';
import Gear from '@phosphor-icons/react/dist/icons/Gear';
import Export from '@phosphor-icons/react/dist/icons/Export';
import Heart from '@phosphor-icons/react/dist/icons/Heart';
import ChatTeardrop from '@phosphor-icons/react/dist/icons/ChatTeardrop';
import BookmarkProject from '../../sections/lowers/bookmark_project';
import { BOOKMARK_URL, POST_URL, PROJECT_URL } from '@/config/routes';
import Semaphore from '@/utils/semaphore';
import { configSelector, setUpdateBookmark, setUpdatingLikes } from '@/slices/configSlice';
import { HeartStraight } from '@phosphor-icons/react';
import ShareProject from '@/sections/lowers/share_project';

interface Props {
  project: Project;
}

interface bookMarkStatus {
  isBookmarked: boolean;
  projectItemID: string;
  bookmarkID: string;
}

const LowerProject = ({ project }: Props) => {
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(project.noLikes);
  const [bookmarkStatus, setBookmarkStatus] = useState<bookMarkStatus>({
    isBookmarked: false,
    projectItemID: '',
    bookmarkID: '',
  });
  const [clickedOnShare, setClickedOnShare] = useState(false);
  const [clickedOnBookmark, setClickedOnBookmark] = useState(false);
  const [mutex, setMutex] = useState(false);

  const likes = useSelector(userSelector).likes;
  const bookmarks = useSelector(userSelector).projectBookmarks;

  const userID = Cookies.get('id');

  const dispatch = useDispatch();
  const router = useRouter();

  const updatingLikes = useSelector(configSelector).updatingLikes;

  const semaphore = new Semaphore(updatingLikes, setUpdatingLikes);

  const setBookmark = (isBookmarked: boolean, projectItemID: string, bookmarkID: string) => {
    setBookmarkStatus({
      isBookmarked,
      projectItemID,
      bookmarkID,
    });
  };

  function removePostItemFromBookmark(
    bookmarks: ProjectBookmark[],
    bookmarkId: string,
    projectItemId: string
  ): ProjectBookmark[] {
    const updatedBookmarks = bookmarks.map(bookmark => {
      if (bookmark.id === bookmarkId) {
        const updatedPostItems = bookmark.projectItems.filter(item => item.id !== projectItemId);
        return { ...bookmark, projectItems: updatedPostItems };
      }
      return bookmark;
    });

    return updatedBookmarks;
  }

  useEffect(() => {
    if (likes.includes(project.id)) setLiked(true);
    bookmarks.forEach(bookmarksObj => {
      if (bookmarksObj.projectItems)
        bookmarksObj.projectItems.forEach(projectItem => {
          if (projectItem.projectID == project.id) setBookmark(true, projectItem.id, bookmarksObj.id);
        });
    });
  }, []);

  const likeHandler = async () => {
    await semaphore.acquire();

    if (liked) setNumLikes(prev => prev - 1);
    else setNumLikes(prev => prev + 1);

    setLiked(prev => !prev);

    const URL = `${PROJECT_URL}/like/${project.id}`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      const newLikes: string[] = [...likes];
      if (liked) {
        newLikes.splice(newLikes.indexOf(project.id), 1);
      } else {
        newLikes.push(project.id);
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
    setBookmark(false, bookmarkStatus.projectItemID, bookmarkStatus.bookmarkID);

    const URL = `${BOOKMARK_URL}/project/item/${bookmarkStatus.projectItemID}`;
    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      const updatedBookmarks = removePostItemFromBookmark(
        bookmarks,
        bookmarkStatus.bookmarkID,
        bookmarkStatus.projectItemID
      );
      dispatch(setProjectBookmarks(updatedBookmarks));
      setBookmark(false, '', '');
      dispatch(setUpdateBookmark(true));
    } else {
      setBookmark(true, bookmarkStatus.projectItemID, bookmarkStatus.bookmarkID);
    }
    setMutex(false);
  };

  return (
    <>
      {clickedOnBookmark ? (
        <BookmarkProject setShow={setClickedOnBookmark} project={project} setBookmark={setBookmark} />
      ) : (
        <></>
      )}
      {clickedOnShare ? <ShareProject setShow={setClickedOnShare} project={project} /> : <></>}

      <div className="flex flex-col gap-12 max-md:gap-2 max-md:flex-row">
        <BookmarkSimple
          className="cursor-pointer max-md:w-6 max-md:h-6"
          onClick={() => {
            if (bookmarkStatus.isBookmarked) removeBookmarkItemHandler();
            else setClickedOnBookmark(prev => !prev);
          }}
          size={32}
          weight={bookmarkStatus.isBookmarked ? 'fill' : 'light'}
        />
        <HeartStraight
          onClick={likeHandler}
          className="cursor-pointer max-md:w-6 max-md:h-6"
          size={32}
          weight={liked ? 'fill' : 'regular'}
        />
        <Export
          onClick={() => setClickedOnShare(true)}
          className="cursor-pointer max-md:w-6 max-md:h-6"
          size={32}
          weight="regular"
        />
        <ChatTeardrop className="cursor-pointer max-md:w-6 max-md:h-6" size={32} />
      </div>
    </>
  );
};

export default LowerProject;
