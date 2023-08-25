import React from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { USER_PROFILE_PIC_URL, POST_PIC_URL } from '@/config/routes';
import moment from 'moment';
import { CarouselProvider, Slider, Slide, Dot } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
// import LowerPost from './lower_post';
import Link from 'next/link';
import LowerPost from '../lowers/lower_post';

interface Props {
  post: Post;
  showLowerPost?: boolean;
}

const Post = ({ post, showLowerPost = true }: Props) => {
  return (
    <div className="w-full flex flex-col gap-4 px-12 py-12 border-b-2 transition-ease-300 hover:bg-[#e3e3e3] max-md:px-4 max-md:py-4">
      <div className="flex justify-between w-full">
        <div className="w-full flex gap-2">
          <Link href={`/explore/user/${post.userID}`} className="rounded-full">
            <Image
              crossOrigin="anonymous"
              width={10000}
              height={10000}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${post.user.profilePic}`}
              className={'rounded-full w-12 h-12'}
            />
          </Link>

          <div className="flex flex-col">
            <Link href={`/explore/user/${post.userID}`} className="text-xl font-bold font-Helvetica">
              {post.user.name}
            </Link>
            <div className="flex gap-1 text-sm font-Imprima">
              <Link href={`/explore/user/${post.userID}`} className="">
                @{post.user.username}
              </Link>
              <div>•</div>
              <div>{moment(post.postedAt).fromNow()}</div>
              {post.edited ? <div>(edited)</div> : ''}
            </div>
          </div>
        </div>
        {/* {userID !== post.userID ? <div className="text-xl">...</div> : <></>} */}
      </div>
      <div className="w-full h-fit pl-14 flex flex-col gap-4">
        <div className="w-full h-fit font-Helvetica whitespace-pre-wrap">{post.content}</div>
        {post.tags && post.tags.length > 0 ? (
          <>
            <div className="w-full flex flex-wrap gap-3 max-md:gap-2 text-sm max-md:text-xs">
              {post.tags.map((tag, index) => {
                return (
                  <Link href={`/explore/search?key=${tag}`} key={index} className="font-bold font-sans cursor-pointer">
                    #{tag}
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {post.images && post.images.length > 0 ? (
        <div className={`w-full pl-14`}>
          <CarouselProvider
            naturalSlideHeight={580}
            naturalSlideWidth={1000}
            totalSlides={post.images.length}
            visibleSlides={1}
            infinite={true}
            dragEnabled={post.images.length != 1}
            touchEnabled={post.images.length != 1}
            isPlaying={false}
            className={`w-full rounded-xl flex flex-col items-center justify-center relative`}
          >
            <Slider className={`w-full rounded-xl`}>
              {post.images.map((image, index) => {
                return (
                  <Slide
                    index={index}
                    key={index}
                    className={`w-full rounded-xl flex items-center justify-center gap-2`}
                  >
                    <Image
                      crossOrigin="anonymous"
                      width={10000}
                      height={10000}
                      alt={'Post Pic'}
                      src={`${POST_PIC_URL}/${image}`}
                      className={`w-full rounded-xl px-1`}
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
        </div>
      ) : (
        <></>
      )}
      {showLowerPost ? <LowerPost post={post} /> : <></>}
    </div>
  );
};

export default Post;
