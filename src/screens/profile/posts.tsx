import PostComponent from '@/components/home/post';
import RePostComponent from '@/components/home/repost';
import { Post } from '@/types';
import React from 'react';

interface Props {
  posts: Post[];
}

const Posts = ({ posts }: Props) => {
  return (
    <div className="w-[45vw] mx-auto max-md:w-screen flex flex-col gap-2 max-md:px-4">
      {posts.length === 0 ? (
        <>No Posts</>
      ) : (
        <>
          {posts.map(post => {
            if (post.rePost) return <RePostComponent key={post.id} post={post} />;
            else return <PostComponent key={post.id} post={post} />;
          })}
        </>
      )}
    </div>
  );
};

export default Posts;
