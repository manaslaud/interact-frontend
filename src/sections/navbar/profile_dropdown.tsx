import React from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { resetUser } from '@/slices/userSlice';
import { useRouter } from 'next/router';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileDropdown = ({ setShow }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(resetUser());
    Cookies.remove('id');
    Cookies.remove('token');

    router.replace('/login');
  };
  return (
    <>
      <div className="w-72 max-md:border-b-[1px] max-md:border-primary_btn bg-gray-200 bg-opacity-50 dark:bg-transparent dark:border-dark_primary_btn dark:text-white font-primary max-md:w-full max-h-[480px] max-md:max-h-none overflow-y-auto fixed top-[72px] max-md:top-navbar right-4 max-md:right-0 rounded-2xl max-md:rounded-none backdrop-blur-lg backdrop p-2 z-50 animate-fade_third">
        <Link
          href={'/profile'}
          className="w-full flex-center py-4 rounded-lg cursor-pointer transition-ease-200 hover:bg-[#ffffff] dark:hover:bg-[#52525246]"
        >
          Profile
        </Link>
        <Link
          href={'/settings'}
          className="w-full flex-center py-4 rounded-lg cursor-pointer transition-ease-200 hover:bg-[#ffffff] dark:hover:bg-[#52525246]"
        >
          Settings
        </Link>
        <div
          onClick={handleLogout}
          className="w-full flex-center py-4 rounded-lg cursor-pointer transition-ease-200 hover:bg-[#ffffff] dark:hover:bg-[#52525246]"
        >
          Log Out
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="backdrop-brightness-75 w-screen h-screen fixed top-0 left-0 z-40 animate-fade_third"
      ></div>
    </>
  );
};

export default ProfileDropdown;
