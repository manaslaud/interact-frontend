import Bookmark from '@/components/bookmarks/post_bookmark';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { BOOKMARK_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { PostBookmark } from '@/types';
import { initialPostBookmark } from '@/types/initials';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import BookmarkPosts from '@/sections/bookmarks/posts';

const Posts = () => {
  const [bookmarks, setBookmarks] = useState<PostBookmark[]>([]);
  const [clickedOnBookmark, setClickedOnBookmark] = useState(false);
  const [clickedBookmark, setClickedBookmark] = useState<PostBookmark>(initialPostBookmark);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    const URL = `${BOOKMARK_URL}/post`;
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
          {clickedOnBookmark ? (
            <BookmarkPosts bookmark={clickedBookmark} setClick={setClickedOnBookmark} />
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
        </>
      )}
    </div>
  );
};

export default Posts;
