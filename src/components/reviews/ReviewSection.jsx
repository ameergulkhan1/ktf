// D:\kft-frontend\src\components\reviews\ReviewSection.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProductReviews, useCreateReview, useDeleteReview } from '../../hooks/useReviews';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data, isLoading, refetch } = useProductReviews(productId);
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();

  const reviews = data?.reviews || [];
  const averageRating = data?.product?.rating || 0;
  const totalReviews = data?.product?.total_reviews || 0;

  // Check if user already reviewed
  const userReview = reviews.find(r => r.user_id === user?.id);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (reviewText.trim().length < 3) {
      toast.error('Review must be at least 3 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview.mutateAsync({
        product_id: productId,
        rating: rating,
        review: reviewText.trim()
      });
      setRating(0);
      setReviewText('');
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        await deleteReview.mutateAsync(reviewId);
        refetch();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (ratingValue, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (interactive ? hoverRating || rating : ratingValue);
      
      if (interactive) {
        return (
          <button
            key={index}
            type="button"
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            {isFilled ? (
              <StarIcon className="h-8 w-8 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            )}
          </button>
        );
      }
      
      return isFilled ? (
        <StarIcon key={index} className="h-5 w-5 text-yellow-400" />
      ) : (
        <StarOutlineIcon key={index} className="h-5 w-5 text-gray-300 dark:text-gray-600" />
      );
    });
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Customer Reviews
      </h3>

      {/* Rating Summary */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex justify-center mt-1">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      {/* Write Review Form */}
      {user && !userReview && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Write a Review</h4>
          <div className="flex items-center gap-1 mb-3">
            {renderStars(0, true)}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 btn-primary"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* User's own review */}
      {userReview && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Your Review</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {renderStars(userReview.rating)}
            </div>
            <button
              onClick={() => handleDeleteReview(userReview.id)}
              className="text-red-500 hover:text-red-700 text-sm ml-2"
            >
              Delete
            </button>
          </div>
          <p className="mt-1 text-gray-700 dark:text-gray-300">{userReview.review}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(userReview.created_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* All Reviews */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.filter(r => r.user_id !== user?.id).map((review) => (
            <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {review.user_name || 'Anonymous'}
                    </span>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{review.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;