import Bookmark from '@/components/bookmarks/project_bookmark';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { BOOKMARK_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { ProjectBookmark } from '@/types';
import { initialProjectBookmark } from '@/types/initials';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';

const Projects = () => {
  const [bookmarks, setBookmarks] = useState<ProjectBookmark[]>([]);
  const [clickedOnBookmark, setClickedOnBookmark] = useState(false);
  const [clickedBookmark, setClickedBookmark] = useState<ProjectBookmark>(initialProjectBookmark);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
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
                  />
                );
              })}
            </div>
          ) : (
            <div>No Bookmarks found</div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
