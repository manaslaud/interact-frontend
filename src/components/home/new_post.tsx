import { SERVER_ERROR, VERIFICATION_ERROR } from '@/config/errors';
import { POST_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';
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
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

    selectedFiles.forEach(file => {
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
      <div className="absolute top-12 w-1/2 max-md:w-5/6 h-max bg-slate-100 z-10 right-1/2 translate-x-1/2">
        <div>New Post</div>
        <div onClick={submitHandler}>submit</div>
        <input
          type="file"
          className="hidden"
          id="image"
          multiple={true}
          onChange={async ({ target }) => {
            if (target.files && target.files.length > 0) {
              if (target.files.length > 5) {
                Toaster.error('Can add at most 5 photos.');
                return;
              }
              const resizedImages = await Promise.all(
                Array.from(target.files).map(async file => {
                  if (file.type.split('/')[0] === 'image') {
                    try {
                      const resizedPic = await resizeImage(file, 1280, 720);
                      return resizedPic;
                    } catch (error) {
                      console.error('Error while resizing image:', error);
                      return null;
                    }
                  } else {
                    Toaster.error('Only Images allowed');
                    return null;
                  }
                })
              );

              const filteredResizedImages = resizedImages.filter(img => img !== null);

              setSelectedImageUrls(filteredResizedImages.map(img => URL.createObjectURL(img as File)));
              setSelectedFiles(filteredResizedImages.filter(img => img !== null) as File[]);
            }
          }}
        />
        <label htmlFor="image">
          <div
            className={
              'rounded-full w-12 h-12 bg-[#292929] flex flex-col items-center justify-center transition-all ease-in-out duration-500 cursor-pointer hover:scale-110 hover:bg-[#3b3b3b]'
            }
          >
            add Image
          </div>
        </label>
        <NewPostImages imageURLs={selectedImageUrls} />
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
        className=" bg-backdrop opacity-50 w-screen h-screen absolute top-0 left-0"
      ></div>
    </>
  );
};

export default NewPost;
