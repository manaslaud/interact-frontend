import { SERVER_ERROR, VERIFICATION_ERROR } from '@/config/errors';
import { POST_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import NewPostImages from '@/components/home/new_post_images';
import { Post } from '@/types';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setFeed?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const NewPost = ({ setShow, setFeed }: Props) => {
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);

  let profilePic = useSelector(userSelector).profilePic;
  let name = useSelector(userSelector).name;
  let username = useSelector(userSelector).username;

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    profilePic = profilePic == '' ? 'default.jpg' : profilePic;
    name = name == '' ? 'Interact User' : name;
    username = username == '' ? 'interactUser' : username;

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

    images.forEach(file => {
      formData.append('images', file);
    });
    formData.append('content', content);

    const res = await postHandler(POST_URL, formData, 'multipart/form-data');

    if (res.statusCode === 201) {
      setContent('');
      setImages([]);
      setShow(false);
      if (setFeed) setFeed(prev => [res.data.post, ...prev]);
      Toaster.stopLoad(toaster, 'Posted!', 1);
      setShow(false);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image/s too large', 0);
    } else {
      if (res.data.message) {
        if (res.data.message == VERIFICATION_ERROR) {
          Toaster.stopLoad(toaster, VERIFICATION_ERROR, 0);
          window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verification`;
        } else Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  return (
    <>
      <div className="fixed top-24 max-md:top-[calc(50%-75px)] w-[953px] max-md:w-5/6 h-[560px] max-md:h-2/3 shadow-xl dark:shadow-none backdrop-blur-xl bg-[#ffffff] dark:bg-[#ffe1fc22] flex flex-col justify-between max-md:items-end p-8 max-md:p-6 dark:text-white font-primary overflow-y-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg right-1/2 translate-x-1/2 max-md:-translate-y-1/2 animate-fade_third z-30">
        <div className="w-full flex flex-col gap-6">
          <div className="flex gap-4 max-md:w-full">
            <Image
              crossOrigin="anonymous"
              className="w-16 h-16 rounded-full"
              width={10000}
              height={10000}
              alt="user"
              src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
            />
            <div className="grow flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-2xl font-semibold">{name}</div>
                  <div className="text-sm">@{username}</div>
                </div>
                <div
                  onClick={handleSubmit}
                  className="max-md:hidden w-[120px] h-[48px] bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover dark:hover:bg-dark_primary_comp_hover active:bg-primary_comp_active dark:active:bg-dark_primary_comp_active transition-ease-300 shrink-0 flex-center text-lg font-semibold rounded-lg cursor-pointer"
                >
                  Post
                </div>
              </div>
              <div className="max-md:hidden w-full flex flex-col gap-4">
                <NewPostImages setSelectedFiles={setImages} />
                <textarea
                  className="w-full bg-transparent focus:outline-none min-h-[154px]"
                  value={content}
                  onChange={el => setContent(el.target.value)}
                  maxLength={1000}
                  placeholder="Start a conversation..."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="md:hidden w-full flex flex-col gap-4">
            <NewPostImages setSelectedFiles={setImages} />
            <textarea
              className="w-full bg-transparent focus:outline-none min-h-[154px]"
              value={content}
              onChange={el => setContent(el.target.value)}
              maxLength={1000}
              placeholder="Start a conversation..."
            ></textarea>
          </div>
        </div>

        <div
          onClick={handleSubmit}
          className="md:hidden w-[120px] h-[48px] bg-primary_comp dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 shrink-0 flex-center text-lg font-semibold rounded-lg cursor-pointer"
        >
          Post
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default NewPost;
