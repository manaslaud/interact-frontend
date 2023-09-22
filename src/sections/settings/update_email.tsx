import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Toaster from '@/utils/toaster';
import patchHandler from '@/handlers/patch_handler';
import isEmail from 'validator/lib/isEmail';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setVerificationStatus, userSelector } from '@/slices/userSlice';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateEmail = ({ setShow }: Props) => {
  const [lockBtn, setLockBtn] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const router = useRouter();

  const dispatch = useDispatch();

  const handleSubmit = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (!isEmail(newEmail)) {
      Toaster.error('Enter a valid email');
      return;
    }
    if (lockBtn) return;
    setLockBtn(true);
    const toaster = Toaster.startLoad('Updating your Email...');

    const formData = {
      email: newEmail,
    };

    const URL = `/users/update_email`;

    const res = await patchHandler(URL, formData);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Email Updated!', 1);
      setLockBtn(false);
      dispatch(setEmail(newEmail));
      dispatch(setVerificationStatus(false));
      router.push('/verification');
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        console.log(res);
      }
    }
    setLockBtn(false);
  };

  const currentEmail = useSelector(userSelector).email;

  return (
    <>
      <div className="w-2/3 h-2/3 max-md:w-5/6 max-md:overflow-y-auto fixed backdrop-blur-xl text-white bg-[#ffe1fc22] z-30 translate-x-1/2 -translate-y-1/4 top-56 right-1/2 flex max-md:flex-col font-primary p-8 max-md:p-4 gap-2 border-2 border-primary_btn  dark:border-dark_primary_btn animate-fade_third rounded-xl">
        <form
          onSubmit={el => handleSubmit(el)}
          className="w-full flex flex-col gap-6 px-32 max-md:px-8 py-16 max-md:py-8"
        >
          <div className="font-Helvetica text-center cursor-default">
            Current Email Address: <span className=" text-xl font-bold">{currentEmail}</span>
          </div>
          <input
            className="bg-slate-200 text-black p-3 rounded-lg  text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            type="email"
            placeholder="Enter your new email address"
            value={newEmail}
            onChange={el => setNewEmail(el.target.value)}
          />
          <button
            type="submit"
            className="w-1/3 m-auto bg-slate-100 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl  text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
          >
            Submit
          </button>
          <div className="w-full text-center ">
            Note: You will have to verify your account again after updating your email.
          </div>
        </form>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default UpdateEmail;
