import { OPENING_URL, PROJECT_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { Opening, Project } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useState } from 'react';
import Image from 'next/image';
import Tags from '@/components/utils/edit_tags';
import patchHandler from '@/handlers/patch_handler';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  opening: Opening;
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
}

const EditOpening = ({ setShow, opening, project, setProject }: Props) => {
  const [description, setDescription] = useState(opening.description);
  const [tags, setTags] = useState<string[]>(opening.tags || []);
  const [active, setActive] = useState(opening.active); //TODO have different manager route for this

  const [mutex, setMutex] = useState(false);

  const handleSubmit = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Editing your opening...');

    const formData = {
      description,
      tags,
      active,
    };

    const URL = `${OPENING_URL}/${opening.id}`;

    const res = await patchHandler(URL, formData);

    if (res.statusCode === 200) {
      if (setProject)
        setProject(prev => {
          let openings = prev.openings;
          openings = openings.map(oldOpening => {
            if (oldOpening.id == opening.id) {
              return { ...oldOpening, description, tags, active };
            } else return oldOpening;
          });
          return { ...prev, openings };
        });
      Toaster.stopLoad(toaster, 'Opening Edited', 1);
      setShow(false);
    } else {
      Toaster.stopLoad(toaster, 'Internal Server Error.', 0);
      console.log(res);
    }
    setMutex(false);
  };

  return (
    <>
      <div className="fixed top-24 max-md:top-20 w-[953px] max-md:w-5/6 h-[540px] max-md:h-2/3 backdrop-blur-2xl bg-[#ffe1fc22] flex flex-col justify-between rounded-lg p-10 text-white font-primary overflow-y-auto border-[1px] border-primary_btn right-1/2 translate-x-1/2 animate-fade_third z-30">
        <div className="w-full flex flex-col gap-12">
          <div className="w-full flex max-md:flex-col gap-12 items-center">
            <Image
              crossOrigin="anonymous"
              width={10000}
              height={10000}
              alt={'User Pic'}
              src={`${PROJECT_PIC_URL}/${project.coverPic}`}
              className={'w-[160px] h-[160px] max-md:w-[120px] max-md:h-[120px] rounded-lg object-cover'}
            />
            <div className="grow flex flex-col gap-2">
              <div className="w-full text-4xl max-md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end cursor-default">
                {' '}
                {opening.title}{' '}
              </div>
              <div className="text-xl font-medium cursor-default">{project.title}</div>
              <Tags tags={tags} setTags={setTags} />
              <label className="flex w-fit cursor-pointer select-none items-center text-sm gap-2">
                <div>Opening Active</div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => setActive(prev => !prev)}
                    className="sr-only"
                  />
                  <div
                    className={`box block h-6 w-10 rounded-full ${
                      active ? 'bg-blue-300' : 'bg-black'
                    } transition-ease-300`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                      active ? 'translate-x-full' : ''
                    }`}
                  ></div>
                </div>
                <div className="text-xs">
                  (setting it to inactive will automatically reject all pending applications)
                </div>
              </label>
            </div>
          </div>
          <textarea
            value={description}
            onChange={el => setDescription(el.target.value)}
            className="w-full min-h-[48px] max-h-40 bg-transparent focus:outline-none"
            placeholder="Start typing role description..."
          />
        </div>
        <div className="w-full flex justify-end">
          <div
            onClick={handleSubmit}
            className="w-36 h-12 font-semibold border-[1px] border-primary_btn shadow-xl text-white bg-primary_btn hover:bg-primary_comp_hover active:bg-primary_comp_active flex-center rounded-lg transition-ease-300 cursor-pointer"
          >
            Edit Opening
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

export default EditOpening;
