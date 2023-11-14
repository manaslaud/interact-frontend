import Links from '@/components/utils/edit_links';
import { SERVER_ERROR, VERIFICATION_ERROR } from '@/config/errors';
import { APPLICATION_URL, PROJECT_PIC_URL } from '@/config/routes';
import socketService from '@/config/ws';
import postHandler from '@/handlers/post_handler';
import { setApplications, userSelector } from '@/slices/userSlice';
import { Opening } from '@/types';
import Toaster from '@/utils/toaster';
import { FilePdf, FileText, X } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  opening: Opening;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setOpening: React.Dispatch<React.SetStateAction<Opening>>;
}

const ApplyOpening = ({ opening, setShow, setOpening }: Props) => {
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState<File>();
  const [links, setLinks] = useState<string[]>([]);

  const user = useSelector(userSelector);
  let profilePic = user.profilePic;

  const applications = useSelector(userSelector).applications;

  const router = useRouter();

  const dispatch = useDispatch();

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
    links.forEach(link => formData.append('links', link));

    const URL = `${APPLICATION_URL}/${opening.id}`;
    const res = await postHandler(URL, formData, 'multipart/form-data');
    if (res.statusCode === 201) {
      setOpening(prev => {
        return { ...prev, noOfApplications: prev.noOfApplications + 1 };
      });
      dispatch(setApplications([...applications, opening.id]));
      socketService.sendNotification(opening.userID, `${user.name} applied at an opening!`);
      Toaster.stopLoad(toaster, 'Applied to the Opening!', 1);
      setShow(false);
    } else {
      if (res.data.message) {
        if (res.data.message == VERIFICATION_ERROR) {
          Toaster.stopLoad(toaster, VERIFICATION_ERROR, 0);
          router.push('/verification');
        } else Toaster.stopLoad(toaster, res.data.message, 0);
      } else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  return (
    <>
      <div className="w-2/3 h-[520px] max-lg:h-base_md max-lg:overflow-y-auto max-md:w-screen max-md:h-screen dark:text-white fixed backdrop-blur-lg bg-white dark:bg-[#ffe1fc22] dark:max-lg:bg-[#2a192eea] z-50 max-lg:z-[100] translate-x-1/2 -translate-y-1/4 max-md:translate-y-0 top-64 max-lg:top-1/4 max-md:top-0 right-1/2 flex flex-col font-primary px-8 py-8 gap-6 border-2 border-primary_btn dark:border-dark_primary_btn rounded-xl max-md:rounded-none animate-fade_third">
        <div className="w-full text-3xl max-md:text-2xl text-primary_black flex justify-between items-center gap-2 font-bold">
          Apply to Opening
          <X onClick={() => setShow(false)} className="cursor-pointer" />
        </div>
        <div className="w-full h-full flex max-lg:flex-col gap-4 items-center">
          <div className="w-1/3 h-full max-lg:h-fit max-lg:w-full font-primary dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-4 flex flex-col items-center justify-center gap-4 max-lg:gap-4 transition-ease-300 cursor-default">
            <Image
              crossOrigin="anonymous"
              width={10000}
              height={10000}
              alt={'User Pic'}
              src={`${PROJECT_PIC_URL}/${opening.project.coverPic}`}
              className={'w-[180px] h-[180px] max-lg:hidden max-lg:w-[120px] max-lg:h-[120px] rounded-lg object-cover'}
            />

            <div className="w-full flex flex-col gap-4 max-lg:gap-2 px-8">
              <div className="w-full flex flex-col items-center gap-1">
                <div className="font-bold text-center line-clamp-2 text-2xl text-gradient">{opening.title}</div>
                <div className="text-sm text-center">@{opening.project.title}</div>
                <div className="text-xs font-thin">{moment(opening.createdAt).fromNow()}</div>
              </div>
            </div>
          </div>
          <div className="w-2/3 h-full max-lg:w-full flex max-lg:flex-col gap-4">
            <div className="w-1/2 max-lg:w-full h-full flex flex-col gap-2 relative">
              <textarea
                value={message}
                onChange={el => {
                  setMessage(el.target.value);
                }}
                maxLength={500}
                className="w-full px-4 py-2 rounded-lg text-black bg-primary_comp dark:bg-dark_primary_comp min-h-[20rem] max-h-60 focus:outline-none"
                placeholder="Add a Message of maximum 500 characters"
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
                    className={`w-full rounded-lg py-2 relative flex-center flex-col cursor-pointer border-[1px] border-primary_btn  dark:border-dark_primary_btn transition-ease-300 ${
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
            <div className="w-1/2 max-lg:w-full h-full flex flex-col justify-between max-lg:gap-2 max-lg:pb-8">
              <div className="w-full flex flex-col gap-2">
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">Links ({links.length || 0}/5)</div>
                <Links links={links} setLinks={setLinks} maxLinks={3} />
              </div>
              <div
                className="h-10 rounded-xl dark:bg-dark_primary_comp bg-primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active flex-center text-lg cursor-pointer dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300"
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
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-40 max-lg:z-[90]"
      ></div>
    </>
  );
};

export default ApplyOpening;
