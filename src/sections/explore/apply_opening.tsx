import Links from '@/components/utils/edit_links';
import { VERIFICATION_ERROR } from '@/config/errors';
import { APPLICATION_URL, PROJECT_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { userSelector } from '@/slices/userSlice';
import { Opening } from '@/types';
import Toaster from '@/utils/toaster';
import { FilePdf, FileText } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  opening: Opening;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setOpening: React.Dispatch<React.SetStateAction<Opening>>;
}

const ApplyOpening = ({ opening, setShow, setOpening }: Props) => {
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState<File>();
  const [links, setLinks] = useState<string[]>([]);

  let profilePic = useSelector(userSelector).profilePic;

  const router = useRouter();

  useEffect(() => {
    profilePic;
  }, [opening]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    profilePic = profilePic == '' ? 'default.jpg' : profilePic;

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const handleSubmit = async () => {
    if (message.trim() == '') {
      Toaster.error('Message Cannot be Empty', 'validation_error');
      return;
    }
    const toaster = Toaster.startLoad('Applying to Opening...');

    const formData = new FormData();
    formData.append('content', message);
    if (resume) formData.append('resume', resume);
    // links.forEach(link => formData.append('links', link));

    const URL = `${APPLICATION_URL}/${opening.id}`;
    const res = await postHandler(URL, formData, 'multipart/form-data');
    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Applied to the Opening!', 1);
      setOpening(prev => {
        return { ...prev, noOfApplications: prev.noOfApplications + 1 };
      });
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
  };

  return (
    <>
      <div className="w-2/3 h-[520px] max-md:h-base_md max-md:overflow-y-auto max-md:w-5/6 text-white fixed backdrop-blur-lg bg-[#ffe1fc22] max-md:bg-[#2a192eea] z-30 translate-x-1/2 -translate-y-1/4 top-64 max-md:top-56 right-1/2 flex flex-col font-primary px-8 py-8 gap-6 border-2 dark:border-dark_primary_btn rounded-xl animate-fade_third">
        <div className="text-xl text-center font-bold underline underline-offset-2">Apply to Opening</div>
        <div className="w-full h-full flex max-md:flex-col gap-4 items-center">
          <div className="w-1/3 h-full max-md:w-full font-primary text-white border-[1px] dark:border-dark_primary_btn rounded-lg p-4 flex flex-col items-center justify-center gap-4 max-md:gap-4 transition-ease-300 cursor-default">
            <Image
              crossOrigin="anonymous"
              width={10000}
              height={10000}
              alt={'User Pic'}
              src={`${PROJECT_PIC_URL}/${opening.project.coverPic}`}
              className={'w-[180px] h-[180px] max-md:w-[120px] max-md:h-[120px] rounded-lg object-cover'}
            />

            <div className="w-full flex flex-col gap-4 max-md:gap-2 px-8">
              <div className="w-full flex flex-col items-center gap-1">
                <div className="font-bold text-center line-clamp-2 text-2xl text-gradient">{opening.title}</div>
                <div className="text-sm">@{opening.project.title}</div>
                <div className="text-xs font-thin">{moment(opening.createdAt).fromNow()}</div>
              </div>

              <div className="w-full flex justify-center flex-wrap gap-2">
                {opening.tags &&
                  opening.tags
                    .filter((tag, index) => {
                      return index >= 0 && index < 3;
                    })
                    .map(tag => {
                      return (
                        <div
                          key={tag}
                          className="flex-center p-2 font-primary text-xs dark:text-white border-[1px] dark:border-dark_primary_btn rounded-xl"
                        >
                          {tag}
                        </div>
                      );
                    })}
                {opening.tags && opening.tags.length - 3 > 0 ? (
                  <div className="flex-center p-2 font-primary text-xs dark:text-white border-[1px] dark:border-dark_primary_btn rounded-xl">
                    + {opening.tags.length - 3}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full max-md:w-full flex max-md:flex-col gap-4">
            <div className="w-1/2 max-md:w-full h-full flex flex-col gap-2 relative">
              <textarea
                value={message}
                onChange={el => {
                  setMessage(el.target.value);
                }}
                maxLength={250}
                className="w-full px-4 py-2 rounded-lg text-black dark:bg-dark_primary_comp min-h-[20rem] max-h-60 focus:outline-none"
                placeholder="Add a Message of maximum 250 characters"
              />
              <div className="flex items-center">
                <input
                  type="file"
                  id="resume"
                  className="hidden"
                  multiple={false}
                  onChange={({ target }) => {
                    if (target.files && target.files[0]) {
                      const file = target.files[0];
                      if (file.type.split('/')[1] == 'pdf') {
                        setResume(file);
                      } else Toaster.error('Only PDF Files can be selected');
                    }
                  }}
                />

                <label className="w-full" htmlFor="resume">
                  <div
                    className={`w-full rounded-lg py-2 relative flex-center flex-col cursor-pointer border-[1px] dark:border-dark_primary_btn transition-ease-300 ${
                      !resume ? 'hover:scale-105' : 'hover:scale-100'
                    }`}
                  >
                    {!resume ? (
                      <>
                        <FilePdf size={32} />
                        <div className="">add resume</div>
                        {/* <div className="absolute top-0 right-0 translate-y-[-50%] text-xs dark:bg-dark_primary_comp_hover rounded-lg dark:text-white py-1 px-2">
                          optional
                        </div> */}
                      </>
                    ) : (
                      <>
                        <FileText size={32} />
                        <div className="w-full text-center text-sm text-ellipsis overflow-hidden">{resume.name}</div>
                      </>
                    )}
                  </div>
                </label>
                {resume ? (
                  <div onClick={() => setResume(undefined)} className="p-2 cursor-pointer">
                    X
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="w-1/2 max-md:w-full h-full flex flex-col justify-between max-md:gap-2 max-md:pb-8">
              <Links links={links} setLinks={setLinks} maxLinks={3} />
              <div
                className="h-10 rounded-xl bg-dark_primary_comp flex-center text-lg cursor-pointer dark:bg-dark_primary_comp_hover active:bg-dark_primary_comp_active transition-ease-300"
                onClick={handleSubmit}
              >
                Apply!
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen max-md:h-base fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default ApplyOpening;
