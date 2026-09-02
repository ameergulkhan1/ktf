import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../api/menuApi';
import toast from 'react-hot-toast';

// Get menu by restaurant
export const useMenu = (restaurantId) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => menuApi.getByRestaurant(restaurantId),
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000,
  });
};

// Create menu item
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: menuApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Menu item added successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add menu item');
    },
  });
};

// Update menu item
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => menuApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Menu item updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update menu item');
    },
  });
};

// Delete menu item
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: menuApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      toast.success('Menu item deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    },
  });
};