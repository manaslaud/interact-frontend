import { SERVER_ERROR, VERIFICATION_ERROR } from '@/config/errors';
import { POST_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import * as DOMPurify from 'dompurify';
import { resizeImage } from '@/utils/resize_image';
import NewPostImages from './new_post_images';

const ReactQuill = dynamic(
  () => {
    return import('react-quill');
  },
  { ssr: false }
);

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewPost = ({ setShow }: Props) => {
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const submitHandler = async () => {
    if (content.trim() == '') {
      Toaster.error('Caption cannot be empty!');
      return;
    }
    if (content.length > 1000) {
      Toaster.error('Caption can only be 1000 characters long!');
      return;
    }

    const purifiedHTML = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ALLOW_ARIA_ATTR: false,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
    });

    console.log(purifiedHTML);

    const toaster = Toaster.startLoad('Adding your Post..');
    const formData = new FormData();

    images.forEach(file => {
      formData.append('images', file);
    });
    formData.append('content', content);

    // const res = await postHandler(POST_URL, formData, 'multipart/form-data');

    // if (res.statusCode === 201) {
    //   setContent('');
    //   setSelectedImage('');
    //   setSelectedFiles([]);
    //   setShow(false);
    //   Toaster.stopLoad(toaster, 'Posted!', 1);
    // } else {
    //   if (res.data.message) {
    //     if (res.data.message == VERIFICATION_ERROR) {
    //       Toaster.stopLoad(toaster, VERIFICATION_ERROR, 0);
    //       window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verification`;
    //     } else Toaster.stopLoad(toaster, res.data.message, 0);
    //   } else {
    //     Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    //     console.log(res);
    //   }
    // }
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link'],
      // ['clean'],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  return (
    <>
      <div className="fixed top-12 w-1/2 max-md:w-5/6 h-max bg-slate-100 right-1/2 translate-x-1/2 animate-fade_third z-20">
        <div>New Post</div>
        <div onClick={submitHandler}>submit</div>
        <NewPostImages setSelectedFiles={setImages} />
        <ReactQuill
          theme="snow"
          modules={modules}
          value={content}
          onChange={setContent}
          className=""
          placeholder="Enter Caption"
        />
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-10"
      ></div>
    </>
  );
};

export default NewPost;
