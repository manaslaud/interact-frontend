import Loader from '@/components/common/loader';
import PostComponent from '@/components/home/post';
import getHandler from '@/handlers/get_handler';
import { userSelector } from '@/slices/userSlice';
import { Post } from '@/types';
import Toaster from '@/utils/toaster';
import { Plus } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import NewPost from '@/sections/home/new_post';

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
    <div className="w-[55vw] max-md:w-screen flex flex-col gap-2">
      {clickedOnNewPost ? <NewPost setFeed={setFeed} setShow={setClickedOnNewPost} /> : <></>}
      {/* Create a New Post */}
      <div
        onClick={() => setClickedOnNewPost(true)}
        className="w-taskbar max-md:w-taskbar_md h-taskbar mx-auto bg-gradient-to-l from-primary_gradient_start to-primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer shadow-outer flex justify-between items-center"
      >
        <div className="flex gap-2 items-center pl-2">
          {/* <Image
            crossOrigin="anonymous"
            className="w-8 h-8 rounded-full"
            width={10000}
            height={10000}
            alt="user"
            src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
          /> */}
          <div className="font-primary text-gray-200 text-lg">Create a post</div>
        </div>
        <Plus
          size={36}
          className="text-gray-200 flex-center rounded-full hover:bg-[#e9e9e933] p-2 transition-ease-300"
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
            <InfiniteScroll
              className="px-12 max-md:px-2"
              dataLength={feed.length}
              next={getFeed}
              hasMore={hasMore}
              loader={<Loader />}
            >
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
