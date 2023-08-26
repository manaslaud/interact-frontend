import Loader from '@/components/common/loader';
import PostComponent from '@/components/home/post';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { userSelector } from '@/slices/userSlice';
import { Post } from '@/types';
import Toaster from '@/utils/toaster';
import { Plus } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import NewPost from '@/sections/home_sections/new_post';

const Feed = () => {
  const [feed, setFeed] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [clickedOnNewPost, setClickedOnNewPost] = useState(false);
  const [loading, setLoading] = useState(true);

  let profilePic = useSelector(userSelector).profilePic;

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
    profilePic = profilePic == '' ? 'default.jpg' : profilePic;
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      {clickedOnNewPost ? <NewPost setShow={setClickedOnNewPost} /> : <></>}
      {/* Create a New Post */}
      <div
        onClick={() => setClickedOnNewPost(true)}
        className="w-full h-16 px-4 py-3 border-2 rounded-xl transition-ease-200 hover:shadow-md flex justify-between items-center"
      >
        <div className="flex gap-2 items-center">
          <Image
            crossOrigin="anonymous"
            className="w-8 h-8 rounded-full cursor-pointer"
            width={10000}
            height={10000}
            alt="user"
            src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
          />
          <div className="font-primary text-gray-400">Create a new post</div>
        </div>
        <Plus
          size={32}
          className="text-gray-400 flex-center rounded-full hover:bg-[#478EE133] p-2 hover:text-[#478EE1] transition-ease-200 cursor-pointer"
          weight="regular"
        />
      </div>

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
