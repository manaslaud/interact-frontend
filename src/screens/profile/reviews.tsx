import { Review } from '@/types';
import React, { useEffect, useState } from 'react';
import { ORG_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '@/components/common/loader';
import ReviewCard from '@/components/explore/review_card';
import NoUserItems from '@/components/empty_fillers/user_items';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import NewReview from '@/sections/organization/reviews/new_review';

interface Props {
  orgID: string;
}

const Reviews = ({ orgID }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [clickedOnNewReview, setClickedOnNewReview] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);

  const user = useSelector(userSelector);

  const getReviews = () => {
    const URL = `${ORG_URL}/${orgID}/reviews?page=${page}&limit=${10}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addReviews = [...reviews, ...(res.data.reviews || [])];
          if (addReviews.length === reviews.length) setHasMore(false);
          setReviews(addReviews);
          setPage(prev => prev + 1);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className="w-[50vw] mx-auto max-md:pb-2 z-50">
      {loading ? (
        <Loader />
      ) : (
        <InfiniteScroll
          dataLength={reviews.length}
          next={getReviews}
          hasMore={hasMore}
          loader={<Loader />}
          className="w-full flex flex-wrap justify-center px-4 pb-12 gap-6"
        >
          {user.organizationMemberships.map(m => m.organizationID).includes(orgID) ? (
            //TODO not show if review is already added
            <NewReview orgID={orgID} setReviews={setReviews} />
          ) : (
            <></>
          )}
          {reviews.length > 0 ? (
            reviews.map(review => <ReviewCard key={review.id} review={review} setReviews={setReviews} />)
          ) : (
            <NoUserItems />
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Reviews;
