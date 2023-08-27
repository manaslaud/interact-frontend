import { BOOKMARK_URL, POST_PIC_URL } from '@/config/routes';
import deleteHandler from '@/handlers/delete_handler';
import { setPostBookmarks, userSelector } from '@/slices/userSlice';
import { PostBookmark } from '@/types';
import Toaster from '@/utils/toaster';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  bookmark: PostBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  setBookmark: React.Dispatch<React.SetStateAction<PostBookmark>>;
  handleDelete: (bookmarkID: string) => Promise<void>;
}

const PostBookmark = ({ bookmark, setClick, setBookmark, handleDelete }: Props) => {
  let count = 0;
  return (
    <div className="w-96 h-108 bg-white border-2">
      <div
        onClick={() => {
          setBookmark(bookmark);
          setClick(true);
        }}
        className="cursor-pointer"
      >
        {bookmark.postItems.length == 0 ? (
          <div className="w-full h-96 bg-slate-400 grid grid-cols-2"></div>
        ) : bookmark.postItems.length == 1 ? (
          <>
            {bookmark.postItems[0].post.images && bookmark.postItems[0].post.images.length > 0 ? (
              <Image
                crossOrigin="anonymous"
                className="w-full h-96 object-cover"
                width={10000}
                height={10000}
                alt=""
                src={`${POST_PIC_URL}/${bookmark.postItems[0].post.images[0]}`}
              />
            ) : (
              <div className="w-full h-96 bg-slate-400 grid grid-cols-2"></div>
            )}
          </>
        ) : (
          <div className="w-full h-96 bg-slate-200 grid grid-cols-2">
            {bookmark.postItems.map(postItem => {
              if (count >= 4 || !postItem.post.images || postItem.post.images.length === 0) {
                return <></>;
              }
              count++;
              return (
                <Image
                  key={postItem.postID}
                  crossOrigin="anonymous"
                  className="w-[180px] h-[180px] object-cover"
                  width={10000}
                  height={10000}
                  alt=""
                  src={`${POST_PIC_URL}/${postItem.post.images[0]}`}
                />
              );
            })}
            {[...Array(4 - count)].map((_, index) => (
              <div key={index} className="w-[180px] h-[180px] bg-slate-400"></div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full text-center">{bookmark.title}</div>
      <div onClick={() => handleDelete(bookmark.id)}>delete Bookmark</div>
    </div>
  );
};

export default PostBookmark;
