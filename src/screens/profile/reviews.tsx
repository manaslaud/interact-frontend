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
import { Star } from '@phosphor-icons/react';

interface Props {
  orgID: string;
}

interface Reviews {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}
interface ReviewData {
  total: number;
  average: number;
  counts: Reviews;
}

const Reviews = ({ orgID }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewData, setReviewData] = useState<ReviewData>({
    total: 0,
    average: 0.0,
    counts: {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    },
  });
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

  const getReviewData = () => {
    const URL = `${ORG_URL}/${orgID}/reviews/data`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setReviewData(res.data.reviewData);
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
    getReviewData();
  }, []);

  return (
    <div className="w-[50vw] max-md:w-full mx-auto max-md:pb-2 z-50">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col gap-2">
          <div className="w-5/6 mx-auto flex justify-between items-center border-[1px] border-primary_black rounded-xl px-4 py-2 gap-4">
            <div className="flex flex-col items-center">
              <Star size={32} />
              <div>Average Rating: {reviewData.average}</div>
              <div>Total Reviews: {reviewData.total}</div>
            </div>
            <div className="grow flex flex-col gap-2">
              <div>5 Star: {reviewData.counts[5]}</div>
              <div>4 Star: {reviewData.counts[4]}</div>
              <div>3 Star: {reviewData.counts[3]}</div>
              <div>2 Star: {reviewData.counts[2]}</div>
              <div>1 Star: {reviewData.counts[1]}</div>
            </div>
          </div>
          <InfiniteScroll
            dataLength={reviews.length}
            next={getReviews}
            hasMore={hasMore}
            loader={<Loader />}
            className="w-full flex flex-wrap justify-center px-4 pb-12 gap-4"
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
        </div>
      )}
    </div>
  );
};

export default Reviews;
