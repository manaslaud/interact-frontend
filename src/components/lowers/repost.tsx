import { SERVER_ERROR, VERIFICATION_ERROR } from '@/config/errors';
import { POST_PIC_URL, POST_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import { Post } from '@/types';
import moment from 'moment';
import { CarouselProvider, Slide, Slider, Dot } from 'pure-react-carousel';

interface Props {
  post: Post;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setFeed?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const RePost = ({ post, setShow, setFeed }: Props) => {
  const [content, setContent] = useState<string>('');

  let profilePic = useSelector(userSelector).profilePic;
  let name = useSelector(userSelector).name;

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    profilePic = profilePic == '' ? 'default.jpg' : profilePic;
    name = name == '' ? 'Interact User' : name;

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const handleSubmit = async () => {
    if (content.trim() == '') {
      Toaster.error('Caption cannot be empty!');
      return;
    }
    if (content.length > 1000) {
      Toaster.error('Caption can only be 1000 characters long!');
      return;
    }

    const toaster = Toaster.startLoad('Adding your Post..');
    const formData = new FormData();

    formData.append('content', content);
    formData.append('postID', post.id);

    const res = await postHandler(POST_URL, formData);

    if (res.statusCode === 201) {
      setContent('');
      setShow(false);
      if (setFeed) setFeed(prev => [res.data.post, ...prev]);
      Toaster.stopLoad(toaster, 'Posted!', 1);
      setShow(false);
    } else {
      if (res.data.message) {
        if (res.data.message == VERIFICATION_ERROR) {
          Toaster.stopLoad(toaster, VERIFICATION_ERROR, 0);
          window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verification`;
        } else Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
        console.log(res);
      }
    }
  };

  return (
    <>
      <div className="fixed top-24 w-[953px] h-[470px] flex flex-col justify-between p-8 text-white font-primary overflow-y-auto max-md:w-5/6 bg-new_post bg-contain right-1/2 translate-x-1/2 animate-fade_third z-30">
        <div className="flex gap-4">
          <Image
            crossOrigin="anonymous"
            className="w-16 h-16 rounded-full"
            width={10000}
            height={10000}
            alt="user"
            src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
          />
          <div className="grow flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-semibold">{name}</div>
              <div
                onClick={handleSubmit}
                className="w-[132px] h-[54px] bg-[#0e0c2a77] shrink-0 flex-center text-lg font-semibold rounded-lg cursor-pointer"
              >
                RePost
              </div>
            </div>

            <div className="w-1/2 font-primary flex gap-1 border-primary_btn border-[1px] text-white rounded-xl p-4 max-md:px-4 max-md:py-4">
              <div className="w-[10%] max-md:w-[10%] h-full">
                <div className="rounded-full">
                  <Image
                    crossOrigin="anonymous"
                    width={10000}
                    height={10000}
                    alt={'User Pic'}
                    src={`${USER_PROFILE_PIC_URL}/${post.user.profilePic}`}
                    className={'rounded-full w-8 h-8'}
                  />
                </div>
              </div>
              <div className="w-[90%] max-md:w-[90%] flex flex-col gap-3">
                <div className="w-full h-fit flex justify-between items-center">
                  <div className="font-medium">@{post.user.username}</div>
                  <div className="flex gap-2 font-light text-xxs">
                    <div>{moment(post.postedAt).fromNow()}</div>
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
                <div className="w-full text-sm whitespace-pre-wrap mb-2 line-clamp-3">{post.content}</div>
              </div>
            </div>

            <textarea
              className="w-full mt-4 bg-transparent focus:outline-none min-h-[154px]"
              value={content}
              onChange={el => setContent(el.target.value)}
              placeholder="Add to conversation..."
            ></textarea>
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default RePost;
