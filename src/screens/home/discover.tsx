import Loader from '@/components/common/loader';
import PostComponent from '@/components/home/post';
import getHandler from '@/handlers/get_handler';
import { Post } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RePostComponent from '@/components/home/repost';
import { EXPLORE_URL } from '@/config/routes';

const Discover = () => {
  const [feed, setFeed] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const getFeed = () => {
    const URL = `${EXPLORE_URL}/posts?page=${page}&limit=${5}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addedFeed = [...feed, ...res.data.posts];
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
    <div className="w-full">
      <div className="w-[50vw] max-md:w-screen flex flex-col gap-2">
        {loading ? (
          <Loader />
        ) : (
          <>
            {feed.length === 0 ? (
              // <NoFeed />
              <></>
            ) : (
              <InfiniteScroll
                className="px-12 max-md:px-2"
                dataLength={feed.length}
                next={getFeed}
                hasMore={hasMore}
                loader={<Loader />}
              >
                {feed.map(post => {
                  if (post.rePost) return <RePostComponent key={post.id} post={post} />;
                  else return <PostComponent key={post.id} post={post} />;
                })}
              </InfiniteScroll>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Discover;
