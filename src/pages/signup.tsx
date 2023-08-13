import React from 'react';
import { ReactSVG } from 'react-svg';
import ArrowRight from '@phosphor-icons/react/dist/icons/ArrowRight';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Toaster from '@/utils/toaster';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '@/config/routes';
import { useDispatch } from 'react-redux';
import { setUser } from '@/slices/userSlice';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next/types';
import nookies from 'nookies';
import configuredAxios from '@/config/axios';
import { resetConfig } from '@/slices/configSlice';
import { setFeed } from '@/slices/feedSlice';
import { User } from '@/types';
import socketService from '@/config/ws';
import isEmail from 'validator/lib/isEmail';
import isStrongPassword from 'validator/lib/isStrongPassword';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mutex, setMutex] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (name.trim().length == 0 || !/^[a-z][a-z\s]*/.test(name.trim().toLowerCase())) {
      Toaster.error('Enter a Valid Name');
      return;
    }
    if (!isEmail(email)) {
      Toaster.error('Enter a Valid Email');
      return;
    }
    if (!/^[a-z][a-z0-9_]{3,}/.test(name.trim().toLowerCase())) {
      Toaster.error('Enter a Valid Username');
      return;
    }
    if (
      !isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      Toaster.error('Enter a strong Password');
      return;
    }

    if (password != confirmPassword) {
      Toaster.error('Passwords do not match');
      return;
    }

    if (mutex) return;
    setMutex(true);
    const formData = {
      email,
      name: name.trim(),
      username: username.toLowerCase(),
      password,
      confirmPassword,
    };
    const toaster = Toaster.startLoad('Creating your Account...');

    await configuredAxios
      .post(`${BACKEND_URL}/signup`, formData, {
        withCredentials: true,
      })
      .then(res => {
        if (res.status === 200) {
          Toaster.stopLoad(toaster, 'Account created!', 1);
          const user: User = res.data.user;
          Cookies.set('token', res.data.token, {
            expires: Number(process.env.NEXT_PUBLIC_COOKIE_EXPIRATION_TIME),
          });
          Cookies.set('id', user.id, {
            expires: Number(process.env.NEXT_PUBLIC_COOKIE_EXPIRATION_TIME),
          });
          dispatch(setUser(user));
          dispatch(resetConfig());
          dispatch(setFeed([]));
          socketService.connect(user.id);
          // router.replace('/verify');
        }
        setMutex(false);
      })
      .catch(err => {
        if (err.response?.data?.message) Toaster.stopLoad(toaster, err.response.data.message, 0);
        else {
          Toaster.stopLoad(toaster, 'Internal Server Error', 0);
          console.log(err);
        }
        setMutex(false);
      });
  };
  return (
    <>
      <Head>
        <title>SignUp | Interact</title>
      </Head>
      <div className="h-screen flex">
        <div className="w-[45%] max-md:w-full h-full overflow-y-auto font-Inter gap-12 py-8 px-8 flex flex-col justify-between items-center">
          <div className="w-full flex justify-start">
            <ReactSVG src="/logo.svg" />
          </div>
          <form onSubmit={handleSubmit} className="w-3/5 max-md:w-full flex flex-col items-center gap-6">
            <div className="flex flex-col gap-2 text-center">
              <div className="text-2xl font-semibold">Let&apos;s Get Started</div>
              <div className="text-gray-400">Start setting up your account ✌️</div>
            </div>
            <div className="w-full flex gap-4 justify-center cursor-pointer shadow-md  border-[#D4D9E1] hover:bg-[#F2F2F2] active:bg-[#EDEDED] border-2 rounded-xl px-4 py-2">
              <div>
                <ReactSVG src="/assets/google.svg" />
              </div>
              <div className="font-medium">Sign in with Google</div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="w-[25%] h-[1px] bg-gray-200"></div>
              <div className="w-[40%] text-center text-sm max-md:text-xs text-gray-400">or continue with email</div>
              <div className="w-[25%] h-[1px] bg-gray-200"></div>
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="font-medium">Name</div>
                <input
                  value={name}
                  onChange={el => setName(el.target.value)}
                  type="text"
                  className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-medium">Username</div>
                <input
                  value={username}
                  onChange={el => setUsername(el.target.value)}
                  type="text"
                  className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-medium">Email</div>
                <input
                  value={email}
                  onChange={el => setEmail(el.target.value)}
                  type="email"
                  className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-medium">Password</div>
                <input
                  value={password}
                  onChange={el => setPassword(el.target.value)}
                  type="password"
                  className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-medium">Confirm Password</div>
                <input
                  value={confirmPassword}
                  onChange={el => setConfirmPassword(el.target.value)}
                  type="password"
                  className="w-full bg-white focus:outline-none border-2 p-2 rounded-xl text-gray-400"
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 items-center">
              <button
                type="submit"
                className="w-full flex items-center cursor-pointer justify-center gap-2 bg-[#3D6DB3] hover:bg-[#345C98] active:bg-[#2D5185] border-[#d1d1d1] text-white py-2 rounded-xl border-2 font-semibold"
              >
                <div> Continue</div>
                <ArrowRight size={20} weight="regular" />
              </button>
              <div onClick={() => router.push('/login')} className="text-gray-400 text-sm cursor-pointer">
                Already have an Account? <span className="font-medium underline underline-offset-2">Login</span>
              </div>
            </div>
          </form>
          <div className="w-3/4 max-md:w-full text-[12px] text-center text-gray-400">
            By clicking “Continue” above, you acknowledge that you have read and understood, and agree to
            Interact&apos;s <span className="underline underline-offset-2 font-medium">Term & Conditions</span> and{' '}
            <span className="underline underline-offset-2 font-medium">Privacy Policy.</span>
          </div>
        </div>
        <div className="w-[55%] max-md:hidden h-full bg-onboarding bg-cover"></div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = nookies.get(context).token;
  if (token && process.env.NODE_ENV != 'development') {
    return {
      redirect: {
        permanent: true, //! check
        destination: '/feed',
      },
      props: { token },
    };
  }
  return {
    props: {},
  };
};

export default SignUp;
