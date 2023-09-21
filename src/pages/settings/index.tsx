import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useState } from 'react';
import Sidebar from '@/components/common/sidebar';
import { At, Phone, Password, SmileyXEyes } from '@phosphor-icons/react';
import UpdateEmail from '@/sections/settings/update_email';
import Protect from '@/utils/protect';
import UpdatePassword from '@/sections/settings/update_password';
import UpdatePhoneNumber from '@/sections/settings/update_phone_number';
import Link from 'next/link';

const Settings = () => {
  const [theme, setTheme] = useState(String(localStorage.getItem('theme')) == 'dark' ? 'dark' : 'light');

  const [clickedOnChangeEmail, setClickedOnChangeEmail] = useState(false);
  const [clickedOnChangePhoneNo, setClickedOnChangePhoneNo] = useState(false);
  const [clickedOnChangePassword, setClickedOnChangePassword] = useState(false);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };
  return (
    <BaseWrapper>
      <Sidebar index={9} />
      <MainWrapper>
        <div className="w-3/4 max-md:w-full mx-auto dark:text-white flex flex-col gap-2 px-8 max-md:px-4 py-6 font-primary relative transition-ease-out-500">
          <div className="text-4xl font-extrabold text-gradient mb-2">Settings</div>
          <label className="w-full h-16 select-none text-xl flex-center gap-4 dark:bg-dark_primary_comp hover:dark:bg-dark_primary_comp_hover active:dark:bg-dark_primary_comp_active px-6 rounded-md text-center cursor-pointer transition-ease-300">
            <div className="capitalize">{theme} Mode</div>
            <div className="relative">
              <input type="checkbox" onChange={toggleTheme} className="sr-only" />
              <div
                className={`box block h-8 w-14 rounded-full ${
                  theme == 'dark' ? 'bg-white' : 'bg-black'
                } transition-ease-300`}
              ></div>
              <div
                className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full ${
                  theme == 'dark' ? 'translate-x-full bg-black' : 'bg-white '
                } transition-ease-300`}
              ></div>
            </div>
          </label>
          <div
            onClick={() => setClickedOnChangeEmail(true)}
            className="w-full h-16 text-xl flex-center gap-4 dark:bg-dark_primary_comp hover:dark:bg-dark_primary_comp_hover active:dark:bg-dark_primary_comp_active px-6 rounded-md text-center cursor-pointer transition-ease-300"
          >
            <div>Change Email Address</div>
            <At size={40} weight="duotone" />
          </div>
          <div
            onClick={() => setClickedOnChangePhoneNo(true)}
            className="w-full h-16 text-xl flex-center gap-4 dark:bg-dark_primary_comp hover:dark:bg-dark_primary_comp_hover active:dark:bg-dark_primary_comp_active px-6 rounded-md text-center cursor-pointer transition-ease-300"
          >
            <div>Change Phone Number</div>
            <Phone size={40} weight="duotone" />
          </div>
          <div
            onClick={() => setClickedOnChangePassword(true)}
            className="w-full h-16 text-xl flex-center gap-4 dark:bg-dark_primary_comp hover:dark:bg-dark_primary_comp_hover active:dark:bg-dark_primary_comp_active px-6 rounded-md text-center cursor-pointer transition-ease-300"
          >
            <div>Update Your Password</div>
            <Password size={40} weight="duotone" />
          </div>
          <Link
            href={'/settings/deactivate_account'}
            className="w-full h-16 text-xl flex-center gap-4 dark:bg-dark_primary_comp hover:dark:bg-dark_primary_comp_hover active:dark:bg-dark_primary_comp_active px-6 rounded-md text-center cursor-pointer transition-ease-300"
          >
            <div>Deactive Account</div>
            <SmileyXEyes size={40} weight="duotone" />
          </Link>
          {clickedOnChangeEmail ? <UpdateEmail setShow={setClickedOnChangeEmail} /> : <></>}
          {clickedOnChangePhoneNo ? <UpdatePhoneNumber setShow={setClickedOnChangePhoneNo} /> : <></>}
          {clickedOnChangePassword ? <UpdatePassword setShow={setClickedOnChangePassword} /> : <></>}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Protect(Settings);
