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
import { BOOKMARK_URL, POST_URL } from '@/config/routes';
import Semaphore from '@/utils/semaphore';
import { configSelector, setUpdatingLikes } from '@/slices/configSlice';

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

    const URL = `${POST_URL}/like/${project.id}`;
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
    } else {
      setBookmark(true, bookmarkStatus.projectItemID, bookmarkStatus.bookmarkID);
    }
    setMutex(false);
  };

  return (
    <>
      {/* {clickedOnShare ? <clickedOnShareProject id={project.id} setShow={setClickedOnShare} /> : <></>} */}
      {clickedOnBookmark ? (
        <BookmarkProject setShow={setClickedOnBookmark} project={project} setBookmark={setBookmark} />
      ) : (
        <></>
      )}
      <div className="w-full flex justify-between pl-14">
        <div className="flex gap-6 max-md:gap-3">
          <div onClick={likeHandler} className="flex items-center gap-2">
            <Heart className="cursor-pointer max-md:w-6 max-md:h-6" size={40} weight={liked ? 'duotone' : 'regular'} />
            <div className="">{numLikes}</div>
          </div>
          <Link className="flex items-center gap-2" href={`/explore/project/comments/${project.id}`}>
            <ChatTeardrop className="cursor-pointer max-md:w-[32px] max-md:h-[32px]" size={40} weight="duotone" />
            <div className="">{project.noComments}</div>
          </Link>
          <div className="flex items-center gap-2" onClick={() => setClickedOnShare(true)}>
            <Export className="cursor-pointer max-md:w-[32px] max-md:h-[32px]" size={40} weight="duotone" />
            <div className="">{project.noShares}</div>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-2">
            {userID == project?.userID ? (
              <Gear
                className="cursor-pointer max-md:w-[32px] max-md:h-[32px]"
                onClick={() => {
                  router.push(`/workspace/project/edit/${project.id}`);
                }}
                size={40}
                weight="light"
              />
            ) : (
              <></>
            )}

            <BookmarkSimple
              className="cursor-pointer max-md:w-[32px] max-md:h-[32px]"
              onClick={() => {
                if (bookmarkStatus.isBookmarked) removeBookmarkItemHandler();
                else setClickedOnBookmark(prev => !prev);
              }}
              size={40}
              weight={bookmarkStatus.isBookmarked ? 'duotone' : 'light'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LowerProject;
