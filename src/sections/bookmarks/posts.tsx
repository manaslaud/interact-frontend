import PostComponent from '@/components/home/post';
import { PostBookmark } from '@/types';
import React from 'react';

interface Props {
  bookmark: PostBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
}

const Posts = ({ bookmark, setClick }: Props) => {
  return (
    <div className="w-base_open m-auto flex flex-col gap-2">
      <div onClick={() => setClick(false)}>Back</div>
      {bookmark.postItems.length === 0 ? (
        <>No Items</>
      ) : (
        <div className="">
          {bookmark.postItems.map(postItem => {
            return <PostComponent key={postItem.id} post={postItem.post} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Posts;
