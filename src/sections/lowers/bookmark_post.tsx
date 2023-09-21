import postHandler from '@/handlers/post_handler';
import { setPostBookmarks, userSelector } from '@/slices/userSlice';
import { Post, PostBookmark, PostBookmarkItem } from '@/types';
import Toaster from '@/utils/toaster';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_URL } from '@/config/routes';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: Post;
  setBookmark: (isBookmarked: boolean, postItemID: string, bookmarkID: string) => void;
}

const BookmarkPost = ({ setShow, post, setBookmark }: Props) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [mutex, setMutex] = useState(false);
  const dispatch = useDispatch();

  const bookmarks = useSelector(userSelector).postBookmarks;

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const addBookmarkHandler = async (el: FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding your Bookmark...');

    const URL = `${BOOKMARK_URL}/post`;
    const res = await postHandler(URL, { title: bookmarkTitle });

    if (res.statusCode === 201) {
      const bookmark: PostBookmark = res.data.bookmark;
      const updatedBookmarks = [...bookmarks, bookmark];
      dispatch(setPostBookmarks(updatedBookmarks));
      Toaster.stopLoad(toaster, 'Bookmark Added', 1);
      setBookmarkTitle('');
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        console.log(res);
      }
    }
    setMutex(false);
  };

  const addBookmarkItemHandler = async (bookmark: PostBookmark) => {
    if (mutex) return;
    setMutex(true);

    const URL = `${BOOKMARK_URL}/post/item/${bookmark.id}`;
    const res = await postHandler(URL, { itemID: post.id });

    if (res.statusCode === 201) {
      const bookmarkItem: PostBookmarkItem = res.data.bookmarkItem;
      const updatedBookmarks = bookmarks.map(postBookmark => {
        if (postBookmark.id === bookmark.id) {
          const updatedPostItems = postBookmark.postItems ? [...postBookmark.postItems, bookmarkItem] : [bookmarkItem];
          return { ...postBookmark, postItems: updatedPostItems };
        }
        return postBookmark;
      });
      dispatch(setPostBookmarks(updatedBookmarks));
      setShow(false);
      setBookmark(true, bookmarkItem.id, bookmarkItem.postBookmarkID);
    }
    setMutex(false);
  };
  return (
    <>
      <div className="fixed top-32 w-1/3 max-md:w-5/6 h-max flex flex-col items-center gap-4 right-1/2 translate-x-1/2 rounded-lg px-4 py-6 dark:text-white font-primary dark:bg-dark_primary_comp backdrop-blur-lg animate-fade_third z-30">
        <div className="text-xl text-center font-bold underline underline-offset-2">Bookmark this Post</div>
        <div className="w-full flex flex-col gap-2">
          {bookmarks.map((bookmark, index: number) => {
            return (
              <div
                key={index}
                className={`w-full h-14 hover:dark:bg-dark_primary_comp_hover active:dark:bg-dark_primary_comp_active flex-center rounded-md cursor-pointer transition-ease-300`}
                onClick={() => {
                  addBookmarkItemHandler(bookmark);
                }}
              >
                {bookmark.title}
              </div>
            );
          })}
        </div>

        <form className="w-full" onSubmit={addBookmarkHandler}>
          <input
            className={`w-full h-14 px-2 flex-center rounded-md bg-transparent border-[1px] dark:border-dark_primary_btn focus:outline-none`}
            value={bookmarkTitle}
            onChange={el => setBookmarkTitle(el.target.value)}
            placeholder="Create a new Bookmark"
          />
        </form>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default BookmarkPost;
