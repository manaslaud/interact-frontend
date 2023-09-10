import React from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import moment from 'moment';
import Link from 'next/link';
import LowerPost from '../lowers/lower_post';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import PostComponent from './post';

interface Props {
  post: Post;
  showLowerPost?: boolean;
}

const RePost = ({ post, showLowerPost = true }: Props) => {
  const loggedInUser = useSelector(userSelector);
  return (
    <div className="w-full font-primary flex gap-1 text-white py-4 border-[#535353] border-b-[1px] max-md:px-4 max-md:py-4">
      <div className="w-[5%] max-md:w-[10%] h-full">
        <Link
          href={`${post.user.username != loggedInUser.username ? `/explore/user/${post.user.username}` : '/profile'}`}
          className="rounded-full"
        >
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${post.user.profilePic}`}
            className={'rounded-full w-8 h-8'}
          />
        </Link>
      </div>
      <div className="w-[95%] max-md:w-[90%] flex flex-col gap-3">
        <div className="w-full h-fit flex justify-between">
          <Link
            href={`${post.user.username != loggedInUser.username ? `/explore/user/${post.user.username}` : '/profile'}`}
            className="font-medium"
          >
            {post.user.username}
          </Link>
          <div className="flex gap-2 font-light text-xs">
            <div>{moment(post.postedAt).fromNow()}</div>
            <div className="text-xxs">•••</div>
          </div>
        </div>
        <PostComponent post={post} />
        <div className="w-full text-sm whitespace-pre-wrap mb-2">{post.content}</div>
        {showLowerPost ? <LowerPost post={post} /> : <></>}
      </div>
    </div>
  );
};

export default RePost;
