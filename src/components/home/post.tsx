import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { USER_PROFILE_PIC_URL, POST_PIC_URL, POST_URL } from '@/config/routes';
import moment from 'moment';
import { CarouselProvider, Slider, Slide, Dot } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Link from 'next/link';
import LowerPost from '../lowers/lower_post';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import deleteHandler from '@/handlers/delete_handler';
import Toaster from '@/utils/toaster';
import patchHandler from '@/handlers/patch_handler';
import { SERVER_ERROR } from '@/config/errors';
import ConfirmDelete from '../common/confirm_delete';

interface Props {
  post: Post;
  showLowerPost?: boolean;
  isRepost?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const Post = ({ post, showLowerPost = true, isRepost = false, setFeed }: Props) => {
  const loggedInUser = useSelector(userSelector);
  const [clickedOnOptions, setClickedOnOptions] = useState(false);
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [clickedOnDelete, setClickedOnDelete] = useState(false);

  const [caption, setCaption] = useState(post.content);

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting your post...');

    const URL = `${POST_URL}/${post.id}`;

    const res = await deleteHandler(URL);

    if (res.statusCode === 204) {
      if (setFeed) setFeed(prev => prev.filter(p => p.id != post.id));
      setClickedOnDelete(false);
      Toaster.stopLoad(toaster, 'Post Deleted', 1);
    } else {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  const handleEdit = async () => {
    if (caption == post.content) {
      setClickedOnEdit(false);
      return;
    }
    const toaster = Toaster.startLoad('Editing Post...');

    const URL = `${POST_URL}/${post.id}`;

    const formData = {
      content: caption,
    };

    const res = await patchHandler(URL, formData);
    if (res.statusCode === 200) {
      if (setFeed)
        setFeed(prev =>
          prev.map(p => {
            if (p.id == post.id) return { ...p, content: caption, edited: true };
            else return p;
          })
        );
      setClickedOnEdit(false);
      Toaster.stopLoad(toaster, 'Post Edited', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  return (
    <div
      onClick={() => setClickedOnOptions(false)}
      className={`w-full relative bg-white dark:bg-transparent font-primary flex gap-1 rounded-lg dark:rounded-none dark:text-white p-4 border-gray-300 border-[1px] dark:border-x-0 dark:border-t-0 dark:border-dark_primary_btn ${
        !isRepost ? 'dark:border-b-[1px]' : 'dark:border-b-0'
      } max-md:p-4`}
    >
      {clickedOnDelete ? <ConfirmDelete setShow={setClickedOnDelete} handleDelete={handleDelete} /> : <></>}
      {clickedOnOptions ? (
        <>
          {post.userID == loggedInUser.id && isRepost ? (
            <></>
          ) : (
            <div className="w-1/4 h-fit flex flex-col bg-gray-100 bg-opacity-75 dark:bg-transparent absolute top-2 right-12 rounded-xl glassMorphism text-sm p-2 z-10 animate-fade_third">
              {clickedOnEdit ? (
                <>
                  <div
                    onClick={handleEdit}
                    className="w-full px-4 py-2 hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] transition-ease-100 rounded-lg cursor-pointer"
                  >
                    Save
                  </div>
                  <div
                    onClick={() => setClickedOnEdit(false)}
                    className="w-full px-4 py-2 hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] transition-ease-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </div>
                </>
              ) : (
                <>
                  {post.userID == loggedInUser.id ? (
                    <div
                      onClick={() => setClickedOnEdit(true)}
                      className="w-full px-4 py-2 hover:bg-[#ffffff] dark:hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] transition-ease-100 rounded-lg cursor-pointer"
                    >
                      Edit
                    </div>
                  ) : (
                    <></>
                  )}
                  {post.userID == loggedInUser.id ? (
                    <div
                      onClick={el => {
                        el.stopPropagation();
                        setClickedOnDelete(true);
                      }}
                      className="w-full px-4 py-2 hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] hover:text-primary_danger transition-ease-100 rounded-lg cursor-pointer"
                    >
                      Delete
                    </div>
                  ) : (
                    <></>
                  )}

                  {post.userID != loggedInUser.id ? (
                    <div
                      onClick={el => {
                        el.stopPropagation();
                      }}
                      className="w-full px-4 py-2 hover:bg-[#ffffff] dark:hover:bg-[#ffffff19] hover:text-primary_danger transition-ease-100 rounded-lg cursor-pointer"
                    >
                      Report
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <></>
      )}
      <div className="h-full">
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
      <div
        className={`grow ${
          isRepost ? 'max-w-[92%] max-md:max-w-[80%]' : 'max-w-[94%] max-md:max-w-[85%]'
        } flex-col gap-3`}
      >
        <div className="w-full h-fit flex justify-between">
          <Link
            href={`${post.user.username != loggedInUser.username ? `/explore/user/${post.user.username}` : '/profile'}`}
            className="font-medium"
          >
            {post.user.username}
          </Link>
          <div className="flex gap-2 font-light text-xs">
            {post.edited ? <div>(edited)</div> : <></>}
            <div>{moment(post.postedAt).fromNow()}</div>
            {post.userID == loggedInUser.id && isRepost ? (
              <></>
            ) : (
              <>
                {showLowerPost ? (
                  <div
                    onClick={el => {
                      el.stopPropagation();
                      setClickedOnOptions(prev => !prev);
                    }}
                    className="text-xxs cursor-pointer"
                  >
                    •••
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
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
        {clickedOnEdit ? (
          <textarea
            maxLength={500}
            value={caption}
            autoFocus={true}
            onChange={el => setCaption(el.target.value)}
            className="w-full text-sm whitespace-pre-wrap rounded-md focus:outline-none dark:bg-dark_primary_comp p-2 my-2 max-h-72"
          />
        ) : (
          <div className="w-full text-sm whitespace-pre-wrap mb-2">{post.content}</div>
        )}
        {showLowerPost ? <LowerPost setFeed={setFeed} post={post} /> : <></>}
      </div>
    </div>
  );
};

export default Post;
