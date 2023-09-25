import TabMenu from '@/components/common/tab_menu';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import React, { useEffect, useState } from 'react';
import { initialPost, initialUser } from '@/types/initials';
import { EXPLORE_URL, POST_URL, USER_COVER_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';
import Posts from '@/screens/profile/posts';
import Projects from '@/screens/profile/projects';
import { Membership, Project } from '@/types';
import { GetServerSidePropsContext } from 'next/types';
import ProfileCard from '@/sections/explore/profile_card';
import PostComponent from '@/components/home/post';
import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';

interface Props {
  id: string;
}

const Post = ({ id }: Props) => {
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(true);

  const getPost = () => {
    const URL = `${POST_URL}/${id}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setPost(res.data.post);
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
    getPost();
  }, []);

  return (
    <BaseWrapper title="Post">
      <Sidebar index={2} />
      <MainWrapper>
        <div className="w-[50vw] pt-6 mx-auto max-lg:w-full flex max-md:flex-col transition-ease-out-500 font-primary">
          {loading ? <Loader /> : <PostComponent post={post} />}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Post;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  return {
    props: { id },
  };
}
