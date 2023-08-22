import { SERVER_ERROR, VERIFICATION_ERROR } from '@/config/errors';
import { POST_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';

interface Props {
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewPost = ({ setValue }: Props) => {
  const [content, setContent] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const submitHandler = async () => {
    if (content.trim() == '') {
      Toaster.error('Caption cannot be empty!');
      return;
    }
    if (content.length > 1000) {
      Toaster.error('Caption can only be 500 characters long!');
      return;
    }

    const toaster = Toaster.startLoad('Adding your Post..');
    const formData = new FormData();

    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    formData.append('content', content);

    const res = await postHandler(POST_URL, formData, 'multipart/form-data');

    if (res.statusCode === 201) {
      setContent('');
      setSelectedImage('');
      setSelectedFiles([]);
      setValue(false);
      Toaster.stopLoad(toaster, 'Posted!', 1);
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
      <div className="absolute top-12 w-1/2 h-52 bg-slate-100 z-10">NewPost</div>
      <div
        onClick={() => setValue(false)}
        className=" bg-backdrop opacity-50 w-screen h-screen absolute top-0 left-0"
      ></div>
    </>
  );
};

export default NewPost;
