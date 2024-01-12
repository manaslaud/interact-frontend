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

  interface ReviewBarProps {
    index: number;
  }

  const ReviewBar = ({ index }: ReviewBarProps) => {
    const barWidth = ((reviewData.counts as any)[index] * 100) / reviewData.total;

    return (
      <div className="w-full flex gap-2 items-center">
        {index} Star
        <div className="grow h-3 max-md:hidden border-dark_primary_btn border-2 rounded-lg">
          <div
            style={{ width: `${barWidth}%` }}
            className={`h-full bg-dark_primary_btn rounded-lg ${barWidth != 1 ? 'rounded-r-none' : ''}`}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[50vw] max-md:w-full mx-auto max-md:pb-2 z-50">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col gap-6">
          <div className="w-5/6 bg-white mx-auto flex justify-between items-center rounded-xl p-6 gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="relative flex-center">
                <Star className="text-dark_primary_btn" size={108} />
                <div className="absolute text-dark_primary_btn font-semibold">{reviewData.average}</div>
              </div>
              <div>From {reviewData.total} Reviews</div>
            </div>
            <div className="grow flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map(index => (
                <ReviewBar key={index} index={index} />
              ))}
            </div>
          </div>
          {user.organizationMemberships.map(m => m.organizationID).includes(orgID) ? (
            //TODO not show if review is already added
            <NewReview orgID={orgID} setReviews={setReviews} />
          ) : (
            <></>
          )}
          <InfiniteScroll
            dataLength={reviews.length}
            next={getReviews}
            hasMore={hasMore}
            loader={<Loader />}
            className="w-full flex flex-wrap justify-center pb-12 gap-4"
          >
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
