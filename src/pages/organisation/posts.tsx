import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useEffect, useState } from 'react';
import OrgSidebar from '@/components/common/org_sidebar';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Post from '@/components/home/post';
import NewPost from '@/sections/home/new_post';
import { Plus } from '@phosphor-icons/react';
import Image from 'next/image';
import { POST_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import PostsLoader from '@/components/loaders/posts';
import NoFeed from '@/components/empty_fillers/feed';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostComponent from '@/components/home/post';
import RePostComponent from '@/components/home/repost';
import OrgMembersOnlyAndProtect from '@/utils/wrappers/org_members_only';

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [clickedOnNewPost, setClickedOnNewPost] = useState(false);
  const [loading, setLoading] = useState(true);

  const getFeed = () => {
    const URL = `${POST_URL}/me?page=${page}&limit=${10}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addedPosts = [...posts, ...res.data.posts];
          if (addedPosts.length === posts.length) setHasMore(false);
          setPosts(addedPosts);
          setPage(prev => prev + 1);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <BaseWrapper title="Posts">
      <OrgSidebar index={2} />
      <MainWrapper>
        <div className="w-[50vw] max-md:w-full mx-auto flex flex-col items-center relative gap-4 px-9 max-md:px-2 p-base_padding">
          {clickedOnNewPost ? <NewPost setFeed={setPosts} setShow={setClickedOnNewPost} org={true} /> : <></>}
          <div
            onClick={() => setClickedOnNewPost(true)}
            className="w-full h-taskbar mx-auto shadow-md hover:shadow-lg transition-ease-300 text-gray-400 dark:text-gray-200 bg-white dark:bg-gradient-to-l dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer border-gray-300 border-[1px] dark:border-0 dark:hover:shadow-outer dark:shadow-outer flex justify-between items-center"
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
              <div className="font-primary">Create a post</div>
            </div>
            <Plus
              size={36}
              className="flex-center rounded-full hover:bg-primary_comp_hover dark:hover:bg-[#e9e9e933] p-2 transition-ease-300"
              weight="regular"
            />
          </div>

          {loading ? (
            <PostsLoader />
          ) : (
            <div className="w-full">
              {posts.length === 0 ? (
                <NoFeed />
              ) : (
                <InfiniteScroll
                  className="w-full flex flex-col gap-4 dark:gap-0"
                  dataLength={posts.length}
                  next={getFeed}
                  hasMore={hasMore}
                  loader={<PostsLoader />}
                >
                  {posts.map(post => {
                    if (post.rePost) return <RePostComponent key={post.id} setFeed={setPosts} post={post} />;
                    else return <PostComponent key={post.id} setFeed={setPosts} post={post} />;
                  })}
                </InfiniteScroll>
              )}
            </div>
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default OrgMembersOnlyAndProtect(Posts);
