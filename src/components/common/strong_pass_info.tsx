import { CheckSquare, XSquare } from '@phosphor-icons/react';
import X from '@phosphor-icons/react/dist/icons/X';
import React from 'react';

interface Props {
  password: string;
  confirmPassword: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const StrongPassInfo = ({ password, confirmPassword, setShow }: Props) => {
  return (
    <>
      <div className="fixed top-24 max-md:top-20 w-1/3 max-md:w-5/6 h-fit backdrop-blur-2xl bg-white dark:bg-[#ffe1fc22] flex flex-col gap-2 max-md:gap-0 rounded-lg p-8 dark:text-white font-primary border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 shadow-2xl translate-x-1/2 animate-fade_third z-50">
        <div className="w-full flex justify-end">
          <X className="lg:hidden cursor-pointer" onClick={() => setShow(false)} size={32} />
        </div>
        <div className="w-full md:flex-1 flex flex-col justify-between gap-4">
          <div className="w-full flex flex-col gap-8">
            <div className="font-semibold text-4xl max-md:text-2xl text-gray-800 dark:text-white capitalize">
              What makes a Password Strong? 💪🏼
            </div>

            {/* <div className="w-full flex flex-col gap-4 text-xl font-medium">
              <div style={{ color: password.trim().length >= 8 ? '#6ad54d' : '#ff6262' }}>• At Least 8 Characters</div>
              <div style={{ color: /\d/.test(password) ? '#6ad54d' : '#ff6262' }}>• At Least 1 Number</div>
              <div style={{ color: /[A-Z]/.test(password) ? '#6ad54d' : '#ff6262' }}>
                • At Least 1 Upper Case Letter
              </div>
              <div style={{ color: /[a-z]/.test(password) ? '#6ad54d' : '#ff6262' }}>
                • At Least 1 Lower Case Letter
              </div>
              <div style={{ color: /[A-Z]/.test(password) ? '#6ad54d' : '#ff6262' }}>
                • At Least 1 Special Character
              </div>
              <div style={{ color: password == confirmPassword ? '#6ad54d' : '#ff6262' }}>• Passwords Should Match</div>
            </div> */}

            <div className="w-full flex flex-col gap-4 text-xl max-md:text-lg font-medium max-md:font-normal">
              <div className="flex gap-2 items-center">
                {password.trim().length >= 8 ? <CheckSquare weight="bold" /> : <XSquare weight="bold" />}
                At Least 8 Characters
              </div>
              <div className="flex gap-2 items-center">
                {/\d/.test(password) ? <CheckSquare weight="bold" /> : <XSquare weight="bold" />}
                At Least 1 Number
              </div>
              <div className="flex gap-2 items-center">
                {/[A-Z]/.test(password) ? <CheckSquare weight="bold" /> : <XSquare weight="bold" />}
                At Least 1 Upper Case Letter
              </div>
              <div className="flex gap-2 items-center">
                {/[a-z]/.test(password) ? <CheckSquare weight="bold" /> : <XSquare weight="bold" />}
                At Least 1 Lower Case Letter
              </div>
              <div className="flex gap-2 items-center">
                {/[!@#$%^&*(),.?":|<>]/.test(password) ? <CheckSquare weight="bold" /> : <XSquare weight="bold" />}
                At Least 1 Special Character
              </div>
              <div className="flex gap-2 items-center">
                {password == confirmPassword ? <CheckSquare weight="bold" /> : <XSquare weight="bold" />}
                Passwords Should Match
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen fixed top-0 left-0 animate-fade_third z-30"
      ></div>
    </>
  );
};

export default StrongPassInfo;
