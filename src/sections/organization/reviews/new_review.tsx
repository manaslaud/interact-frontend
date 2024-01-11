import React, { useState } from 'react';
import Image from 'next/image';
import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import { useSelector } from 'react-redux';
import { profilePicSelector } from '@/slices/userSlice';
import Toaster from '@/utils/toaster';
import postHandler from '@/handlers/post_handler';
import { SERVER_ERROR } from '@/config/errors';
import { Star } from '@phosphor-icons/react';
import { Review } from '@/types';

interface Props {
  orgID: string;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

const NewReview = ({ orgID, setReviews }: Props) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [mutex, setMutex] = useState(false);

  const profilePic = useSelector(profilePicSelector) || 'default.jpg';

  const submitHandler = async () => {
    if (rating == 0) {
      Toaster.error('Add a rating');
      return;
    }
    if (content == '') {
      Toaster.error('Content cannot be empty');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding your review...');

    const formData = { content, rating, isAnonymous };

    const URL = `${ORG_URL}/${orgID}/reviews`;

    const res = await postHandler(URL, formData);
    if (res.statusCode === 201) {
      const review = res.data.review;
      setReviews(prev => [review, ...prev]);
      setContent('');
      setRating(0);
      setIsAnonymous(false);
      Toaster.stopLoad(toaster, 'Review Added!', 1);
    } else {
      if (res.data.message != '') Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 z-10">
      <div className="w-5/6 flex justify-between gap-2">
        <Image
          crossOrigin="anonymous"
          className="w-8 h-8 rounded-full cursor-default mt-2"
          width={50}
          height={50}
          alt="user"
          src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
        />
        <textarea
          value={content}
          maxLength={500}
          onChange={el => setContent(el.target.value)}
          onKeyDown={el => {
            if (el.key === 'Enter') submitHandler();
          }}
          className="w-[calc(100%-32px)] max-md:text-sm border-[1px] border-dashed p-2 rounded-lg dark:text-white dark:bg-dark_primary_comp focus:outline-none min-h-[3rem] max-h-64 max-md:w-full"
          placeholder="Add a Review (500 characters)"
        />
      </div>

      <div className="w-5/6 flex justify-between items-center">
        <div className="w-fit flex flex-col gap-2">
          <div className="w-fit flex gap-1">
            <Star
              onClick={() => setRating(1)}
              className="cursor-pointer"
              size={24}
              weight={rating >= 1 ? 'fill' : 'regular'}
            />
            <Star
              onClick={() => setRating(2)}
              className="cursor-pointer"
              size={24}
              weight={rating >= 2 ? 'fill' : 'regular'}
            />
            <Star
              onClick={() => setRating(3)}
              className="cursor-pointer"
              size={24}
              weight={rating >= 3 ? 'fill' : 'regular'}
            />
            <Star
              onClick={() => setRating(4)}
              className="cursor-pointer"
              size={24}
              weight={rating >= 4 ? 'fill' : 'regular'}
            />
            <Star
              onClick={() => setRating(5)}
              className="cursor-pointer"
              size={24}
              weight={rating == 5 ? 'fill' : 'regular'}
            />
          </div>
          <label className="flex w-fit cursor-pointer select-none items-center text-sm gap-2">
            <div className="font-semibold">Make this Anonymous</div>
            <div className="relative">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(prev => !prev)}
                className="sr-only"
              />
              <div
                className={`box block h-6 w-10 rounded-full ${
                  isAnonymous ? 'bg-blue-300' : 'bg-black'
                } transition-ease-300`}
              ></div>
              <div
                className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                  isAnonymous ? 'translate-x-full' : ''
                }`}
              ></div>
            </div>
          </label>
        </div>

        <div
          className="h-fit text-sm max-md:text-xs dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md py-2 px-6  flex-center cursor-pointer max-md:h-10 max-md:w-fit transition-ease-300"
          onClick={submitHandler}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default NewReview;
