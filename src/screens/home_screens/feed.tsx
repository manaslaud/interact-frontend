import Loader from '@/components/common/loader';
import PostComponent from '@/components/home/post';
import getHandler from '@/handlers/get_handler';
import NewPost from '@/sections/home_sections/new_post';
import { Post } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Feed = () => {
  const [feed, setFeed] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const getFeed = () => {
    const URL = `/feed?page=${page}&limit=${5}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addedFeed = [...feed, ...res.data.feed];
          if (addedFeed.length === feed.length) setHasMore(false);
          setFeed(addedFeed);
          setPage(prev => prev + 1);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message);
          else {
            Toaster.error('Internal Server Error');
            console.log(res);
          }
        }
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <NewPost />
      {loading ? (
        <Loader />
      ) : (
        <>
          {feed.length === 0 ? (
            // <NoFeed />
            <></>
          ) : (
            <InfiniteScroll dataLength={feed.length} next={getFeed} hasMore={hasMore} loader={<Loader />}>
              {feed.map(post => {
                return <PostComponent key={post.id} post={post} />;
              })}
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
