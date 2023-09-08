import React from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { USER_PROFILE_PIC_URL, POST_PIC_URL } from '@/config/routes';
import moment from 'moment';
import { CarouselProvider, Slider, Slide, Dot } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Link from 'next/link';
import LowerPost from '../lowers/lower_post';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';

interface Props {
  post: Post;
  showLowerPost?: boolean;
}

const Post = ({ post, showLowerPost = true }: Props) => {
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
        {post.images && post.images.length > 0 ? (
          <CarouselProvider
            naturalSlideHeight={580}
            naturalSlideWidth={1000}
            totalSlides={post.images.length}
            visibleSlides={1}
            infinite={true}
            dragEnabled={post.images.length != 1}
            touchEnabled={post.images.length != 1}
            isPlaying={false}
            className={`w-full rounded-lg flex flex-col items-center justify-center relative`}
          >
            <Slider className={`w-full rounded-lg`}>
              {post.images.map((image, index) => {
                return (
                  <Slide
                    index={index}
                    key={index}
                    className={`w-full rounded-lg flex items-center justify-center gap-2`}
                  >
                    <Image
                      crossOrigin="anonymous"
                      width={10000}
                      height={10000}
                      alt={'Post Pic'}
                      src={`${POST_PIC_URL}/${image}`}
                      className={`w-full`}
                    />
                  </Slide>
                );
              })}
            </Slider>
            <div className={`${post.images.length === 1 ? 'hidden' : ''} absolute bottom-5`}>
              {post.images.map((_, i) => {
                return <Dot key={i} slide={i} />;
              })}
            </div>
          </CarouselProvider>
        ) : (
          <></>
        )}
        <div className="w-full text-sm whitespace-pre-wrap mb-2">{post.content}</div>
        {showLowerPost ? <LowerPost post={post} /> : <></>}
      </div>
    </div>
  );
};

export default Post;
