import Bookmark from '@/components/bookmarks/project_bookmark';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { BOOKMARK_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { ProjectBookmark } from '@/types';
import { initialProjectBookmark } from '@/types/initials';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import BookmarkProjects from '@/sections/bookmarks/projects';
import deleteHandler from '@/handlers/delete_handler';
import { userSelector, setProjectBookmarks } from '@/slices/userSlice';
import { useSelector, useDispatch } from 'react-redux';

const Projects = () => {
  const [bookmarks, setBookmarks] = useState<ProjectBookmark[]>([]);
  const [clickedOnBookmark, setClickedOnBookmark] = useState(false);
  const [clickedBookmark, setClickedBookmark] = useState<ProjectBookmark>(initialProjectBookmark);
  const [loading, setLoading] = useState(true);

  const [mutex, setMutex] = useState(false);

  const fetchBookmarks = async () => {
    setLoading(true);
    const URL = `${BOOKMARK_URL}/project`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setBookmarks(res.data.bookmarks || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const bookmarksRedux = useSelector(userSelector).projectBookmarks;
  const dispatch = useDispatch();

  const handleDeleteBookmark = async (bookmarkID: string) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Deleting Bookmark', bookmarkID);

    const URL = `${BOOKMARK_URL}/project/${bookmarkID}`;
    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      let updatedBookmarks = [...bookmarksRedux];
      updatedBookmarks = updatedBookmarks.filter(el => el.id != bookmarkID);
      dispatch(setProjectBookmarks(updatedBookmarks));
      setBookmarks(prev => prev.filter(el => el.id != bookmarkID));
      Toaster.stopLoad(toaster, 'Bookmark Deleted', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
        console.log(res);
      }
    }
    setMutex(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {clickedOnBookmark ? (
            <BookmarkProjects bookmark={clickedBookmark} setClick={setClickedOnBookmark} />
          ) : (
            <>
              {bookmarks.length > 0 ? (
                <div className="w-full px-4 flex flex-wrap gap-2">
                  {bookmarks.map(bookmark => {
                    return (
                      <Bookmark
                        key={bookmark.id}
                        bookmark={bookmark}
                        setClick={setClickedOnBookmark}
                        setBookmark={setClickedBookmark}
                        handleDelete={handleDeleteBookmark}
                      />
                    );
                  })}
                </div>
              ) : (
                <div>No Bookmarks found</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
