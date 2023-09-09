import postHandler from '@/handlers/post_handler';
import { setOpeningBookmarks, userSelector } from '@/slices/userSlice';
import { Opening, OpeningBookmark, OpeningBookmarkItem } from '@/types';
import Toaster from '@/utils/toaster';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BOOKMARK_URL } from '@/config/routes';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  opening: Opening;
  setBookmark: (isBookmarked: boolean, openingItemID: string, bookmarkID: string) => void;
}

const BookmarkOpening = ({ setShow, opening, setBookmark }: Props) => {
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [mutex, setMutex] = useState(false);
  const dispatch = useDispatch();

  const bookmarks = useSelector(userSelector).openingBookmarks;

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

    const URL = `${BOOKMARK_URL}/opening`;
    const res = await postHandler(URL, { title: bookmarkTitle });

    if (res.statusCode === 201) {
      const bookmark: OpeningBookmark = res.data.bookmark;
      const updatedBookmarks = [...bookmarks, bookmark];
      dispatch(setOpeningBookmarks(updatedBookmarks));
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

  const addBookmarkItemHandler = async (bookmark: OpeningBookmark) => {
    if (mutex) return;
    setMutex(true);

    const URL = `${BOOKMARK_URL}/opening/item/${bookmark.id}`;
    const res = await postHandler(URL, { itemID: opening.id });

    if (res.statusCode === 201) {
      const bookmarkItem: OpeningBookmarkItem = res.data.bookmarkItem;
      const updatedBookmarks = bookmarks.map(openingBookmark => {
        if (openingBookmark.id === bookmark.id) {
          const updatedOpeningItems = openingBookmark.openingItems
            ? [...openingBookmark.openingItems, bookmarkItem]
            : [bookmarkItem];
          return { ...openingBookmark, openingItems: updatedOpeningItems };
        }
        return openingBookmark;
      });
      dispatch(setOpeningBookmarks(updatedBookmarks));
      setShow(false);
      setBookmark(true, bookmarkItem.id, bookmarkItem.openingBookmarkID);
    }
    setMutex(false);
  };
  return (
    <>
      <div className="fixed top-32 w-1/3 max-md:w-5/6 h-max bg-slate-100 right-1/2 translate-x-1/2 animate-fade_third z-30">
        <div>BookMark this Opening</div>
        {bookmarks.map((bookmark, index: number) => {
          return (
            <div
              key={index}
              className={`w-full h-14 flex justify-center rounded-xl rounded-b-none items-center border-b-2 border-black hover:bg-[#1a1a1a18] cursor-pointer`}
              onClick={() => {
                addBookmarkItemHandler(bookmark);
              }}
            >
              {bookmark.title}
            </div>
          );
        })}
        <form onSubmit={addBookmarkHandler}>
          <input
            className={`w-full h-14 px-2 flex rounded-xl justify-center items-center font-Helvetica bg-[#1a1a1a18] cursor-pointer focus:outline-none`}
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

export default BookmarkOpening;
