import React, { useState } from 'react';
import Toaster from '@/utils/toaster';
import patchHandler from '@/handlers/patch_handler';
import { useDispatch, useSelector } from 'react-redux';
import { setPhoneNumber, userSelector } from '@/slices/userSlice';
import isMobilePhone from 'validator/lib/isMobilePhone';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatePhoneNumber = ({ setShow }: Props) => {
  const [lockBtn, setLockBtn] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (!isMobilePhone(phoneNo)) {
      Toaster.error('Enter a valid phone number');
      return;
    }
    if (lockBtn) return;
    setLockBtn(true);
    const toaster = Toaster.startLoad('Updating your Phone Number...');

    const formData = {
      phoneNo,
    };

    const URL = `/users/update_phone_number`;

    const res = await patchHandler(URL, formData);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Phone Number Updated!', 1);
      setLockBtn(false);
      dispatch(setPhoneNumber(phoneNo));
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        console.log(res);
      }
    }
    setLockBtn(false);
  };

  const handleChange = (el: React.ChangeEvent<HTMLInputElement>) => {
    if (el.target.value.length > 10) return;
    setPhoneNo(el.target.value.replace(/\D+/g, ''));
  };

  const currentPhoneNo = useSelector(userSelector).phoneNo;

  return (
    <>
      <div className="w-2/3 h-2/3 max-md:w-5/6 max-md:overflow-y-auto fixed backdrop-blur-xl text-white bg-[#ffe1fc22] z-30 translate-x-1/2 -translate-y-1/4 top-56 right-1/2 flex max-md:flex-col font-primary p-8 max-md:p-4 gap-2 border-2 border-primary_btn  dark:border-dark_primary_btn animate-fade_third rounded-xl">
        <form
          onSubmit={el => handleSubmit(el)}
          className="w-full flex flex-col gap-6 px-32 max-md:px-8 py-16 max-md:py-8"
        >
          {!currentPhoneNo || currentPhoneNo == '' ? (
            <div className="font-Inconsolata text-xl text-center cursor-default">
              You haven&apos;t set up your phone number yet.
            </div>
          ) : (
            <div className="font-Helvetica text-center cursor-default">
              Current Phone Number: <span className="font-Inconsolata text-xl font-bold">{currentPhoneNo}</span>
            </div>
          )}

          <input
            className="bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            type="text"
            placeholder="Enter your new phone number"
            value={phoneNo}
            onChange={el => handleChange(el)}
          />
          <button
            type="submit"
            className="w-1/3 m-auto bg-slate-100 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl font-Inconsolata text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default UpdatePhoneNumber;
