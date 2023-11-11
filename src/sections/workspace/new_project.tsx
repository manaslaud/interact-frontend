import Links from '@/components/utils/edit_links';
import Tags from '@/components/utils/edit_tags';
import Images from '@/components/workspace/new_project_images';
import { VERIFICATION_ERROR } from '@/config/errors';
import { PROJECT_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { setOwnerProjects, userSelector } from '@/slices/userSlice';
import { Project } from '@/types';
import categories from '@/utils/categories';
import Toaster from '@/utils/toaster';
import router from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (title.trim() == '') {
      Toaster.error('Enter Title');
      return;
    }
    if (description.trim() == '') {
      Toaster.error('Enter Description');
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
      dispatch(setOwnerProjects([...user.ownerProjects, project.id]));
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
      }
    }
    setMutex(false);
  };

  return (
    <>
      {/* <div className="w-screen h-screen max-md:overflow-auto flex max-md:flex-col-reverse fixed top-0 left-0 bg-[#ffffff] z-50 animate-fade_third">
        
        </div> */}

      <div className="fixed top-14 max-md:top-20 w-5/6 max-md:w-5/6 h-5/6 backdrop-blur-2xl bg-white dark:bg-[#ffe1fc22] flex max-md:flex-col justify-between rounded-lg p-8 gap-8 max-md:gap-4 dark:text-white font-primary overflow-y-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 translate-x-1/2 animate-fade_third z-50">
        <div className="w-80 max-md:w-full md:sticky md:top-0">
          <Images setSelectedFile={setImage} />
        </div>
        <div className="w-[calc(100%-320px)] max-md:w-full h-full flex flex-col justify-between gap-2">
          <div className="w-full h-fit flex flex-col gap-6">
            <div className="w-full max-md:w-full text-primary_black flex flex-col gap-4 pb-8 max-md:pb-4">
              <input
                value={title}
                onChange={el => setTitle(el.target.value)}
                maxLength={20}
                type="text"
                placeholder="Untitled Project"
                className="w-full text-5xl max-md:text-center max-md:text-3xl font-bold bg-transparent focus:outline-none"
              />

              <select
                onChange={el => setCategory(el.target.value)}
                className="w-1/2 max-md:w-full h-12 border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:text-white bg-primary_comp dark:bg-[#10013b30] focus:outline-nonetext-sm rounded-lg block p-2"
              >
                {categories.map((c, i) => {
                  return (
                    <option className="bg-primary_comp_hover dark:bg-[#10013b30]" key={i} value={c}>
                      {c}
                    </option>
                  );
                })}
              </select>

              <div>
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  Project Tagline ({tagline.trim().length}/40)
                </div>
                <input
                  value={tagline}
                  onChange={el => setTagline(el.target.value)}
                  maxLength={40}
                  type="text"
                  className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
                  placeholder="Write your Tagline here..."
                />
              </div>

              <div>
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  Project Description ({description.trim().length}/500)
                </div>
                <textarea
                  value={description}
                  onChange={el => setDescription(el.target.value)}
                  maxLength={500}
                  className="w-full min-h-[80px] max-h-80 bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
                  placeholder="Explain your project"
                />
              </div>

              <div>
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  Project Tags ({tags.length || 0}/10)
                </div>
                <Tags tags={tags} setTags={setTags} maxTags={10} />
              </div>

              <div>
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  Project Links ({links.length || 0}/5)
                </div>
                <Links links={links} setLinks={setLinks} maxLinks={5} />
              </div>

              <label className="flex w-fit cursor-pointer select-none items-center text-sm gap-2">
                <div className="font-semibold">Keep this Project Private</div>
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
            </div>
          </div>

          <div className="w-full flex max-md:justify-center justify-end">
            <button
              onClick={handleSubmit}
              className={`duration-300 relative group cursor-pointer text-white overflow-hidden h-16 max-md:h-12 ${
                mutex ? 'w-72 max-md:w-64 scale-90' : 'w-48 max-md:w-40 hover:scale-90'
              } rounded-xl p-2 flex-center`}
            >
              <div
                className={`absolute right-32 -top-4 ${
                  mutex
                    ? 'top-0 right-2 scale-150'
                    : 'scale-125 group-hover:top-1 group-hover:right-2 group-hover:scale-150'
                } z-10 w-36 h-36 rounded-full duration-500 bg-[#6661c7]`}
              ></div>
              <div
                className={`absolute right-2 -top-4 ${
                  mutex
                    ? 'top-1 right-2 scale-150'
                    : 'scale-125 right-3 group-hover:top-1 group-hover:right-2 group-hover:scale-150'
                } z-10 w-24 h-24 rounded-full duration-500 bg-[#ada9ff]`}
              ></div>
              <div
                className={`absolute -right-10 top-0 ${
                  mutex ? 'top-1 right-2 scale-150' : 'group-hover:top-1 group-hover:right-2 group-hover:scale-150'
                } z-10 w-20 h-20 rounded-full duration-500 bg-[#cea9ff]`}
              ></div>
              <div
                className={`absolute right-20 -top-4 ${
                  mutex ? 'top-1 right-2 scale-125' : 'group-hover:top-1 group-hover:right-2 group-hover:scale-125'
                } z-10 w-16 h-16 rounded-full duration-500 bg-[#df96ff]`}
              ></div>
              <div
                className={`w-[96%] h-[90%] bg-gray-50 ${
                  mutex ? 'opacity-100' : 'opacity-0'
                } absolute rounded-xl z-10 transition-ease-500`}
              ></div>
              <p className={`z-10 font-bold text-xl max-md:text-lg transition-ease-500`}>
                {mutex ? (
                  <>
                    <div className="w-fit text-gradient transition-ease-out-300 animate-fade_half">
                      Building your project!
                    </div>
                  </>
                ) : (
                  <div className="">Build Project</div>
                )}
              </p>
            </button>
          </div>

          {/* <div className="w-fit  text-3xl font-bold">Build Project</div> */}
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen max-md:w-[105vw] max-md:h-[105vh] fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default NewProject;
