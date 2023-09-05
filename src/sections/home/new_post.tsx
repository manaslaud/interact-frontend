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
                Post
              </div>
            </div>
            <NewPostImages setSelectedFiles={setImages} />
            <textarea
              className="w-full bg-transparent focus:outline-none min-h-[154px]"
              value={content}
              onChange={el => setContent(el.target.value)}
              placeholder="Start a conversation..."
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

export default NewPost;
