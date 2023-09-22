import React, { useState } from 'react';
import Toaster from '@/utils/toaster';
import patchHandler from '@/handlers/patch_handler';
import Cookies from 'js-cookie';
import isStrongPassword from 'validator/lib/isStrongPassword';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatePassword = ({ setShow }: Props) => {
  const [lockBtn, setLockBtn] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordChecks, setShowPasswordChecks] = useState(false);

  const handleSubmit = async () => {
    if (
      !isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      Toaster.error('Enter a strong Password');
      setShowPasswordChecks(true);
      return;
    }

    if (newPassword != confirmPassword) {
      Toaster.error('Passwords do not match!');
      return;
    }
    if (lockBtn) return;
    setLockBtn(true);
    const toaster = Toaster.startLoad('Updating your Password...');

    const formData = {
      password,
      newPassword,
      confirmPassword,
    };

    const URL = `/users/update_password`;

    const res = await patchHandler(URL, formData);

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Password Updated!', 1);
      Cookies.set('token', res.data.token, {
        expires: Number(process.env.NEXT_PUBLIC_COOKIE_EXPIRATION_TIME),
      });
      setLockBtn(false);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        console.log(res);
      }
    }
    setLockBtn(false);
  };

  return (
    <>
      <div className="w-2/3 h-2/3 max-md:w-5/6 max-md:overflow-y-auto fixed backdrop-blur-xl text-white bg-[#ffe1fc22] z-30 translate-x-1/2 -translate-y-1/4 top-56 right-1/2 flex max-md:flex-col font-primary p-8 max-md:p-4 gap-2 border-2 border-primary_btn  dark:border-dark_primary_btn animate-fade_third rounded-xl">
        <div className="w-full flex flex-col gap-6 px-32 max-md:px-8 py-16 max-md:py-8">
          <input
            className="bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            type="password"
            placeholder="Old Password"
            value={password}
            onChange={el => setPassword(el.target.value)}
          />
          <input
            className="bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={el => setNewPassword(el.target.value)}
          />
          <input
            className="bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={el => setConfirmPassword(el.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-1/3 m-auto bg-slate-100 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl font-Inconsolata text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
          >
            Submit
          </button>
          {
            //! add this on signUp too
          }
          {showPasswordChecks ? (
            <div className="flex flex-col gap-1 text-base text-center">
              <div style={{ color: password.trim().length >= 8 ? '#6ad54d' : '#ff6262' }}>• At Least 8 Characters</div>
              <div style={{ color: /[A-Z]/.test(password) ? '#6ad54d' : '#ff6262' }}>
                • At Least 1 Upper Case Letter
              </div>
              <div style={{ color: /[a-z]/.test(password) ? '#6ad54d' : '#ff6262' }}>
                • At Least 1 Lower Case Letter
              </div>
              <div style={{ color: /\d/.test(password) ? '#6ad54d' : '#ff6262' }}>• At Least 1 Number</div>
              <div style={{ color: /[A-Z]/.test(password) ? '#6ad54d' : '#ff6262' }}>
                • At Least 1 Special Character
              </div>
              <div style={{ color: password == confirmPassword ? '#6ad54d' : '#ff6262' }}>• Passwords Should Match</div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default UpdatePassword;
