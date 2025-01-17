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
import { useSelector, useDispatch } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import NewReview from '@/sections/organization/reviews/new_review';
import { Star, Plus } from '@phosphor-icons/react';
import StarRating from '@/components/organization/star_rating';
import { reviewModalOpenSelector, setReviewModalOpen } from '@/slices/feedSlice';
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
  const [reviewDataLoading, setReviewDataLoading] = useState(true);

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
          setReviewDataLoading(false);
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

  const dispatch = useDispatch();
  const reviewModalOpen = useSelector(reviewModalOpenSelector);

  interface ReviewBarProps {
    index: number;
  }

  const ReviewBar = ({ index }: ReviewBarProps) => {
    const barWidth = ((reviewData.counts as any)[index] * 100) / reviewData.total;

    return (
      <div className="w-full flex gap-2 items-center font-bold">
        {index}
        <div className="grow h-3 max-md:hidden border-dark_primary_btn border-2 rounded-lg">
          <div
            style={{ width: `${barWidth}%` }}
            className={`h-full bg-dark_primary_btn rounded-lg ${barWidth != 100 ? 'rounded-r-none' : ''}`}
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
          {user.organizationMemberships.map(m => m.organizationID).includes(orgID) && !reviewModalOpen ? (
            <div
              className="fixed z-50 bottom-28 right-0 lg:bottom-12 lg:right-12 flex-center text-sm bg-primary_text text-white px-4 py-3 rounded-full flex gap-2 shadow-lg hover:shadow-2xl font-medium cursor-pointer transition-ease-300 animate-fade_third"
              onClick={() => dispatch(setReviewModalOpen(!reviewModalOpen))}
            >
              <Plus size={20} /> <div className="h-fit">Add Review</div>
            </div>
          ) : (
            <></>
          )}

          {reviewDataLoading ? (
            //TODO add Review Data Card Loader
            <></>
          ) : (
            <div className="w-5/6 bg-white mx-auto flex justify-between items-center rounded-xl p-6 gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="relative flex-center">
                  <div className=" text-dark_primary_btn font-bold text-5xl flex flex-col items-center gap-2">
                    {reviewData.average}
                    <StarRating
                      defaultRating={Math.floor(reviewData.average)}
                      color={'#9275b9ba'}
                      strokeColor={'#633267'}
                      size={15}
                      fixRating={true}
                    />
                  </div>
                </div>
                <div className="text-sm font-medium">From {reviewData.total} Reviews</div>
              </div>
              <div className="grow flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map(index => (
                  <ReviewBar key={index} index={index} />
                ))}
              </div>
            </div>
          )}

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
