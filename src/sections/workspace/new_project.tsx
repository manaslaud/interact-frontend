import Links from '@/components/utils/edit_links';
import Tags from '@/components/utils/edit_tags';
import Images from '@/components/workspace/new_project_images';
import { VERIFICATION_ERROR } from '@/config/errors';
import { PROJECT_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { userSelector } from '@/slices/userSlice';
import { Project } from '@/types';
import categories from '@/utils/categories';
import Toaster from '@/utils/toaster';
import router from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
}

const NewProject = ({ setShow, setProjects }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [image, setImage] = useState<File>();

  const [mutex, setMutex] = useState(false);

  const user = useSelector(userSelector);

  const handleSubmit = async () => {
    if (title.trim() == '') {
      Toaster.error('Enter Title');
      return;
    }
    if (category.trim() == '') {
      Toaster.error('Select Category');
      return;
    }
    if (category == 'Select Category') {
      Toaster.error('Select Category');
      return;
    }

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
    if (image) formData.append('coverPic', image);

    const res = await postHandler(PROJECT_URL, formData, 'multipart/form-data');

    if (res.statusCode === 201) {
      const project = res.data.project;
      project.user = user;
      if (setProjects) setProjects(prev => [...prev, project]);
      Toaster.stopLoad(toaster, 'Project Added', 1);
      setTitle('');
      setTagline('');
      setDescription('');
      setTags([]);
      setLinks([]);
      setImage(undefined);
      setShow(false);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image too large', 0);
    } else {
      if (res.data.message) {
        if (res.data.message == VERIFICATION_ERROR) {
          Toaster.stopLoad(toaster, VERIFICATION_ERROR, 0);
          router.push('/verification'); //TODO use window location instead
        } else Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, 'Internal Server Error.', 0);
        console.log(res);
      }
    }
    setMutex(false);
  };

  return (
    <>
      {/* <div className="w-screen h-screen max-md:overflow-auto flex max-md:flex-col-reverse fixed top-0 left-0 bg-[#ffffff] z-50 animate-fade_third">
        
        </div> */}

      <div className="fixed top-24 max-md:top-20 w-[953px] max-md:w-5/6 h-[540px] max-md:h-2/3 backdrop-blur-2xl bg-[#ffe1fc22] flex max-md:flex-col justify-between rounded-lg p-8 gap-8 text-white font-primary overflow-y-auto border-[1px] border-primary_btn right-1/2 translate-x-1/2 animate-fade_third z-30">
        <div className="w-2/5 max-md:w-full md:sticky md:top-0">
          <Images setSelectedFile={setImage} />
        </div>
        <div className="w-3/5 max-md:w-full">
          <div className="w-full max-md:w-full flex flex-col gap-4 pb-8 max-md:pb-4">
            <input
              value={title}
              onChange={el => setTitle(el.target.value)}
              maxLength={25}
              type="text"
              placeholder="Untitled Project"
              className="w-full text-5xl max-md:text-3xl font-bold bg-transparent focus:outline-none"
            />

            <select
              onChange={el => setCategory(el.target.value)}
              className="w-fit h-12 border-[1px] border-primary_btn text-white bg-[#10013b30] focus:outline-none border-gray-300 text-sm rounded-lg block p-2"
            >
              {categories.map((c, i) => {
                return (
                  <option className="bg-[#10013b30]" key={i} value={c}>
                    {c}
                  </option>
                );
              })}
            </select>

            <Tags tags={tags} setTags={setTags} />

            <input
              value={tagline}
              onChange={el => setTagline(el.target.value)}
              type="text"
              placeholder="Write your Tagline here..."
              className="w-full text-lg bg-transparent focus:outline-none"
            />

            <textarea
              value={description}
              onChange={el => setDescription(el.target.value)}
              className="w-full max-h-80 bg-transparent focus:outline-none"
              placeholder="Explain your project"
            />
            <Links links={links} setLinks={setLinks} />

            <label className="flex w-fit cursor-pointer select-none items-center text-sm gap-2">
              <div>Keep this Project Private</div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(prev => !prev)}
                  className="sr-only"
                />
                <div
                  className={`box block h-6 w-10 rounded-full ${
                    isPrivate ? 'bg-blue-300' : 'bg-black'
                  } transition-ease-300`}
                ></div>
                <div
                  className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                    isPrivate ? 'translate-x-full' : ''
                  }`}
                ></div>
              </div>
            </label>
            <div
              onClick={handleSubmit}
              className="w-36 h-12 font-semibold border-[1px] border-primary_btn shadow-xl text-white bg-primary_btn hover:bg-primary_comp_hover active:bg-primary_comp_active flex-center rounded-lg transition-ease-300 cursor-pointer"
            >
              Build Project
            </div>
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

export default NewProject;
