import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import toast from 'react-hot-toast';

// Get reviews by product
export const useProductReviews = (productId, params = {}) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId, params],
    queryFn: () => reviewApi.getByProduct(productId, params),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get user's own reviews
export const useUserReviews = (params = {}) => {
  return useQuery({
    queryKey: ['reviews', 'user', params],
    queryFn: () => reviewApi.getUserReviews(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.product_id] });
      toast.success('Review submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
};

// Update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => reviewApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update review');
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};