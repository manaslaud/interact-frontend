import Links from '@/components/common/edit_links';
import Tags from '@/components/common/edit_tags';
import Images from '@/components/workspace/new_project_images';
import { VERIFICATION_ERROR } from '@/config/errors';
import { PROJECT_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import categories from '@/utils/categories';
import Toaster from '@/utils/toaster';
import router from 'next/router';
import React, { useState } from 'react';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewProject = ({ setShow }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [mutex, setMutex] = useState(false);

  const handleSubmit = async () => {
    if (mutex) return;
    setMutex(true);
    const toaster = Toaster.startLoad('Adding your project...');

    const formData = new FormData();

    formData.append('title', title);
    formData.append('tagline', tagline);
    formData.append('description', description);
    tags.forEach(tag => formData.append('tags', tag));
    links.forEach(link => formData.append('links', link));
    formData.append('category', category);
    formData.append('isPrivate', String(isPrivate));
    // images.forEach(file => {
    //   formData.append('images', file);
    // });

    const res = await postHandler(PROJECT_URL, formData, 'multipart/form-data');

    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Project Added', 1);
      setShow(false);
    } else {
      if (res.data.message) {
        if (res.data.message == VERIFICATION_ERROR) {
          Toaster.stopLoad(toaster, VERIFICATION_ERROR, 0);
          router.push('/verification');
        } else Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, 'Internal Server Error.', 0);
        console.log(res);
      }
    }
    setMutex(false);
  };

  return (
    <div className="w-screen h-screen flex absolute top-0 left-0 bg-[#ffffff] z-50">
      <div className="w-1/3 bg-slate-100">
        <Images setSelectedFiles={setImages} />
      </div>
      <div className="w-2/3">
        <div className="w-full flex justify-end">
          <div onClick={() => setShow(false)}>Cancel</div>
        </div>
        <div className="w-3/5 flex flex-col gap-4">
          <input
            value={title}
            onChange={el => setTitle(el.target.value)}
            type="text"
            placeholder="Untitled Project"
            className="w-full text-5xl focus:outline-none"
          />
          <input
            value={tagline}
            onChange={el => setTagline(el.target.value)}
            type="text"
            placeholder="Add a Tagline"
            className="w-full text-lg focus:outline-none"
          />
          <Tags tags={tags} setTags={setTags} />
          <textarea
            value={description}
            onChange={el => setDescription(el.target.value)}
            className="w-full max-h-80 focus:outline-none"
            placeholder="Click here and start typing"
          />
          <Links links={links} setLinks={setLinks} />
          <div>
            <div className="block mb-2 text-sm font-medium text-gray-900">Select a Category</div>
            <select
              onChange={el => setCategory(el.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {categories.map((c, i) => {
                return (
                  <option key={i} value={c}>
                    {c}
                  </option>
                );
              })}
            </select>
          </div>

          <label className="flex cursor-pointer select-none items-center">
            <div>Keep this Project Private</div>
            <div className="relative">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(prev => !prev)}
                className="sr-only"
              />
              <div
                className={`box block h-8 w-14 rounded-full ${
                  isPrivate ? 'bg-blue-300' : 'bg-black'
                } transition-ease-300`}
              ></div>
              <div
                className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                  isPrivate ? 'translate-x-full' : ''
                }`}
              ></div>
            </div>
          </label>
          <div onClick={handleSubmit} className="cursor-pointer">
            Build Project
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
